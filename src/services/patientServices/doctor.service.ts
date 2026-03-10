import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/doctors";

export const getAllDoctors = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getDoctorById = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    throw error;
  }
};