from rest_framework import serializers
from notes.models import Note, Share, NotePermissions
from accounts.models import CustomUser
from typing import Any


class SharesListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for `Share` model list view (requires `context={"request": request}`).

    Handles list representation of note's shares (`url`, `id`, `user`, `permissions`).
    """

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    permissions = serializers.SlugRelatedField(queryset=NotePermissions.objects.all(), many=True, slug_field="code")

    class Meta:
        model = Share
        fields = ["url", "id", "user", "permissions"]


class SharesDetailSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for `Share` model detail view (requires `context={"request": request}`).

    Handles share's full representation.
    """

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    permissions = serializers.SlugRelatedField(queryset=NotePermissions.objects.all(), many=True, slug_field="code")

    # Read-only: show note as URL in responses
    note = serializers.HyperlinkedRelatedField(view_name="notes-detail", lookup_field="pk", read_only=True)
    # Write-only: accept note ID in requests
    note_id = serializers.PrimaryKeyRelatedField(source="note", queryset=Note.objects.all(), write_only=True)

    class Meta:
        model = Share
        fields = ["url", "id", "user", "note", "note_id", "permissions"]

    def validate(self, attrs: Any) -> Any:
        """
        Restrict users from sharing a note with themselves
        and prevent duplicate (`user`, `note`) pairs.
        """
        validated_data = super().validate(attrs)
        user = validated_data.get("user")
        note = validated_data.get("note")
        if note and user and note.owner == user:
            raise serializers.ValidationError("You cannot share a note with yourself.")
        elif note and user and Share.objects.filter(user=user, note=note).exists():
            raise serializers.ValidationError(f"Note is already shared with user {user.username}")
        return validated_data
