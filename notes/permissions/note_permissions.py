from rest_framework import permissions
from rest_framework import request
from rest_framework import views
from notes.models import Share, Note


class CheckNotePermission(permissions.BasePermission):
    """
    Note-level permission to check users access.
    """

    def has_object_permission(
        self, request: request.Request, view: views.APIView, obj: Note
    ) -> bool:
        # Owner always has full access
        if request.user == obj.owner:
            return True

        # Get user's share for this note
        try:
            share = obj.shares.get(user=request.user)
        except Share.DoesNotExist:
            return False

        # Check for specific permissions per request method
        if request.method == "GET":
            return share.has_perm("read")
        elif request.method in ("PATCH", "PUT"):
            return share.has_perm("write")
        elif request.method == "DELETE":
            return share.has_perm("delete")

        return False
