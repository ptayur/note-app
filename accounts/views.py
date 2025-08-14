from django.shortcuts import render, redirect
from .forms import SignUpForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm

# Create your views here.


def index(request):
    return render(request, "index.html")


def auth_view(request):
    if request.method == "POST":
        if "login_submit" in request.POST:
            login_form = AuthenticationForm(request, data=request.POST)
            signup_form = SignUpForm()
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("notes")
        elif "signup_submit" in request.POST:
            signup_form = SignUpForm(request.POST)
            login_form = AuthenticationForm()
            if signup_form.is_valid():
                user = signup_form.save()
                login(request, user)
                return redirect("notes")
    else:
        login_form = AuthenticationForm()
        signup_form = SignUpForm()
    return render(
        request,
        "auth.html",
        {"login_form": login_form, "signup_form": signup_form},
    )
