//
// Imports
//

import { createNote, readNotes, updateNote, deleteNote } from "./notesCore.js";
import { renderNote, addChip, removeChip } from "./notesUI.js";

//
// Global Variables & DOM Elements
//

const notesContainer = document.getElementById('notes');

const checkboxes = document.querySelectorAll(".dropdown input[type='checkbox']");
const selectedCheckboxes = document.querySelector(".selected-controls");

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    const result = await readNotes();
    result.data.forEach(note => {
        renderNote(notesContainer, note);
    });
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
            if (cb.checked) {
                addChip(dropdown, cb, selectedCheckboxes);
            } else {
                if (allCheckbox.checked) {
                    // Display checked checkboxes
                    otherCheckboxes.forEach(oCb => {
                        if (oCb.checked) {
                            addChip(dropdown, oCb, selectedCheckboxes);
                        }
                    });
                    // Remove "All" chip
                    removeChip(dropdown, allCheckbox, selectedCheckboxes);
                    allCheckbox.checked = false;
                } else {
                    removeChip(dropdown, cb, selectedCheckboxes);
                }
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