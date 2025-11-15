import { Dropdown } from "static/js/components/Dropdown.js";
import { infoModal, shareModal, deleteModal } from "static/notes/js/components/modals/index.js";

export class NoteItem {
  static cssClass = ".note-item";

  constructor(data, callbacks) {
    this.data = data;
    this.callbacks = callbacks;

    this.el = this.#createDOM();
    this.#bindEvents();
  }

  #createDOM() {
    const noteTemplate = document.querySelector("#note-item");
    if (!noteTemplate) {
      console.warn(`Template for '${NoteItem.cssClass}' wasn't found.`);
      return;
    }
    const noteEl = noteTemplate.content.cloneNode(true);
    noteEl.dataset.id = this.data.id;

    const noteTitleEl = noteEl.querySelector(".note-title");
    noteTitleEl.textContent = this.data.title;

    const noteDropdownEl = noteEl.querySelector(".dropdown");
    new Dropdown(noteDropdownEl);

    return noteEl;
  }

  #bindEvents() {
    this.el.querySelector(".note-info-btn").addEventListener("click", () => {
      infoModal(this.data);
    });
    this.el.querySelector(".note-share-btn").addEventListener("click", () => {
      shareModal(this.data);
    });
    this.el.querySelector(".note-delete-btn").addEventListener("click", () => {
      const confirm = deleteModal(this.data.title);
      if (confirm) {
        this.callbacks?.onDelete(this.data.id);
      }
    });
  }

  getElement() {
    return this.el;
  }

  getId() {
    return this.data.id;
  }
}
