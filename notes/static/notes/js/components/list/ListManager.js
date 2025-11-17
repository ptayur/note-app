export class ListManager {
  items = new Map();
  selectedItem = null;

  #onSelect = null;

  constructor(containerEl, itemClass) {
    this.container = containerEl;
    this.itemClass = itemClass;

    this.container.addEventListener("click", (event) => {
      const item = event.target.closest(this.itemClass);
      if (!item) return;

      const id = item.dataset.id;
      if (this.selectedItem?.getElement() === item) {
        this.unselect();
      } else {
        this.select(id);
      }
      if (this.#onSelect) this.#onSelect(id);
    });
  }

  addItem(item) {
    this.items.set(item.getId(), item);
    this.container.appendChild(item.getElement());
  }

  removeItem(itemId) {
    const item = this.items.get(parseInt(itemId));
    if (!item) return;
    item.getElement().remove();
    this.items.delete(itemId);
  }

  select(itemId) {
    this.unselect();
    const item = this.items.get(parseInt(itemId));
    if (!item) return;
    item.getElement().classList.add("selected");
    this.selectedItem = item;
  }

  unselect() {
    if (!this.selectedItem) return;
    this.selectedItem.getElement().classList.remove("selected");
    this.selectedItem = null;
  }

  clearList() {
    this.container.innerHTML = "";
    this.items.clear();
  }

  setOnSelect(callback) {
    this.#onSelect = callback;
  }
}
