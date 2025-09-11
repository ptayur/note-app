from rest_framework import serializers
from .models import Note, Shares


class SharesSerializer(serializers.ModelSerializer):
    """Shares serializer for endpoint"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    note = serializers.SlugRelatedField(read_only=True, slug_field="id")

    class Meta:
        model = Shares
        fields = "__all__"


class SharesNestedSerializer(serializers.ModelSerializer):
    """Shares serializer for NoteSerializer"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")

    class Meta:
        model = Shares
        exclude = ["note"]


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    shared_with = SharesNestedSerializer(source="shares", many=True, read_only=True)

    class Meta:
        model = Note
        fields = "__all__"
