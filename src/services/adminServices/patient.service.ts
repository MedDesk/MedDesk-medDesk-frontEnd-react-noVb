import apiClient from "../../../lib/ApiClient";
import type { 
  CreatePatientRequest, 
  PatientDtoResponse, 
  ApiResponse 
} from "../../types/Patient";

const BASE_URL = "/patients";


export const createPatient = async (data: CreatePatientRequest):Promise<ApiResponse<PatientDtoResponse>>=> {
    try {
        const response = await apiClient.post<ApiResponse<PatientDtoResponse>>(`${BASE_URL}`, data);
        return response.data;   
    } catch (error) {
        console.error("Error creating patient:", error);
        throw error;
    }
};



export const getPatients = async (page: number, size: number): Promise<ApiResponse<{
    content: PatientDtoResponse[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
}>> => {
    try {
        const response = await apiClient.get(`${BASE_URL}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
};

/**
 * Get a single patient by ID
 */

export const getPatientById = async (id: number): Promise<ApiResponse<PatientDtoResponse>> => {
    try {
        const response = await apiClient.get<ApiResponse<PatientDtoResponse>>(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching patient ${id}:`, error);
        throw error;
    }
};

/**
 * Update an existing patient
 */
export const updatePatient = async (id: number, data: Partial<CreatePatientRequest>): Promise<ApiResponse<PatientDtoResponse>> => {
    try {
        const response = await apiClient.patch<ApiResponse<PatientDtoResponse>>(`${BASE_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating patient ${id}:`, error);
        throw error;
    }
};


/**
 * Delete a patient
 */
export const deletePatient = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await apiClient.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting patient ${id}:`, error);
        throw error;
    }
};