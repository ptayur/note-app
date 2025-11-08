export function createShareList() {
  const rootEl = document.createElement("div");
  rootEl.classList.add("share-list");

  const headerRowEl = document.createElement("div");
  headerRowEl.classList.add("share-list__row--header", "share-list__row");

  const usernameHeaderEl = document.createElement("span");
  usernameHeaderEl.textContent = "Username";
  const roleHeaderEl = document.createElement("span");
  roleHeaderEl.textContent = "Role";
  const actionHeaderEl = document.createElement("span");
  actionHeaderEl.textContent = "Action";

  headerRowEl.append(usernameHeaderEl, roleHeaderEl, actionHeaderEl);
  rootEl.appendChild(headerRowEl);

  return rootEl;
}

export function createShareRow(roles, shareData) {
  const rootEl = document.createElement("div");
  rootEl.classList = "share-list__row";
  rootEl.dataset.id = shareData.id;

  const usernameEl = document.createElement("span");
  usernameEl.textContent = shareData.user;

  const selectEl = document.createElement("select");
  roles.forEach((role) => {
    const optionEl = document.createElement("option");
    optionEl.value = role;
    optionEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    if (role == shareData.role) optionEl.selected = true;
    selectEl.appendChild(optionEl);
  });

  const buttonEl = document.createElement("button");
  buttonEl.innerHTML = `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M10.655 17.03l3.97-3.97l3.97 3.97l1.061-1.061l-3.97-3.97l3.97-3.97l-1.061-1.061l-3.97 3.97l-3.97-3.97l-1.061 1.061l3.97 3.97l-3.97 3.97l1.061 1.061z" fill=currentColor />
    <path d="M22.125 3H9.124a1.126 1.126 0 0 0-.816.351L.751 11.326v1.348l7.557 7.975c.206.216.495.351.816.351h13.001a1.127 1.127 0 0 0 1.125-1.125V4.125A1.127 1.127 0 0 0 22.125 3zm-.375 16.5H9.285L2.25 12.076v-.152L9.285 4.5H21.75z" fill=currentColor />
    </svg>
    <span>Remove</span>
  `;
  buttonEl.classList.add("flat-button");

  rootEl.append(usernameEl, selectEl, buttonEl);
  return {
    root: rootEl,
    username: usernameEl,
    select: selectEl,
    button: buttonEl,
  };
}
