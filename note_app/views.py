from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required()
def notes(request):
    return render(request, "notes.html")


def home(request):
    return render(request, "home.html")


def auth(request):
    return render(request, "auth.html")
