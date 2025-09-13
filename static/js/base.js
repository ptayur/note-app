//
// Imports
//

import { renderLeftSide, renderRightSideLogged, renderRightSide } from "./baseUI.js";
import { logout, getCurrentUser } from "/static/accounts/js/authCore.js";
import { initDropdowns } from "../components/dropdown/dropdown.js";

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

    initDropdowns();
})

// Logout handler
rightSide.addEventListener("click", async (event) => {
    const logoutBtn = rightSide.querySelector("#logout-button");

    if (logoutBtn.contains(event.target)) {
        await logout();
    }
})