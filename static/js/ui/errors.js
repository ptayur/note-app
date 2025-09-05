export function showFieldError(errorContainer, messages) {
    errorContainer.innerHTML = "";

    if (!messages) return;

    messages.forEach(msg => {
        const p = document.createElement("p");
        p.textContent = msg.trim();
        errorContainer.appendChild(p);
    });
}