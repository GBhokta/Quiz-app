from rest_framework import serializers


class AccessValidateSerializer(serializers.Serializer):
    test_code = serializers.CharField()
    passcode = serializers.CharField()
