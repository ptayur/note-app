import { createDropdownUI } from "./dropdownUI";

export class Dropdown {
  static #initialized = false;
  static openDropdown = null;

  constructor() {
    const dropdown = createDropdownUI();
    this.rootEl = dropdown.root;
    this.buttonEl = dropdown.button;
    this.contentEl = dropdown.content;

    this.#setupListeners();
    if (!Dropdown.#initialized) {
      document.addEventListener("click", Dropdown.#setupGlobalListener);
      Dropdown.#initialized = true;
    }
  }

  static #setupGlobalListener(event) {
    const open = Dropdown.openDropdown;
    if (open && !open.contentEl.contains(event.target) && event.target !== open.buttonEl) {
      open.close();
    }
  }

  #setupListeners() {
    this.buttonEl.addEventListener("click", () => {
      if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
        Dropdown.openDropdown.close();
      }
      this.toggle();
    });
  }

  open() {
    if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
      Dropdown.openDropdown.close();
    }
    this.contentEl.classList.remove("hidden");
    Dropdown.openDropdown = this;
  }

  close() {
    this.contentEl.classList.add("hidden");
    if (Dropdown.openDropdown === this) Dropdown.openDropdown = null;
  }

  toggle() {
    if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
      Dropdown.openDropdown.close();
    }
    const isHidden = this.contentEl.classList.toggle("hidden");
    Dropdown.openDropdown = isHidden ? null : this;
  }
}
