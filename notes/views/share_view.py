from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from notes.models import Share
from notes.serializers import ShareSerializer


class ShareView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Share, pk=pk)

    def post(self, request):
        """Create new share"""
        serializer = ShareSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        """Update a `pk` share"""
        share = self.get_object(pk)

        if share.note.user != request.user:
            raise PermissionDenied("Only the note owner can modify share.")

        serializer = ShareSerializer(share, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a `pk` share"""
        share = self.get_object(pk)

        if share.note.user != request.user:
            raise PermissionDenied("Only the note owner can remove share.")

        share.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
