//
// Imports
//

// Functions

export function renderLeftSide(leftSide) {
    leftSide.innerHTML = `
        <button>
            <a href="/">NoteApp</a>
        </button>
    `;
}

export function renderRightSideLogged(rightSide) {

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    dropdown.innerHTML = `
        <button class="dropdown-button dropdown-button--nav" aria-expanded="false">
            <span id="username">Menu</span>
            <svg class="dropdown-button__arrow" xmlns="http://www.w3.org/2000/svg" width="200" height="200" 
                viewBox="0 0 1024 1024" fill="currentColor">
                <path fill="currentColor" 
                    d="M8.2 751.4c0 8.6 3.4 17.401 10 24.001c13.2 13.2 34.8 13.2 48 0l451.8-451.8l445.2 445.2c13.2 13.2 34.8 13.2 48 0s13.2-34.8 0-48L542 251.401c-13.2-13.2-34.8-13.2-48 0l-475.8 475.8c-6.8 6.8-10 15.4-10 24.2z"/>
            </svg>
        </button>

        <ul class="dropdown-list dropdown-list--nav">
            <li>
                <a href="/profile">
                    <svg class="dropdown-list__icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" 
                        viewBox="0 0 16 16" fill="currentColor">
                        <path fill="currentColor" fill-rule="evenodd" 
                        d="M8 14.5a6.47 6.47 0 0 0 3.25-.87V11.5A2.25 2.25 0 0 0 9 9.25H7a2.25 2.25 0 0 0-2.25 2.25v2.13A6.47 6.47 0 0 0 8 14.5Zm4.75-3v.937a6.5 6.5 0 1 0-9.5 0V11.5a3.752 3.752 0 0 1 2.486-3.532a3 3 0 1 1 4.528 0A3.752 3.752 0 0 1 12.75 11.5ZM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM9.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" clip-rule="evenodd"/>
                    </svg>
                    <span>Profile</span>
                </a>
            </li>
            <li>
                <a href="/notes">
                    <svg class="dropdown-list__icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" 
                        viewBox="0 0 24 24" fill="currentColor">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 20l7-7m-7 7v-6a1 1 0 0 1 1-1h6V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/>
                    </svg>
                    <span>Notes</span>
                </a>
            </li>
            <hr>
            <li>
                <button id="logout-button" type="button">
                    <svg class="dropdown-list__icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" 
                        viewBox="0 0 1024 1024" fill="currentColor">
                        <path fill="currentColor" d="M116.832 543.664H671.28c17.696 0 32-14.336 32-32s-14.304-32-32-32H118.832l115.76-115.76c12.496-12.496 12.496-32.752 0-45.248s-32.752-12.496-45.248 0l-189.008 194l189.008 194c6.256 6.256 14.432 9.376 22.624 9.376s16.368-3.12 22.624-9.376c12.496-12.496 12.496-32.752 0-45.248zM959.664 0H415.663c-35.36 0-64 28.656-64 64v288h64.416V103.024c0-21.376 17.344-38.72 38.72-38.72h464.72c21.391 0 38.72 17.344 38.72 38.72l1.007 818.288c0 21.376-17.328 38.72-38.72 38.72h-465.71c-21.376 0-38.72-17.344-38.72-38.72V670.944l-64.416.08V960c0 35.344 28.64 64 64 64h543.984c35.36 0 64.016-28.656 64.016-64V64c-.015-35.344-28.671-64-64.015-64z"/>
                    </svg>
                    <span>Logout</span>
                </button>
            </li>
        </ul>
    `;

    return rightSide.appendChild(dropdown);
}

export function renderRightSide(rightSide) {
    rightSide.innerHTML = `
        <button>
            <a href="/auth/">Login</a>
        </button>
    `;
}