//
// Imports
//

import { openModalBox } from "./modalBox.js";
import { updateNote } from "./notesCore.js";

export function renderNote(notesContainer, data) {
    // Get note template
    const noteTemplate = notesContainer.querySelector("#note-template");
    const noteClone = noteTemplate.content.cloneNode(true);

    // Set note id
    const note = noteClone.querySelector(".note");
    note.dataset.id = data.id;

    // Set note title
    const title = note.querySelector(".note-header h3");
    title.textContent = data.title;

    // Set note content
    const content = note.querySelector("p");
    content.textContent = data.content;

    // Set note event listeners
    // Edit button
    note.querySelector("#edit-button")
        .addEventListener("click", () => {
             openModalBox("#edit-note-template", async (data) => {
                updateNote(note, data);
             })
        });

    // Delete button
    note.querySelector("#delete-button")
        .addEventListener("click", () => openModalBox("#delete-note-template"));

    // Share button
    note.querySelector("#share-button")
        .addEventListener("click", () => openModalBox("#share-note-template"));

    // Append note to container
    notesContainer.appendChild(noteClone);
}

export function addChip(dropdown, checkbox, selectedContainer) {
    if (!selectedContainer.querySelector(`[data-filter="${dropdown.dataset.dropdown}:${checkbox.value}]"`)) {
        const chip = document.createElement("span");
        chip.className = "filter-chip";
        chip.dataset.filter = `${dropdown.dataset.dropdown}:${checkbox.value}`;

        // Get corresponding span text
        const checkboxText = checkbox.nextElementSibling?.textContent;
        const dropdownText = dropdown.querySelector(".dropdown-button span").textContent;
        chip.innerHTML = `${dropdownText}: ${checkboxText} <button type="button">&times;</button>`;
        selectedContainer.appendChild(chip);

        // Remove chip button logic
        chip.querySelector("button").addEventListener("click", () => {
            removeChip(dropdown, checkbox, selectedContainer);

            const cb = dropdown.querySelector(`input[value="${checkbox.value}"]`);
            if (cb.value === "all") {
                // Remove selection if "All" button clicked
                const selectedCheckboxes = dropdown.querySelectorAll(`input[type="checkbox"]`);
                selectedCheckboxes.forEach(sCb => {
                    sCb.checked = false;
                });
            } else {
                cb.checked = false;
            }
        })
    }
}

export function removeChip(dropdown, checkbox, selectedContainer) {
    const chip = selectedContainer.querySelector(`[data-filter="${dropdown.dataset.dropdown}:${checkbox.value}"]`);
    if (chip) chip.remove();
}