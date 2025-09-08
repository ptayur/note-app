//
// Imports
//

import { renderLeftSide, renderRightSideLogged, renderRightSide } from "./baseUI.js";
import { logout, getCurrentUser } from "/static/accounts/js/authCore.js";

//
// Global Variables & DOM Elements
//

const leftSide = document.getElementById("nav-left-side");
const rightSide = document.getElementById("nav-right-side");

const protectedPages = ["/notes/"];

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    renderLeftSide(leftSide);

    if (localStorage.getItem("IsLoggedIn")) {
        const result = await getCurrentUser();
        if (result.ok) {
            const dropdown = renderRightSideLogged(rightSide);

            // Set username as menu title
            const usernameSpan = dropdown.querySelector("#username");
            usernameSpan.textContent = result.data.user.username;
        }
    } else {
        renderRightSide(rightSide);

        // Redirect if trying to access protected page
        if (protectedPages.includes(window.location.pathname)) {
            window.location.href = "/auth/";
        }
    }
})

document.addEventListener("click", async (event) => {
    const dropdown = rightSide.querySelector(".dropdown");
    const logoutBtn = rightSide.querySelector("#logout-button");
    
    // Dropdown object logic
    if (dropdown) {
        const menuBtn = dropdown.querySelector("#menu-button");
        const menuList = dropdown.querySelector("#menu-list");

        if (dropdown.contains(event.target)) {
            const isOpen = menuList.classList.contains("active");

            menuList.classList.toggle("active");
            menuBtn.setAttribute("aria-expanded", String(!isOpen));
        } else {
            menuList.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
        } 
    }

    // Logout button logic
    if (logoutBtn && logoutBtn.contains(event.target)) {
        await logout();
    }
})