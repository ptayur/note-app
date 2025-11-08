import { ModalManager } from "/static/components/modal/modalManager.js";
import { createNoteShare, updateNoteShare, getNoteShares, deleteNoteShare } from "./notesAPI.js";
import { ToastContainer } from "/static/components/toasts/toastContainer.js";

export function noteInfoModal(noteData) {
  // Init elements
  const p = document.createElement("p");
  p.textContent = noteData.title;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList = "generic-button";

  const fields = {
    owner: "Owner",
    created_at: "Creation time",
    updated_at: "Last updated",
  };
  const ul = document.createElement("ul");
  ul.classList.add("modal__list");

  for (const [key, label] of Object.entries(fields)) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="list__label"><p>${label}</p></div>
      <div class="list__key"><p>${noteData[key]}</p></div>
    `;
    ul.appendChild(li);
  }

  const okBtn = document.createElement("button");
  okBtn.textContent = "Ok";
  okBtn.classList = "generic-button";

  //Modal setup
  const modal = new ModalManager();
  modal.setContent({
    header: [p, closeBtn],
    main: ul,
    footer: okBtn,
  });

  modal.setClass({
    modal: "modal--generic",
    modalWindow: "modal__window--generic",
  });

  // Modal events
  closeBtn.addEventListener("click", () => modal.close());
  okBtn.addEventListener("click", () => modal.close());

  modal.show();
}

export function deleteNoteModal(noteTitle) {
  // Init elements
  const p = document.createElement("p");
  p.textContent = `Are you sure you want to delete note "${noteTitle}"?`;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList = "generic-button";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList = "generic-button";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList = "modal__button--delete generic-button";

  //Modal setup
  const modal = new ModalManager();
  modal.setContent({
    header: [`<p>Delete Note</p>`, closeBtn],
    main: p,
    footer: [cancelBtn, deleteBtn],
  });

  modal.setClass({
    modal: "modal--generic",
    modalWindow: "modal__window--generic",
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
