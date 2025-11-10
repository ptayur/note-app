import { ModalManager } from "/static/components/modal/modalManager.js";

export function infoModal(noteData) {
  // -------
  // Init UI
  // -------

  // Init Header
  const headerEl = document.createElement("div");
  headerEl.classList.add("modal__header__section");

  const headerTitleEl = document.createElement("span");
  headerTitleEl.textContent = `More about "${noteData.title}" note`;

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
    <path fill=currentColor d="M10 8.586L2.929 1.515L1.515 2.929L8.586 10l-7.071 7.071l1.414 1.414L10 11.414l7.071 7.071l1.414-1.414L11.414 10l7.071-7.071l-1.414-1.414L10 8.586z"/>
    </svg>
  `;
  closeBtn.classList = "flat-button";

  headerEl.append(headerTitleEl, closeBtn);

  // Init Main
  const mainEl = document.createElement("div");
  mainEl.classList.add("modal__main__section");

  const infoFields = {
    owner: "Owner",
    created_at: "Creation time",
    updated_at: "Last updated",
  };
  const infoListEl = document.createElement("ul");
  infoListEl.classList.add("modal__list");

  for (const [key, label] of Object.entries(infoFields)) {
    const infoListRowEl = document.createElement("li");
    infoListRowEl.innerHTML = `
      <div class="list__label"><p>${label}</p></div>
      <div class="list__key"><p>${noteData[key]}</p></div>
    `;
    infoListEl.appendChild(infoListRowEl);
  }

  mainEl.append(infoListEl);

  // Init Footer
  const footerEl = document.createElement("div");
  footerEl.classList.add("modal__footer__section");

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.classList = "flat-button";

  footerEl.append(doneBtn);

  // ---------------
  // Event Listeners
  // ---------------

  closeBtn.addEventListener("click", () => modal.close());
  doneBtn.addEventListener("click", () => modal.close());

  // -----------
  // Setup Modal
  // -----------

  const modal = new ModalManager();
  modal.setContent({
    header: headerEl,
    main: mainEl,
    footer: footerEl,
  });

  modal.show();
}
