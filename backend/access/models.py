from django.db import models
from django.utils import timezone
import uuid
from tests.models import Test
class TestAccessSession(models.Model):

    test = models.ForeignKey(
        Test,
        on_delete=models.CASCADE,
        related_name="access_sessions"
    )

    session_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    passcode_version = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.expires_at

    def __str__(self):
        return f"{self.test.title} | {self.session_token}"
