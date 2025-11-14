//
// Imports
//

import { debounce } from "/static/js/utils/utils.js";

export class FiltersManager {
  #dropdownFilter = null;
  #queryParams = null;
  #sectionNames = [];
  #onChange;

  constructor({ dropdownFilter, onChange }) {
    this.#dropdownFilter = dropdownFilter;
    this.#queryParams = new URLSearchParams();
    this.#getSectionNames();
    this.#sectionNames.forEach((section) => this.#setupListeners(section));
    this.#onChange = onChange;
  }

  #getSectionNames() {
    const filterSections = this.#dropdownFilter.querySelectorAll("div");
    filterSections.forEach((section) => {
      this.#sectionNames.push(section.querySelector("input").name);
    });
  }

  #getInputs(sectionName, type) {
    return [...this.#dropdownFilter.querySelectorAll(`input[name="${sectionName}"][type="${type}"]`)];
  }

  #setupListeners(sectionName) {
    // Setup checkboxes
    const sectionCbs = this.#getInputs(sectionName, "checkbox");
    if (sectionCbs) {
      const allCb = sectionCbs.find((cb) => cb.value === "");

      sectionCbs.forEach((cb) => {
        if (cb === allCb) {
          cb.addEventListener("change", () => {
            // Sync other checkboxes with "All"
            sectionCbs.forEach((x) => (x.checked = allCb.checked));

            this.#queryParams.delete(allCb.name);
            this.#onChange();
          });
        } else {
          cb.addEventListener("change", () => {
            // Check does all section selected
            const nonAllCb = sectionCbs.filter((x) => x !== allCb);
            const allChecked = nonAllCb.every((x) => x.checked);
            if (allChecked) {
              allCb.checked = allChecked;
              this.#queryParams.delete(cb.name);
              this.#onChange();
            } else {
              if (cb.checked) {
                this.#queryParams.append(cb.name, cb.value);
                this.#onChange();
              } else {
                this.#queryParams.delete(cb.name, cb.value);
                this.#onChange();
              }
            }
          });
        }
      });
    }

    // Setup text fields
    const sectionText = this.#getInputs(sectionName, "text");
    if (sectionText) {
      sectionText.forEach((text) => {
        const textDebouce = debounce(() => {
          if (text.value) {
            this.#queryParams.delete(text.name);
            this.#queryParams.append(text.name, text.value);
            this.#onChange();
          } else {
            this.#queryParams.delete(text.name);
            this.#onChange();
          }
        });
        text.addEventListener("input", textDebouce);
      });
    }

    // Setup date fields
    const sectionDate = this.#getInputs(sectionName, "date");
    if (sectionDate) {
      sectionDate.forEach((date) => {
        date.addEventListener("change", () => {
          if (date.value) {
            this.#queryParams.delete(date.name);
            this.#queryParams.append(date.name, date.value);
            this.#onChange();
          } else {
            this.#queryParams.delete(date.name);
            this.#onChange();
          }
        });
      });
    }
  }

  getQueryParams() {
    return this.#queryParams.toString();
  }
}
