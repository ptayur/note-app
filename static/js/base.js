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
            renderRightSideLogged(rightSide, result.data.user.username);
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
    const menu = rightSide.querySelector(".has-dropdown");
    const logoutBtn = rightSide.querySelector("#logout");
    
    if (menu) {
       const dropdown = menu.querySelector(".dropdown");
    
        if (menu.contains(event.target)) {
            dropdown.classList.toggle("active");
        } else {
            dropdown.classList.remove("active");
        } 
    }

    if (logoutBtn && logoutBtn.contains(event.target)) {
        event.preventDefault();
        await logout();
    }
})