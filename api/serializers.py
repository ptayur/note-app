from rest_framework import serializers
from django.contrib.auth.models import User
from note_app.models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content"]
