from rest_framework import permissions
from rest_framework import request
from rest_framework import views
from notes.models import Share, Note


class SharePermissions(permissions.BasePermission):
    """
    `Share` permissions handler.

    Implements global and object-level permissions handlers:
    - Global: only `Note` owner can create/read `Share` objects.
    - Object-level: only `Note` owner can manipulate associated `Share` objects.
    """

    def has_object_permission(self, request: request.Request, view: views.APIView, obj: Share) -> bool:
        """
        `Share` object-level permissions handler.

        Ensures that only owner of `Note` object that associated with current `Share` can manipulate it.
        """
        return request.user == obj.note.owner

    def has_permission(self, request: request.Request, view: views.APIView) -> bool:
        """
        `Share` global permissions handler.

        Ensures that only owner of `Note` object can create/read `Share` objects.
        """
        share_pk = view.kwargs.get("pk")
        if share_pk:
            # Let object-level handler verify permissions
            return True

        # Verify permissions of requests to /api/notes/<int:pk>/shares/
        note_id = view.kwargs.get("note_id")
        if note_id:
            try:
                note = Note.objects.only("owner").get(pk=note_id)
            except Note.DoesNotExist:
                return False
            return note.owner == request.user

        return False
