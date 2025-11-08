export function shareRow(roles, shareData) {
  const rootEl = document.createElement("div");
  rootEl.classList = "share-list__row";
  rootEl.dataset.id = shareData.id;

  const usernameEl = document.createElement("p");
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
  buttonEl.textContent = "Remove";
  buttonEl.classList = "generic-button";

  rootEl.append(usernameEl, selectEl, buttonEl);
  return { rootEl, usernameEl, selectEl, buttonEl };
}
