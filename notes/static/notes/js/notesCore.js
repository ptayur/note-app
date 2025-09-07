//
// Imports
//

import { jwtRequest } from "../../../../static/js/utils.js";

//
// CRUD Functions
//

export async function createNote(data) {
    return await jwtRequest("/api/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export async function readNotes() {
    return await jwtRequest("/api/notes/", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
}

export async function updateNote(id, data) {
    return await jwtRequest(`/api/notes/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

export async function deleteNote(id) {
    return await jwtRequest(`/api/notes/${id}/`, {
        method: "DELETE"
    });
}