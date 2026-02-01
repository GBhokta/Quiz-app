from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Topic(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Question(models.Model):

    QUESTION_TYPE_CHOICES = (
        ("MCQ", "Multiple Choice (Single Correct)"),
        ("MSQ", "Multiple Select"),
        ("NAT", "Numerical Answer Type"),
    )

    DIFFICULTY_CHOICES = (
        ("EASY", "Easy"),
        ("MEDIUM", "Medium"),
        ("HARD", "Hard"),
    )

    question_text = models.TextField()

    question_type = models.CharField(
        max_length=10,
        choices=QUESTION_TYPE_CHOICES
    )

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    # Used only when question_type = NAT
    correct_numerical_answer = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    explanation = models.TextField(blank=True)

    # Visibility
    is_public = models.BooleanField(default=False)

    # Relations
    topics = models.ManyToManyField(
        Topic,
        related_name="questions",
        blank=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_questions"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["question_type"]),
            models.Index(fields=["difficulty"]),
            models.Index(fields=["is_public"]),
            models.Index(fields=["created_by"]),
        ]

    def __str__(self):
        return f"{self.question_type} | Q{self.id}"


class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="options"
    )

    option_text = models.TextField()
    is_correct = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"Option for Question {self.question_id}"
