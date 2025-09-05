from django.shortcuts import render


def notes(request):
    return render(request, "notes.html")


def home(request):
    return render(request, "home.html")


def auth(request):
    return render(request, "auth.html")
