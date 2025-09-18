//
// Imports
//

import { getNoteDetails, getNoteList } from "./notesAPI.js";
import { NoteController } from "./noteController.js";
import { confirmDeleteModal, noteDetailsModal } from "./notesModal.js";

import { ToastContainer } from "/static/components/toasts/toastContainer.js";

//
// Global Variables & DOM Elements
//

const notesList = document.querySelector(".notes__list");
const notePanel = document.querySelector(".note-panel");
const noteController = new NoteController({
    notePanel: notePanel,
    notesList: notesList
});

const toastContainer = new ToastContainer();

// Get note list actions
const createBtn = document.querySelector("#create-button");

// Get note actions
const titleInput = notePanel.querySelector("#note-title");
const renameBtn = notePanel.querySelector("#rename-button");
const saveBtn = notePanel.querySelector("#save-button");
const infoBtn = notePanel.querySelector("#info-button");
const deleteBtn = notePanel.querySelector("#delete-button");
const shareBtn = notePanel.querySelector("#share-button");

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    // Load note list
    try {
        const notes = await getNoteList();
        notes.forEach(data => {
            noteController.appendToList(data.id, data.title);
        });
    } catch (error) {
        toastContainer.addErrorToast("Notes loading error", error);
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
                toastContainer.addErrorToast("Note selecting error", error);
            }
        }
    }
})

renameBtn.addEventListener("click", () => {
    if (!renameBtn.classList.contains("renaming")) {
        // Prevent double call
        noteController.rename();
    }
})

// Create note button logic
createBtn.addEventListener("click", async() => {
    try {
        const result = await noteController.create();
        if (result) {
            toastContainer.addSuccessToast("Note creation", "Note was successfully created!");
        }
    } catch (error) {
        toastContainer.addErrorToast("Note creation", error);
    }
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
    noteDetailsModal(noteData);
})

// Delete button logic
deleteBtn.addEventListener("click", async () => {
    const noteData = noteController.getData();
    const confirmed = await confirmDeleteModal(noteData.title);
    if (confirmed) {
        try {
            noteController.delete();
            toastContainer.addSuccessToast("Delete success", "Note has been deleted!");
        } catch (error) {
            toastContainer.addErrorToast("Delete error", error);
        }
    }
    
})