from rest_framework import serializers
from .models import Question, Option, Topic


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "option_text", "is_correct"]


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "name"]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=False)
    topics = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "question_type",
            "difficulty",
            "correct_numerical_answer",
            "explanation",
            "is_public",
            "topics",
            "options",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        topics = validated_data.pop("topics", [])
        question = Question.objects.create(**validated_data)


        if topics:
            question.topics.set(topics)

        for opt in options_data:
            Option.objects.create(question=question, **opt)

        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop("options", None)
        topics = validated_data.pop("topics", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if topics is not None:
            instance.topics.set(topics)

        instance.save()

        if options_data is not None:
            instance.options.all().delete()
            for opt in options_data:
                Option.objects.create(question=instance, **opt)

        return instance


class QuestionListSerializer(serializers.ModelSerializer):
    # React prefers IDs, not nested objects
    topics = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "question_type",
            "difficulty",
            "topics",
            "is_public",
        ]
