//
// Imports
//

import { createNote, deleteNote, updateNote, getNoteList, getNoteDetails } from "./notesAPI.js";
import { AppError } from "/static/js/utils.js"

// Note controller object
export class NotesManager {
    #notePanel;
    #notesList;
    #selectedElement = null;
    #selectedData = null;

    constructor({ notePanel, notesList }) {
        this.#notePanel = notePanel;
        this.#notesList = notesList;
        this.#clear();
    }

    // private helpers

    #displaySelected(noteElement) {
        noteElement.classList.add("note--selected");
    }

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

    async select(noteElement) {
        this.unselect();

        try {
            const noteData = await getNoteDetails(noteElement.dataset.id);
            this.#displaySelected(noteElement);
            this.#selectedElement = noteElement;
            this.#selectedData = noteData;

            this.#render(noteData);
        } catch (error) {
            throw error;
        }
    }

    unselect() {
        if (!this.#selectedElement) return;
        this.#selectedElement.classList.remove("note--selected");
        this.#selectedElement = null;
        this.#selectedData = null;

        this.#clear();
    }

    async delete() {
        if (!this.#selectedData) return;
        try {
            await deleteNote(this.#selectedData.id);
            this.#selectedElement.remove();
            this.unselect();
        } catch (error) {
            throw error;
        }
    }

    async update() {
        if (!this.#selectedData) return;
        // Get fields current value
        const content = this.#notePanel.querySelector("textarea").value;
        const title = this.#notePanel.querySelector(".note-panel__title").value;

        // Build payload with only changed fields
        const payload = {};
        if (title !== this.#selectedData.title) payload.title = title;
        if (content !== this.#selectedData.content) payload.content = content;

        // Return early if nothing changed
        if (Object.keys(payload).length === 0) {
            throw new AppError("Update error", "No changes provided");
        }

        try {
            const data = await updateNote(this.#selectedData.id, payload);
            this.#selectedElement.querySelector(".note-title").textContent = data.title;
            this.#selectedData = data;
        } catch (error) {
            throw error;
        }
    }

    async create() {
        const newNote = this.appendToList(null, "");
        this.#displaySelected(newNote);
        this.#selectedElement = newNote;
        this.#render(null);

        try {
            const result = await this.rename();
            if (!result) {
                this.#selectedElement.remove();
                this.unselect();
            } else {
                this.#selectedElement.querySelector(".note-title").textContent = this.#selectedData.title;
                this.#selectedElement.dataset.id = this.#selectedData.id;
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
                    reject(new AppError("Rename error", "Note title is empty"));
                };

                try {
                    if (this.#selectedData) {
                        // Casual note renaming
                        await this.update();
                    } else {
                        // Naming newly created note
                        const data = await createNote({ 
                            title: noteTitle,
                            content: "" 
                        });
                        this.#selectedData = data;
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
                this.#selectedElement.querySelector(".note-title").textContent = inputTitle.value;
            };

            renameBtn.addEventListener("click", onClick);
            inputTitle.addEventListener("blur", onBlur);
            inputTitle.addEventListener("keydown", onKeydown);
            inputTitle.addEventListener("input", onInput);
        })
    }

    async loadList(filterParams = "") {
        this.clearList();
        try {
            const notes = await getNoteList(filterParams);
            notes.forEach(note => {
                this.appendToList(note.id, note.title);
            });
        } catch (error) {
            throw error;
        }
    }

    clearList() {
        const notes = this.#notesList.querySelectorAll(".note");
        notes.forEach(note => note.remove());
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
        return this.#selectedData;
    }
}