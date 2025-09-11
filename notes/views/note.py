from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q
from notes.models import Note
from notes.serializers import NoteSerializer


class NoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Note, pk=pk)

    def get(self, request):
        """List all notes"""
        notes = Note.objects.filter(Q(user=request.user) | Q(shares__user=request.user))
        serializer = NoteSerializer(notes, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new note"""
        serializer = NoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        """Update a `pk` note"""
        note = self.get_object(pk)

        if note.user != request.user:
            raise PermissionDenied("Only note owner can modify it.")

        serializer = NoteSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a `pk` note"""
        note = self.get_object(pk)

        if note.user != request.user:
            raise PermissionDenied("Only note owner can delete it.")

        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
