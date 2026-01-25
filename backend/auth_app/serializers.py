from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=["STUDENT", "TEST_MAKER"],
        required=False
    )

    class Meta:
        model = User
        fields = ("email", "name", "password", "role")

    def create(self, validated_data):
        validated_data.pop("role", None)  # role handled in view
        password = validated_data.pop("password")

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "name")
