//
// Imports
//

import { deleteNote, getNoteDetails, getNoteList, updateNote } from "./notesCore.js";
import { renderNote, unselectNote, selectNote } from "./notesUI.js";

//
// Global Variables & DOM Elements
//

const notesList = document.querySelector(".notes__list");
const noteView = document.querySelector(".note-view");

// Get note actions
const saveBtn = noteView.querySelector("#save-button");
const infoBtn = noteView.querySelector("#info-button");
const deleteBtn = noteView.querySelector("#delete-button");
const shareBtn = noteView.querySelector("#share-button");

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    // Load note list
    try {
        const data = await getNoteList();
        data.forEach(note => {
            renderNote(notesList, note);
        });
    } catch (error) {
        // TODO: display modal with error
        console.log(error);
    }
})

notesList.addEventListener("click", async (event) => {
    // Note selecting
    const note = event.target.closest(".note");
    if (!note) return;
    if (note.contains(event.target)) {
        if (note.classList.contains("note--selected")) {
            unselectNote(note, noteView);
        } else {
            try {
                const data = await getNoteDetails(note.dataset.id);
                selectNote(note, notesList, noteView, data);
            } catch (error) {
                // TODO: display modal with error
                console.log(error);
            }
        }
    }
})

// Save button logic
saveBtn.addEventListener("click", async () => {
    const content = noteView.querySelector("textarea").value;
    const note = notesList.querySelector(".note--selected");

    try {
        await updateNote(note.dataset.id, { content: content });
    } catch (error) {
        // TODO: display modal with error
        console.log(error);
    }
    
})

//Info button logic
infoBtn.addEventListener("click", async () => {
    // TODO: display modal with info
})

// Delete button logic
deleteBtn.addEventListener("click", async () => {
    const note = notesList.querySelector(".note--selected");
    const noteId = note.dataset.id;

    try {
        await deleteNote(noteId);
        unselectNote(note, noteView);
        note.remove();
    } catch {error} {
        // TODO: display modal with error
        console.log(error);
    }
})