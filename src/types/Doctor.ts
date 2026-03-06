// src/types/Doctor.ts

export type SpecialistType = 'CARDIOLOGY' | 'DERMATOLOGY' | 'NEUROLOGY' | 'PEDIATRICS' | 'GENERAL_PRACTICE' | 'OTHER';

export interface DoctorDto {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
  gender: string;
  birthDate: string;
  address: string;
  emergency_contact: string;
  license_number: string;
  specialist: string; // Or SpecialistType if you want it strict
  cin: string;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone: string;
  profileImage: string | null;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  address: string;
  cin: string;
  emergency_contact: string;
  license_number: string;
  specialist: SpecialistType;
}