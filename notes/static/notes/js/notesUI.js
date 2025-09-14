export function renderNote(notesList, data) {
    const noteTemplate = notesList.querySelector("#note-template");
    const noteClone = noteTemplate.content.cloneNode(true);

    const note = noteClone.querySelector(".note");
    note.dataset.id = data.id;

    const title = note.querySelector(".note h3");
    title.textContent = data.title;

    notesList.appendChild(noteClone);
}

export function unselectNote(note, noteView) {
    // Remove current selection
    note.classList.remove("note--selected");

    noteView.querySelector(".note-view__title").value = "";
    noteView.querySelector("textarea").value = "";

    noteView.querySelectorAll("button").forEach(button => {
            button.disabled = true;
    })
}

export function selectNote(note, notesList, noteView, data) {
    // Remove previous selection
    const selectedNote = notesList.querySelector(".note--selected");
    if (selectedNote) {
        selectedNote.classList.remove("note--selected");
    }

    // Set new note as selected
    note.classList.add("note--selected");

    noteView.querySelector(".note-view__title").value = data.title;
    noteView.querySelector("textarea").value = data.content;

    noteView.querySelectorAll("button").forEach(button => {
        button.disabled = false;
    })
}