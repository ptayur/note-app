//
// Imports
//

import { jwtRequest } from "../../../../static/js/utils.js";

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
    const result = await jwtRequest("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });

    if (result.ok) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("IsLoggedIn", true);
    }

    return result;
}

export async function register(credentials) {
    return await jwtRequest("/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
}

export async function logout() {
    const result = await jwtRequest("/api/users/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    if (result.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("IsLoggedIn");
        window.location.href = "/auth/";
    }

    return result;
}

export async function getCurrentUser() {
    return await jwtRequest("/api/users/me/", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
}