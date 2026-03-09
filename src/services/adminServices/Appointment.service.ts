import apiClient from "../../../lib/ApiClient";
const BASE_URL = "/appointments";

/**
 * 1. Fetch all appointments (Paginated)
 */
export const getAppointments = async (page: number, size: number) => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

/**
 * 2. Create a new appointment
 */
export const createAppointment = async (data: any) => {
  try {
    const response = await apiClient.post(`${BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

/**
 * 3. Update appointment status (Confirmed, Canceled, Completed)
 * Uses PATCH for partial updates
 */
export const updateAppointmentStatus = async (id: number, status: string) => {
  try {
    const response = await apiClient.patch(`${BASE_URL}/${id}`, { 
        appointmentStatus: status 
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment ${id}:`, error);
    throw error;
  }
};

/**
 * 4. Delete an appointment
 */
export const deleteAppointment = async (id: number) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting appointment ${id}:`, error);
    throw error;
  }
};

/**
 * 5. Get Weekly Availability
 * Endpoint: /appointments/weekly-availability
 */
export const getWeeklyAvailability = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/weekly-availability`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly availability:", error);
    throw error;
  }
};

/**
 * 6. Get Day Availability for a specific date
 * Endpoint: /appointments/availability?date=YYYY-MM-DD
 */
export const getDayAvailability = async (date: string) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/availability`, {
      params: { date } // This automatically turns into ?date=YYYY-MM-DD
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching availability for ${date}:`, error);
    throw error;
  }
};


export const updateAvailability = async (id: number, available: boolean) => {
  try {
    const response = await apiClient.patch(`${BASE_URL}/${id}/availability`, null, {
      params: { available } // This sends it as a query param
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling availability for ${id}:`, error);
    throw error;
  }
};