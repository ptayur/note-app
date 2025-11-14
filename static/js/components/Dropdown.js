export class Dropdown {
  static #initialized = false;
  static openDropdown = null;

  constructor(rootEl) {
    this.rootEl = rootEl;
    this.buttonEl = this.rootEl.querySelector(".dropdown__btn");
    this.contentEl = this.rootEl.querySelector(".dropdown__content");

    this.#setupListeners();
    if (!Dropdown.#initialized) {
      document.addEventListener("click", Dropdown.#setupGlobalListener);
      Dropdown.#initialized = true;
    }
  }

  static #setupGlobalListener(event) {
    const open = Dropdown.openDropdown;
    if (open && !open.rootEl.contains(event.target)) {
      open.close();
    }
  }

  #setupListeners() {
    this.buttonEl.addEventListener("click", (event) => this.toggle());
  }

  open() {
    if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
      Dropdown.openDropdown.close();
    }
    this.buttonEl.setAttribute("aria-expanded", true);
    this.contentEl.classList.remove("hidden");
    Dropdown.openDropdown = this;
  }

  close() {
    this.contentEl.classList.add("hidden");
    this.buttonEl.setAttribute("aria-expanded", false);
    if (Dropdown.openDropdown === this) Dropdown.openDropdown = null;
  }

  toggle() {
    if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
      Dropdown.openDropdown.close();
    }
    const isOpen = this.buttonEl.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}
