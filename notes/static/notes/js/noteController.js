//
// Imports
//

import { createNote, deleteNote, updateNote } from "./notesAPI.js";


// Note controller object
export class NoteController {
    #notePanel;
    #notesList;
    #noteElement = null;
    #noteData = null;

    constructor({ notePanel, notesList }) {
        this.#notePanel = notePanel;
        this.#notesList = notesList;
        this.#clear();
    }

    // private helpers

    #render(data) {
        this.#notePanel.querySelector(".note-panel__title").value = data?.title ?? "";
        this.#notePanel.querySelector("textarea").value = data?.content ?? "";
        this.#notePanel.querySelectorAll("button").forEach(btn => btn.disabled = false);
    }

    #clear() {
        this.#notePanel.querySelector(".note-panel__title").value = "";
        this.#notePanel.querySelector("textarea").value = "";
        this.#notePanel.querySelectorAll("button").forEach(btn => btn.disabled = true);
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
            this.#noteElement.remove();
            this.unselect();
        } catch (error) {
            throw error;
        }
    }

    async update() {
        if (!this.#noteData) return;
        // Get fields current value
        const content = this.#notePanel.querySelector("textarea").value;
        const title = this.#notePanel.querySelector(".note-panel__title").value;

        // Build payload with only changed fields
        const payload = {};
        if (title !== this.#noteData.title) payload.title = title;
        if (content !== this.#noteData.content) payload.content = content;

        // Return early if nothing changed
        if (Object.keys(payload).length === 0) {
            throw new Error("No changes provided");
        }

        try {
            const data = await updateNote(this.#noteData.id, payload);
            this.#noteElement.querySelector(".note-title").textContent = data.title;
            this.#noteData = data;
        } catch (error) {
            throw error;
        }
    }

    async create() {
        const newNote = this.appendToList(null, "");
        this.select(newNote, null);

        try {
            const result = await this.rename();
            if (!result) {
                this.#noteElement.remove();
                this.unselect();
            } else {
                this.#noteElement.querySelector(".note-title").textContent = this.#noteData.title;
                this.#noteElement.dataset.id = this.#noteData.id;
            }
        } catch (error) {
            throw error;
        }
    }

    rename() {
        const renameBtn = this.#notePanel.querySelector("#rename-button");
        const inputTitle = this.#notePanel.querySelector("#note-title");

        // Enter renaming mode
        inputTitle.disabled = false;
        inputTitle.focus();

        renameBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 2048 2048">
                <path fill="currentColor" d="M640 1755L19 1133l90-90l531 530L1939 275l90 90L640 1755z"/>
            </svg>
        `;
        renameBtn.classList.add("renaming");

        // 
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                // Remove listeners
                renameBtn.removeEventListener("click", onClick);
                inputTitle.removeEventListener("blur", onBlur);
                inputTitle.removeEventListener("keydown", onKeydown);

                // Quit renaming mode
                inputTitle.disabled = true;

                renameBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                        viewBox="0 0 24 24">
                        <path fill="currentColor" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zm6.65.85c.39-.39.39-1.04 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
                    </svg>
                `;
                renameBtn.classList.remove("renaming");
            };

            // Confirmation flow
            const confirm = async () => {
                const noteTitle = inputTitle.value.trim();
                if (!noteTitle) {
                    cleanup();
                    reject("Note title is empty");
                };

                try {
                    if (this.#noteData) {
                        // Casual note renaming
                        try {
                            await this.update();
                        } catch (error) {
                            throw error;
                        }
                    } else {
                        // Naming newly created note
                        const data = await createNote({ 
                            title: noteTitle,
                            content: "" 
                        });
                        this.#noteData = data;
                    }

                    cleanup();
                    resolve(true);
                } catch (error){
                    cleanup();
                    reject(error);
                }
            };

            const onClick = () => {
                if (renameBtn.classList.contains("renaming")) {
                    confirm();
                }
            };
            const onBlur = (event) => {
                if (event.relatedTarget !== renameBtn) {
                    cleanup();
                    resolve(false);
                }
            };
            const onKeydown = (event) => {
                if (event.key === "Enter") {
                    confirm();
                } else if (event.key === "Escape") {
                    cleanup();
                    resolve(false);
                }
            };
            const onInput = () => {
                this.#noteElement.querySelector(".note-title").textContent = inputTitle.value;
            };

            renameBtn.addEventListener("click", onClick);
            inputTitle.addEventListener("blur", onBlur);
            inputTitle.addEventListener("keydown", onKeydown);
            inputTitle.addEventListener("input", onInput);
        })
    }

    appendToList(id, noteTitle) {
        const noteTemplate = this.#notesList.querySelector("#note-template");
        const noteClone = noteTemplate.content.cloneNode(true);

        const note = noteClone.querySelector(".note");
        note.dataset.id = id;

        const title = note.querySelector(".note h3");
        title.textContent = noteTitle;

        this.#notesList.appendChild(noteClone);

        return note;
    }

    getData() {
        return this.#noteData;
    }
}