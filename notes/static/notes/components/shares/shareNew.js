export function shareNew(roles) {
  const rootEl = document.createElement("div");
  rootEl.classList = "new-share";

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.placeholder = "Enter username...";
  inputEl.classList = "new-share__input";

  const selectEl = document.createElement("select");
  roles.forEach((role) => {
    const optionEl = document.createElement("option");
    optionEl.value = role;
    optionEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    selectEl.appendChild(optionEl);
  });

  const buttonEl = document.createElement("button");
  buttonEl.textContent = "Add";
  buttonEl.classList = "generic-button";

  rootEl.append(inputEl, selectEl, buttonEl);
  return { rootEl, inputEl, selectEl, buttonEl };
}
