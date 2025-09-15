export class ModalManager {
    static #instance = null;
    
    #modal;
    #modalWindow;
    #modalHeader;
    #modalMain;
    #modalFooter;

    constructor() {
        // Prevent new instance from init
        if (ModalManager.#instance) {
            return ModalManager.#instance;
        }

        // Init base modal structure
        this.#modal = document.createElement("div");
        this.#modal.classList.add("modal");

        this.#modalWindow = document.createElement("div");
        this.#modalWindow.classList.add("modal__window");

        // Init modal window structure
        this.#modalHeader = document.createElement("div");
        this.#modalHeader.classList.add("modal__header");

        this.#modalMain = document.createElement("div");
        this.#modalMain.classList.add("modal__main");

        this.#modalFooter = document.createElement("div");
        this.#modalFooter.classList.add("modal__footer");

        this.#modalWindow.append(
            this.#modalHeader,
            this.#modalMain,
            this.#modalFooter
        );
        this.#modal.appendChild(this.#modalWindow);
        document.body.appendChild(this.#modal);

        ModalManager.#instance = this;
    }

    static getInstance() {
        if (!ModalManager.#instance) {
            ModalManager.#instance = new ModalManager();
        }

        return ModalManager.#instance;
    }

    show() {
        this.#modal.classList.add("modal--open");
    }

    close() {
        this.#modal.classList.remove("modal--open");
    }

    setContent({ header, main, footer }) {
        this.#modalHeader.replaceChildren(header || null);
        this.#modalMain.replaceChildren(main || null);
        this.#modalFooter.replaceChildren(footer || null);
    }
}