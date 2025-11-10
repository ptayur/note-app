import { ModalManager } from "/static/components/modal/modalManager.js";

export function deleteModal(noteTitle) {
  // -------
  // Init UI
  // -------

  // Init Header
  const headerEl = document.createElement("div");
  headerEl.classList.add("modal__header__section");

  const headerTitleEl = document.createElement("span");
  headerTitleEl.textContent = `Delete "${noteTitle}" note`;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
    <path fill=currentColor d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"/>
    </svg>
  `;
  closeBtn.classList = "flat-button";

  headerEl.append(headerTitleEl, closeBtn);

  // Init Main
  const mainEl = document.createElement("div");
  mainEl.classList.add("modal__main__section");

  const mainTextEl = document.createElement("span");
  mainTextEl.textContent = `Are you sure you want to delete note "${noteTitle}"?`;

  mainEl.append(mainTextEl);

  // Init Footer
  const footerEl = document.createElement("div");
  footerEl.classList.add("modal__footer__section");

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList = "flat-button";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("modal__button--delete", "flat-button");

  footerEl.append(cancelBtn, deleteBtn);

  // -----------
  // Setup Modal
  // -----------

  const modal = new ModalManager();
  modal.setContent({
    header: headerEl,
    main: mainEl,
    footer: footerEl,
  });

  modal.show();

  // Resolve promise
  return new Promise((resolve) => {
    const close = (result) => {
      modal.close();
      resolve(result);
    };
    closeBtn.addEventListener("click", () => close(false));
    cancelBtn.addEventListener("click", () => close(false));
    deleteBtn.addEventListener("click", () => close(true));
  });
}
