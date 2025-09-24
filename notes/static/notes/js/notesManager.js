import { createNote, deleteNote, updateNote, getNoteList, getNoteDetails } from "./notesAPI.js";


export class NotesManager {
    notePanel;
    notesList;

    #selectedElement = null;
    #selectedData = null;


    titleInput;
    contentInput;

    constructor({ notePanel, notesList }) {
        this.notePanel = notePanel;
        this.notesList = notesList;

        this.titleInput = notePanel.querySelector(".note-panel__title");
        this.contentInput = notePanel.querySelector("textarea");
        
        this.#clearPanel();
    }

    // ----------------
    // Private helpers
    // ----------------

    #highlightNote(noteElement) {
        noteElement.classList.add("note--selected");
    }

    #unhighlightNote() {
        this.#selectedElement.classList.remove("note--selected");
    }

    #renderNote(data) {
        this.titleInput.value = data?.title ?? "";
        this.contentInput.value = data?.content ?? "";
        this.notePanel.querySelectorAll("button").forEach(btn => btn.disabled = false);
    }

    #clearPanel() {
        this.titleInput.value = "";
        this.contentInput.value = "";
        this.notePanel.querySelectorAll("button").forEach(btn => btn.disabled = true);
    }

    #appendNoteToList(id, noteTitle) {
        const noteTemplate = this.notesList.querySelector("#note-template");
        const noteClone = noteTemplate.content.cloneNode(true);

        const note = noteClone.querySelector(".note");
        note.dataset.id = id;

        const title = note.querySelector(".note h3");
        title.textContent = noteTitle;

        this.notesList.appendChild(noteClone);

        return note;
    }

    // ----------------
    // Public API
    // ----------------

    async select(noteElement) {
        this.unselect();
        const noteData = await getNoteDetails(noteElement.dataset.id);
        this.#highlightNote(noteElement);
        this.#selectedElement = noteElement;
        this.#selectedData = noteData;
        this.#renderNote(noteData);
    }

    unselect() {
        if (!this.#selectedElement) return;
        this.#unhighlightNote();
        this.#selectedElement = null;
        this.#selectedData = null;
        this.#clearPanel();
    }

    async delete() {
        if (!this.#selectedData) return;
        await deleteNote(this.#selectedData.id);
        this.#selectedElement.remove();
        this.unselect();
    }

    async update() {
        if (!this.#selectedData) return false;
        // Get fields current value
        const title = this.titleInput.value;
        const content = this.contentInput.value;

        // Build payload with only changed fields
        const payload = {};
        if (title !== this.#selectedData.title) payload.title = title;
        if (content !== this.#selectedData.content) payload.content = content;

        // Return early if nothing changed
        if (Object.keys(payload).length === 0) {
            return false;
        }

        const data = await updateNote(this.#selectedData.id, payload);
        this.#selectedElement.querySelector(".note-title").textContent = data.title;
        this.#selectedData = data;
    }

    async create() {
        const data = await createNote({
            title: "Untitled",
            content: ""
        });
        this.unselect();

        const noteElement = this.#appendNoteToList(data.id, data.title);
        this.#highlightNote(noteElement);
        this.#selectedElement = noteElement;
        this.#selectedData = data;
        this.#renderNote(data);
    }

    async loadList(filterParams = "") {
        this.clearList();
        const notes = await getNoteList(filterParams);
        notes.forEach(note => {
            this.#appendNoteToList(note.id, note.title);
        });
    }

    clearList() {
        this.notesList.querySelectorAll(".note").forEach(note => note.remove());
    }

    getData() {
        return this.#selectedData;
    }

    getSelectedNote() {
        return this.#selectedElement;
    }
}