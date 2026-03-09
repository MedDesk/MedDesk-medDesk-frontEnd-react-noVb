import apiClient from "../../lib/ApiClient";

const BASE_URL = "/users";

/**
 * 1. Fetch all users (Paginated)
 */
export const getUsers = async (page: number, size: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * 2. Create a new user
 */
export const createUser = async (data: any) => {
  try {
    const response = await apiClient.post(`${BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * 3. Update user details
 * Uses PATCH for partial updates
 */
export const updateUser = async (id: number, data: any) => {
  try {
    const response = await apiClient                                                                                            .patch(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * 4. Delete a user
 */
export const deleteUser = async (id: number) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};


export const getUserById = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data; // This returns the object you showed me
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};