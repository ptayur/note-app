import { jwtRequest } from "/static/js/utils/utils.js";

function getSharesURL(noteId, shareId = null) {
  if (shareId) {
    return `/api/v1/notes/${noteId}/shares/${shareId}/`;
  }
  return `/api/v1/notes/${noteId}/shares/`;
}

// -------------------
// Shares API Requests
// -------------------

export async function createNoteShare(noteId, data) {
  return await jwtRequest(getSharesURL(noteId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getNoteShares(noteId) {
  return await jwtRequest(getSharesURL(noteId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateNoteShare(noteId, shareId, data) {
  return await jwtRequest(getSharesURL(noteId, shareId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteNoteShare(noteId, shareId) {
  return await jwtRequest(getSharesURL(noteId, shareId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
