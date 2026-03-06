export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type PatientType = 'INPATIENT' | 'OUTPATIENT';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'OTHER' | 'WIDOWED';

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone: string;
  profileImage: string | null;
  gender: Gender;
  birthDate: string;
  address: string;
  cin: string;
  patientType: PatientType;
  cnss: string | null;
  maritalStatus: MaritalStatus;
}

export interface PatientDtoResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
  gender: Gender;
  birthDate: string;
  address: string;
  registerDate: string;
  patientType: PatientType;
  cnss: string | null;
  maritalStatus: MaritalStatus;
  cin: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status: number;
  path: string;
}