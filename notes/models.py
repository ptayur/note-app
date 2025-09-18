from django.db import models
from accounts.models import CustomUser


class Note(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="owned_notes")
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shared_with = models.ManyToManyField(CustomUser, through="Shares")

    def __str__(self):
        return self.title


class Shares(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="shares")
    can_modify = models.BooleanField(default=False)
