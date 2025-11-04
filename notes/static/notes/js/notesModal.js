import { ModalManager } from "/static/components/modal/modalManager.js";
import { createNoteShare, getNoteShares, updateNoteShare, deleteNoteShare } from "./notesAPI.js";
import { AppError } from "../../../../static/js/utils.js";

export function noteInfoModal(noteData) {
  // Init elements
  const p = document.createElement("p");
  p.textContent = noteData.title;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList = "generic-button";
  closeBtn.addEventListener(() => modal.close());

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
  okBtn.addEventListener(() => modal.close());

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

export function shareNoteModal(noteData) {
  // Hardcoded roles
  const roles = ["viewer", "editor"];

  // Init elements
  // Init header
  const pTitle = document.createElement("p");
  pTitle.textContent = `Manage shares for "${noteData.title}"`;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList = "generic-button";

  // Init create new share block
  const newShareBlock = document.createElement("div");
  newShareBlock.classList = "new-share";

  const userInput = document.createElement("input");
  userInput.type = "text";
  userInput.placeholder = "Enter username...";
  userInput.classList = "new-share__input";

  const roleSelect = document.createElement("select");
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role.toUpperCase();
    roleSelect.appendChild(option);
  });

  const addShareBtn = document.createElement("button");
  addShareBtn.textContent = "Add";
  addShareBtn.classList = "generic-button";

  newShareBlock.append(userInput, roleSelect, addShareBtn);

  // Init display existing shares block
  const shareListBlock = document.createElement("div");
  shareListBlock.classList = "share-list";

  const renderExistingShare = (share) => {
    const row = document.createElement("div");
    row.classList = "share-list__row";
    row.dataset.id = share.id;

    const pUsername = document.createElement("p");
    pUsername.textContent = share.username;

    const roleSelect = document.createElement("select");
    roles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role;
      option.textContent = role.toUpperCase();
      if (role == share.role) option.selected = true;
      roleSelect.appendChild(option);
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList = "generic-button";

    row.append(pUsername, roleSelect, removeBtn);
    shareListBlock.appendChild(row);
  };

  noteData.shares.forEach(renderExistingShare);

  // Init footer
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList = "generic-button";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList = "modal__button--confirm generic-button";

  // Modal setup
  const modal = new ModalManager();
  modal.setContent({
    header: [pTitle, closeBtn],
    main: [newShareBlock, shareListBlock],
    footer: [cancelBtn, saveBtn],
  });

  modal.setClass({
    modal: "modal--generic",
    modalWindow: "modal__window--generic",
  });

  modal.show();

  // Changes tracking
  const created = [];
  const removed = new Set();
  const updated = new Map();

  // Modal events
  addShareBtn.addEventListener("click", async () => {
    const username = userInput.value.trim();
    if (!username) return;

    const role = roleSelect.value;
    response = await createNoteShare(noteData.id, { user: username, role: role });
    renderExistingShare(response.data);

    userInput.value = "";
  });

  shareListBlock.addEventListener("click", (event) => {
    const row = event.target.closest(".share-list__row");
    if (!row) return;

    const id = row.dataset.id;

    if (event.target.tagName === "BUTTON") {
      row.remove();
      if (typeof id !== "string") removed.add(id);
      return;
    }

    if (event.target.tagName === "SELECT") {
      updated.set(id, event.target.value);
    }
  });

  // Resolve promise
  return new Promise((resolve) => {
    const close = (result) => {
      modal.close();
      resolve(result);
    };
    cancelBtn.addEventListener("click", () => close(null));
    closeBtn.addEventListener("click", () => close(null));
    saveBtn.addEventListener("click", () => {
      close({
        created,
        updated: Array.from(updated, ([id, role]) => ({ id, role })),
        removed: Array.from(removed),
      });
    });
  });
}
