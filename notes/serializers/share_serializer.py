from rest_framework import serializers
from notes.models import Note, Share, Permissions
from accounts.models import CustomUser
from typing import Any


class ShareSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for Share model (requires `context={"request": request}`).

    Handles both list and detail views:
    - List view: list representation of Note's shares (`url`, `id`, `user`, `permissions`).
    - Detail view: Share's full representation.
    """

    list_fields = ["url", "id", "user", "permissions"]

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    permissions = serializers.SlugRelatedField(queryset=Permissions.objects.all(), many=True, slug_field="code")

    # Read-only: show note as URL in responses
    note = serializers.HyperlinkedRelatedField(view_name="note-detail", lookup_field="pk", read_only=True)
    # Write-only: accept note ID in requests
    note_id = serializers.PrimaryKeyRelatedField(source="note", queryset=Note.objects.all(), write_only=True)

    class Meta:
        model = Share
        fields = ["url", "id", "user", "note", "note_id", "permissions"]

    def get_fields(self) -> dict[str, serializers.Field]:
        """
        Dynamically adjust serializer fields based on context and instance.

        - If used in ListSerializer (list) -> return list representation of user's Shares.
        - If single instance (detail) -> return Share's full representation.
        """
        fields = super().get_fields()

        is_list_view = getattr(self, "many", False) or isinstance(
            getattr(self, "parent", None), serializers.ListSerializer
        )
        if is_list_view:
            return {k: fields[k] for k in self.list_fields if k in fields}
        return fields

    def validate(self, attrs: Any) -> Any:
        validated_data = super().validate(attrs)
        # Restrict users from sharing a note with themselves.
        user = validated_data.get("user")
        note = validated_data.get("note")
        if note and user and note.owner == user:
            raise serializers.ValidationError("You cannot share a note with yourself.")
        return validated_data
