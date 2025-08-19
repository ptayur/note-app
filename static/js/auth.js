//
// Imports
//

import { apiFetch } from "./utils.js";

//
// Global Variables & DOM Elements
//

const signInForm = document.getElementById('sign-in');
const signUpForm = document.getElementById('sign-up');

//
// Authentication Functions
//

async function login(data) {
    const result = await apiFetch('api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!result.ok) {
        console.error('Login failed:', result.data);
        return;
    }

    const accessToken = result.data.access;
    const refreshToken = result.data.refresh;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
}

async function register(data) {
    const result = await apiFetch('api/register/', {
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