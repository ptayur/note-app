import { ToastManager } from "./toastManager.js";

export class ToastContainer {
    static #instance = null;
    #container;
    #toasts = [];
    #maxToasts;

    constructor(position = "bottom-right", maxToasts = 5) {
        if (ToastContainer.#instance) {
            return ToastContainer.#instance;
        }

        this.#container = document.createElement("div");
        this.#container.classList.add("toast-container", position);
        document.body.appendChild(this.#container);

        this.#maxToasts = maxToasts;

        ToastContainer.#instance = this;
    }

    // TODO: fix animations sequence
    #createToast(toastTitle, toastMessage, duration) {
        const toast = new ToastManager(duration);

        // Toast header
        const pTitle = document.createElement("p");
        pTitle.textContent = toastTitle;

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 20 20">
                <path fill="currentColor" d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"/>
            </svg>
        `;
        closeBtn.classList.add("toast__button--close");
        closeBtn.addEventListener("click", () => toast.close());

        // Toast main
        const pMessage = document.createElement("p");
        pMessage.textContent = toastMessage;

        // Toast footer
        const divTimer = document.createElement("div");
        divTimer.classList.add("toast__timer");
        divTimer.style.setProperty("--duration", `${duration / 1000}s`);

        toast.setContent({
            header: [pTitle, closeBtn],
            main: pMessage,
            footer: divTimer
        });

        // Remove toast from queue when closes
        toast.setOnClose(() => {
            this.#toasts = this.#toasts.filter(t => t !== toast);

            if (this.#toasts.length) {
                // Animate remaining toasts up smoothly
                const remainingToasts = this.#toasts.map(t => t.getElement());
                const oldPositions = remainingToasts.map(t => t.getBoundingClientRect().top);

                // Trigger layout reflow first
                requestAnimationFrame(() => {
                    remainingToasts.forEach((t, i) => {
                        const newTop = t.getBoundingClientRect().top;
                        const delta = oldPositions[i] - newTop;

                        t.style.transform = `translateY(${delta}px)`;
                        t.style.transition = "transform 0s";

                        requestAnimationFrame(() => {
                            t.style.transition = "transform 0.3s ease";
                            t.style.transform = "";
                        });
                    });
                });
            }
            
        });

        // Get toasts current positions
        const oldToasts = this.#toasts.map(t => t.getElement());
        const oldPositions = oldToasts.map(t => t.getBoundingClientRect().top);
        // Add new toast
        this.#toasts.push(toast);
        this.#container.prepend(toast.getElement());
        // Apply transform to keep old position
        oldToasts.forEach((oldToast, index) => {
            const newTop = oldToast.getBoundingClientRect().top;
            const delta = oldPositions[index] - newTop;

            oldToast.style.transform = `translateY(${delta}px)`;
            oldToast.style.transition = "transform 0s";
        });
        // Trigger reflow and remove transform
        requestAnimationFrame(() => {
            oldToasts.forEach(oldToast => {
                oldToast.style.transition = "transform 0.3s ease";
                oldToast.style.transform = "";
            });
        });

        // Close all toasts that exceed maxToasts
        const excess = this.#toasts.length - this.#maxToasts;
        if (excess > 0) {
            const toRemove = this.#toasts.slice(0, excess);
            setTimeout(() => {
                toRemove.forEach(toast => toast.close());
            }, 400);
        }

        return toast;
    }

    addErrorToast(errorTitle, errorMessage, duration = 5000) {
        const toast = this.#createToast(errorTitle, errorMessage, duration);
        toast.setClass({
            toastWindow: "toast__window--error",
            header: "toast__header--error",
            main: "toast__main--error",
            footer: "toast__footer--error"
        });
    }

    addSuccessToast(successTitle, successMessage, duration = 5000) {
        const toast = this.#createToast(successTitle, successMessage, duration);
        toast.setClass({
            toastWindow: "toast__window--success",
            header: "toast__header--success",
            main: "toast__main--success",
            footer: "toast__footer--success"
        });
    }
}