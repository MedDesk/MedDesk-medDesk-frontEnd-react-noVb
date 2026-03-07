import apiClient from "../../lib/ApiClient";
import type { CreateDoctorRequest } from "../types/Doctor";

const BASE_URL = "/doctors";

export const createDoctor = async(data: CreateDoctorRequest)=>{
    const response = await apiClient.post(`${BASE_URL}`, data);
    return response.data;
}

export const getDoctors = async (page: number, size: number) => {
    try {
        const response = await apiClient.get(`${BASE_URL}`, {
            params: { page, size }
        });
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

export const updateDoctor = async (id: number, data: Partial<CreateDoctorRequest>) => {
    try {
        const response = await apiClient.patch(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating doctor ${id}:`, error);
        throw error;
    }
};

export const deleteDoctor = async (id: number) => {
    try {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting doctor ${id}:`, error);
        throw error;
    }
}