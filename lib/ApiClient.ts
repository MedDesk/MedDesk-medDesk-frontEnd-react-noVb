// /// <reference types="vite/client" />
// // we add this in the top --saying hi vite i wanna to get all vite built-in difinitions
// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_BASE_API_URL,
//   withCredentials: true, // to get the sessionId from the backend 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });



// /// response interceptor to handle Session expiration and redirect user to login
// // apiClient.interceptors.response.use(
// //   (response)=>{
// //     // if the request is successfully
// //     return response;
// //   },
// //   (error)=>{
// //     //  chekc the error type if it's anuthorized 401
// //     if(error.response && error.response.status === 401){
// //       console.warn("Session expired or unauthorized. Redirecting to login ...");

// //       localStorage.removeItem("user");

// //       window.location.href='/login'
// //     }

// //     return Promise.reject(error)
// //   }
// // );

// // if we use  JWT interceptor 
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// export default apiClient;
/// <reference types="vite/client" />
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, // MANDATORY: Allows browser to send/receive httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Attach Access Token to every outgoing request
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor: Handle Token Expiration (401)
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to retry this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired. Attempting silent refresh...");
        
        // Call the refresh endpoint. 
        // withCredentials: true ensures the httpOnly refresh cookie is sent automatically.
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BASE_API_URL}/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );

        if (refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          
          // 1. Update localStorage with new Access Token
          localStorage.setItem("accessToken", newAccessToken);

          // 2. Update the Authorization header for the original failed request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 3. Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is also expired or invalid, log out the user
        console.error("Refresh token expired. Redirecting to login.");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;