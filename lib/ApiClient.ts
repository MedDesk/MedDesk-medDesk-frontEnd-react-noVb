

// /// <reference types="vite/client" />

// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_BASE_API_URL,
//   withCredentials: true, // new changeToday: Mandatory for sending/receiving httpOnly cookies (refresh token)
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /**
//  * Request Interceptor: Attach Access Token to every outgoing request
//  */
// // new changeToday: Automatically add Authorization header if access token exists
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// /**
//  * Response Interceptor: Handle Token Expiration (401)
//  */
// // new changeToday: Automatically try refresh token if access token expired

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 1. Only try if error is 401 (Unauthorized)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // 2. Get the refresh token from localStorage (since your backend expects it in the body)
//         const userJson = localStorage.getItem('user');
//         const userData = userJson ? JSON.parse(userJson) : null;
        
     
//         const refreshToken = localStorage.getItem("refreshToken"); 

//         if (!refreshToken) {
//            throw new Error("No refresh token available");
//         }

//         console.log("Access token expired. Attempting refresh...");
        
//         const refreshResponse = await axios.post(
//           `${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, // URL Fixed
//           { refreshToken: refreshToken } // Body Fixed
//         );

//         if (refreshResponse.data.success) {
//           const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

//           // 4. Update storage with BOTH tokens
//           localStorage.setItem("accessToken", accessToken);
//           localStorage.setItem("refreshToken", newRefreshToken);

//           // 5. Retry original request
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Refresh failed", refreshError);
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

/// <reference types="vite/client" />
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Token issues. Attempting silent refresh via HttpOnly Cookie...");

        // N.B: We don't pass the refreshToken in the body anymore.
        // The browser will automatically send the HttpOnly cookie. this what did we program in the backend when we set the cookie with `httpOnly: true` and `sameSite: 'Strict'`
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, 
          {}, // Empty body
          { withCredentials: true } // Mandatory to send/receive cookies
        );

        if (refreshResponse.data.success) {
          // Usually, backend sends a NEW Access Token in the response JSON
          // and a NEW Refresh Token in the Set-Cookie header automatically.
          const { accessToken } = refreshResponse.data.data;

          localStorage.setItem("accessToken", accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh failed (Cookie expired or invalid).");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;