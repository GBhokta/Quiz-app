from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils import timezone

from access.models import TestAccessSession
from tests.models import TestQuestion
from .serializers import StartSessionSerializer

from django.db import transaction
from questions.models import Question, Option
from .models import TestAttempt, Response, ResponseOption
from results.models import Result

class StartTestSessionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StartSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test_id = serializer.validated_data["test_id"]
        session_token = serializer.validated_data["session_token"]

        access_session = TestAccessSession.objects.filter(
            test_id=test_id,
            session_token=session_token
        ).first()

        if not access_session or not access_session.is_valid():
            return Response(
                {"detail": "Invalid or expired session"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = request.user if request.user.is_authenticated else None

        # Determine attempt number
        last_attempt = TestAttempt.objects.filter(
            test_id=test_id,
            user=user
        ).order_by("-attempt_number").first()

        attempt_number = 1 if not last_attempt else last_attempt.attempt_number + 1

        # Resume logic (important)
        existing_attempt = TestAttempt.objects.filter(
            test_id=test_id,
            user=user,
            status="IN_PROGRESS"
        ).first()

        if existing_attempt:
            attempt = existing_attempt
        else:
            attempt = TestAttempt.objects.create(
                test_id=test_id,
                user=user,
                attempt_number=attempt_number,
                passcode_version_used=access_session.passcode_version
            )

        # Fetch ordered questions
        test_questions = TestQuestion.objects.filter(
            test_id=test_id
        ).select_related("question").prefetch_related("question__options")

        questions_payload = []

        for tq in test_questions:
            q = tq.question
            data = {
                "question_id": q.id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "marks": tq.marks,
            }

            if q.question_type in ["MCQ", "MSQ"]:
                data["options"] = [
                    {"id": opt.id, "text": opt.option_text}
                    for opt in q.options.all()
                ]

            questions_payload.append(data)

        return Response({
            "attempt_id": attempt.id,
            "duration_minutes": attempt.test.duration_minutes,
            "questions": questions_payload
        })
class SubmitTestView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        attempt_id = serializer.validated_data["attempt_id"]
        answers = serializer.validated_data["answers"]

        attempt = TestAttempt.objects.select_for_update().filter(
            id=attempt_id,
            status="IN_PROGRESS"
        ).first()

        if not attempt:
            return Response(
                {"detail": "Invalid or already submitted attempt"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test_questions = {
            tq.question_id: tq
            for tq in attempt.test.test_questions.all()
        }

        correct = wrong = unattempted = score = 0

        for qid, tq in test_questions.items():
            question = tq.question
            marks = tq.marks
            user_answer = answers.get(str(qid))

            # UNATTEMPTED
            if user_answer is None:
                Response.objects.create(
                    attempt=attempt,
                    question=question,
                    is_correct=False,
                    marks_obtained=0
                )
                unattempted += 1
                continue

            response = Response.objects.create(
                attempt=attempt,
                question=question
            )

            is_correct = False

            # MCQ
            if question.question_type == "MCQ":
                option = Option.objects.filter(
                    question=question,
                    option_text=user_answer
                ).first()

                if option:
                    ResponseOption.objects.create(
                        response=response,
                        option=option
                    )
                    is_correct = option.is_correct

            # MSQ
            elif question.question_type == "MSQ":
                correct_opts = set(
                    question.options.filter(is_correct=True)
                    .values_list("option_text", flat=True)
                )
                selected_opts = set(user_answer)

                for opt in question.options.filter(option_text__in=selected_opts):
                    ResponseOption.objects.create(
                        response=response,
                        option=opt
                    )

                is_correct = selected_opts == correct_opts

            # NAT
            elif question.question_type == "NAT":
                response.numerical_answer = user_answer
                is_correct = (
                    question.correct_numerical_answer == user_answer
                )

            response.is_correct = is_correct

            if is_correct:
                response.marks_obtained = marks
                correct += 1
                score += marks
            else:
                response.marks_obtained = 0
                wrong += 1

            response.save()

        total_questions = len(test_questions)
        percentage = (score / attempt.test.total_marks) * 100

        attempt.status = "SUBMITTED"
        attempt.score = score
        attempt.submitted_at = timezone.now()
        attempt.save()

        Result.objects.create(
            attempt=attempt,
            total_questions=total_questions,
            correct=correct,
            wrong=wrong,
            unattempted=unattempted,
            percentage=percentage
        )

        return Response({
            "score": score,
            "correct": correct,
            "wrong": wrong,
            "unattempted": unattempted,
            "percentage": percentage
        })
