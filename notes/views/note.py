from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.db.models import Q
from notes.models import Note
from notes.serializers import NoteSerializer, NoteListSerializer


class NoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Note, pk=pk)

    def get(self, request, pk=None):
        """Get info about `pk` note"""
        if pk is None:
            # Get filtering params
            search = request.query_params.get("search", None)
            ownership_type = request.query_params.get("ownership", None)
            shared_permissions = request.query_params.get("permissions", None)
            date = request.query_params.get("date", None)

            # Get all user's notes first
            notes = Note.objects.filter(Q(user=request.user) | Q(shares__user=request.user))

            # Apply filters
            if search:
                notes = notes.filter(Q(title__icontains=search) | Q(content__icontains=search))

            if ownership_type == "private":
                notes = notes.filter(shared_with__isnull=True)
            if ownership_type == "with_shares":
                notes = notes.filter(shared_with__isnull=False)
            if ownership_type == "shared":
                notes = notes.filter(shares__user=request.user)

            if shared_permissions == "read":
                notes = notes.filter(shared_with__can_modify=False)
            if shared_permissions == "write":
                notes = notes.filter(shared_with__can_modify=True)

            if date:
                notes = notes.filter(created_at=date)

            serializer = NoteListSerializer(notes, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            note = self.get_object(pk)
            serializer = NoteSerializer(note)

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
