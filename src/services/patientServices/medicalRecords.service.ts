import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/medical-records";

export const getMedicalRecords = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/patient/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }
};

