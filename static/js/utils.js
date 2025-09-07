export function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

// Hold in-progress refresh request
let refreshTokenPromise;

export async function jwtRequest(url, options = {}, { auth = true } = {}) {
    try {
        // Initial request
        const makeRequest = async () => {
            const headers = { ...options.headers };
            if (auth) {
                headers["Authorization"] = "Bearer " + localStorage.getItem("access_token");
            }

            const response = await fetch(url, { ...options, headers});
            return response;
        }

        let response = await makeRequest();

        if (auth && response.status === 401) {
            // If no refresh request in-progress, start one
            if (!refreshTokenPromise) {
                refreshTokenPromise = (async () => {
                    const res = await fetch("/api/users/refresh/", { method: "POST" });
                    if (!res.ok) throw new Error("Refresh token expired");

                    const resJson = await res.json();
                    localStorage.setItem("access_token", resJson.data.access_token);
                    return resJson.data.access_token;
                })();
            }

            try {
                await refreshTokenPromise; // Wait for refresh request to complete
            } finally {
                refreshTokenPromise = null; // Clear shared promise
            }

            response = await makeRequest(); // retry original request with new token
        }

        if (response.status === 204) {
            return { ok: response.ok, status: response.status, data: null }
        }

        const data = await response.json();
        return { ok: response.ok, status: response.status, ...data };

    } catch (error) {
        return {ok: false, status: 0, data: {error: error.message}}
    }
}

export function generateSVG({ svgAttrs = {} , pathAttrs = {}, className = "icon" } = {}) {
    const iconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    for (const [key, value] of Object.entries(svgAttrs)) {
        iconSVG.setAttribute(key, value);
    };
    iconSVG.classList.add(className);

    for (const [key, value] of Object.entries(pathAttrs)) {
        iconPath.setAttribute(key, value);
    };
    iconSVG.appendChild(iconPath);
    return iconSVG;
}