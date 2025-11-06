import { jwtRequest, AppError } from "/static/js/utils.js";

// ------------------
// Notes API Requests
// ------------------

export async function createNote(data) {
  return await jwtRequest("/api/v1/notes/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getNoteList(filterParams = null) {
  let url = "/api/v1/notes/";
  if (filterParams) {
    url += `?${filterParams}`;
  }
  return await jwtRequest(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function getNoteDetails(noteId) {
  return await jwtRequest(`/api/v1/notes/${noteId}/`, {
    method: "GET",
  });
}

export async function updateNote(noteId, payload) {
  return await jwtRequest(`/api/v1/notes/${noteId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(noteId) {
  return await jwtRequest(`/api/v1/notes/${noteId}/`, {
    method: "DELETE",
  });
}

// -------------------
// Shares API Requests
// -------------------

export async function createNoteShare(noteId, data) {
  return await jwtRequest(`/api/v1/notes/${noteId}/shares/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getNoteShares(noteId) {
  return await jwtRequest(`/api/v1/notes/${noteId}/shares/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateNoteShare(noteId, shareId, data) {
  return await jwtRequest(`/api/v1/notes/${noteId}/shares/${shareId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteNoteShare(noteId, shareId) {
  return await jwtRequest(`/api/v1/notes/${noteId}/shares/${shareId}/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
