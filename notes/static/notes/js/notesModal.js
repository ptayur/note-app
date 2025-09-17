//
// Imports
//

import { ModalManager } from "/static/components/modal/modalManager.js";

export function showDetailsModal(noteData) {
    const modal = new ModalManager();

    // Header structure
    const h5 = document.createElement("h5");
    h5.textContent = noteData.title;
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.classList.add("generic-button");

    closeBtn.addEventListener("click", () => modal.close());

    // Main structure
    const fields = { 
        user: "Owner",
        created_at: "Creation time",
        updated_at: "Last updated" 
    };
    const ul = document.createElement("ul");
    ul.classList.add("modal__list");

    Object.entries(fields).forEach(([key, label]) => {
        const li = document.createElement("li");
        
        // Label section
        const fieldLabel = document.createElement("div");
        fieldLabel.classList.add("list__label");

        const pLabel = document.createElement("p");
        pLabel.textContent = `${label}: `

        fieldLabel.appendChild(pLabel);

        // Key section
        const fieldKey = document.createElement("div");
        fieldKey.classList.add("list__key");

        const pKey = document.createElement("p");
        pKey.textContent = `${noteData[key]}`;

        fieldKey.appendChild(pKey);

        li.appendChild(fieldLabel);
        li.appendChild(fieldKey);
        ul.appendChild(li);
    });

    // Footer structure

    const okBtn = document.createElement("button");
    okBtn.textContent = "Ok";
    okBtn.classList.add("generic-button");

    okBtn.addEventListener("click", () => modal.close());

    //Modal setup
    modal.setContent({
        header: [h5, closeBtn],
        main: ul,
        footer: okBtn
    });

    modal.setClass({
        modal: "modal--generic",
        modalWindow: "modal__window--generic"
    });

    modal.show();
}

export function showCreateModal() {
    const modal = new ModalManager();

    // Header structure
    const h5 = document.createElement("h5");
    h5.textContent = "Create new note"
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.classList.add("generic-button");

    closeBtn.addEventListener("click", () => modal.close());

    // Main structure
    

    // Footer structure
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("generic-button");

    const createBtn = document.createElement("button");
    createBtn.textContent = "Create";
    createBtn.classList.add("generic-button");

    createBtn.addEventListener("click", () => modal.close());

    //Modal setup
    modal.setContent({
        header: [h5, closeBtn],
        footer: [cancelBtn, createBtn]
    });

    modal.setClass({
        modal: "modal--generic",
        modalWindow: "modal__window--generic"
    });

    modal.show();
}