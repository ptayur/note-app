export class NotePanel {
  container = null;

  #titleInput = null;
  #contentInput = null;
  #renameBtn = null;

  constructor(containerEl) {
    this.container = containerEl;
    this.#titleInput = this.container.querySelector(".note-panel__title");
    this.#contentInput = this.container.querySelector(".note-panel__content");
    this.#renameBtn = this.container.querySelector("#rename-button");

    this.#bindEvents();
  }

  enterRenameMode() {
    this.#titleInput.readOnly = false;
    this.#titleInput.focus();
    this.#renameBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 2048 2048">
                <path fill="currentColor" d="M640 1755L19 1133l90-90l531 530L1939 275l90 90L640 1755z"/>
            </svg>
        `;
    this.#renameBtn.classList.add("renaming");
  }

  quitRenameMode() {
    this.#titleInput.readOnly = true;
    this.#renameBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 24 24">
                <path fill="currentColor" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zm6.65.85c.39-.39.39-1.04 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
            </svg>
        `;
    this.#renameBtn.classList.remove("renaming");
  }

  #bindEvents() {
    this.#renameBtn.addEventListener("click", async () => {
      if (!this.#renameBtn.classList.contains("renaming")) {
        this.enterRenameMode();
      } else {
        await this?.onUpdate(this.#titleInput.value);
        this.quitRenameMode();
      }
    });

    this.#titleInput.addEventListener("blur", (event) => {
      if (event.relatedTarget !== this.#renameBtn) {
        this.quitRenameMode();
      }
    });

    this.#titleInput.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        await this?.onUpdate(this.#titleInput.value);
        this.quitRenameMode();
      } else if (event.key === "Escape") {
        this.quitRenameMode();
      }
    });
  }

  clear() {
    this.#titleInput.value = "";
    this.#contentInput.value = "";
  }

  setData(title, content) {
    this.#titleInput.value = title;
    this.#contentInput.value = content;
  }

  getData() {
    return {
      title: this.#titleInput.value,
      content: this.#contentInput.value,
    };
  }
}
