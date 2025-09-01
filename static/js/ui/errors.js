export function showFieldError(errorContainer, messages) {
    errorContainer.innerHTML = "";

    if (messages && messages.length > 0) {
        messages.forEach(msg => {
            const p = document.createElement("p");
            p.textContent = msg.trim();
            errorContainer.appendChild(p);
        });
    }
}