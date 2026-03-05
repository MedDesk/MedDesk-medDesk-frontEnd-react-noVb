/// <reference types="vite/client" />
// we add this in the top --saying hi vite i wanna to get all vite built-in difinitions
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, // to get the sessionId from the backend 
  headers: {
    "Content-Type": "application/json",
  },
});



/// response interceptor to handle Session expiration and redirect user to login
// apiClient.interceptors.response.use(
//   (response)=>{
//     // if the request is successfully
//     return response;
//   },
//   (error)=>{
//     //  chekc the error type if it's anuthorized 401
//     if(error.response && error.response.status === 401){
//       console.warn("Session expired or unauthorized. Redirecting to login ...");

//       localStorage.removeItem("user");

//       window.location.href='/login'
//     }

//     return Promise.reject(error)
//   }
// );

// if we use  JWT interceptor 
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default apiClient;