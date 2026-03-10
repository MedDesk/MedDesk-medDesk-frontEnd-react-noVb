import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/staff";

export const getAllNurses = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/nurses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching nurses:", error);
    throw error;
  }
};
 export const getNurseById = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/nurses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching nurse ${id}:`, error);
    throw error;
  }
};