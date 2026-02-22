from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import timedelta

from tests.models import TestAccess
from .models import TestAccessSession
from .serializers import AccessValidateSerializer


class ValidateTestAccessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AccessValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 🔒 Normalize input
        test_code = serializer.validated_data["test_code"].strip().upper()
        passcode = serializer.validated_data["passcode"].strip()

        # 🔎 Find access entry
        access = (
            TestAccess.objects
            .select_related("test")
            .filter(access_code=test_code)
            .first()
        )

        if not access:
            return Response(
                {
                    "access_granted": False,
                    "detail": "Invalid test code"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        test = access.test

        # 🚫 Check availability
        if not test.is_active:
            return Response(
                {
                    "access_granted": False,
                    "detail": "Test is currently disabled"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if test.status != "PUBLISHED":
            return Response(
                {
                    "access_granted": False,
                    "detail": "Test is not published"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # 🔐 Validate passcode (if required)
        if access.is_passcode_required:
            if not check_password(passcode, access.passcode_hash):
                return Response(
                    {
                        "access_granted": False,
                        "detail": "Invalid passcode"
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # 🟢 Create short-lived access session
        session = TestAccessSession.objects.create(
            test=test,
            passcode_version=access.passcode_version,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        return Response(
            {
                "access_granted": True,
                "test_id": test.id,
                "session_token": str(session.session_token)
            },
            status=status.HTTP_200_OK
        )