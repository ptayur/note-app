//
// API Requests
//

export async function apiFetch(url, options) {
    try {
        const response = await fetch(url, options || {});

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;  

        return {
            ok: response.ok,
            status: response.status,
            data
        };

    } catch (error) {
        return {ok: false, status: 0, data: {error: error.message}}
    }
}