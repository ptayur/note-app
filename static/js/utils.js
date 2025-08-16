export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export async function apiFetch(url, options) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;  

    } catch (error) {
        throw error;
    }
}