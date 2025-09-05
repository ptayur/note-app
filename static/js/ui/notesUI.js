export function renderNote(notesContainer, data) {
    const note = document.createElement("div");
    note.dataset.id = data.id;
    note.className = "note";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-button";
    editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="lucide lucide-square-pen-icon lucide-square-pen">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
        </svg>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-button";
    deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="lucide lucide-trash-icon lucide-trash">
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
    `;

    const noteActions = document.createElement("div");
    noteActions.className = "note-actions";
    noteActions.append(editBtn, deleteBtn);


    const title = document.createElement("h3");
    title.textContent = data.title;

    const noteHeader = document.createElement("div");
    noteHeader.className = "note-header";
    noteHeader.append(title, noteActions)

    const content = document.createElement("p");
    content.textContent = data.content;

    note.append(noteHeader, content);
    notesContainer.appendChild(note);
}