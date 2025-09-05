//
// Imports
//

import { jwtRequest } from "./utils.js";

//
// Validation Functions
//

export async function validateField({ field, url, method = "POST", paramName }) {
    const value = field.value;

    let options = { method, headers: { "Content-Type": "application/json" } };
    let fetchURL = url;

    if (method.toUpperCase() === "POST") {
        options.body = JSON.stringify({ [paramName]: value });
    } else if (method.toUpperCase() === "GET" && paramName) {
        const params = new URLSearchParams({ [paramName]: value });
        fetchURL += `?${params}`;
    }

    return await jwtRequest(fetchURL, options);
}

export function validateRepeatPassword({ passwordField, repeatField}) {
    const password = passwordField.value;
    const repeat = repeatField.value;

    if (repeat && password !== repeat) {
        return false;
    }

    return true;
}

//
// Authentication Functions
//

export async function login(credentials) {
    return await jwtRequest('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
}

export async function register(credentials) {
    return await jwtRequest('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
}