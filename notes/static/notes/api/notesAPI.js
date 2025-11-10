import { jwtRequest } from "/static/utils/utils.js";

function getNotesURL(noteId = null) {
  if (noteId) {
    return `/api/v1/notes/${noteId}/`;
  }
  return "/api/v1/notes/";
}

// ------------------
// Notes API Requests
// ------------------

export async function createNote(data) {
  return await jwtRequest(getNotesURL(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getNoteList(filterParams = null) {
  let url = getNotesURL();
  if (filterParams) {
    url += `?${filterParams}`;
  }
  return await jwtRequest(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getNoteDetails(noteId) {
  return await jwtRequest(getNotesURL(noteId), {
    method: "GET",
  });
}

export async function updateNote(noteId, data) {
  return await jwtRequest(getNotesURL(noteId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteNote(noteId) {
  return await jwtRequest(getNotesURL(noteId), {
    method: "DELETE",
  });
}
