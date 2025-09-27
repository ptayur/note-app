from rest_framework import serializers
from notes.models import Note
from .share_serializer import ShareListSerializer


class NoteSerializer(serializers.HyperlinkedModelSerializer):
    """Note serializer for detailed note view"""

    owner = serializers.SlugRelatedField(read_only=True, slug_field="username")
    shares = ShareListSerializer(source="share", many=True, read_only=True)

    class Meta:
        model = Note
        fields = ["url", "id", "owner", "title", "content", "created_at", "updated_at", "shares"]


class NoteListSerializer(serializers.HyperlinkedModelSerializer):
    """Note serializer for list note view"""

    class Meta:
        model = Note
        fields = ["url", "id", "title"]
