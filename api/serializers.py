from rest_framework import serializers
from django.contrib.auth.models import User
from note_app.models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["title", "content"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "email"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", ""),
        )
        return user
