from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password
from django.db import models
from auth_app.permissions import IsTestMaker

from .models import Test, TestAccess, TestPasscodeHistory, TestQuestion
from .serializers import AddTestQuestionSerializer, TestQuestionListSerializer, TestSerializer, TestCreateSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Test, TestQuestion
from .serializers import (
    TestQuestionListSerializer,
    AddTestQuestionSerializer,
)



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

        return Response({"detail": "Passcode updated","passcode_version": access.passcode_version,})

    def get(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )
        access = test.access
        return Response({
            "access_code": access.access_code,
            "passcode_version": access.passcode_version,
        })
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



class AddTestQuestionsView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def get(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )

        qs = (
            TestQuestion.objects
            .filter(test=test)
            .select_related("question")
            .order_by("question_order")
        )

        serializer = TestQuestionListSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )

        questions = request.data.get("questions")

        # ✅ strict validation
        if not isinstance(questions, list) or len(questions) == 0:
            return Response(
                {"detail": "Questions list required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AddTestQuestionSerializer(
            data=questions,
            many=True
        )
        serializer.is_valid(raise_exception=True)

        # ✅ start ordering from last question
        last_order = (
            TestQuestion.objects
            .filter(test=test)
            .aggregate(max_order=models.Max("question_order"))
            .get("max_order") or 0
        )

        created = 0

        for index, item in enumerate(serializer.validated_data, start=1):
            _, was_created = TestQuestion.objects.get_or_create(
                test=test,
                question_id=item["question_id"],
                defaults={
                    "marks": item.get("marks", 1),
                    "question_order": last_order + index,
                }
            )
            if was_created:
                created += 1

        return Response(
            {"detail": f"{created} questions added"},
            status=status.HTTP_201_CREATED
        )

class RemoveQuestionFromTestView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, test_id, question_id):
        # Ensure test belongs to user
        try:
            test = Test.objects.get(id=test_id, created_by=request.user)
        except Test.DoesNotExist:
            return Response(
                {"detail": "Test not found or access denied"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Remove mapping
        deleted, _ = TestQuestion.objects.filter(
            test_id=test_id,
            question_id=question_id
        ).delete()

        if deleted == 0:
            return Response(
                {"detail": "Question not found in test"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {"detail": "Question removed from test"},
            status=status.HTTP_204_NO_CONTENT,
        )