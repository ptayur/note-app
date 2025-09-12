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

export async function updateNote(note, data) {
    const noteId = note.dataset.id;
    const noteTitle = note.querySelector(".note-title");
    const noteContent = note.querySelector(".note-content");

    // Build payload with only changed field
    const payload = {};
    if (data.title !== noteTitle.textContent) {
        payload.title = data.title;
    }
    if (data.content !== noteContent.textContent) {
        payload.content = data.content;
    }

    // Return early if nothing changed
    if (Object.keys(payload).length === 0) {
        return { ok: false, status: 0, data: {"detail": "No changes provided."} };
    }

    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        // Change note title and content on success
        noteTitle.textContent = response.data.title;
        noteContent.textContent = response.data.content;
    } else {
        // Display error modal box
        console.log("Edit response not ok");
    }
}

export async function deleteNote(note) {
    const noteId = note.dataset.id;

    const response = await jwtRequest(`/api/notes/${noteId}/`, {
        method: "DELETE"
    });
    if (response.ok) {
        note.remove();
    } else {
        console.log("Delete response not ok");
    }
}

export async function shareNote(data) {
    return await jwtRequest("/api/notes/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}