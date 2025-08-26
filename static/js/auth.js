//
// Imports
//

import { jwtRequest } from "./utils.js";

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

//
// Authentication Functions
//

async function login(data) {
    const result = await jwtRequest('/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.error('Login failed:', result.data);
        return;
    }
}

async function register(data) {
    const result = await jwtRequest('/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.error('Register failed:', result.data);
        return;
    }
}

//
// Helper Functions
//

function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

//
// Validation Functions
//

async function validateEmail() {
    const email = emailFieldBack.value;

    const response = await jwtRequest("/auth/validation/email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": email })
    })

    if (!response.ok) {
        const errorMessage = response.data["error"];
        emailError.innerHTML = `<p>${errorMessage}</p>`;
    } else {
        emailError.innerHTML = ""
    }
    
    
}

async function validatePassword() {
    const password = passwordField.value;

    const response = await jwtRequest("/auth/validation/password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "password": password })
    })

    if (!response.ok) {
        const errorMessage = response.data["error"];
        passwordError.innerHTML = `<p>${errorMessage}</p>`;
    } else {
        passwordError.innerHTML = ""
    }
}

//
// Event Listeners
//

signInForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = {
        email: signInForm.email.value,
        password: signInForm.password.value
    };

    await login(data);
})

signUpForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = {
        username: signUpForm.username.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value
    };

    await register(data);
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

emailFieldBack.addEventListener("input", debounce(validateEmail))

passwordField.addEventListener("input", debounce(validatePassword))