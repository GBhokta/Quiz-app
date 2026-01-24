from rest_framework import serializers
from .models import Test, TestAccess

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
