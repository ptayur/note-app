import { logout, getCurrentUser } from "/static/accounts/api/authAPI.js";
import { Dropdown } from "/static/components/dropdown/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  const nav = document.querySelector("nav");
  // Render left side of navigation bar
  const leftTemplate = document.querySelector("#left-template");
  const leftClone = leftTemplate.content.cloneNode(true);

  nav.appendChild(leftClone);

  // Render right side of navigation bar
  if (localStorage.getItem("IsLoggedIn")) {
    const response = await getCurrentUser();
    if (response.ok) {
      const dropdown = new Dropdown();

      const dropdownBtnEl = dropdown.buttonEl;
      dropdownBtnEl.innerHTML = `
      <span>${response.data.user.username}</span>
      `;
      dropdownBtnEl.classList.add("nav-button");

      const dropdownContentTemplate = document.querySelector("#logged-in-dropdown-template");
      const dropdownContentClone = dropdownContentTemplate.content.cloneNode(true);

      const logoutBtnEl = dropdownContentClone.querySelector("#logout-button");
      logoutBtnEl.addEventListener("click", () => {
        logout();
      });

      const dropdownContentEl = dropdown.contentEl;
      dropdownContentEl.classList.add("dropdown__content--nav");
      dropdownContentEl.append(dropdownContentClone);

      nav.appendChild(dropdown.rootEl);
    }
  } else {
    const loggedOutTemplate = document.querySelector("#right-logged-out-template");
    const loggedOutClone = loggedOutTemplate.content.cloneNode(true);

    nav.appendChild(loggedOutClone);
  }
});
