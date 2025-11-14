export class ListManager {
  container = null;
  items = new Map();

  #selectedEl = null;
  #onSelect = null; // select callback
  #onCreate = null; // create callback
  #onDelete = null; // delete callback
  #ListApi = null; // api class
  #ListItem = null; // item class

  constructor(containerEl, ListApi, ListItem) {
    this.container = containerEl;
    this.#ListApi = ListApi;
    this.#ListItem = ListItem;

    this.container.addEventListener("click", (event) => {
      const itemEl = event.target.closest(this.#ListItem.class);
      if (!itemEl) return;
      this.select(itemEl);
      if (this.#onSelect) this.#onSelect(itemEl.dataset.id);
    });
  }

  #addItem(itemData) {
    const itemEl = this.#ListItem.create(itemData);
    this.container.appendChild(itemEl);
    return itemEl;
  }

  async select(noteEl) {
    this.unselect();
    this.#ListItem?.select();
    this.#selectedEl = noteEl;
  }

  unselect() {
    if (!this.#selectedEl) return;
    this.#ListItem?.unselect();
    this.#selectedEl = null;
  }

  async delete(itemId) {
    const response = await this.#ListApi.deleteItem(itemId);
    if (response.ok) {
      this.items.get(itemId).remove();
      this.items.delete(itemId);
      this.#selectedEl = null;
      this.#onDelete?.();
    } else {
      console.error(`Note with id=${itemId} is not deleted.`);
    }
  }

  async create() {
    const response = await this.#ListApi.createItem(this.#ListItem.defaultData);
    if (response.ok) {
      const itemData = response.data;
      const itemEl = this.#addItem(itemData);
      this.select(itemEl);
      this.#onCreate?.(noteId, defaultTitle);
    } else {
      console.error(`Note is not been created.`);
    }
  }

  async loadList(filterParams = "") {
    const response = await this.#ListApi.getItems(filterParams);
    if (response.ok) {
      this.clearList();
      response.data.forEach((itemData) => {
        this.#addItem(itemData);
      });
    } else {
      console.log("Notes list is not loaded.");
    }
  }

  clearList() {
    this.container.querySelectorAll(this.#ListItem.class).forEach((item) => item.remove());
  }
}
