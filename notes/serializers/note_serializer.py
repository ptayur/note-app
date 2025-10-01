from rest_framework import serializers
from notes.models import Note
from .share_serializer import ShareDetailSerializer


class NoteListSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for `Note` model list view (requires `context={"request": request}`).

    Handles list representation of user's notes (`url`, `id`, `title`).
    """

    class Meta:
        model = Note
        fields = ["url", "id", "title"]


class NoteDetailSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for `Note` model detail view (requires `context={"request": request}`).

    Handles note's full representation (field `shares` removed for non-owners).
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")
    shares = ShareDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = ["url", "id", "owner", "title", "content", "created_at", "updated_at", "shares"]

    def get_fields(self) -> dict[str, serializers.Field]:
        """
        Dynamically adjust serializer fields based on request's user:
        - If user is not `Note.owner` -> remove `shares` from representation.
        """
        fields = super().get_fields()
        # Remove "shares" for non-owners
        if isinstance(self.instance, Note):
            request = self.context.get("request")
            if request and request.user != self.instance.owner:
                fields.pop("shares", None)
        return fields
