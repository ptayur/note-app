//
// Imports
//

import { jwtRequest } from "./utils.js";

//
// Validation Functions
//

export async function validatePassword(passwordField) {
    const password = passwordField.value;

    const response = await jwtRequest("/auth/validation/password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "password": password })
    })

    if (!response.ok) {
        return response.data["error"];
    }

    return null;
}

export async function validateEmail(emailField) {
    const email = emailField.value;

    const response = await jwtRequest("/auth/validation/email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "email": email })
    })

    if (!response.ok) {
        return response.data["error"];

    }

    return null;
}

export async function validateUsername(usernameField) {
    const username = usernameField.value;
    const validationURL = `/auth/validation/username/?username=${encodeURIComponent(username)}`;

    const response = await jwtRequest(validationURL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (!response.ok) {
        return response.data["error"];

    }

    return null;
}

//
// Authentication Functions
//

export async function login(credentials) {
    const result = await jwtRequest('/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!result.ok) {
        return result.data["error"];
    }

    return null;
}

export async function register(credentials) {
    const result = await jwtRequest('/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });

    if (!result.ok) {
        return result.data["error"];
    }

    return result.data;
}