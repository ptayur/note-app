//
// Imports
//

import { createNote, readNotes, updateNote, deleteNote } from "./notesCore.js";
import { renderNote, addChip, removeChip } from "./notesUI.js";

//
// Global Variables & DOM Elements
//

const modal = document.getElementById('modalOverlay');
const notesContainer = document.getElementById('notes');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const noteForm = document.getElementById('noteForm');

const checkboxes = document.querySelectorAll(".dropdown input[type='checkbox']");
const selectedCheckboxes = document.querySelector("#selected-filters");

//
// Modal Handling
//

openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
})

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
})

document.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
})

//
// Event Listeners
//

noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = {
        title: noteForm.title.value,
        content: noteForm.content.value
    };
    const result = await createNote(data);
    modal.style.display = 'none';
    noteForm.reset();
    renderNote(notesContainer, result.data);
})

document.addEventListener("DOMContentLoaded", async () => {
    const result = await readNotes();
    result.data.forEach(note => {
        renderNote(notesContainer, note);
    });
})

notesContainer.addEventListener("click", async (event) => {
    const deleteBtn = event.target.closest(".delete-button");
    if (deleteBtn) {
        const noteDiv = deleteBtn.closest(".note");
        const noteId = noteDiv.dataset.id;

        const result = await deleteNote(noteId);
        if (result.ok) {
            noteDiv.remove();
        } else {
            alert("Note hasn't been deleted.");
        }
    }
})

// Checkbox handler
checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        const dropdown = cb.closest(".dropdown");
        const dropdownName = dropdown.dataset.dropdown;
        const allCheckbox = dropdown.querySelector("input[value='all']");
        const otherCheckboxes = Array.from(dropdown.querySelectorAll("input:not([value='all'])"));

        if (cb.value === "all") {
            // if clicked "All" checkbox
            if (cb.checked) {
                // Remove other chips
                otherCheckboxes.forEach(oCb => {
                    oCb.checked = true;
                    
                    const chip = selectedCheckboxes.querySelector(`[data-filter="${dropdownName}:${oCb.value}"]`);
                    if (chip) chip.remove();
                });
                // Add "All" chip
                addChip(dropdown, cb, selectedCheckboxes);
            } else {
                // Remove "All" chip
                otherCheckboxes.forEach(oCb => {
                    oCb.checked = false;
                });
                removeChip(dropdown, cb, selectedCheckboxes);
            }
        } else {
            // Remove "All" chip if options changes
            removeChip(dropdown, allCheckbox, selectedCheckboxes);
            allCheckbox.checked = false;

            if (cb.checked) {
                addChip(dropdown, cb, selectedCheckboxes);
            } else {
                removeChip(dropdown, cb, selectedCheckboxes);
                // Bug there!!! Creates duplicate chip
                otherCheckboxes.forEach(oCb => {
                    if (oCb.checked) {
                        addChip(dropdown, oCb, selectedCheckboxes);
                    }
                })
            }

            // Check if all other checkboxes selected
            if (otherCheckboxes.every(oCb => oCb.checked)) {
                // Select "All" chip and remove other chips from selected
                allCheckbox.checked = true;
                otherCheckboxes.forEach(oCb => removeChip(dropdown, oCb, selectedCheckboxes));
                addChip(dropdown, allCheckbox, selectedCheckboxes);
            }
        }
    })
})