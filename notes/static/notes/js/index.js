import { FilterManager } from "./components/notes/FilterManager.js";
import { ToastContainer } from "/static/js/components/toastContainer.js";
import { Dropdown } from "/static/js/components/Dropdown.js";
import { toastErrorWrapper } from "/static/js/errors/index.js";
import { ListManager } from "./components/list/ListManager.js";
import { NoteItem } from "./components/list/NoteItem.js";
import { createNote, deleteNote, getNoteList, getNoteDetails } from "./api/notesAPI.js";
import { NotePanel } from "./components/notes/NotePanel.js";

async function loadFilteredNotes(notesList, filter = "") {
  const response = await getNoteList(filter);
  response.data.forEach((note) => {
    notesList.addItem(
      new NoteItem(note, {
        onDelete: async (noteId) => {
          const response = await deleteNote(noteId);
          notesList.removeItem(noteId);
        },
      })
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // ----------------
  // Init toast messages
  // ----------------
  const toastContainer = new ToastContainer();

  // ------------
  // Init Sidebar
  // ------------

  document.querySelector("#sidebar-toggle-btn").addEventListener("click", () => {
    document.querySelector("#sidebar").classList.toggle("closed");
  });

  const notesListEl = document.querySelector(".notes-list");
  const notesList = new ListManager(notesListEl, NoteItem.cssClass);

  const notePanelEl = document.querySelector(".note-panel");
  const notePanel = new NotePanel(notePanelEl);

  notesList.setOnSelect((noteId) => {
    toastErrorWrapper(async () => {
      const response = await getNoteDetails(noteId);
      notePanel.setData(response.data.title, response.data.content);
    });
  });

  toastErrorWrapper(async () => {
    await loadFilteredNotes(notesList);
  });

  const filterDropdownEl = document.querySelector("#filter-dropdown");
  const filterDropdown = new Dropdown(filterDropdownEl);

  const filterManager = new FilterManager(filterDropdown.contentEl, async () => {
    const filters = filterManager.getQueryParams();
    notesList.clearList();
    await loadFilteredNotes(notesList, filters);
  });
});
