export function renderNote(notesList, data) {
    const noteTemplate = notesList.querySelector("#note-template");
    const noteClone = noteTemplate.content.cloneNode(true);

    const note = noteClone.querySelector(".note");
    note.dataset.id = data.id;

    const title = note.querySelector(".note h3");
    title.textContent = data.title;

    notesList.appendChild(noteClone);
}