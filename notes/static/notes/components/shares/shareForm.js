export function shareForm(roles) {
  const rootEl = document.createElement("div");
  rootEl.classList.add("share-form");

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.placeholder = "Enter username...";

  const roleBlockEl = document.createElement("div");
  roleBlockEl.classList.add("share-form__role");
  const roleEl = document.createElement("span");
  roleEl.textContent = "Role:";

  const selectEl = document.createElement("select");
  roles.forEach((role) => {
    const optionEl = document.createElement("option");
    optionEl.value = role;
    optionEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    selectEl.appendChild(optionEl);
  });

  roleBlockEl.append(roleEl, selectEl);

  const buttonEl = document.createElement("button");
  buttonEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" fill=currentColor>
    <g fill="none" stroke=currentColor stroke-linejoin="round" stroke-width="4">
    <rect width="36" height="36" x="6" y="6" rx="3"/>
    <path stroke-linecap="round" d="M24 16v16m-8-8h16"/>
    </g>
    </svg>
    <span>Add</span>
  `;
  buttonEl.classList.add("flat-button");

  rootEl.append(inputEl, roleBlockEl, buttonEl);
  return {
    root: rootEl,
    input: inputEl,
    select: selectEl,
    button: buttonEl,
  };
}
