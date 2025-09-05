from rest_framework.views import APIView
from rest_framework import permissions, status
from note_app.models import Note
from note_app.serializers import NoteSerializer
from .api_responses import APIResponse


class NoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List all notes"""
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return APIResponse.success(serializer.data)

    def post(self, request):
        """Create a new note"""
        serializer = NoteSerializer(data=request.data)
        if not serializer.is_valid():
            return APIResponse.error(serializer.errors)

        serializer.save(user=request.user)
        return APIResponse.success(serializer.data, status_code=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        """Update a `pk` note"""
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return APIResponse.error(
                f"Note object with id={pk} not found.", status_code=status.HTTP_404_NOT_FOUND
            )

        serializer = NoteSerializer(note, data=request.data, partial=True)
        if not serializer.is_valid():
            return APIResponse.error(serializer.errors)

        serializer.save()
        return APIResponse.success(serializer.data)

    def delete(self, request, pk):
        """Delete a `pk` note"""
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return APIResponse.error(
                f"Note object with id={pk} not found.", status_code=status.HTTP_404_NOT_FOUND
            )

        note.delete()
        return APIResponse.success(status_code=status.HTTP_204_NO_CONTENT)
