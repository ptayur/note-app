import { shareForm } from "../shares/shareForm.js";
import { shareList, shareRow } from "../shares/shareList.js";
import { createNoteShare, getNoteShares, updateNoteShare, deleteNoteShare } from "../../api/sharesAPI.js";
import { ModalManager } from "/static/js/components/modalManager.js";
import { ToastContainer } from "/static/js/components/toastContainer.js";

function attachRowListeners({ root, username, select, button }, noteID, toast) {
  select.addEventListener("change", async () => {
    const response = await updateNoteShare(noteID, root.dataset.id, {
      role: select.value,
    });
    if (!response.ok) {
      toast.addErrorToast("Share has not been updated!", response.data);
      return;
    }
    toast.addSuccessToast("Share has been updated!", `${username.textContent}'s role changed to ${select.value}.`);
  });
  button.addEventListener("click", async () => {
    const response = await deleteNoteShare(noteID, root.dataset.id);
    if (!response.ok) {
      toast.addErrorToast("Share has not been deleted!", response.data);
      return;
    }
    root.remove();
    toast.addSuccessToast("Share has been deleted!", `Share for ${username.textContent} deleted.`);
  });
}

export async function shareModal(noteData) {
  const toast = new ToastContainer();
  const modal = new ModalManager();
  const roles = ["viewer", "editor"]; // Hardcoded roles

  // -------
  // Init UI
  // -------

  // Init Header
  const headerEl = document.createElement("div");
  headerEl.classList.add("modal__header__section");

  const titleEl = document.createElement("span");
  titleEl.textContent = `Manage shares for "${noteData.title}" note`;

  const closeBtnEl = document.createElement("button");
  closeBtnEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
    <path fill=currentColor d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"/>
    </svg>
  `;
  closeBtnEl.classList.add("flat-button");

  headerEl.append(titleEl, closeBtnEl);

  // Init create block
  const createBlockEl = document.createElement("div");
  createBlockEl.classList.add("modal__main__section");

  const createTitleEl = document.createElement("span");
  createTitleEl.textContent = "Create a new share";

  const shareFormEl = shareForm(roles);

  createBlockEl.append(createTitleEl, shareFormEl.root);

  // Init list block
  const listBlockEl = document.createElement("div");
  listBlockEl.classList.add("modal__main__section");

  const listTitleEl = document.createElement("span");
  listTitleEl.textContent = "Shares list";

  const shareListEl = shareList();

  listBlockEl.append(listTitleEl, shareListEl);

  const response = await getNoteShares(noteData.id);
  if (!response.ok) {
    toast.addErrorToast("Cannot load note shares data!", response.data);
  } else {
    response.data.forEach((share) => {
      const row = shareRow(roles, share);
      attachRowListeners(row, noteData.id, toast);
      shareListEl.appendChild(row.root);
    });
  }

  // Init Footer

  const footerEl = document.createElement("div");
  footerEl.classList.add("modal__footer__section");

  const doneBtnEl = document.createElement("button");
  doneBtnEl.textContent = "Done";
  doneBtnEl.classList.add("flat-button");

  footerEl.appendChild(doneBtnEl);

  // ---------------
  // Event Listeners
  // ---------------

  shareFormEl.button.addEventListener("click", async () => {
    const username = shareFormEl.input.value.trim();
    if (!username) {
      shareFormEl.input.classList.add("input--error");
      return;
    }
    const role = shareFormEl.select.value;
    const response = await createNoteShare(noteData.id, {
      user: username,
      role: role,
    });
    if (!response.ok) {
      toast.addErrorToast("Share has not been created!", Object.values(response.data)[0]);
      return;
    }
    const row = shareRow(roles, response.data);
    attachRowListeners(row, noteData.id, toast);
    shareListEl.appendChild(row.root);
    shareFormEl.input.value = "";
    toast.addSuccessToast("Share has been created!", `Share for ${username} created.`);
  });

  shareFormEl.input.addEventListener("input", () => {
    if (shareFormEl.input.classList.contains("input--error")) {
      shareFormEl.input.classList.remove("input--error");
    }
  });

  closeBtnEl.addEventListener("click", () => modal.close());
  doneBtnEl.addEventListener("click", () => modal.close());

  // -----------
  // Setup Modal
  // -----------

  modal.setContent({
    header: headerEl,
    main: [createBlockEl, listBlockEl],
    footer: footerEl,
  });

  modal.show();
}
