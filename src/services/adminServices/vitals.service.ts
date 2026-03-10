import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/vitals";

export const createVitals = async (data: any) => {
  try {
    const response = await apiClient.post(`${BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating vitals:", error);
    throw error;
  }
};

export const getVitalsById = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  }         catch (error) {
    console.error(`Error fetching vitals ${id}:`, error);
    throw error;
  }
};