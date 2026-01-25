from rest_framework import serializers
from .models import Result


class ResultSerializer(serializers.ModelSerializer):
    test_id = serializers.IntegerField(source="attempt.test.id", read_only=True)
    test_title = serializers.CharField(source="attempt.test.title", read_only=True)

    class Meta:
        model = Result
        fields = (
            "id",
            "test_id",
            "test_title",
            "total_questions",
            "correct",
            "wrong",
            "unattempted",
            "percentage",
            "rank",
            "generated_at",
        )
