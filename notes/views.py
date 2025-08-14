from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import NoteForm
from .models import Note

# Create your views here.


def notes(request):
    return render(request, "notes.html")


def get_notes(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=403)
    if request.method == "GET":
        notes = Note.objects.filter(user=request.user).iterator()
        response = []
        for note in notes:
            response.append(
                {
                    "id": note.id,
                    "title": note.title,
                    "content": note.content,
                    "created_at": note.created_at,
                    "updated_at": note.updated_at,
                }
            )
        return JsonResponse(response, safe=False)


# Rewrite into NoteForm
def add_note(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=403)
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        note = Note.objects.create(
            user=request.user, title=title, content=content
        )
        return JsonResponse(
            {"id": note.id, "title": note.title, "content": note.content}
        )
