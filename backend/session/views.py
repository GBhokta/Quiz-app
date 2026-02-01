from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from tests.models import Test, TestAttempt


class StartTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        test_id = request.data.get("test_id")

        if not test_id:
            return Response(
                {"detail": "test_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test = get_object_or_404(Test, id=test_id, is_active=True)

        # Determine attempt number
        last_attempt = (
            TestAttempt.objects
            .filter(test=test, user=request.user)
            .order_by("-attempt_number")
            .first()
        )

        attempt_number = 1
        if last_attempt:
            attempt_number = last_attempt.attempt_number + 1

        attempt = TestAttempt.objects.create(
            test=test,
            user=request.user,
            attempt_number=attempt_number,
            passcode_version_used=1  # simple for now
        )

        return Response(
            {
                "attempt_id": attempt.id,
                "test_id": test.id,
                "attempt_number": attempt.attempt_number,
                "status": attempt.status,
                "started_at": attempt.started_at,
            },
            status=status.HTTP_201_CREATED
        )
