from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from notes.models import Share
from notes.serializers import SharesListSerializer, SharesDetailSerializer
from notes.permissions import SharePermissions


class SharesListView(APIView):
    """
    Share view for nested `/api/notes/<int:note_id>/shares/` endpoint.

    Supports `GET` and `POST` methods.
    """

    permission_classes = [permissions.IsAuthenticated, SharePermissions]

    def get(self, request: Request, note_id: int) -> Response:
        shares = Share.objects.filter(note__id=note_id)
        serializer = SharesListSerializer(shares, context={"request": request}, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, note_id: int) -> Response:
        data = request.data
        data["note_id"] = note_id
        serializer = SharesDetailSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SharesDetailView(APIView):
    """
    Share view for flat `/api/shares/<int:pk>` endpoint.

    Supports `GET`, `PATCH` and `DELETE` methods.
    """

    permission_classes = [permissions.IsAuthenticated, SharePermissions]

    def get_object(self, request: Request, pk: int) -> Share:
        share = get_object_or_404(Share, pk=pk)
        self.check_object_permissions(request, share)
        return share

    def get(self, request: Request, pk: int) -> Response:
        share = self.get_object(request, pk)
        serializer = SharesDetailSerializer(share, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request, pk: int) -> Response:
        share = self.get_object(request, pk)
        serializer = SharesDetailSerializer(share, data=request.data, context={"request": request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, pk: int) -> Response:
        share = self.get_object(request, pk)
        share.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
