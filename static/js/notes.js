//
// Imports
//

import { apiFetch } from "./utils.js";

//
// Global Variables & DOM Elements
//

const modal = document.getElementById('modalOverlay');
const notesContainer = document.getElementById('notes');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const noteForm = document.getElementById('noteForm');

//
// Rendering
//

function renderNote(note) {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
    `;

    notesContainer.appendChild(div);
}

function loadNotes() {
    apiFetch('/api/notes/')
    .then(notes => {
        notes.forEach(renderNote);
    })
    .catch(error => {
        console.error('Failed to load notes:', error);
    })
    
}

//
// CRUD Actions
//

function createNote(data) {
    apiFetch('/api/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(note => renderNote(note))
    .catch(error => {
        console.error('Failed to create note:', error);
    });
}

function updateNote(id, data) {
    apiFetch(`/api/notes/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => loadNotes())
    .catch(error => {
        console.error('Failde to update note:', error);
    });
}

function deleteNote(id, noteElement) {
    apiFetch(`/api/notes/${id}/`, {
        method: 'DELETE'
    })
    .then(() => noteElement.remove())
    .catch(error => {
        console.error('Failed to delete note:', error);
    });
}

//
// Modal Handling
//

openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
})

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
})

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
})

//
// Event Listeners
//

noteForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = {
        title: noteForm.title.value,
        content: noteForm.content.value
    };
    createNote(data);
    modal.style.display = 'none';
    noteForm.reset();
})

//
// Initialize App
//

loadNotes();