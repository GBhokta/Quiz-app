from django.db import models
from django.conf import settings
from questions.models import Question


User = settings.AUTH_USER_MODEL
class Test(models.Model):

    STATUS_CHOICES = (
        ("DRAFT", "Draft"),
        ("PUBLISHED", "Published"),
        ("ARCHIVED", "Archived"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_tests"
    )

    duration_minutes = models.PositiveIntegerField()
    total_marks = models.PositiveIntegerField()

    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
class TestAccess(models.Model):

    test = models.OneToOneField(
        Test,
        on_delete=models.CASCADE,
        related_name="access"
    )

    access_code = models.CharField(max_length=50, unique=True)

    passcode_hash = models.CharField(max_length=255)

    passcode_version = models.PositiveIntegerField(default=1)

    is_passcode_required = models.BooleanField(default=True)

    max_attempts_per_user = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.test.title} | v{self.passcode_version}"
class TestPasscodeHistory(models.Model):

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="passcode_history"
    )

    passcode_hash = models.CharField(max_length=255)

    passcode_version = models.PositiveIntegerField()

    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.test.title} | v{self.passcode_version}"
class TestQuestion(models.Model):

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="test_questions"
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="test_questions"
    )

    marks = models.PositiveIntegerField()

    question_order = models.PositiveIntegerField()

    class Meta:
        unique_together = ("test", "question")
        ordering = ["question_order"]

    def __str__(self):
        return f"{self.test.title} | Q{self.question_id}"