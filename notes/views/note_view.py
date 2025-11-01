from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from notes.models import Note
from notes.serializers import NotesListSerializer, NotesDetailSerializer
from notes.permissions import NotePermissions


class NotesListView(APIView):
    """
    Note view for `/api/v1/notes/` endpoint.

    Supports `GET` and `POST` methods.
    """

    permission_classes = [permissions.IsAuthenticated, NotePermissions]

    def get(self, request: Request) -> Response:
        # Get filtering params
        search = request.query_params.getlist("search")
        ownership_type = request.query_params.getlist("ownership")
        shared_permissions = request.query_params.getlist("permissions")

        # Get all user's notes first
        notes = Note.objects.filter(Q(owner=request.user) | Q(shares__user=request.user))

        # Search filters
        if len(search) > 0:
            search_q = Q()
            for element in search:
                search_q |= Q(title__icontains=element) | Q(content__icontains=element)
            notes = notes.filter(search_q)

        # Ownership filters
        if len(ownership_type) > 0:
            ownership_q = Q()
            if "private" in ownership_type:
                ownership_q |= Q(shares__isnull=True)
            if "with_shares" in ownership_type:
                ownership_q |= Q(shares__isnull=False)
            if "shared" in ownership_type:
                ownership_q |= Q(shares__user=request.user)
            notes = notes.filter(ownership_q)

        # Shared permissions filters
        if len(shared_permissions) > 0:
            perm_q = Q()
            for perm in shared_permissions:
                perm_q &= Q(shares__permissions__code=perm)
            notes = notes.filter(perm_q)

        notes = notes.distinct()  # Prevent duplicates
        serializer = NotesListSerializer(notes, context={"request": request}, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        serializer = NotesDetailSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NotesDetailView(APIView):
    """
    Note view for `/api/v1/notes/<int:pk>` endpoint.

    Supports `GET`, `PUT`, `PATCH`, `DELETE` methods.
    """

    permission_classes = [permissions.IsAuthenticated, NotePermissions]

    def get_object(self, request: Request, pk: int) -> Note:
        note = get_object_or_404(Note, pk=pk)
        self.check_object_permissions(request, note)
        return note

    def get(self, request: Request, pk: int) -> Response:
        note = self.get_object(request, pk)
        serializer = NotesDetailSerializer(note, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request, pk: int) -> Response:
        note = self.get_object(request, pk)
        serializer = NotesDetailSerializer(note, data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request, pk: int) -> Response:
        note = self.get_object(request, pk)
        serializer = NotesDetailSerializer(note, data=request.data, context={"request": request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, pk: int) -> Response:
        note = self.get_object(request, pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
