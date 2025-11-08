import { shareNew } from "./shareNew.js";
import { shareRow } from "./shareRow.js";
import { createNoteShare, getNoteShares, updateNoteShare, deleteNoteShare } from "../../js/notesAPI.js";
import { ModalManager } from "/static/components/modal/modalManager.js";
import { ToastContainer } from "/static/components/toasts/toastContainer.js";

function attachRowListeners({ rootEl, usernameEl, selectEl, buttonEl }, noteID, toast) {
  selectEl.addEventListener("change", async () => {
    const response = await updateNoteShare(noteID, rootEl.dataset.id, { role: selectEl.value });
    if (!response.ok) {
      toast.addErrorToast("Share has not been updated!", response.data);
      return;
    }
    toast.addSuccessToast("Share has been updated!", `${usernameEl.textContent}'s role changed to ${selectEl.value}.`);
  });
  buttonEl.addEventListener("click", async () => {
    const response = await deleteNoteShare(noteID, rootEl.dataset.id);
    if (!response.ok) {
      toast.addErrorToast("Share has not been deleted!", response.data);
      return;
    }
    rootEl.remove();
    toast.addSuccessToast("Share has been deleted!", `Share for ${usernameEl.textContent} deleted.`);
  });
}

export async function shareModal(noteData) {
  const toast = new ToastContainer();
  const modal = new ModalManager();
  const roles = ["viewer", "editor"]; // Hardcoded roles

  // -------
  // Init UI
  // -------

  const titleEl = document.createElement("p");
  titleEl.textContent = `Manage shares for "${noteData.title}"`;

  const closeBtnEl = document.createElement("button");
  closeBtnEl.textContent = "Close";
  closeBtnEl.classList = "generic-button";

  // Create share block
  const createShareEl = document.createElement("div");
  createShareEl.classList.add("create-share");

  const createTitleEl = document.createElement("p");
  createTitleEl.textContent = "Create a new share";

  const newShare = shareNew(roles);

  createShareEl.append(createTitleEl, newShare.rootEl);

  // shares list block
  const sharesEl = document.createElement("div");
  sharesEl.classList.add("shares");

  const sharesTitleEl = document.createElement("p");
  sharesTitleEl.textContent = "Shares list";

  const shareListEl = document.createElement("div");
  shareListEl.classList.add("share-list");

  sharesEl.append(sharesTitleEl, shareListEl);

  const response = await getNoteShares(noteData.id);
  if (!response.ok) {
    toast.addErrorToast("Cannot load note shares data!", response.data);
  } else {
    response.data.forEach((share) => {
      const row = shareRow(roles, share);
      attachRowListeners(row, noteData.id, toast);
      shareListEl.appendChild(row.rootEl);
    });
  }

  const okBtnEl = document.createElement("button");
  okBtnEl.textContent = "Ok";
  okBtnEl.classList = "modal__button--confirm generic-button";

  // ---------------
  // Event Listeners
  // ---------------

  newShare.buttonEl.addEventListener("click", async () => {
    const username = newShare.inputEl.value.trim();
    if (!username) {
      newShare.inputEl.classList.add("input--error");
      return;
    }
    const role = newShare.selectEl.value;
    const response = await createNoteShare(noteData.id, { user: username, role: role });
    if (!response.ok) {
      toast.addErrorToast("Share has not been created!", response.data);
      return;
    }
    const row = shareRow(roles, response.data);
    attachRowListeners(row, noteData.id, toast);
    shareListEl.appendChild(row.rootEl);
    newShare.inputEl.value = "";
    toast.addSuccessToast("Share has been created!", `Share for ${username} created.`);
  });

  closeBtnEl.addEventListener("click", () => modal.close());
  okBtnEl.addEventListener("click", () => modal.close());

  // -----------
  // Setup Modal
  // -----------

  modal.setContent({
    header: [titleEl, closeBtnEl],
    main: [createShareEl, sharesEl],
    footer: [okBtnEl],
  });

  modal.setClass({
    modal: "modal--generic",
    modalWindow: "modal__window--generic",
  });

  modal.show();
}
