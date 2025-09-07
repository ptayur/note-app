export function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    }
}

export async function jwtRequest(url, options = {}, { auth = true } = {}) {
    try {
        let headers = { ...options.headers };
        if (auth) {
            headers["Authorization"] = "Bearer " + localStorage.getItem("access_token");
        }
        let response = await fetch(url, {
            ...options,
            headers,
        });

        if (auth && response.status === 401) {
            const refreshResponse = await fetch("/api/users/refresh/", {
                method: "POST",
            });

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                localStorage.setItem("access_token", refreshData.data.access_token)

                response = await fetch(url, {
                    ...options,
                    headers: {...options.headers,
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    }
                });
            }
        }

        if (response.status === 204) {
            return { ok: response.ok, status: response.status, data: null }
        }

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            ...data,
        };

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