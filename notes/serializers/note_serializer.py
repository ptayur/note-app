from rest_framework import serializers
from notes.models import Note
from .share_serializer import ShareSerializer


class NoteSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for Note model (requires `context={"request": request}`).

    Handles both list and detail views:
    - List view: list representation of user's Notes (`url`, `id`, `title`).
    - Detail view: Note's full representation (field `shares` removed for non-owners).
    """

    list_fields = ["url", "id", "title"]  # List representation fields

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")
    shares = ShareSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = ["url", "id", "owner", "title", "content", "created_at", "updated_at", "shares"]

    def get_fields(self) -> dict[str, serializers.Field]:
        """
        Dynamically adjust serializer fields based on context and instance.

        - If used in ListSerializer (list) -> return list representation of user's Notes.
        - If single instance (detail) -> return Note's full representation.
            - If user is not Note.owner -> remove `shares` from representation.
        """
        fields = super().get_fields()

        # List view: return list representation
        is_list_view = getattr(self, "many", False) or isinstance(
            getattr(self, "parent", None), serializers.ListSerializer
        )
        if is_list_view:
            return {k: fields[k] for k in self.list_fields if k in fields}

        # Detail view: remove "shares" for non-owners
        if isinstance(self.instance, Note):
            request = self.context.get("request")
            if request and request.user != self.instance.owner:
                fields.pop("shares", None)
        return fields
