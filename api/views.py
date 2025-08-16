from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from notes.models import Note
from .serializers import NoteSerializer

# Create your views here.


class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
