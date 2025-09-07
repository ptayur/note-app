//
// Imports
//

import { createNote, readNotes, updateNote, deleteNote } from "./notesCore.js";
import { renderNote } from "./notesUI.js";

//
// Global Variables & DOM Elements
//

const modal = document.getElementById('modalOverlay');
const notesContainer = document.getElementById('notes');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const noteForm = document.getElementById('noteForm');

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