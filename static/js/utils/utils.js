export function debounce(func, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
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

      const response = await fetch(url, { ...options, headers });

      let data;
      if (response.status === 204) {
        data = null;
      } else {
        data = await response.json();
      }

      return { ok: response.ok, status: response.status, data: data };
    };

    let response = await makeRequest();

    if (auth && response.status === 401) {
      // If no refresh request in-progress, start one
      if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
          const res = await fetch("/api/v1/users/refresh/", { method: "POST" });
          if (!res.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("IsLoggedIn");
            throw new AppError("Refresh token expired", "Authentication needed");
          }

          const data = await res.json();
          localStorage.setItem("access_token", data.access_token);
          return data.access_token;
        })();
      }

      try {
        await refreshTokenPromise; // Wait for refresh request to complete
      } finally {
        refreshTokenPromise = null; // Clear shared promise
      }

      response = await makeRequest(); // retry original request with new token
    }

    return response;
  } catch (error) {
    return { ok: false, status: 0, data: { error: error.message } };
  }
}

export class AppError extends Error {
  constructor(title, message) {
    super(message);
    this.name = "AppError";
    this.title = title;
  }
}
