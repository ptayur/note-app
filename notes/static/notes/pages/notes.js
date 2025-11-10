import { FiltersManager } from "../components/notes/filtersManager.js";
import { NotesManager } from "../components/notes/notesManager.js";
import { deleteModal, infoModal, shareModal } from "../components/modals/index.js";
import { ToastContainer } from "/static/components/toasts/toastContainer.js";
import { AppError } from "/static/utils/utils.js";
import { Dropdown } from "/static/components/dropdown/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ----------------
  // Init toast messages
  // ----------------
  const toastContainer = new ToastContainer();
  async function toastErrorWrapper(func) {
    try {
      await func();
    } catch (error) {
      if (error instanceof AppError) {
        toastContainer.addErrorToast(error.title, error.message);
      } else {
        console.error(error);
      }
    }
  }

  // ----------------
  // Init Notes Manager
  // ----------------
  const notesList = document.querySelector(".notes__list");
  const notePanel = document.querySelector(".note-panel");
  if (!notesList || !notePanel) {
    throw new AppError("Cannot find DOM element", "'notes__list' or '.note-panel' is missing");
  }
  const notesManager = new NotesManager({
    notePanel: notePanel,
    notesList: notesList,
  });

  // Load note list
  toastErrorWrapper(async () => {
    await notesManager.loadList();
  });

  // ----------------
  // Init notes filtering
  // ----------------
  const dropdownFilter = new Dropdown();

  const dropdownBtnEl = dropdownFilter.buttonEl;
  dropdownBtnEl.classList.add("generic-button");
  dropdownBtnEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
        viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.67 7c.083-.182.127-.374.16-.627c.202-1.572.303-2.358-.158-2.866C20.212 3 19.396 3 17.766 3H6.234c-1.63 0-2.445 0-2.906.507c-.461.508-.36 1.294-.158 2.866c.06.459.158.72.457 1.076c.969 1.15 2.742 3.197 5.23 5.057c.228.17.377.448.402.755c.28 3.425.537 5.765.674 6.917c.071.604.741 1.069 1.293.678c.927-.655 2.66-1.39 2.888-2.612c.108-.577.267-1.585.445-3.244M17.5 8v7m3.5-3.5h-7" color="currentColor"/>
    </svg>
    <span>Add filter</span>
  `;

  const dropdownTemplate = document.querySelector("#dropdown-filter-template");
  const dropdownClone = dropdownTemplate.content.cloneNode(true);

  const dropdownContentEl = dropdownFilter.contentEl;
  dropdownContentEl.classList.add("dropdown__content--filter");
  dropdownContentEl.append(dropdownClone);

  document.querySelector(".filters__header").appendChild(dropdownFilter.rootEl);

  const filterManager = new FiltersManager({
    dropdownFilter: dropdownContentEl,
    onChange: () =>
      toastErrorWrapper(async () => {
        const queryParams = filterManager.getQueryParams();
        await notesManager.loadList(queryParams);
      }),
  });

  // ----------------
  // Init note controls
  // ----------------

  function bindAction(control, action, handler) {
    control.addEventListener(action, async (event) => {
      await toastErrorWrapper(() => handler(event));
    });
  }

  // Rename controls setup
  const renameBtn = notePanel.querySelector("#rename-button");
  const titleInput = notesManager.titleInput;

  function enterRenameMode() {
    titleInput.readOnly = false;
    titleInput.focus();
    renameBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 2048 2048">
                <path fill="currentColor" d="M640 1755L19 1133l90-90l531 530L1939 275l90 90L640 1755z"/>
            </svg>
        `;
    renameBtn.classList.add("renaming");
  }

  function quitRenameMode() {
    titleInput.readOnly = true;
    renameBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                viewBox="0 0 24 24">
                <path fill="currentColor" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zm6.65.85c.39-.39.39-1.04 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
            </svg>
        `;
    renameBtn.classList.remove("renaming");
  }

  bindAction(renameBtn, "click", async () => {
    if (!renameBtn.classList.contains("renaming")) {
      enterRenameMode();
    } else {
      await notesManager.update();
      quitRenameMode();
    }
  });

  bindAction(titleInput, "blur", (event) => {
    if (event.relatedTarget !== renameBtn) {
      quitRenameMode();
    }
  });

  bindAction(titleInput, "keydown", async (event) => {
    if (event.key === "Enter") {
      await notesManager.update();
      quitRenameMode();
    } else if (event.key === "Escape") {
      quitRenameMode();
    }
  });

  bindAction(titleInput, "input", () => {
    const note = notesManager.getSelectedNote();
    if (note) {
      note.querySelector(".note-title").textContent = titleInput.value;
    }
  });

  // Create note button
  const createBtn = document.querySelector("#create-button");
  bindAction(createBtn, "click", async () => {
    await notesManager.create();
    toastContainer.addSuccessToast("Note creation", "Note was successfully created!");
    enterRenameMode();
  });

  // Save note button
  const saveBtn = notePanel.querySelector("#save-button");
  bindAction(saveBtn, "click", async () => {
    await notesManager.update();
    toastContainer.addSuccessToast("Note update", "Note was successfully updated!");
  });

  //Info note button
  const infoBtn = notePanel.querySelector("#info-button");
  bindAction(infoBtn, "click", async () => {
    const noteData = notesManager.getData();
    infoModal(noteData);
  });

  // Delete note button
  const deleteBtn = notePanel.querySelector("#delete-button");
  bindAction(deleteBtn, "click", async () => {
    const noteData = notesManager.getData();
    const confirmed = await deleteModal(noteData.title);
    if (confirmed) {
      await notesManager.delete();
      toastContainer.addSuccessToast("Delete success", "Note has been deleted!");
    }
  });

  // Share note button
  const shareBtn = notePanel.querySelector("#share-button");
  bindAction(shareBtn, "click", async () => {
    const noteData = notesManager.getData();
    await shareModal(noteData);
  });

  // Note selecting flow
  bindAction(notesManager.notesList, "click", async (event) => {
    const note = event.target.closest(".note");
    if (!note) return;
    if (note.contains(event.target)) {
      if (note.classList.contains("note--selected")) {
        notesManager.unselect();
      } else {
        await notesManager.select(note);
      }
    }
  });
});
