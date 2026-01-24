from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password

from auth_app.permissions import IsTestMaker
from .models import Test, TestAccess, TestPasscodeHistory
from .serializers import TestSerializer, TestCreateSerializer
class CreateTestView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def post(self, request):
        serializer = TestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        test = serializer.save(created_by=request.user)

        access_code = get_random_string(8).upper()
        raw_passcode = get_random_string(6)

        TestAccess.objects.create(
            test=test,
            access_code=access_code,
            passcode_hash=make_password(raw_passcode),
        )

        return Response({
            "test": TestSerializer(test).data,
            "access_code": access_code,
            "passcode": raw_passcode,
        }, status=status.HTTP_201_CREATED)
class MyTestsView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def get(self, request):
        tests = Test.objects.filter(created_by=request.user)
        serializer = TestSerializer(tests, many=True)
        return Response(serializer.data)
class TestDetailView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def get_object(self, request, test_id):
        return get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )

    def get(self, request, test_id):
        test = self.get_object(request, test_id)
        return Response(TestSerializer(test).data)

    def put(self, request, test_id):
        test = self.get_object(request, test_id)
        serializer = TestCreateSerializer(
            test, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TestSerializer(test).data)

    def delete(self, request, test_id):
        test = self.get_object(request, test_id)
        test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class ChangePasscodeView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def put(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )

        new_passcode = request.data.get("passcode")
        if not new_passcode:
            return Response(
                {"detail": "Passcode required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        access = test.access
        access.passcode_version += 1
        access.passcode_hash = make_password(new_passcode)
        access.save()

        TestPasscodeHistory.objects.create(
            test=test,
            passcode_hash=access.passcode_hash,
            passcode_version=access.passcode_version,
            changed_by=request.user
        )

        return Response({"detail": "Passcode updated"})
class LockTestView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def post(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )
        test.is_active = False
        test.save()
        return Response({"detail": "Test locked"})
class UnlockTestView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def post(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )
        test.is_active = True
        test.save()
        return Response({"detail": "Test unlocked"})
