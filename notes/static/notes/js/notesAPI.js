//
// Imports
//

import { jwtRequest, AppError } from "/static/js/utils.js";

//
// CRUD Functions
//

async function checkResponse(response, errorTitle) {
    if (!response.ok) {
        throw new AppError(errorTitle, response.data?.error || `HTTP error: ${response.status}`);
    }
    return response.data;
}

export async function createNote(data) {
    const response = await jwtRequest("/api/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return checkResponse(response, "Create request error");
}

export async function getNoteList(filterParams = null) {
    let url = "/api/notes/";
    if (filterParams) {
        url += `?${filterParams}`; 
    }
    const response = await jwtRequest(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    return await checkResponse(response, "Get notes request error");
}

export async function getNoteDetails(noteId) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "GET"
    });

    return await checkResponse(response, "Get note request error");
}

export async function updateNote(noteId, payload) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    return await checkResponse(response, "Update request error");
}

export async function deleteNote(noteId) {
    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "DELETE"
    });

    return await checkResponse(response, "Delete request error");
}

export async function shareNote(data) {
    const response = await jwtRequest("/api/notes/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return await checkResponse(response);
}