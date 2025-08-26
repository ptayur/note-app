//
// API Requests
//

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

        if (auth && response.status === 403) {
            const refreshResponse = await fetch("/auth/refresh/", {
                method: "POST",
            });

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                localStorage.setItem("access_token", refreshData.access_token)

                response = await fetch(url, {
                    ...options,
                    headers: {...options.headers,
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    }
                });
            } else {
                window.location.replace("/auth/login/");
            }
        }

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };

    } catch (error) {
        return {ok: false, status: 0, data: {error: error.message}}
    }
}