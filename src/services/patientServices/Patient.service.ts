import apiClient from "../../../lib/ApiClient"

const BASE_URL = "/patients";

export const getPatientById = async (id: number) => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching patient ${id}:`, error);
        throw error;
    }
};