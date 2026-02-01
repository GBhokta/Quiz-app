from rest_framework import serializers
from .models import Test, TestAccess, TestQuestion
from questions.models import Question

class AddTestQuestionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    marks = serializers.IntegerField(min_value=1)
    question_order = serializers.IntegerField(min_value=1)

    def validate_question_id(self, value):
        if not Question.objects.filter(id=value).exists():
            raise serializers.ValidationError("Question does not exist")
        return value

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = (
            "id",
            "title",
            "description",
            "duration_minutes",
            "total_marks",
            "start_time",
            "end_time",
            "status",
            "is_active",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
class TestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = (
            "title",
            "description",
            "duration_minutes",
            "total_marks",
            "start_time",
            "end_time",
        )
class TestQuestionListSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.question_text")
    question_type = serializers.CharField(source="question.question_type")
    difficulty = serializers.CharField(source="question.difficulty")

    options = serializers.SerializerMethodField()

    class Meta:
        model = TestQuestion
        fields = [
            "question_order",
            "marks",
            "question_text",
            "question_type",
            "difficulty",
            "options",
        ]

    def get_options(self, obj):
        if obj.question.question_type == "NAT":
            return []
        return list(
            obj.question.options.values("id", "option_text")
        )