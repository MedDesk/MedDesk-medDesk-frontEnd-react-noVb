import apiClient from "../../lib/ApiClient";

const BASE_URL = "/workingHours";

export const getWorkingHours = async () => {
  return apiClient.get(`${BASE_URL}`);
};

export const createWorkingHours = async (data: any) => {
  return apiClient.post(BASE_URL, data);
};

export const updateWorkingHours = async (id: number, data: any) => {
  return apiClient.patch(`${BASE_URL}/${id}`, data);
};

export const deleteWorkingHours = async (id: number) => {
  return apiClient.delete(`${BASE_URL}/${id}`);
};
