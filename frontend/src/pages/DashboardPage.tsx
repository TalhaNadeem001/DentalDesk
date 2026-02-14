import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { LogOut, Users, Plus, Calendar, FileText, X, ChevronRight, Trash2, AlertTriangle, Settings, User, Search, Image, Scan, Bell, ChevronLeft } from 'lucide-react';
import { ThemeSelect } from '../components/ThemeSelect';
import type { Patient, PatientBiodata, Visit, RecordPlanner } from '../types';
import './DashboardPage.css';

const DUMMY_BIODATA_FIELDS = {
  date_of_birth: null as string | null,
  gender: null as string | null,
  address: null as string | null,
  occupation: null as string | null,
  emergency_contact_name: null as string | null,
  emergency_contact_phone: null as string | null,
  medical_history: null as string | null,
  allergies: null as string | null,
  medications: null as string | null,
  previous_surgeries: null as string | null,
  family_medical_history: null as string | null,
  previous_dental_treatments: null as string | null,
  gum_disease_history: null as string | null,
  dental_visit_frequency: null as string | null,
  oral_hygiene_habits: null as string | null,
  dental_trauma_history: null as string | null,
  smoking_tobacco_use: null as string | null,
  alcohol_consumption: null as string | null,
  diet_habits: null as string | null,
  insurance_provider: null as string | null,
  insurance_policy_number: null as string | null,
  consent_forms: null as string | null,
  created_at: '',
  updated_at: '',
};

const DUMMY_NAMES: Array<{ first_name: string; last_name: string; phone?: string }> = [
  { first_name: 'Sarah', last_name: 'Mitchell', phone: '+1 (555) 234-5678' },
  { first_name: 'James', last_name: 'Chen', phone: '555-876-5432' },
  { first_name: 'Emma', last_name: 'Rodriguez', phone: '(555) 111-2233' },
  { first_name: 'Michael', last_name: 'Thompson' },
  { first_name: 'Olivia', last_name: 'Williams', phone: '555-999-8877' },
  { first_name: 'David', last_name: 'Kim', phone: '+1 555 444 3322' },
  { first_name: 'Sophia', last_name: 'Martinez' },
  { first_name: 'Ethan', last_name: 'Davis', phone: '555-123-4567' },
  { first_name: 'Isabella', last_name: 'Anderson', phone: '555-234-5678' },
  { first_name: 'William', last_name: 'Taylor' },
  { first_name: 'Ava', last_name: 'Thomas', phone: '555-345-6789' },
  { first_name: 'Benjamin', last_name: 'Jackson', phone: '555-456-7890' },
  { first_name: 'Mia', last_name: 'White' },
  { first_name: 'Lucas', last_name: 'Harris', phone: '555-567-8901' },
  { first_name: 'Charlotte', last_name: 'Martin' },
  { first_name: 'Henry', last_name: 'Garcia', phone: '555-678-9012' },
  { first_name: 'Amelia', last_name: 'Lee' },
  { first_name: 'Alexander', last_name: 'Clark', phone: '555-789-0123' },
  { first_name: 'Harper', last_name: 'Lewis' },
  { first_name: 'Mason', last_name: 'Robinson', phone: '555-890-1234' },
  { first_name: 'Evelyn', last_name: 'Walker' },
  { first_name: 'Elijah', last_name: 'Hall', phone: '555-901-2345' },
  { first_name: 'Abigail', last_name: 'Allen' },
  { first_name: 'Oliver', last_name: 'Young', phone: '555-012-3456' },
  { first_name: 'Emily', last_name: 'King' },
  { first_name: 'Daniel', last_name: 'Wright', phone: '555-111-2222' },
  { first_name: 'Elizabeth', last_name: 'Scott' },
  { first_name: 'Matthew', last_name: 'Green', phone: '555-222-3333' },
  { first_name: 'Sofia', last_name: 'Baker' },
  { first_name: 'Joseph', last_name: 'Adams', phone: '555-333-4444' },
  { first_name: 'Avery', last_name: 'Nelson' },
  { first_name: 'Samuel', last_name: 'Carter', phone: '555-444-5555' },
  { first_name: 'Ella', last_name: 'Mitchell' },
  { first_name: 'David', last_name: 'Perez', phone: '555-555-6666' },
  { first_name: 'Scarlett', last_name: 'Roberts' },
  { first_name: 'Owen', last_name: 'Turner', phone: '555-666-7777' },
  { first_name: 'Grace', last_name: 'Phillips' },
  { first_name: 'Sebastian', last_name: 'Campbell', phone: '555-777-8888' },
  { first_name: 'Chloe', last_name: 'Parker' },
  { first_name: 'Jack', last_name: 'Evans', phone: '555-888-9999' },
  { first_name: 'Victoria', last_name: 'Edwards' },
  { first_name: 'Aiden', last_name: 'Collins', phone: '555-999-0000' },
  { first_name: 'Riley', last_name: 'Stewart' },
  { first_name: 'Noah', last_name: 'Sanchez', phone: '555-100-2000' },
  { first_name: 'Aria', last_name: 'Morris' },
  { first_name: 'Liam', last_name: 'Rogers', phone: '555-200-3000' },
  { first_name: 'Lily', last_name: 'Reed' },
  { first_name: 'Lucas', last_name: 'Cook', phone: '555-300-4000' },
  { first_name: 'Zoey', last_name: 'Morgan' },
  { first_name: 'Ethan', last_name: 'Bell', phone: '555-400-5000' },
  { first_name: 'Hannah', last_name: 'Murphy' },
  { first_name: 'Mason', last_name: 'Bailey', phone: '555-500-6000' },
  { first_name: 'Layla', last_name: 'Rivera' },
  { first_name: 'Logan', last_name: 'Cooper', phone: '555-600-7000' },
  { first_name: 'Nora', last_name: 'Richardson' },
  { first_name: 'Carter', last_name: 'Cox', phone: '555-700-8000' },
  { first_name: 'Penelope', last_name: 'Howard' },
  { first_name: 'Jackson', last_name: 'Ward', phone: '555-800-9000' },
  { first_name: 'Addison', last_name: 'Torres' },
  { first_name: 'Sebastian', last_name: 'Peterson', phone: '555-900-1000' },
];

