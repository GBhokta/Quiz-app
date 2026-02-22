from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from django.db.models import Prefetch

from tests.models import (
    Test,
    TestAttempt,
    TestQuestion,
    Response as AttemptResponse,
    ResponseOption,
)
from questions.models import Option
from results.models import Result
from .serializers import SubmitTestSerializer


# =========================================================
# START TEST
# =========================================================

class StartTestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        test_id = request.data.get("test_id")

        if not test_id:
            return Response(
                {"detail": "test_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test = get_object_or_404(Test, id=test_id, is_active=True)

        if test.status != Test.Status.PUBLISHED:
            return Response(
                {"detail": "Test is not published"},
                status=status.HTTP_400_BAD_REQUEST
            )

        access = getattr(test, "access", None)
        if not access:
            return Response(
                {"detail": "Test access configuration missing"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Guest-safe user handling
        user = request.user if request.user.is_authenticated else None

        # -------------------------------
        # ATTEMPT COUNT (only for logged in users)
        # -------------------------------
        if user:
            attempt_count = TestAttempt.objects.filter(
                test=test,
                user=user
            ).count()

            if access.max_attempts_per_user and attempt_count >= access.max_attempts_per_user:
                return Response(
                    {"detail": "Maximum attempts reached"},
                    status=status.HTTP_403_FORBIDDEN
                )

            in_progress = TestAttempt.objects.filter(
                test=test,
                user=user,
                status=TestAttempt.Status.IN_PROGRESS
            ).first()

            if in_progress:
                return self._build_test_payload(in_progress)

            attempt_number = attempt_count + 1
        else:
            attempt_number = 1

        # -------------------------------
        # CREATE ATTEMPT
        # -------------------------------
        attempt = TestAttempt.objects.create(
            test=test,
            user=user,
            attempt_number=attempt_number,
            passcode_version_used=access.passcode_version
        )

        return self._build_test_payload(attempt)

    # =========================================================
    # BUILD FULL TEST PAYLOAD (QUESTIONS + OPTIONS)
    # =========================================================
    def _build_test_payload(self, attempt):
        test = attempt.test

        test_questions = TestQuestion.objects.filter(
            test=test
        ).select_related("question").prefetch_related(
            Prefetch("question__options", queryset=Option.objects.all())
        )

        questions_data = []

        for tq in test_questions:
            q = tq.question

            questions_data.append({
                "id": q.id,
                "text": q.question_text,
                "type": q.question_type,
                "marks": tq.marks,
                "options": [
                    {
                        "id": opt.id,
                        "text": opt.option_text
                    }
                    for opt in q.options.all()
                ]
            })

        return Response(
            {
                "attempt_id": attempt.id,
                "attempt_number": attempt.attempt_number,
                "status": attempt.status,
                "test_title": test.title,
                "duration_minutes": test.duration_minutes,
                "total_marks": test.total_marks,
                "questions": questions_data,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# SUBMIT TEST
# =========================================================

class SubmitTestView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        attempt_id = serializer.validated_data["attempt_id"]
        answers = serializer.validated_data["answers"]

        attempt = get_object_or_404(
            TestAttempt,
            id=attempt_id,
            user=request.user
        )

        if attempt.status != TestAttempt.Status.IN_PROGRESS:
            return Response(
                {"detail": "Attempt already finalized"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not attempt.test.is_active:
            return Response(
                {"detail": "Test is no longer active"},
                status=status.HTTP_400_BAD_REQUEST
            )

        duration_seconds = attempt.test.duration_minutes * 60
        elapsed = (timezone.now() - attempt.started_at).total_seconds()

        if elapsed > duration_seconds:
            attempt.status = TestAttempt.Status.EXPIRED
            attempt.submitted_at = timezone.now()
            attempt.save(update_fields=["status", "submitted_at"])
            return Response(
                {"detail": "Time expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test_questions = TestQuestion.objects.filter(
            test=attempt.test
        ).select_related("question").prefetch_related(
            Prefetch("question__options", queryset=Option.objects.all())
        )

        correct = 0
        wrong = 0
        unattempted = 0
        total_marks = 0
        total_questions = test_questions.count()

        response_objects = []
        response_option_objects = []

        for tq in test_questions:
            question = tq.question
            user_answer = answers.get(str(question.id))

            if not user_answer:
                unattempted += 1
                continue

            is_correct = False
            marks_awarded = 0

            if question.question_type == "MCQ":
                correct_option = next(
                    (opt for opt in question.options.all() if opt.is_correct),
                    None
                )
                if correct_option and str(correct_option.id) == str(user_answer):
                    is_correct = True

            elif question.question_type == "MSQ":
                correct_ids = {
                    str(opt.id)
                    for opt in question.options.all()
                    if opt.is_correct
                }
                user_ids = set(map(str, user_answer))
                if user_ids == correct_ids:
                    is_correct = True

            elif question.question_type == "NAT":
                if str(question.correct_answer) == str(user_answer):
                    is_correct = True

            if is_correct:
                correct += 1
                marks_awarded = tq.marks
                total_marks += tq.marks
            else:
                wrong += 1

            response_objects.append(
                AttemptResponse(
                    attempt=attempt,
                    question=question,
                    is_correct=is_correct,
                    marks_obtained=marks_awarded
                )
            )

        AttemptResponse.objects.bulk_create(response_objects)

        for response in AttemptResponse.objects.filter(attempt=attempt):
            user_answer = answers.get(str(response.question_id))

            if response.question.question_type == "MCQ":
                option = Option.objects.filter(id=user_answer).first()
                if option:
                    response_option_objects.append(
                        ResponseOption(response=response, option=option)
                    )

            elif response.question.question_type == "MSQ":
                for opt_id in user_answer:
                    option = Option.objects.filter(id=opt_id).first()
                    if option:
                        response_option_objects.append(
                            ResponseOption(response=response, option=option)
                        )

        ResponseOption.objects.bulk_create(response_option_objects)

        attempt.status = TestAttempt.Status.SUBMITTED
        attempt.submitted_at = timezone.now()
        attempt.score = total_marks
        attempt.save(update_fields=["status", "submitted_at", "score"])

        percentage = (total_marks / (attempt.test.total_marks or 1)) * 100

        result = Result.objects.create(
            attempt=attempt,
            total_questions=total_questions,
            correct=correct,
            wrong=wrong,
            unattempted=unattempted,
            percentage=percentage
        )

        return Response(
            {
                "detail": "Test submitted successfully",
                "result_id": result.id,
                "score": total_marks,
                "percentage": percentage
            },
            status=status.HTTP_200_OK
        )