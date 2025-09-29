from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.dateparse import parse_date
from notes.models import Note
from notes.serializers import NoteSerializer
from notes.permissions import NotePermissions


class NoteView(APIView):
    permission_classes = [permissions.IsAuthenticated, NotePermissions]

    def get_object(self, request, pk):
        note = get_object_or_404(Note, pk=pk)
        self.check_object_permissions(request, note)
        return note

    def get(self, request, pk=None):
        """Get info about `pk` note"""
        if pk is None:
            # Get filtering params
            search = request.query_params.getlist("search")
            ownership_type = request.query_params.getlist("ownership")
            shared_permissions = request.query_params.getlist("permissions")
            date = request.query_params.get("date", None)

            # Get all user's notes first
            notes = Note.objects.filter(Q(owner=request.user) | Q(shares__user=request.user))

            # Search filters
            if search:
                search_q = Q()
                for element in search:
                    search_q |= Q(title__icontains=element) | Q(content__icontains=element)
                notes = notes.filter(search_q)

            # Ownership filters
            if ownership_type and "" not in ownership_type:
                ownership_q = Q()
                if "private" in ownership_type:
                    ownership_q |= Q(shares__isnull=True)
                if "with_shares" in ownership_type:
                    ownership_q |= Q(shares__isnull=False)
                if "shared" in ownership_type:
                    ownership_q |= Q(shares__user=request.user)
                notes = notes.filter(ownership_q)

            # Shared permissions filters
            if shared_permissions and "" not in shared_permissions:
                perm_q = Q()
                if "read" in shared_permissions:
                    perm_q |= Q(share__can_modify=False)
                if "write" in shared_permissions:
                    perm_q |= Q(share__can_modify=True)
                notes = notes.filter(perm_q)

            # Date filter
            if date:
                parsed_date = parse_date(date)  # Normalize date
                if parsed_date:
                    notes = notes.filter(created_at__date=parsed_date)

            notes = notes.distinct()  # Prevent duplicates
            serializer = NoteSerializer(notes, context={"request": request}, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            note = self.get_object(request, pk)
            serializer = NoteSerializer(note, context={"request": request})

            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Create a new note"""
        serializer = NoteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        """Update a `pk` note"""
        note = self.get_object(request, pk)

        serializer = NoteSerializer(note, data=request.data, context={"request": request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a `pk` note"""
        note = self.get_object(request, pk)

        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
