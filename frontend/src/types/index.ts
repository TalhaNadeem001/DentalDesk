export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  user: User;
  session_id: string;
}

export interface Patient {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PatientBiodata {
  id: number;
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  occupation: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_history: string | null;
  allergies: string | null;
  medications: string | null;
  previous_surgeries: string | null;
  family_medical_history: string | null;
  previous_dental_treatments: string | null;
  gum_disease_history: string | null;
  dental_visit_frequency: string | null;
  oral_hygiene_habits: string | null;
  dental_trauma_history: string | null;
  smoking_tobacco_use: string | null;
  alcohol_consumption: string | null;
  diet_habits: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  consent_forms: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientBiodataCreate {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  occupation?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  medical_history?: string | null;
  allergies?: string | null;
  medications?: string | null;
  previous_surgeries?: string | null;
  family_medical_history?: string | null;
  previous_dental_treatments?: string | null;
  gum_disease_history?: string | null;
  dental_visit_frequency?: string | null;
  oral_hygiene_habits?: string | null;
  dental_trauma_history?: string | null;
  smoking_tobacco_use?: string | null;
  alcohol_consumption?: string | null;
  diet_habits?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  consent_forms?: string | null;
}

export interface Visit {
  id: number;
  patient_id: number;
  visit_date: string;
  visit_type: string | null;
  chief_complaint: string | null;
  examination_notes: string | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  treatment_performed: string | null;
  next_appointment: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecordPlanner {
  id: number;
  patient_id: number;
  title: string;
  description: string | null;
  planned_date: string | null;
  completed_date: string | null;
  status: string;
  priority: string | null;
  created_at: string;
  updated_at: string;
}
