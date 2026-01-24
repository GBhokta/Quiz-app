from django.db import models
from django.conf import settings
from tests.models import Test
from questions.models import Question
from questions.models import Option

User = settings.AUTH_USER_MODEL
class TestAttempt(models.Model):

    STATUS_CHOICES = (
        ("IN_PROGRESS", "In Progress"),
        ("SUBMITTED", "Submitted"),
        ("EXPIRED", "Expired"),
        ("FORCE_SUBMITTED", "Force Submitted"),
    )

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="attempts"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    # null user → guest attempt

    attempt_number = models.PositiveIntegerField()

    passcode_version_used = models.PositiveIntegerField()

    started_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now=True)

    submitted_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="IN_PROGRESS"
    )

    score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("test", "user", "attempt_number")

    def __str__(self):
        return f"{self.test.title} | Attempt {self.attempt_number}"
class Response(models.Model):

    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name="responses"
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    # Used only for NAT questions
    numerical_answer = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    is_correct = models.BooleanField(null=True)
    marks_obtained = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("attempt", "question")

    def __str__(self):
        return f"Attempt {self.attempt.id} | Q{self.question.id}"
class ResponseOption(models.Model):

    response = models.ForeignKey(
        Response,
        on_delete=models.CASCADE,
        related_name="selected_options"
    )

    option = models.ForeignKey(
        Option,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("response", "option")

    def __str__(self):
        return f"Response {self.response.id} | Option {self.option.id}"
