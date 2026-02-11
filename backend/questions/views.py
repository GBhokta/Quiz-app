from django.db import models
from rest_framework import generics, permissions
from .models import Question, Topic
from .serializers import (
    QuestionSerializer,
    QuestionListSerializer,
    TopicSerializer,
)


class QuestionCreateView(generics.CreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # attach logged-in user as creator
        serializer.save(created_by=self.request.user)


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # creator sees own questions + public questions
        qs = Question.objects.filter(
            models.Q(created_by=user) | models.Q(is_public=True)
        ).prefetch_related("topics")

        q = self.request.query_params.get("q")
        topic = self.request.query_params.get("topic")
        difficulty = self.request.query_params.get("difficulty")
        qtype = self.request.query_params.get("type")
        scope= self.request.query_params.get("scope")
        if scope == "my":
            return Question.objects.filter(created_by=user)

        if scope == "public":
            return Question.objects.filter(is_public=True)

        if q:
            qs = qs.filter(question_text__icontains=q)

        if topic:
            qs = qs.filter(topics__id=topic)

        if difficulty:
            qs = qs.filter(difficulty=difficulty)

        if qtype:
            qs = qs.filter(question_type=qtype)

        return qs.distinct()


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only owner can edit/delete
        return Question.objects.filter(created_by=self.request.user)


class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all().order_by("name")
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticated]

class AllQuestionsView(generics.ListAPIView):
    serializer_class = QuestionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # creator sees own questions + public questions
        qs = Question.objects.filter(
            models.Q(created_by=user) | models.Q(is_public=True)
        ).prefetch_related("topics")

        return qs.distinct()