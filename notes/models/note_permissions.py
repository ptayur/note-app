from django.db import models
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from typing import Iterable


class NotePermissions(models.Model):
    code = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=100, blank=True)

    CACHE_KEY = "note_permissions:all_codes"

    @classmethod
    def all_codes(cls) -> set[str]:
        """
        Returns set of valid permission codes (cached).
        """
        codes = cache.get(cls.CACHE_KEY)
        if codes is None:
            codes = set(cls.objects.values_list("code", flat=True))
            cache.set(cls.CACHE_KEY, codes, timeout=3600)
        return codes

    @classmethod
    def validate_codes(cls, perm_codes: Iterable[str] | str) -> set[str]:
        """
        Validates `perm_codes` type and existence in `NotePermissions` table.

        Returns set of permission codes.
        """
        if isinstance(perm_codes, str):
            perm_codes = [perm_codes]
        elif isinstance(perm_codes, Iterable):
            if not all(isinstance(code, str) for code in perm_codes):
                raise TypeError("All permission codes must be strings.")
        else:
            raise TypeError("perm_codes must be a string or iterable of strings.")

        perms = set(perm_codes)
        missing = perms - cls.all_codes()
        if missing:
            raise ValueError(f"Invalid permission code(s): {', '.join(missing)}.")

        return perms


# Auto-clear cache on table change
@receiver([post_save, post_delete], sender=NotePermissions)
def clear_permission_cache(sender, **kwargs):
    cache.delete(sender.CACHE_KEY)
