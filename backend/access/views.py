from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import timedelta

from tests.models import Test, TestAccess
from .models import TestAccessSession
from .serializers import AccessValidateSerializer

class ValidateTestAccessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AccessValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test_code = serializer.validated_data["test_code"]
        passcode = serializer.validated_data["passcode"]

        access = TestAccess.objects.filter(
            access_code=test_code
        ).select_related("test").first()

        if not access:
            return Response(
                {"access_granted": False, "detail": "Invalid test code"},
                status=status.HTTP_400_BAD_REQUEST
            )

        test = access.test

        if not test.is_active or test.status != "PUBLISHED":
            return Response(
                {"access_granted": False, "detail": "Test not available"},
                status=status.HTTP_403_FORBIDDEN
            )

        if access.is_passcode_required:
            if not check_password(passcode, access.passcode_hash):
                return Response(
                    {"access_granted": False, "detail": "Invalid passcode"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        session = TestAccessSession.objects.create(
            test=test,
            passcode_version=access.passcode_version,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        return Response({
            "access_granted": True,
            "test_id": test.id,
            "session_token": str(session.session_token)
        })
