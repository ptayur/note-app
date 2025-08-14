import { getCookie } from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalOverlay');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('noteForm');

    fetch('/notes/get/', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('notes');
            data.forEach(note => {
                const div = document.createElement('div');
                div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
                container.appendChild(div);
            });
        })

    openBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    })

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    })

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        modal.style.display = 'none';
        form.reset();

        fetch('/notes/add/', {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            body: data
        })
            .then(res => res.json())
            .then(note => {
                const container = document.getElementById('notes');
                const div = document.createElement('div');
                div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
                container.appendChild(div);
            })
    })
})