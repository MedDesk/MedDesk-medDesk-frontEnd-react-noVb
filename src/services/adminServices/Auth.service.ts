import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/auth";

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const register = async (data: any) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post(`${BASE_URL}/logout`);
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};


export const getCurrentUser = async () => {
        return JSON.parse(localStorage.getItem('user') || 'null');
};      