from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from note_app.models import Note
from .serializers import NoteSerializer


class NoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List all notes"""
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new note"""
        serializer = NoteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=request.user)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        """Update a `pk` note"""
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return Response(
                {"errors": f"Note object with id={pk} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = NoteSerializer(note, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a `pk` note"""
        try:
            note = Note.objects.get(pk=pk, user=request.user)
        except Note.DoesNotExist:
            return Response(
                {"errors": f"Note object with id={pk} not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
