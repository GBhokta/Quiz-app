from django.db import models
from django.conf import settings
from django.utils import timezone
from questions.models import Question

User = settings.AUTH_USER_MODEL


# =========================================================
# 1. TEST
# =========================================================

class Test(models.Model):

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        ARCHIVED = "ARCHIVED", "Archived"

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
        choices=Status.choices,
        default=Status.DRAFT
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    # -------------------------
    # Business Logic
    # -------------------------

    def publish(self):
        self.status = self.Status.PUBLISHED
        self.save(update_fields=["status", "updated_at"])

    def archive(self):
        self.status = self.Status.ARCHIVED
        self.save(update_fields=["status", "updated_at"])

    def unpublish(self):
        self.status = self.Status.DRAFT
        self.save(update_fields=["status", "updated_at"])

    def deactivate(self):
        self.is_active = False
        self.save(update_fields=["is_active"])

    def activate(self):
        self.is_active = True
        self.save(update_fields=["is_active"])

    def __str__(self):
        return self.title


# =========================================================
# 2. TEST ACCESS (Security Layer)
# =========================================================

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

    def increment_passcode_version(self):
        self.passcode_version += 1
        self.save(update_fields=["passcode_version", "updated_at"])

    def __str__(self):
        return f"{self.test.title} | v{self.passcode_version}"


# =========================================================
# 3. PASSCODE HISTORY (Audit Safe)
# =========================================================

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


# =========================================================
# 4. TEST QUESTION MAPPING
# =========================================================

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
        ordering = ["question_order"]
        constraints = [
            models.UniqueConstraint(
                fields=["test", "question"],
                name="unique_question_per_test"
            )
        ]

    def __str__(self):
        return f"{self.test.title} | Q{self.question_id}"


# =========================================================
# 5. TEST ATTEMPT (Backbone)
# =========================================================

class TestAttempt(models.Model):

    class Status(models.TextChoices):
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        SUBMITTED = "SUBMITTED", "Submitted"
        EXPIRED = "EXPIRED", "Expired"
        FORCE_SUBMITTED = "FORCE_SUBMITTED", "Force Submitted"

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

    attempt_number = models.PositiveIntegerField(default=1)

    passcode_version_used = models.PositiveIntegerField()

    started_at = models.DateTimeField(auto_now_add=True)
    last_activity_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)


    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS
    )

    score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["test", "user", "attempt_number"],
                name="unique_attempt_per_user"
            )
        ]

    def submit(self):
        self.status = self.Status.SUBMITTED
        self.submitted_at = timezone.now()
        self.save(update_fields=["status", "submitted_at", "updated_at"])

    def __str__(self):
        return f"{self.test.title} | Attempt {self.attempt_number}"


# =========================================================
# 6. RESPONSE
# =========================================================

class Response(models.Model):

    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name="responses"
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="responses"
    )

    numerical_answer = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    is_correct = models.BooleanField(default=False)
    marks_obtained = models.FloatField(default=0.0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["attempt", "question"],
                name="unique_response_per_question"
            )
        ]

    def __str__(self):
        return f"Response Q{self.question_id} | Attempt {self.attempt_id}"


# =========================================================
# 7. RESPONSE OPTION (MSQ Support)
# =========================================================

class ResponseOption(models.Model):

    response = models.ForeignKey(
        Response,
        on_delete=models.CASCADE,
        related_name="selected_options"
    )

    option = models.ForeignKey(
        "questions.Option",
        on_delete=models.CASCADE
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["response", "option"],
                name="unique_option_per_response"
            )
        ]

    def __str__(self):
        return f"Response {self.response_id} | Option {self.option_id}"