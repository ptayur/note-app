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

// Dropdowns handler
document.addEventListener("click", event => {
    const dropdowns = document.querySelectorAll(".dropdown");
    
    // Dropdown object logic
    dropdowns.forEach((dropdown) => {
        const dropdownBtn = dropdown.querySelector(".dropdown-button");
        const dropdownList = dropdown.querySelector(".dropdown-list");

        if (dropdownBtn.contains(event.target)) {
            // Clicked inside this dropdown
            const isOpen = !dropdownList.classList.contains("dropdown-list--hidden");

            // Close all dropdowns first
            dropdowns.forEach((d) => {
                d.querySelector(".dropdown-list").classList.add("dropdown-list--hidden");
                d.querySelector(".dropdown-button").setAttribute("aria-expanded", "false");
            })
            
            // Then open this dropdown
            if (!isOpen) {
                dropdownList.classList.toggle("dropdown-list--hidden");
                dropdownBtn.setAttribute("aria-expanded", String(!isOpen));
            }
        } else if (!dropdownList.contains(event.target)) {
            // close this dropdown if clicked outside
            dropdownList.classList.add("dropdown-list--hidden");
            dropdownBtn.setAttribute("aria-expanded", "false");
        }
    })
})

// Logout handler
rightSide.addEventListener("click", async (event) => {
    const logoutBtn = rightSide.querySelector("#logout-button");

    if (logoutBtn.contains(event.target)) {
        await logout();
    }
})