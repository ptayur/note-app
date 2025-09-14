//
// Imports
//

import { logout, getCurrentUser } from "/static/accounts/js/authCore.js"

// Functions

export async function renderNavBar() {
    const nav = document.querySelector("nav");
    // Render left side of navigation bar
    const leftTemplate = document.querySelector("#left-template");
    const leftClone = leftTemplate.content.cloneNode(true);

    nav.appendChild(leftClone);

    // Render right side of navigation bar
    if (localStorage.getItem("IsLoggedIn")) {
        const response = await getCurrentUser();
        if (response.ok) {
            const loggedInTemplate = document.querySelector("#right-logged-in-template");
            const loggedInClone = loggedInTemplate.content.cloneNode(true);

            loggedInClone.querySelector("#username").textContent = response.data.user.username;

            // Set logout handler for logout button
            loggedInClone.querySelector("#logout-button").
                addEventListener("click", async () => {
                    await logout();
            })
            
            nav.appendChild(loggedInClone);
        }
    } else {
        const loggedOutTemplate = document.querySelector("#right-logged-out-template");
        const loggedOutClone = loggedOutTemplate.content.cloneNode(true);

        nav.appendChild(loggedOutClone);
    }
}