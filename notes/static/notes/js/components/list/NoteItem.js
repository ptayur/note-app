export class NoteItem {
  static cssClass = ".note-item";

  constructor(data, callbacks) {
    this.data = data;
    this.callbacks = callbacks;

    this.el = this.#createDOM();
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

    return noteEl;
  }

  #bindEvents() {
    this.el.addEventListener("click", () => {
      this.callbacks.onSelect?.(this.data.id);
    });
    this.el.querySelector(".");
  }
}
