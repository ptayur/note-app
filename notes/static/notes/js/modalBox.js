export function openModalBox(templateId, onSubmit) {
    // Get modal box
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";

    // Get provided template
    const template = document.querySelector(templateId);
    const clone = template.content.cloneNode(true);

    // Set event listener for close button
    const closeBtn = clone.querySelector(".close-modal");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => closeModalBox());
    }

    // Set event listener for form submit
    const form = clone.querySelector("form");
    if (form && onSubmit) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            onSubmit(data);
            closeModalBox();
        })
    }

    // Append template to modal box and display it
    modal.appendChild(clone);
    modal.classList.remove("modal--hidden");
}

function closeModalBox() {
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";
    modal.classList.add("modal--hidden");
}