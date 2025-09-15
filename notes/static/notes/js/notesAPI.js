//
// Imports
//

import { jwtRequest } from "../../../../static/js/utils.js";

//
// CRUD Functions
//

async function checkResponse(response) {
    if (!response.ok) {
        throw new Error(response.data?.error || `HTTP error: ${response.status}`);
    }
    return response.data;
}

export async function createNote(data) {
    const response = await jwtRequest("/api/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return checkResponse(response);
}

export async function getNoteList() {
    const response = await jwtRequest("/api/notes/", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    return await checkResponse(response);
}

export async function getNoteDetails(noteId) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "GET"
    });

    return await checkResponse(response);
}

export async function updateNote(noteId, payload) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    return await checkResponse(response);
}

export async function deleteNote(noteId) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "DELETE"
    });

    return await checkResponse(response);
}

export async function shareNote(data) {
    const response = await jwtRequest("/api/notes/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return await checkResponse(response);
}