from rest_framework import serializers


class StartSessionSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    session_token = serializers.UUIDField()
class SubmitTestSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    answers = serializers.DictField()
