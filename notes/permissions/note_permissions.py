from rest_framework import permissions
from rest_framework import request
from rest_framework import views
from notes.models import Share, Note


class NotePermissions(permissions.BasePermission):
    """
    `Note` permissions handler.

    Implements object-level permissions handler:
    - Object-level: full access for `Note` object owner and verification for request's user.
    """

    def has_object_permission(self, request: request.Request, view: views.APIView, obj: Note) -> bool:
        """
        `Note` object-level permissions handler.

        Implements following access control:
        - Ensures that owner of the `Note` object has full access.
        - Verifies roles of request's user according to request method (`GET`, `PATCH`, etc).
        """
        # Owner always has full access
        if request.user == obj.owner:
            return True

        # Get user's share for this note
        try:
            share = obj.shares.get(user=request.user)
        except Share.DoesNotExist:
            return False

        # Verify specific role per request method
        method_mapping = {
            "GET": ["viewer", "editor"],
            "PUT": ["editor"],
            "PATCH": ["editor"],
        }
        if request.method in method_mapping:
            return share.role in method_mapping[request.method]
        return False
