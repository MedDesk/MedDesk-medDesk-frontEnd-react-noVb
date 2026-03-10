import apiClient from "../../../lib/ApiClient";

const BASE_URL = "/medical-records";



export const getMedicalRecords = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw error;
  }
}; 



export const getMedicalRecordById = async (id: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medical record ${id}:`, error);
    throw error;
  }
};

export const createMedicalRecord = async (data: any) => {
  try {
    const response = await apiClient.post(`${BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
};

export const updateMedicalRecord = async (id: number, data: any) => {
  try {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating medical record ${id}:`, error);
    throw error;
  }
};

export const deleteMedicalRecord = async (id: number) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting medical record ${id}:`, error);
    throw error;
  }
};

export const getMedicalRecordsByPatientId = async (patientId: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/patient/${patientId}`);   
    return response.data;
  } catch (error) {
    console.error(`Error fetching medical records for patient ${patientId}:`, error);
    throw error;
  }
};
