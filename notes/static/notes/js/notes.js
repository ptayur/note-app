//
// Imports
//

import { getNoteDetails, getNoteList } from "./notesAPI.js";
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

// Get note list actions
const createBtn = document.querySelector("#create-button");

const dropdownFilter = document.querySelector("#dropdown-filter");
const inputsFilter = dropdownFilter.querySelectorAll("input");
// Get note actions
const renameBtn = notePanel.querySelector("#rename-button");
const saveBtn = notePanel.querySelector("#save-button");
const infoBtn = notePanel.querySelector("#info-button");
const deleteBtn = notePanel.querySelector("#delete-button");

//
// Event Listeners
//

function getFilterSectionNames() {
    let sections = [];
    const filterSections = dropdownFilter.querySelectorAll("li");
    filterSections.forEach(section => {
        sections.push(section.querySelector("input").name);
    });
    return sections;
}

function getSectionCheckboxes(sectionName) {
    const sectionCbs = [...dropdownFilter.querySelectorAll(`input[name="${sectionName}"][type="checkbox"]`)];
    const allCb = sectionCbs.find(cb => cb.value === "");

    return {sectionCbs, allCb};
}

function getFilters(sectionNames) {
    const queryParams = new URLSearchParams();

    sectionNames.forEach(section => {
        // Get values from checkboxes
        const { sectionCbs, allCb } = getSectionCheckboxes(section);

        if (allCb && allCb.checked) {
            return;
        } else {
            sectionCbs.forEach(cb => {
                if (cb !== allCb && cb.checked) {
                    queryParams.append(cb.name, cb.value);
                }
            });
        }
        // Get values from text fields
        
    });

    return queryParams.toString();
}

function setupCheckboxSection(sectionName) {
    const { sectionCbs, allCb } = getSectionCheckboxes(sectionName);

    sectionCbs.forEach(cb => {
        if (cb === allCb) {
            cb.addEventListener("change", () => {
                sectionCbs.forEach(x => x.checked = allCb.checked);
                const queryParams = getFilters(getFilterSectionNames());
                console.log(queryParams);
            });
        } else {
            cb.addEventListener("change", () => {
                const nonAllCb = sectionCbs.filter(x => x !== allCb);
                const allChecked = nonAllCb.every(x => x.checked);
                allCb.checked = allChecked;
                const queryParams = getFilters(getFilterSectionNames());
                console.log(queryParams);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // Load note list
    try {
        await notesManager.loadList();
    } catch (error) {
        toastContainer.addErrorToast("Notes loading error", error);
    }

    const filterSections = getFilterSectionNames();
    filterSections.forEach(section => {
        setupCheckboxSection(section);
    });
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
                const data = await getNoteDetails(note.dataset.id);
                notesManager.select(note, data);
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