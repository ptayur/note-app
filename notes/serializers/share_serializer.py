from rest_framework import serializers
from notes.models import Note, Share
from accounts.models import CustomUser


class ShareSerializer(serializers.ModelSerializer):
    """Shares serializer for endpoint"""

    user = serializers.SlugRelatedField(queryset=CustomUser.objects.all(), slug_field="username")
    note = serializers.SlugRelatedField(queryset=Note.objects.all(), slug_field="id")
    permissions = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Share
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


class ShareNestedSerializer(serializers.ModelSerializer):
    """Shares serializer for NoteSerializer"""

    user = serializers.SlugRelatedField(read_only=True, slug_field="username")
    permissions = serializers.SlugRelatedField(many=True, read_only=True, slug_field="code")

    class Meta:
        model = Share
        exclude = ["id", "note"]
