import { logout, getCurrentUser } from "/static/accounts/js/authAPI.js";
import { Dropdown } from "/static/js/components/Dropdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  const nav = document.querySelector("nav");

  // Render right side of navigation bar
  if (localStorage.getItem("IsLoggedIn")) {
    const response = await getCurrentUser();
    if (response.ok) {
      const loggedInTemplate = document.querySelector("#logged-in-template");
      const loggedInEl = loggedInTemplate.content.cloneNode(true);

      const navDropdownEl = loggedInEl.querySelector("#nav-dropdown");
      const navDropdown = new Dropdown(navDropdownEl);

      const usernameEl = navDropdown.buttonEl.querySelector("span");
      usernameEl.textContent = `${response.data.user.username}`;

      const logoutBtnEl = navDropdown.contentEl.querySelector("#logout-button");
      logoutBtnEl.addEventListener("click", () => {
        logout();
      });

      nav.appendChild(loggedInEl);
    }
  } else {
    const loggedOutTemplate = document.querySelector("#logged-out-template");
    const loggedOutClone = loggedOutTemplate.content.cloneNode(true);

    nav.appendChild(loggedOutClone);
  }
});
