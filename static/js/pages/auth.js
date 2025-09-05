//
// Imports
//

import { login, register, validateField, validateRepeatPassword } from "../core/authCore.js";
import { debounce } from "../core/utils.js";
import { showFieldError } from "../ui/errors.js"

//
// Global Variables & DOM Elements
//

const signInForm = document.getElementById('sign-in');
const signUpForm = document.getElementById('sign-up');
const card = document.getElementById('auth-card');

const emailFieldBack = document.getElementById("email-back");
const emailError = document.getElementById("email-error");

const passwordField = document.getElementById("password-back");
const passwordError = document.getElementById("password-error");

const passwordRepeatField = document.getElementById("repeat-password");
const passwordRepeatError = document.getElementById("repeat-password-error");

const usernameField = document.getElementById("username");
const usernameError = document.getElementById("username-error");

const loginError = document.getElementById("login-error");

//
// Functions
//

const debouncedValidateUsername = debounce(async () => {
    const result = await validateField({
        field: usernameField,
        url: "/auth/validation/username/",
        method: "GET",
        paramName: "username"

    })
    showFieldError(usernameError, result);

})

const debouncedValidateEmail = debounce(async () => {
    const result = await validateField({
        field: emailFieldBack,
        url: "/auth/validation/email/",
        paramName: "email"
    })
    showFieldError(emailError, result);
})

const debouncedValidatePassword = debounce(async () => {
    const result = await validateField({
        field: passwordField,
        url: "/auth/validation/password/",
        paramName: "password"
    })
    showFieldError(passwordError, result);
})

//
// Event Listeners
//

signInForm.addEventListener('submit', async event => {
    event.preventDefault();
    const credentials = {
        email: signInForm.email.value,
        password: signInForm.password.value
    };

    const result = await login(credentials);
    if (!result.ok) {
        console.log(result);
        showFieldError(loginError, result.data);
    } else {
        localStorage.setItem("access_token", result.data["access_token"]);
        window.location.replace("/notes/");
    }
})

signUpForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = {
        username: signUpForm.username.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value
    };

    const result = await register(data);
    if (!result.ok) {
        // Manage error
    } else {
        await login({
            email: data.email,
            password: data.password
        })
    }
})

document.getElementById('flip-to-signup').addEventListener('click', () => {
    card.classList.add('flipped');
})

document.getElementById('flip-to-signin').addEventListener('click', () => {
    card.classList.remove('flipped');
})

emailFieldBack.addEventListener("input", debouncedValidateEmail)

passwordField.addEventListener("input", debouncedValidatePassword)

passwordField.addEventListener("input", () => {
    const result = validateRepeatPassword({
        passwordField: passwordField,
        repeatField: passwordRepeatField
    });
    const errorMessage = result ? "" : "Passwords do not match.";
    showFieldError(passwordRepeatError, errorMessage);
})

passwordRepeatField.addEventListener("input", () => {
    const result = validateRepeatPassword({
        passwordField: passwordField,
        repeatField: passwordRepeatField
    });
    const errorMessage = result ? "" : "Passwords do not match.";
    showFieldError(passwordRepeatError, errorMessage);
})

usernameField.addEventListener("input", debouncedValidateUsername)

