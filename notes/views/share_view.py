from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from notes.models import Share
from notes.serializers import ShareSerializer
from notes.permissions import SharePermissions


class ShareNoteView(APIView):
    """
    Share view for nested /api/notes/<int:pk>/shares/ endpoint
    """

    permission_classes = [permissions.IsAuthenticated, SharePermissions]

    def get(self, request, note_id):
        shares = Share.objects.filter(note__id=note_id)
        serializer = ShareSerializer(shares, context={"request": request}, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, note_id):
        data = request.data
        data["note_id"] = note_id

        serializer = ShareSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ShareView(APIView):
    """
    Share view for flat /api/shares/<int:pk> endpoint
    """

    permission_classes = [permissions.IsAuthenticated, SharePermissions]

    def get_object(self, request, pk):
        share = get_object_or_404(Share, pk=pk)
        self.check_object_permissions(request, share)
        return share

    def get(self, request, pk):
        share = self.get_object(request, pk)
        serializer = ShareSerializer(share, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        """Update a `pk` share"""
        share = self.get_object(request, pk)
        serializer = ShareSerializer(share, data=request.data, context={"request": request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a `pk` share"""
        share = self.get_object(request, pk)
        share.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
