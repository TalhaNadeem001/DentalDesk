import axios, { AxiosInstance } from 'axios';
import type {
  User,
  LoginRequest,
  SignUpRequest,
  LoginResponse,
  Patient,
  PatientBiodata,
  PatientBiodataCreate,
  Visit,
  RecordPlanner,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Auth endpoints
  async signUp(data: SignUpRequest): Promise<User> {
    const response = await this.client.post<User>('/auth/signup', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  // Patient endpoints
  async createPatient(userId: number): Promise<Patient> {
    const response = await this.client.post<Patient>('/patients', {
      user_id: userId,
    });
    return response.data;
  }

  async getPatient(patientId: number): Promise<Patient> {
    const response = await this.client.get<Patient>(`/patients/${patientId}`);
    return response.data;
  }

  async getPatientsByUser(userId: number): Promise<Patient[]> {
    const response = await this.client.get<Patient[]>(`/patients/user/${userId}`);
    return response.data;
  }

  async deletePatient(patientId: number): Promise<void> {
    await this.client.delete(`/patients/${patientId}`);
  }

  // Biodata endpoints
  async createBiodata(data: PatientBiodataCreate): Promise<PatientBiodata> {
    const response = await this.client.post<PatientBiodata>('/patients/biodata', data);
    return response.data;
  }

  async getBiodata(patientId: number): Promise<PatientBiodata> {
    const response = await this.client.get<PatientBiodata>(`/patients/biodata/${patientId}`);
    return response.data;
  }

  async updateBiodata(patientId: number, data: Partial<PatientBiodataCreate>): Promise<PatientBiodata> {
    const response = await this.client.put<PatientBiodata>(`/patients/biodata/${patientId}`, data);
    return response.data;
  }

  // Visit endpoints
  async getVisits(patientId: number): Promise<Visit[]> {
    const response = await this.client.get<Visit[]>(`/patients/visits/${patientId}`);
    return response.data;
  }

  // Record planner endpoints
  async getRecordPlanners(patientId: number): Promise<RecordPlanner[]> {
    const response = await this.client.get<RecordPlanner[]>(`/patients/record-planner/${patientId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
