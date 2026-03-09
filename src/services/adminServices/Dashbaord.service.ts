import apiClient from "../../../lib/ApiClient";
const BASE_URL = "/dashboard/statistics";


export const getDashboardStatistics = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    throw error;
  }
}
    