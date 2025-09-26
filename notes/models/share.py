from django.db import models
from django.db.models.query import QuerySet
from accounts.models import CustomUser
from .note import Note


class Permissions(models.Model):
    code = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=100, blank=True)


class Share(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="share")
    permissions = models.ManyToManyField(Permissions)

    def get_permissions(self, perm_codes: list[str] | str) -> QuerySet[Permissions, Permissions]:
        if isinstance(perm_codes, str):
            perm_codes = [perm_codes]

        qs = Permissions.objects.filter(code__in=perm_codes)
        missing = set(perm_codes) - set(qs.values_list("code", flat=True))
        if missing:
            raise ValueError(f"Unknown permission codes: {', '.join(missing)}")

        return qs

    def has_perm(self, perm_codes: list[str] | str) -> bool:
        perms = self.get_permissions(perm_codes).values_list("code", flat=True)
        qs = self.permissions.filter(code__in=perms)
        return not perms.difference(qs.values_list("code", flat=True))

    def set_perms(self, perm_codes: list[str] | str) -> QuerySet[Permissions, Permissions]:
        perms = self.get_permissions(perm_codes)
        self.permissions.set(perms)
        return self.permissions.all()
