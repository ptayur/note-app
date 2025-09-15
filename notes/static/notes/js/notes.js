//
// Imports
//

import { deleteNote, getNoteDetails, getNoteList, updateNote } from "./notesAPI.js";
import { renderNote } from "./notesUI.js";
import { NoteController } from "./noteController.js";

//
// Global Variables & DOM Elements
//

const notesList = document.querySelector(".notes__list");
const noteView = document.querySelector(".note-view");
const noteController = new NoteController({
    noteView: noteView,
    notesList: notesList
});

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
            noteController.unselect();
        } else {
            try {
                const data = await getNoteDetails(note.dataset.id);
                noteController.select(note, data);
            } catch (error) {
                // TODO: display modal with error
                console.log(error);
            }
        }
    }
})

// Save button logic
saveBtn.addEventListener("click", async () => {
    noteController.update();
})

//Info button logic
infoBtn.addEventListener("click", async () => {
    // TODO: display modal with info
})

// Delete button logic
deleteBtn.addEventListener("click", async () => {
    noteController.delete();
})