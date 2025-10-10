from django.db import models
from typing import Iterable
from accounts.models import CustomUser
from notes.models import Note, NotePermission


class Share(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="shares")
    permissions = models.ManyToManyField(NotePermission)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "note"], name="unique_share_per_user"),
        ]

    def has_perm(self, perm_codes: Iterable[str] | str) -> bool:
        """
        Returns `True` if given `perm_codes` are subset of current `Share.permissions`.
        """
        perms = NotePermission.validate_codes(perm_codes)
        current = set(self.permissions.values_list("code", flat=True))
        return perms.issubset(current)
