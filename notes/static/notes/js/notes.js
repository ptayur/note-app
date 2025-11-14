import { FiltersManager } from "./components/notes/filtersManager.js";
import { NotesManager } from "./components/notes/notesManager.js";
import { deleteModal, infoModal, shareModal } from "./components/modals/index.js";
import { ToastContainer } from "/static/js/components/toastContainer.js";
import { AppError } from "/static/js/utils/utils.js";
import { Dropdown } from "/static/js/components/Dropdown.js";

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
  const notesList = document.querySelector(".notes-list");
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
  const filterDropdownEl = document.querySelector("#filter-dropdown");
  const filterDropdown = new Dropdown(filterDropdownEl);

  const filterManager = new FiltersManager({
    dropdownFilter: filterDropdown.contentEl,
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
    const note = event.target.closest(".note-item");
    if (!note) return;
    if (event.target === note) {
      if (note.classList.contains("note--selected")) {
        notesManager.unselect();
      } else {
        await notesManager.select(note);
      }
    }
  });
});
