export function createDropdownUI() {
  const rootEl = document.createElement("div");
  rootEl.classList.add("dropdown");

  const dropdownButtonEl = document.createElement("button");
  dropdownButtonEl.classList.add("dropdown__button");

  const dropdownContentEl = document.createElement("div");
  dropdownContentEl.classList.add("dropdown__content", "hidden");

  rootEl.append(dropdownButtonEl, dropdownContentEl);
  return {
    root: rootEl,
    button: dropdownButtonEl,
    content: dropdownContentEl,
  };
}
