//
// Imports
//

import { jwtRequest } from "../../../../static/js/utils.js";

//
// CRUD Functions
//

// Save full info about currently selected note
let currentNoteInfo;

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

    const data = await checkResponse(response);
    currentNoteInfo = data;

    return data;
}

export async function updateNote(noteId, updatedData) {
    // Build payload with only changed field
    const payload = {};
    if ((updatedData.title !== currentNoteInfo.title) && updatedData.title) {
        payload.title = updatedData.title;
    }
    if ((updatedData.content !== currentNoteInfo.content) && updatedData.content) {
        payload.content = updatedData.content;
    }

    // Return early if nothing changed
    if (Object.keys(payload).length === 0) {
        throw new Error("No changes provided.");
    }

    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await checkResponse(response);
    currentNoteInfo = data;

    return data;
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