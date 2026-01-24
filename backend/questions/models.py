from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


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

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_questions"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["question_type"]),
            models.Index(fields=["difficulty"]),
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

    def __str__(self):
        return f"Option for Q{self.question_id}"
