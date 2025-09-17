//
// Imports
//

import { getNoteDetails, getNoteList } from "./notesAPI.js";
import { NoteController } from "./noteController.js";
import { showCreateModal, showDetailsModal } from "./notesModal.js";

import { ToastContainer } from "/static/components/toasts/toastContainer.js";

//
// Global Variables & DOM Elements
//

const notesList = document.querySelector(".notes__list");
const noteView = document.querySelector(".note-view");
const noteController = new NoteController({
    noteView: noteView,
    notesList: notesList
});

const toastContainer = new ToastContainer();

// Get note list actions
const createBtn = document.querySelector("#create-button");

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
        const notes = await getNoteList();
        notes.forEach(data => {
            const noteTemplate = notesList.querySelector("#note-template");
            const noteClone = noteTemplate.content.cloneNode(true);

            const note = noteClone.querySelector(".note");
            note.dataset.id = data.id;

            const title = note.querySelector(".note h3");
            title.textContent = data.title;

            notesList.appendChild(noteClone);
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

// Create note button logic
createBtn.addEventListener("click", async() => {
    showCreateModal();
})

// Save button logic
saveBtn.addEventListener("click", async () => {
    try {
        await noteController.update();
        toastContainer.addSuccessToast("Note update", "Note was successfully updated!");
    } catch (error) {
        toastContainer.addErrorToast("Update error", error);
    }
})

//Info button logic
infoBtn.addEventListener("click", async () => {
    const noteData = noteController.getData();
    showDetailsModal(noteData);
})

// Delete button logic
deleteBtn.addEventListener("click", async () => {
    noteController.delete();
})