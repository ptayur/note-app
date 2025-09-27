from rest_framework import serializers
from notes.models import Note, Share, Permissions
from accounts.models import CustomUser


class ShareSerializer(serializers.HyperlinkedModelSerializer):
    """Shares serializer for endpoint"""

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    note = serializers.HyperlinkedRelatedField(
        queryset=Note.objects.all(), view_name="note-detail", lookup_field="pk"
    )
    permissions = serializers.SlugRelatedField(
        queryset=Permissions.objects.all(), many=True, slug_field="code"
    )

    class Meta:
        model = Share
        fields = ["url", "id", "user", "note", "permissions"]

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


class ShareListSerializer(serializers.HyperlinkedModelSerializer):
    """Shares serializer for NoteSerializer"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    permissions = serializers.SlugRelatedField(many=True, read_only=True, slug_field="code")

    class Meta:
        model = Share
        fields = ["url", "id", "user", "permissions"]
