from django.db import models
from session.models import TestAttempt
class Result(models.Model):

    attempt = models.OneToOneField(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name="result"
    )

    total_questions = models.PositiveIntegerField()

    correct = models.PositiveIntegerField()
    wrong = models.PositiveIntegerField()
    unattempted = models.PositiveIntegerField()

    percentage = models.FloatField()
    rank = models.PositiveIntegerField(null=True, blank=True)

    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result | Attempt {self.attempt.id}"
