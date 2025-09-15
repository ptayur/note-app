//
// Imports
//

import { deleteNote, updateNote } from "./notesAPI.js";


// Note controller object
export class NoteController {
    #noteView;
    #notesList;
    #noteElement = null;
    #noteData = null;

    constructor({ noteView, notesList }) {
        this.#noteView = noteView;
        this.#notesList = notesList;
        this.#clear();
    }

    // private helpers

    #render(data) {
        this.#noteView.querySelector(".note-view__title").value = data.title;
        this.#noteView.querySelector("textarea").value = data.content;
        this.#noteView.querySelectorAll("button").forEach(btn => btn.disabled = false);
    }

    #clear() {
        this.#noteView.querySelector(".note-view__title").value = "";
        this.#noteView.querySelector("textarea").value = "";
        this.#noteView.querySelectorAll("button").forEach(btn => btn.disabled = true);
    }

    // public API

    select(noteElement, noteData) {
        this.unselect();

        noteElement.classList.add("note--selected");
        this.#noteElement = noteElement;
        this.#noteData = noteData;

        this.#render(noteData);
    }

    unselect() {
        if (!this.#noteElement) return;
        this.#noteElement.classList.remove("note--selected");
        this.#noteElement = null;
        this.#noteData = null;

        this.#clear();
    }

    async delete() {
        if (!this.#noteData) return;
        try {
            await deleteNote(this.#noteData.id);
            this.unselect();
            this.#noteElement.remove();
        } catch (error) {
            // TODO: modal display
            console.log(error);
        }
    }

    async update() {
        if (!this.#noteData) return;
        // Get fields current value
        const content = this.#noteView.querySelector("textarea").value;
        const title = this.#noteView.querySelector(".note-view__title").value;

        // Build payload with only changed fields
        const payload = {};
        if (title !== this.#noteData.title) payload.title = title;
        if (content !== this.#noteData.content) payload.content = content;

        // Return early if nothing changed
        if (Object.keys(payload).length === 0) {
            // TODO: modal display
            console.log("No changes provided.");
            return;
        }

        try {
            const data = await updateNote(this.#noteData.id, payload);
            this.#noteElement.querySelector(".note-title").textContent = data.title;
            this.#noteData = data;
        } catch (error) {
            // TODO: modal display
            console.log(error);
        }
    }
}