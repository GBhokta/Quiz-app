from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Max

from tests.models import (
    Test,
    TestAttempt,
    TestQuestion,
    Response as AttemptResponse,
    ResponseOption,
)
from results.models import Result
from .serializers import SubmitTestSerializer


# =========================================================
# START TEST
# =========================================================




class ResultDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, result_id):
        result = get_object_or_404(Result, id=result_id)

        attempt = result.attempt

        responses = (
            AttemptResponse.objects
            .filter(attempt=attempt)
            .select_related("question")
            .prefetch_related("question__options", "selected_options")
        )

        question_data = []

        for resp in responses:
            question = resp.question

            # IDs of options selected by user
            selected_option_ids = [
                opt.option.id
                for opt in resp.selected_options.all()
            ]

            question_data.append({
                "question_id": question.id,
                "question_text": question.question_text,
                "question_type": question.question_type,
                "marks_awarded": resp.marks_obtained,
                "is_correct": resp.is_correct,
                "explanation": question.explanation,

                # 🔥 Return ALL options
                "options": [
                    {
                        "id": opt.id,
                        "text": opt.option_text,
                        "is_correct": opt.is_correct
                    }
                    for opt in question.options.all()
                ],

                # What user selected
                "selected_options": selected_option_ids,

                # For NAT
                "numerical_answer": resp.numerical_answer
            })

        return Response({
            "score": attempt.score,
            "percentage": result.percentage,
            "correct": result.correct,
            "wrong": result.wrong,
            "unattempted": result.unattempted,
            "questions": question_data
        })


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

        # Logged user OR guest
        user = request.user if request.user.is_authenticated else None

        # Prevent duplicate in-progress attempt
        existing_attempt = TestAttempt.objects.filter(
            test=test,
            user=user,
            status=TestAttempt.Status.IN_PROGRESS
        ).first()

        if existing_attempt:
            attempt = existing_attempt
        else:
            last_number = (
                TestAttempt.objects
                .filter(test=test, user=user)
                .aggregate(max_number=Max("attempt_number"))
            )["max_number"] or 0

            attempt = TestAttempt.objects.create(
                test=test,
                user=user,
                attempt_number=last_number + 1,
                passcode_version_used=test.access.passcode_version,
            )

        # Fetch questions
        test_questions = (
            TestQuestion.objects
            .filter(test=test)
            .select_related("question")
            .prefetch_related("question__options")
        )

        question_data = []

        for tq in test_questions:
            question = tq.question

            question_data.append({
                "id": question.id,
                "text": question.question_text,
                "type": question.question_type,
                "options": [
                    {
                        "id": opt.id,
                        "text": opt.option_text,
                    }
                    for opt in question.options.all()
                ]
            })

        return Response({
            "attempt_id": attempt.id,
            "duration_minutes": test.duration_minutes,
            "questions": question_data,
        }, status=status.HTTP_201_CREATED)
# =========================================================
# SUBMIT TEST
# =========================================================

class SubmitTestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        attempt_id = serializer.validated_data["attempt_id"]
        answers = serializer.validated_data["answers"]

        attempt = get_object_or_404(TestAttempt, id=attempt_id)

        if attempt.status != TestAttempt.Status.IN_PROGRESS:
            return Response(
                {"detail": "Attempt already finalized"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test_questions = (
            TestQuestion.objects
            .filter(test=attempt.test)
            .select_related("question")
            .prefetch_related("question__options")
        )

        correct = 0
        wrong = 0
        unattempted = 0
        total_marks = 0

        for tq in test_questions:
            question = tq.question
            user_answer = answers.get(str(question.id))

            if not user_answer:
                unattempted += 1
                continue

            is_correct = False
            marks_awarded = 0

            # ---------------- MCQ ----------------
            if question.question_type == "MCQ":
                correct_option = next(
                    (opt for opt in question.options.all() if opt.is_correct),
                    None
                )
                if correct_option and str(correct_option.id) == str(user_answer):
                    is_correct = True

            # ---------------- MSQ ----------------
            elif question.question_type == "MSQ":
                correct_ids = {
                    str(opt.id)
                    for opt in question.options.all()
                    if opt.is_correct
                }
                user_ids = set(map(str, user_answer))
                if user_ids == correct_ids:
                    is_correct = True

            # ---------------- NAT ----------------
# ---------------- NAT ----------------
            elif question.question_type == "NAT":
                if question.correct_numerical_answer is not None:
                    try:
                        user_value = float(user_answer)
                        correct_value = float(question.correct_numerical_answer)

                        if user_value == correct_value:
                            is_correct = True
                    except (ValueError, TypeError):
                        is_correct = False

            if is_correct:
                correct += 1
                marks_awarded = tq.marks
                total_marks += tq.marks
            else:
                wrong += 1

            attempt_response, _ = AttemptResponse.objects.update_or_create(
                attempt=attempt,
                question=question,
                defaults={
                    "numerical_answer": user_answer if question.question_type == "NAT" else None,
                    "is_correct": is_correct,
                    "marks_obtained": marks_awarded,
                }
            )

            # Save selected options safely
            if question.question_type in ["MCQ", "MSQ"]:

                selected_ids = (
                    [user_answer]
                    if question.question_type == "MCQ"
                    else user_answer
                )

                # 🔥 VERY IMPORTANT
                # First delete old options for this response
                attempt_response.selected_options.all().delete()

                # Then recreate fresh
                for opt_id in selected_ids:
                    option = question.options.filter(id=opt_id).first()
                    if option:
                        ResponseOption.objects.create(
                            response=attempt_response,
                            option=option
                        )

        # Finalize attempt
        attempt.status = TestAttempt.Status.SUBMITTED
        attempt.submitted_at = timezone.now()
        attempt.score = total_marks
        attempt.save(update_fields=["status", "submitted_at", "score"])

        percentage = (
            total_marks / (attempt.test.total_marks or 1)
        ) * 100

        result = Result.objects.create(
            attempt=attempt,
            total_questions=test_questions.count(),
            correct=correct,
            wrong=wrong,
            unattempted=unattempted,
            percentage=percentage
        )

        return Response({
            "result_id": result.id,
            "score": total_marks,
            "percentage": percentage
        }, status=status.HTTP_200_OK)

