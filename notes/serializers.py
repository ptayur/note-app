from rest_framework import serializers
from .models import Note, Shares
from accounts.models import CustomUser


class SharesSerializer(serializers.ModelSerializer):
    """Shares serializer for endpoint"""

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    note = serializers.SlugRelatedField(queryset=Note.objects.all(), slug_field="id")
    permissions = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Shares
        fields = "__all__"

    def create(self, validated_data):
        perms = validated_data.pop("permissions", [])
        share = super().create(validated_data)
        if perms:
            share.set_perms(perms)
        return share

    def update(self, instance, validated_data):
        perms = validated_data.pop("permissions", None)
        instance = super().update(instance, validated_data)
        if perms is not None:
            instance.set_perms(perms)
        return instance


class SharesNestedSerializer(serializers.ModelSerializer):
    """Shares serializer for NoteSerializer"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")

    class Meta:
        model = Shares
        exclude = ["id", "note"]


class NoteSerializer(serializers.ModelSerializer):
    """Note serializer for detailed note view"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    shared_with = SharesNestedSerializer(source="shares", many=True, read_only=True)

    class Meta:
        model = Note
        fields = "__all__"


class NoteListSerializer(serializers.ModelSerializer):
    """Note serializer for list note view"""

    class Meta:
        model = Note
        fields = ["id", "title"]
