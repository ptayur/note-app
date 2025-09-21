//
// Imports
//

import { FiltersManager } from "./filtersManager.js";
import { NotesManager } from "./notesManager.js";
import { confirmDeleteModal, noteDetailsModal } from "./notesModal.js";

import { ToastContainer } from "/static/components/toasts/toastContainer.js";

//
// Global Variables & DOM Elements
//

const notesList = document.querySelector(".notes__list");
const notePanel = document.querySelector(".note-panel");
const notesManager = new NotesManager({
    notePanel: notePanel,
    notesList: notesList
});

const toastContainer = new ToastContainer();

const dropdownFilter = document.querySelector("#dropdown-filter");
const filterManager = new FiltersManager({
    dropdownFilter: dropdownFilter,
    onChange: async () => {
        try {
            const queryParams = filterManager.getQueryParams();
            await notesManager.loadList(queryParams);
        } catch (error) {
            toastContainer.addErrorToast("Filtering error", error);
        }
    }
});
// Get note list actions
const createBtn = document.querySelector("#create-button");

// Get note actions
const renameBtn = notePanel.querySelector("#rename-button");
const saveBtn = notePanel.querySelector("#save-button");
const infoBtn = notePanel.querySelector("#info-button");
const deleteBtn = notePanel.querySelector("#delete-button");

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    // Load note list
    try {
        await notesManager.loadList();
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
            notesManager.unselect();
        } else {
            try {
                notesManager.select(note);
            } catch (error) {
                toastContainer.addErrorToast("Note selecting error", error);
            }
        }
    }
})

renameBtn.addEventListener("click", () => {
    if (!renameBtn.classList.contains("renaming")) {
        // Prevent double call
        notesManager.rename();
    }
})

// Create note button logic
createBtn.addEventListener("click", async() => {
    try {
        const result = await notesManager.create();
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
        await notesManager.update();
        toastContainer.addSuccessToast("Note update", "Note was successfully updated!");
    } catch (error) {
        toastContainer.addErrorToast("Update error", error);
    }
})

//Info button logic
infoBtn.addEventListener("click", async () => {
    const noteData = notesManager.getData();
    noteDetailsModal(noteData);
})

// Delete button logic
deleteBtn.addEventListener("click", async () => {
    const noteData = notesManager.getData();
    const confirmed = await confirmDeleteModal(noteData.title);
    if (confirmed) {
        try {
            notesManager.delete();
            toastContainer.addSuccessToast("Delete success", "Note has been deleted!");
        } catch (error) {
            toastContainer.addErrorToast("Delete error", error);
        }
    }
    
})