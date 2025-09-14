//
// Imports
//

import { renderNavBar } from "./baseUI.js";
import { initDropdowns } from "../components/dropdown/dropdown.js";

//
// Global Variables & DOM Elements
//

//
// Event Listeners
//

document.addEventListener("DOMContentLoaded", async () => {
    await renderNavBar();
    initDropdowns();
})