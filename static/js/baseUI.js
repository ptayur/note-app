//
// Imports
//

import { generateSVG } from "./utils.js";

// Functions

export function renderLeftSide(leftSide) {
    leftSide.innerHTML = `
        <ul>
            <li><a href="/">NoteApp</a></li>
        </ul>
    `;
}

export function renderRightSideLogged(rightSide, username) {
    
    // wrapper list
    const ul = document.createElement("ul");

    // parent item with username
    const li = document.createElement("li");
    li.className = "has-dropdown";

    const a = document.createElement("a");

    const span = document.createElement("span");
    span.textContent = username;

    const svg = generateSVG({
        svgAttrs: {
            viewBox: "0 0 20 20",
        },
        pathAttrs: {
            fill: "currentColor",
            d: "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
        },
        className: "menu-icon"
    });

    a.appendChild(span);
    a.appendChild(svg);
    li.appendChild(a);

    //dropdown
    const dropdown = document.createElement("ul");
    dropdown.className = "dropdown";

    const items = [
        {
            href: "/profile",
            label: "Profile",
            icon: {
                svgAttrs: {
                    "viewBox": "0 0 16 16"
                },
                pathAttrs: {
                    "fill": "currentColor",
                    "d": "M8 14.5a6.47 6.47 0 0 0 3.25-.87V11.5A2.25 2.25 0 0 0 9 9.25H7a2.25 2.25 0 0 0-2.25 2.25v2.13A6.47 6.47 0 0 0 8 14.5Zm4.75-3v.937a6.5 6.5 0 1 0-9.5 0V11.5a3.752 3.752 0 0 1 2.486-3.532a3 3 0 1 1 4.528 0A3.752 3.752 0 0 1 12.75 11.5ZM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM9.5 6a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z",
                    "fill-rule": "evenodd",
                    "clip-rule": "evenodd"
                },
                className: "menu-icon"
            }
        }, 
        { 
            href: "/notes", 
            label: "Notes",
            icon: {
                svgAttrs: {
                    "viewBox": "0 0 48 48"
                },
                pathAttrs: {
                    "fill": "none",
                    "stroke": "#000000",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "d": "M5 7v25.56h10.44V43H41a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Zm0 25.56L15.44 43"
                },
                className: "menu-icon"
            }
        },
        { 
            href: "/logout", 
            label: "Logout",
            icon: {
                svgAttrs: {
                    "viewBox": "0 0 1024 1024"
                },
                pathAttrs: {
                    "fill": "currentColor",
                    "d": "M116.832 543.664H671.28c17.696 0 32-14.336 32-32s-14.304-32-32-32H118.832l115.76-115.76c12.496-12.496 12.496-32.752 0-45.248s-32.752-12.496-45.248 0l-189.008 194l189.008 194c6.256 6.256 14.432 9.376 22.624 9.376s16.368-3.12 22.624-9.376c12.496-12.496 12.496-32.752 0-45.248zM959.664 0H415.663c-35.36 0-64 28.656-64 64v288h64.416V103.024c0-21.376 17.344-38.72 38.72-38.72h464.72c21.391 0 38.72 17.344 38.72 38.72l1.007 818.288c0 21.376-17.328 38.72-38.72 38.72h-465.71c-21.376 0-38.72-17.344-38.72-38.72V670.944l-64.416.08V960c0 35.344 28.64 64 64 64h543.984c35.36 0 64.016-28.656 64.016-64V64c-.015-35.344-28.671-64-64.015-64z"
                },
                className: "menu-icon"
            },
            id: "logout"
        }
    ];

    items.forEach(({ href, label, icon, id = {}}) => {
        const dLi = document.createElement("li");
        const dA = document.createElement("a");

        dA.href = href;
        dA.id = id

        const span = document.createElement("span");
        span.textContent = label;

        const svg = generateSVG(icon);
        dA.appendChild(svg);
        dA.append(span);

        dLi.appendChild(dA);
        dropdown.appendChild(dLi);
    });

    li.appendChild(dropdown);
    ul.appendChild(li);
    rightSide.appendChild(ul);
}

export function renderRightSide(rightSide) {
    rightSide.innerHTML = `
        <ul>
            <li><a href="/auth">Login</a></li>
        </ul>
    `;
}