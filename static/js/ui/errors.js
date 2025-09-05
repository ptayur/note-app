export function showFieldError(errorContainer, messages) {
    errorContainer.innerHTML = "";

    if (!messages) return;
    const errors = Array.isArray(messages) ? messages : [messages];

    errors
        .filter(msg => typeof msg === "string" && msg.trim() !== "")
        .forEach(msg => {
            const p = document.createElement("p");
            p.textContent = msg.trim();
            errorContainer.appendChild(p);
        });
}