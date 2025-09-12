export function openModalBox(templateId) {
    // Get modal box
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";

    // Get provided template
    const template = document.querySelector(templateId);
    const clone = template.content.cloneNode(true);

    // Append template to modal box and display it
    modal.appendChild(clone);
    modal.classList.add("modal--open");

    return modal;
}

export function closeModalBox() {
    const modal = document.querySelector(".modal");
    modal.innerHTML = "";
    modal.classList.remove("modal--open");
}