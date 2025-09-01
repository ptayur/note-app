//
// Imports
//

import { login, register, validateEmail, validatePassword, validateUsername } from "../core/authCore.js";
import { debounce } from "../core/utils.js";
import {showFieldError} from "../ui/errors.js"

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

const usernameField = document.getElementById("username");
const usernameError = document.getElementById("username-error");

//
// Functions
//

const debouncedValidateUsername = debounce(async () => {
    const result = await validateUsername(usernameField);
    showFieldError(usernameError, result);

})

const debouncedValidateEmail = debounce(async () => {
    const result = await validateEmail(emailFieldBack);
    showFieldError(emailError, result);
})

const debouncedValidatePassword = debounce(async () => {
    const result = await validatePassword(passwordField);
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

    login(credentials);

})

signUpForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = {
        username: signUpForm.username.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value
    };

    const result = register(data);
    await login({
        email: data.email,
        password: data.password
    })
})

document.getElementById('flip-to-signup').addEventListener('click', () => {
    card.classList.add('flipped');
})

document.getElementById('flip-to-signin').addEventListener('click', () => {
    card.classList.remove('flipped');
})

emailFieldBack.addEventListener("input", debouncedValidateEmail)

passwordField.addEventListener("input", debouncedValidatePassword)

usernameField.addEventListener("input", debouncedValidateUsername)