const DUMMY_PATIENTS: Patient[] = DUMMY_NAMES.map((_, i) => ({
  id: 9001 + i,
  user_id: 1,
  created_at: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
  updated_at: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}));

function buildDummyBiodataMap(): Record<number, PatientBiodata | null> {
  const map: Record<number, PatientBiodata | null> = {};
  DUMMY_NAMES.forEach((entry, i) => {
    const patientId = 9001 + i;
    map[patientId] = {
      id: i + 1,
      patient_id: patientId,
      first_name: entry.first_name,
      last_name: entry.last_name,
      phone: entry.phone ?? null,
      email: null,
      ...DUMMY_BIODATA_FIELDS,
    };
  });
  return map;
}

const DUMMY_BIODATA_MAP: Record<number, PatientBiodata | null> = buildDummyBiodataMap();

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [biodata, setBiodata] = useState<PatientBiodata | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [planners, setPlanners] = useState<RecordPlanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showAddPatientOptions, setShowAddPatientOptions] = useState(false);
  const [patientViewMode, setPatientViewMode] = useState<'options' | 'detail'>('options');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'biodata' | 'visits' | 'planner'>('overview');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    medications: '',
    previous_surgeries: '',
    family_medical_history: '',
    previous_dental_treatments: '',
    gum_disease_history: '',
    dental_visit_frequency: '',
    oral_hygiene_habits: '',
    dental_trauma_history: '',
    smoking_tobacco_use: '',
    alcohol_consumption: '',
    diet_habits: '',
    insurance_provider: '',
    insurance_policy_number: '',
    consent_forms: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientBiodataMap, setPatientBiodataMap] = useState<Record<number, PatientBiodata | null>>({});
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    if (settingsOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [settingsOpen]);

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientDetails();
    }
  }, [selectedPatient]);

  const displayPatients = patients.length > 0 ? patients : DUMMY_PATIENTS;
  const displayBiodataMap = patients.length > 0 ? patientBiodataMap : DUMMY_BIODATA_MAP;
  const isDummyData = patients.length === 0;

  const getPatientDisplayLabel = (patient: Patient, biodataMap?: Record<number, PatientBiodata | null>): string => {
    const map = biodataMap ?? patientBiodataMap;
    const b = map[patient.id];
    if (b && (b.first_name?.trim() || b.last_name?.trim())) {
      return `${b.first_name?.trim() || ''} ${b.last_name?.trim() || ''}`.trim();
    }
    if (b?.phone?.trim()) return b.phone.trim();
    return `Patient #${patient.id}`;
  };

  const filteredPatients = patientSearchQuery.trim() === ''
    ? displayPatients
    : (() => {
        const q = patientSearchQuery.trim().toLowerCase();
        const qDigits = q.replace(/\D/g, '');
        return displayPatients.filter((p) => {
          const b = displayBiodataMap[p.id];
          const name = b ? `${b.first_name ?? ''} ${b.last_name ?? ''}`.toLowerCase() : '';
          const phone = (b?.phone ?? '').replace(/\D/g, '');
          const matchName = name.includes(q);
          const matchPhone = qDigits && phone && phone.includes(qDigits);
          const matchId = String(p.id).includes(qDigits);
          return matchName || matchPhone || matchId;
        });
      })();

  const loadPatients = async () => {
    if (!user) return;
    try {
      const data = await apiService.getPatientsByUser(user.id);
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0]);
      }
      const map: Record<number, PatientBiodata | null> = {};
      await Promise.all(
        data.map(async (p) => {
          try {
            map[p.id] = await apiService.getBiodata(p.id);
          } catch {
            map[p.id] = null;
          }
        })
      );
      setPatientBiodataMap(map);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientDetails = async () => {
    if (!selectedPatient) return;
    try {
      const [biodataData, visitsData, plannersData] = await Promise.all([
        apiService.getBiodata(selectedPatient.id).catch(() => null),
        apiService.getVisits(selectedPatient.id).catch(() => []),
        apiService.getRecordPlanners(selectedPatient.id).catch(() => []),
      ]);
      setBiodata(biodataData);
      setVisits(visitsData);
      setPlanners(plannersData);
      if (biodataData) {
        setPatientBiodataMap((prev) => ({ ...prev, [selectedPatient.id]: biodataData }));
      }
    } catch (error) {
      console.error('Failed to load patient details:', error);
    }
  };

  const handleCreatePatient = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      alert('First name and last name are required');
      return;
    }

    setFormLoading(true);
    try {
      // Create patient
      const newPatient = await apiService.createPatient(user.id);
      
      // Create biodata if form has data
      try {
        await apiService.createBiodata({
          patient_id: newPatient.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
          gender: formData.gender || null,
          phone: formData.phone || null,
          email: formData.email || null,
          address: formData.address || null,
          occupation: formData.occupation || null,
          emergency_contact_name: formData.emergency_contact_name || null,
          emergency_contact_phone: formData.emergency_contact_phone || null,
          medical_history: formData.medical_history || null,
          allergies: formData.allergies || null,
          medications: formData.medications || null,
          previous_surgeries: formData.previous_surgeries || null,
          family_medical_history: formData.family_medical_history || null,
          previous_dental_treatments: formData.previous_dental_treatments || null,
          gum_disease_history: formData.gum_disease_history || null,
          dental_visit_frequency: formData.dental_visit_frequency || null,
          oral_hygiene_habits: formData.oral_hygiene_habits || null,
          dental_trauma_history: formData.dental_trauma_history || null,
          smoking_tobacco_use: formData.smoking_tobacco_use || null,
          alcohol_consumption: formData.alcohol_consumption || null,
          diet_habits: formData.diet_habits || null,
          insurance_provider: formData.insurance_provider || null,
          insurance_policy_number: formData.insurance_policy_number || null,
          consent_forms: formData.consent_forms || null,
        });
      } catch (biodataError) {
        console.error('Failed to create biodata:', biodataError);
        // Continue even if biodata creation fails
      }
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        occupation: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_history: '',
        allergies: '',
        medications: '',
        previous_surgeries: '',
        family_medical_history: '',
        previous_dental_treatments: '',
        gum_disease_history: '',
        dental_visit_frequency: '',
        oral_hygiene_habits: '',
        dental_trauma_history: '',
        smoking_tobacco_use: '',
        alcohol_consumption: '',
        diet_habits: '',
        insurance_provider: '',
        insurance_policy_number: '',
        consent_forms: '',
      });
      
      // Refresh patients list
      await loadPatients();
      
      // Load biodata for the new patient
      try {
        const biodataData = await apiService.getBiodata(newPatient.id);
        setBiodata(biodataData);
      } catch {
        // Biodata might not exist yet, that's okay
        setBiodata(null);
      }
      
      // Select the new patient
      setSelectedPatient(newPatient);
      setShowNewPatientModal(false);
      setShowAddPatientOptions(false);
    } catch (error) {
      console.error('Failed to create patient:', error);
      alert('Failed to create patient. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetAddPatientForm = () => {
    setShowNewPatientModal(false);
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      occupation: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      medical_history: '',
      allergies: '',
      medications: '',
      previous_surgeries: '',
      family_medical_history: '',
      previous_dental_treatments: '',
      gum_disease_history: '',
      dental_visit_frequency: '',
      oral_hygiene_habits: '',
      dental_trauma_history: '',
      smoking_tobacco_use: '',
      alcohol_consumption: '',
      diet_habits: '',
      insurance_provider: '',
      insurance_policy_number: '',
      consent_forms: '',
    });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    try {
      await apiService.deletePatient(patientToDelete.id);
      
      // If deleted patient was selected, clear selection
      if (selectedPatient?.id === patientToDelete.id) {
        setSelectedPatient(null);
        setBiodata(null);
        setVisits([]);
        setPlanners([]);
      }
      
      // Refresh patient list
      await loadPatients();
      
      // Close confirmation modal
      setShowDeleteConfirm(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Failed to delete patient:', error);
      alert('Failed to delete patient. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page dashboard-loading min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen">
      {/* Header – same theme as home nav */}
      <header className="dashboard-header">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="dashboard-logo">
              <div className="dashboard-logo-mark">🦷</div>
              <h1 className="dashboard-logo-text">Dentique</h1>
            </div>
            <div className="dashboard-settings-wrap" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setSettingsOpen((o) => !o)}
                className="dashboard-btn-settings"
                title="Settings"
                aria-expanded={settingsOpen}
                aria-haspopup="true"
              >
                <Settings className="h-6 w-6" />
              </button>
              {settingsOpen && (
                <div className="dashboard-settings-dropdown">
                  <button
                    type="button"
                    className="dashboard-settings-item"
                    onClick={() => {
                      setSettingsOpen(false);
                      // My Profile – placeholder until profile page exists
                    }}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                  <button
                    type="button"
                    className="dashboard-settings-item"
                    onClick={() => {
                      setSettingsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
        </div>
      </header>

      <div className="w-full flex flex-col lg:flex-row lg:gap-6 py-8 min-h-[calc(100vh-6rem)]">
        {/* Patients card – left edge of page */}
        <aside className="w-full lg:w-[420px] lg:min-w-[380px] lg:max-w-[480px] pl-4 pr-4 lg:pl-4 lg:pr-0 order-1 shrink-0 lg:self-stretch">
            <div className="dashboard-card rounded-lg p-0 overflow-hidden flex flex-col min-h-[300px] max-h-[calc(100vh-6rem)]">
              <div className="p-5 dashboard-card-header flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold dashboard-text-heading flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Patients
                </h2>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setShowAddPatientOptions(true);
                  }}
                  className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                  title="Add Patient"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 border-b border-cream-deeper flex-shrink-0">
                <div className="dashboard-patient-search-wrap">
                  <Search className="dashboard-patient-search-icon" aria-hidden />
                  <input
                    type="text"
                    placeholder="Search by name or number..."
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    className="dashboard-patient-search-input"
                  />
                </div>
              </div>
              <div className="divide-y divide-cream-deeper overflow-y-auto flex-1 min-h-0 overscroll-contain">
                {!isDummyData && patients.length === 0 ? (
                  <div className="p-6 text-center dashboard-text-muted text-base">
                    No patients yet. Click + to add one.
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="p-6 text-center dashboard-text-muted text-base">
                    No patients match your search.
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`group relative w-full hover:bg-cream-dark transition ${
                        selectedPatient?.id === patient.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientViewMode('options');
                        }}
                        className="w-full text-left p-5 pr-14 flex items-center justify-between gap-3"
                      >
                        <p className="font-medium dashboard-text-heading truncate text-xl flex-1 min-w-0">
                          {getPatientDisplayLabel(patient, displayBiodataMap)}
                        </p>
                        <span className="text-sm dashboard-text-muted flex-shrink-0">
                          {new Date(patient.created_at).toLocaleDateString()}
                        </span>
                        <ChevronRight className="h-5 w-5 dashboard-text-muted flex-shrink-0" />
                      </button>
                      {!isDummyData && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(patient);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition"
                          title="Delete patient"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 order-2 flex flex-col items-stretch min-h-0">
          {selectedPatient && patientViewMode === 'options' ? (
            <div className="w-full flex-shrink-0">
              <div className="dashboard-card rounded-lg overflow-hidden w-full">
                <div className="p-6 dashboard-card-header flex items-center justify-between bg-white">
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="add-patient-header-back flex items-center gap-2 dashboard-text-body hover:text-forest font-semibold"
                  >
                    <ChevronLeft className="h-7 w-7" />
                    Back
                  </button>
                  <h3 className="add-patient-header-title text-2xl font-semibold dashboard-text-heading">
                    {getPatientDisplayLabel(selectedPatient, displayBiodataMap)}
                  </h3>
                  <div className="w-20" />
                </div>
                <div className="p-6">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setPatientViewMode('detail')}
                      className="add-patient-option"
                    >
                      <FileText className="h-8 w-8 flex-shrink-0" />
                      <span>Patient Biodata</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Image className="h-8 w-8 flex-shrink-0" />
                      <span>Intraoral pictures</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Scan className="h-8 w-8 flex-shrink-0" />
                      <span>Xray</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Calendar className="h-8 w-8 flex-shrink-0" />
                      <span>Visit Information</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Bell className="h-8 w-8 flex-shrink-0" />
                      <span>Reminder</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedPatient && patientViewMode === 'detail' ? (
          <div className="max-w-4xl">
              <div className="dashboard-card rounded-lg p-0 overflow-hidden">
                {/* Patient Header */}
                <div className="p-6 dashboard-card-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {biodata
                          ? `${biodata.first_name} ${biodata.last_name}`
                          : `Patient #${selectedPatient.id}`}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Patient ID: {selectedPatient.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPatientViewMode('options')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </button>
                      <button
                        onClick={() => handleDeleteClick(selectedPatient)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete patient"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4 flex space-x-1 border-b border-gray-200">
                    {[
                      { id: 'overview', label: 'Overview', icon: FileText },
                      { id: 'biodata', label: 'Biodata', icon: Users },
                      { id: 'visits', label: 'Visits', icon: Calendar },
                      { id: 'planner', label: 'Planner', icon: Calendar },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition ${
                          activeTab === tab.id
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Total Visits</p>
                          <p className="text-2xl font-bold text-primary-600">{visits.length}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Active Plans</p>
                          <p className="text-2xl font-bold text-green-600">
                            {planners.filter((p) => p.status === 'planned').length}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">Completed Plans</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {planners.filter((p) => p.status === 'completed').length}
                          </p>
                        </div>
                      </div>

                      {biodata && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Info</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{biodata.email || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{biodata.phone || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {visits.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Visits</h3>
                          <div className="space-y-2">
                            {visits.slice(0, 3).map((visit) => (
                              <div
                                key={visit.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {new Date(visit.visit_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">{visit.visit_type || 'General Visit'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'biodata' && (
                    <div>
                      {biodata ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">First Name</label>
                              <p className="mt-1 text-gray-900">{biodata.first_name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Last Name</label>
                              <p className="mt-1 text-gray-900">{biodata.last_name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                              <p className="mt-1 text-gray-900">
                                {biodata.date_of_birth
                                  ? new Date(biodata.date_of_birth).toLocaleDateString()
                                  : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Gender</label>
                              <p className="mt-1 text-gray-900">{biodata.gender || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <p className="mt-1 text-gray-900">{biodata.email || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Phone</label>
                              <p className="mt-1 text-gray-900">{biodata.phone || 'N/A'}</p>
                            </div>
                          </div>
                          {biodata.address && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Address</label>
                              <p className="mt-1 text-gray-900">{biodata.address}</p>
                            </div>
                          )}
                          {biodata.medical_history && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Medical History</label>
                              <p className="mt-1 text-gray-900">{biodata.medical_history}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No biodata available for this patient.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'visits' && (
                    <div>
                      {visits.length > 0 ? (
                        <div className="space-y-4">
                          {visits.map((visit) => (
                            <div
                              key={visit.id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-5 w-5 text-primary-600" />
                                    <p className="font-semibold text-gray-900">
                                      {new Date(visit.visit_date).toLocaleDateString()}
                                    </p>
                                    {visit.visit_type && (
                                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                                        {visit.visit_type}
                                      </span>
                                    )}
                                  </div>
                                  {visit.chief_complaint && (
                                    <p className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium">Chief Complaint:</span> {visit.chief_complaint}
                                    </p>
                                  )}
                                  {visit.diagnosis && (
                                    <p className="text-sm text-gray-700 mb-2">
                                      <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                                    </p>
                                  )}
                                  {visit.treatment_performed && (
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Treatment:</span> {visit.treatment_performed}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No visits recorded for this patient.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'planner' && (
                    <div>
                      {planners.length > 0 ? (
                        <div className="space-y-4">
                          {planners.map((planner) => (
                            <div
                              key={planner.id}
                              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">{planner.title}</h4>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded ${
                                        planner.status === 'completed'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                    >
                                      {planner.status}
                                    </span>
                                  </div>
                                  {planner.description && (
                                    <p className="text-sm text-gray-700 mb-2">{planner.description}</p>
                                  )}
                                  {planner.planned_date && (
                                    <p className="text-xs text-gray-500">
                                      Planned: {new Date(planner.planned_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No planned records for this patient.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
          </div>
          ) : showAddPatientOptions && !showNewPatientModal ? (
            <div className="w-full flex-shrink-0">
              <div className="dashboard-card rounded-lg overflow-hidden w-full">
                <div className="p-6 dashboard-card-header flex items-center justify-between bg-white">
                  <button
                    type="button"
                    onClick={() => setShowAddPatientOptions(false)}
                    className="add-patient-header-back flex items-center gap-2 dashboard-text-body hover:text-forest font-semibold"
                  >
                    <ChevronLeft className="h-7 w-7" />
                    Back
                  </button>
                  <h3 className="add-patient-header-title text-2xl font-semibold dashboard-text-heading">Add Patient</h3>
                  <div className="w-20" />
                </div>
                <div className="p-6">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setShowNewPatientModal(true)}
                      className="add-patient-option"
                    >
                      <FileText className="h-8 w-8 flex-shrink-0" />
                      <span>Create Patient Biodata</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Image className="h-8 w-8 flex-shrink-0" />
                      <span>Upload Intraoral Pictures</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Scan className="h-8 w-8 flex-shrink-0" />
                      <span>Upload X rays</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Calendar className="h-8 w-8 flex-shrink-0" />
                      <span>Add Visit Information</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                    <button
                      type="button"
                      className="add-patient-option add-patient-option-disabled"
                      disabled
                      title="Coming soon"
                    >
                      <Bell className="h-8 w-8 flex-shrink-0" />
                      <span>Set Appointment reminder</span>
                      <ChevronRight className="h-7 w-7 flex-shrink-0 dashboard-text-muted" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : showNewPatientModal ? (
            <div className="w-full flex-shrink-0">
              <div className="dashboard-card rounded-lg overflow-hidden w-full">
                <div className="p-6 dashboard-card-header flex items-center justify-between bg-white">
                  <h3 className="text-2xl font-semibold dashboard-text-heading">Create New Patient</h3>
                  <button
                    type="button"
                    onClick={resetAddPatientForm}
                    className="p-2.5 dashboard-text-muted hover:bg-cream-dark rounded-lg transition"
                    aria-label="Cancel"
                  >
                    <X className="h-7 w-7" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
                  <form onSubmit={(e) => { e.preventDefault(); handleCreatePatient(); }} className="dashboard-form">
                    <div className="space-y-6">
                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Basic Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="first_name" className="dashboard-form-label">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              name="first_name"
                              required
                              value={formData.first_name}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="dashboard-form-label">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              name="last_name"
                              required
                              value={formData.last_name}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="date_of_birth" className="dashboard-form-label">Date of Birth</label>
                            <input
                              type="date"
                              id="date_of_birth"
                              name="date_of_birth"
                              value={formData.date_of_birth}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                            />
                          </div>
                          <div>
                            <label id="gender-label" className="dashboard-form-label">Gender</label>
                            <ThemeSelect
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleFormChange}
                              options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                                { value: 'Prefer not to say', label: 'Prefer not to say' },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="phone" className="dashboard-form-label">Phone</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="dashboard-form-label">Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="patient@example.com"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="address" className="dashboard-form-label">Address</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="123 Main St, City, State, ZIP"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="occupation" className="dashboard-form-label">Occupation</label>
                            <input
                              type="text"
                              id="occupation"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="e.g., Software Engineer, Teacher, etc."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Emergency Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="emergency_contact_name" className="dashboard-form-label">Contact Name</label>
                            <input
                              type="text"
                              id="emergency_contact_name"
                              name="emergency_contact_name"
                              value={formData.emergency_contact_name}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="Jane Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="emergency_contact_phone" className="dashboard-form-label">Contact Phone</label>
                            <input
                              type="tel"
                              id="emergency_contact_phone"
                              name="emergency_contact_phone"
                              value={formData.emergency_contact_phone}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="+1 (555) 987-6543"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Medical History</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="medical_history" className="dashboard-form-label">Current and Past Illnesses</label>
                            <textarea
                              id="medical_history"
                              name="medical_history"
                              rows={3}
                              value={formData.medical_history}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="e.g., diabetes, heart disease, hypertension, etc."
                            />
                          </div>
                          <div>
                            <label htmlFor="medications" className="dashboard-form-label">Current Medications</label>
                            <textarea
                              id="medications"
                              name="medications"
                              rows={2}
                              value={formData.medications}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Current medications and dosages"
                            />
                          </div>
                          <div>
                            <label htmlFor="allergies" className="dashboard-form-label">Allergies</label>
                            <textarea
                              id="allergies"
                              name="allergies"
                              rows={2}
                              value={formData.allergies}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Known allergies (especially to medications)"
                            />
                          </div>
                          <div>
                            <label htmlFor="previous_surgeries" className="dashboard-form-label">Previous Surgeries</label>
                            <textarea
                              id="previous_surgeries"
                              name="previous_surgeries"
                              rows={2}
                              value={formData.previous_surgeries}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="List any previous surgeries"
                            />
                          </div>
                          <div>
                            <label htmlFor="family_medical_history" className="dashboard-form-label">Family Medical History</label>
                            <textarea
                              id="family_medical_history"
                              name="family_medical_history"
                              rows={2}
                              value={formData.family_medical_history}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Family medical history relevant to dental care"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Dental History</h4>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="previous_dental_treatments" className="dashboard-form-label">Previous Dental Treatments</label>
                            <textarea
                              id="previous_dental_treatments"
                              name="previous_dental_treatments"
                              rows={2}
                              value={formData.previous_dental_treatments}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="e.g., fillings, extractions, braces, implants"
                            />
                          </div>
                          <div>
                            <label htmlFor="gum_disease_history" className="dashboard-form-label">History of Gum Disease or Oral Infections</label>
                            <textarea
                              id="gum_disease_history"
                              name="gum_disease_history"
                              rows={2}
                              value={formData.gum_disease_history}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Any history of gum disease or oral infections"
                            />
                          </div>
                          <div>
                            <label id="dental_visit_frequency-label" className="dashboard-form-label">Frequency of Dental Visits</label>
                            <ThemeSelect
                              id="dental_visit_frequency"
                              name="dental_visit_frequency"
                              value={formData.dental_visit_frequency}
                              onChange={handleFormChange}
                              options={[
                                { value: 'Every 3 months', label: 'Every 3 months' },
                                { value: 'Every 6 months', label: 'Every 6 months' },
                                { value: 'Annually', label: 'Annually' },
                                { value: 'Every 2 years', label: 'Every 2 years' },
                                { value: 'Rarely/Never', label: 'Rarely/Never' },
                                { value: 'Only when needed', label: 'Only when needed' },
                              ]}
                            />
                          </div>
                          <div>
                            <label htmlFor="oral_hygiene_habits" className="dashboard-form-label">Oral Hygiene Habits</label>
                            <textarea
                              id="oral_hygiene_habits"
                              name="oral_hygiene_habits"
                              rows={2}
                              value={formData.oral_hygiene_habits}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Brushing, flossing, mouthwash use, etc."
                            />
                          </div>
                          <div>
                            <label htmlFor="dental_trauma_history" className="dashboard-form-label">History of Dental Trauma</label>
                            <textarea
                              id="dental_trauma_history"
                              name="dental_trauma_history"
                              rows={2}
                              value={formData.dental_trauma_history}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Any history of dental trauma or injuries"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Lifestyle & Habits</h4>
                        <div className="space-y-4">
                          <div>
                            <label id="smoking_tobacco_use-label" className="dashboard-form-label">Smoking or Tobacco Use</label>
                            <ThemeSelect
                              id="smoking_tobacco_use"
                              name="smoking_tobacco_use"
                              value={formData.smoking_tobacco_use}
                              onChange={handleFormChange}
                              options={[
                                { value: 'Never', label: 'Never' },
                                { value: 'Former smoker', label: 'Former smoker' },
                                { value: 'Occasional', label: 'Occasional' },
                                { value: 'Daily', label: 'Daily' },
                                { value: 'Other tobacco products', label: 'Other tobacco products' },
                              ]}
                            />
                          </div>
                          <div>
                            <label id="alcohol_consumption-label" className="dashboard-form-label">Alcohol Consumption</label>
                            <ThemeSelect
                              id="alcohol_consumption"
                              name="alcohol_consumption"
                              value={formData.alcohol_consumption}
                              onChange={handleFormChange}
                              options={[
                                { value: 'Never', label: 'Never' },
                                { value: 'Occasional', label: 'Occasional' },
                                { value: 'Moderate', label: 'Moderate' },
                                { value: 'Regular', label: 'Regular' },
                              ]}
                            />
                          </div>
                          <div>
                            <label htmlFor="diet_habits" className="dashboard-form-label">Diet Habits Affecting Oral Health</label>
                            <textarea
                              id="diet_habits"
                              name="diet_habits"
                              rows={2}
                              value={formData.diet_habits}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="e.g., sugary foods, acidic drinks, etc."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="dashboard-form-section">
                        <h4 className="dashboard-form-section-title">Insurance / Administrative</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="insurance_provider" className="dashboard-form-label">Insurance Provider</label>
                            <input
                              type="text"
                              id="insurance_provider"
                              name="insurance_provider"
                              value={formData.insurance_provider}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="e.g., Delta Dental, Cigna"
                            />
                          </div>
                          <div>
                            <label htmlFor="insurance_policy_number" className="dashboard-form-label">Policy Number</label>
                            <input
                              type="text"
                              id="insurance_policy_number"
                              name="insurance_policy_number"
                              value={formData.insurance_policy_number}
                              onChange={handleFormChange}
                              className="dashboard-form-input"
                              placeholder="Insurance policy number"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="consent_forms" className="dashboard-form-label">Consent Forms & Notes</label>
                            <textarea
                              id="consent_forms"
                              name="consent_forms"
                              rows={2}
                              value={formData.consent_forms}
                              onChange={handleFormChange}
                              className="dashboard-form-input dashboard-form-textarea w-full"
                              placeholder="Notes about consent forms, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t border-cream-deeper">
                      <button
                        type="button"
                        onClick={resetAddPatientForm}
                        className="dashboard-form-btn-cancel flex-1"
                        disabled={formLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="dashboard-form-btn-submit flex-1"
                      >
                        {formLoading ? 'Creating...' : 'Create Patient'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex-shrink-0">
              <div className="dashboard-card p-12 text-center w-full">
                <Users className="h-20 w-20 mx-auto mb-5 dashboard-text-muted" />
                <h3 className="text-2xl font-semibold dashboard-text-heading mb-3">No Patient Selected</h3>
                <p className="dashboard-text-body mb-6 text-lg">Select a patient from the list or create a new one.</p>
                <button
                  onClick={() => setShowAddPatientOptions(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-lg bg-forest text-cream rounded-lg hover:bg-forest-mid transition font-semibold"
                >
                  <Plus className="h-6 w-6" />
                  Add Patient
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Patient</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {biodata && biodata.patient_id === patientToDelete.id
                    ? `${biodata.first_name} ${biodata.last_name}`
                    : `Patient #${patientToDelete.id}`}
                </span>
                ? This will permanently delete all patient data including biodata, visits, and records.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPatientToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
