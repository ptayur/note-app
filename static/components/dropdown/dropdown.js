// Dropdowns handler
export function initDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", event => {
            const dropdownBtn = dropdown.querySelector(".dropdown__button");
            const dropdownMenu = dropdown.querySelector(".dropdown__menu");

            if (dropdownBtn.contains(event.target)) {
                // Check is clicked inside this dropdown
                const isOpen = dropdownMenu.classList.contains("dropdown__menu--open");
                if (!isOpen) {
                    // Close open dropdown first
                    closeOpenDropdown(event.target);
                }
                dropdownMenu.classList.toggle("dropdown__menu--open");
                dropdownBtn.setAttribute("aria-expanded", String(!isOpen));
            }
        });
    });

    // Global listener to close dropdown when clicked outside of it
    document.addEventListener("click", event => {
        closeOpenDropdown(event.target);
    })

    function closeOpenDropdown(eventTarget) {
        const openDropdown = document.querySelector(".dropdown__menu--open");
        if (openDropdown) {
            const dropdown = openDropdown.closest(".dropdown");
            if (!dropdown.contains(eventTarget)) {
                openDropdown.classList.remove("dropdown__menu--open");
                dropdown.querySelector(".dropdown__button")
                    .setAttribute("aria-expanded", "false");
            }
        }
    }
}

