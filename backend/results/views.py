from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from auth_app.permissions import IsTestMaker
from tests.models import Test
from .models import Result
from .serializers import ResultSerializer
class MyResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = Result.objects.filter(
            attempt__user=request.user
        ).select_related("attempt__test")

        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
class TestResultsView(APIView):
    permission_classes = [IsAuthenticated, IsTestMaker]

    def get(self, request, test_id):
        test = get_object_or_404(
            Test,
            id=test_id,
            created_by=request.user
        )

        results = Result.objects.filter(
            attempt__test=test
        ).select_related("attempt__user")

        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
