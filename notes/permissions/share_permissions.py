from rest_framework import permissions
from rest_framework import request
from rest_framework import views
from notes.models import Share, Note


class SharePermissions(permissions.BasePermission):
    """
    Share-level permission to check users access.
    """

    def has_object_permission(self, request: request.Request, view: views.APIView, obj: Share) -> bool:
        # Owner always has full access
        return request.user == obj.note.owner

    def has_permission(self, request: request.Request, view: views.APIView) -> bool:
        share_pk = view.kwargs.get("pk")
        if share_pk:
            # Let object-level handler check permissions
            return True

        # Handle permissions of requests to /api/notes/<int:pk>/shares/
        note_id = view.kwargs.get("note_id")
        if note_id:
            try:
                note = Note.objects.get(pk=note_id)
            except Note.DoesNotExist:
                return False
            return note.owner == request.user

        return False
