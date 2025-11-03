from django.db import models
from accounts.models import CustomUser
from notes.models import Note


class Share(models.Model):
    ROLE_CHOICES = [
        ("viewer", "Viewer"),
        ("editor", "Editor"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="shares")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "note"], name="unique_share_per_user"),
        ]
