export class ToastManager {
    #toastWindow;
    #toastHeader;
    #toastMain;
    #toastFooter;

    #isClosing = false;
    #timeoutId = null;
    #onClose = null;
    #fallbackId = null;

    constructor(duration = 5000, { onClose = null } = {}) {
        // Init base toast structure
        this.#toastWindow = document.createElement("div");
        this.#toastWindow.classList.add("toast__window");

        this.#toastHeader = document.createElement("div");
        this.#toastHeader.classList.add("toast__header");

        this.#toastMain = document.createElement("div");
        this.#toastMain.classList.add("toast__main");

        this.#toastFooter = document.createElement("div");
        this.#toastFooter.classList.add("toast__footer");

        this.#toastWindow.append(
            this.#toastHeader, 
            this.#toastMain, 
            this.#toastFooter
        );  

        this.#onClose = onClose;

        // Set auto-close timer
        this.#timeoutId = setTimeout(() => {
            this.close();
        }, duration);
    }

    #toNodeArray(value) {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    }

    getElement() {
        return this.#toastWindow;
    }

    setOnClose(callback) {
        this.#onClose = typeof callback === "function" ? callback : null;
    }

    close() {
        if (this.#isClosing) return;
        this.#isClosing = true;

        if (this.#timeoutId) {
            clearTimeout(this.#timeoutId);
            this.#timeoutId = null;
        }

        // Trigger CSS exit animation
        this.#toastWindow.classList.add("toast--closing");

        const cleanup = () => {
            this.#toastWindow.removeEventListener("transitionend", onEnd);
            this.#toastWindow.removeEventListener("animationend", onEnd);

            if (this.#fallbackId) {
                clearTimeout(this.#fallbackId);
                this.#fallbackId = null;
            }

            if (typeof this.#onClose === "function") this.#onClose(this);
            if (this.#toastWindow.parentNode) this.#toastWindow.remove();
        };

        const onEnd = (event) => {
            if (event.target !== this.#toastWindow) return;
            cleanup();
        };

        this.#toastWindow.addEventListener("transitionend", onEnd);
        this.#toastWindow.addEventListener("animationend", onEnd);

        this.#fallbackId = setTimeout(cleanup, 400);
    }

    setContent({ header, main, footer }) {
        this.#toastHeader.replaceChildren(...this.#toNodeArray(header));
        this.#toastMain.replaceChildren(...this.#toNodeArray(main));
        this.#toastFooter.replaceChildren(...this.#toNodeArray(footer));
    }

    setClass({ toastWindow, header, main, footer }) {
        this.#toastWindow.classList.add(...this.#toNodeArray(toastWindow));
        this.#toastHeader.classList.add(...this.#toNodeArray(header));
        this.#toastMain.classList.add(...this.#toNodeArray(main));
        this.#toastFooter.classList.add(...this.#toNodeArray(footer));
    }

    removeClass({ toastWindow, header, main, footer }) {
        this.#toastWindow.classList.remove(...this.#toNodeArray(toastWindow));
        this.#toastHeader.classList.remove(...this.#toNodeArray(header));
        this.#toastMain.classList.remove(...this.#toNodeArray(main));
        this.#toastFooter.classList.remove(...this.#toNodeArray(footer));
    }

}