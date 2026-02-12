import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { LogOut, Users, Plus, Calendar, FileText, X, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';
import type { Patient, PatientBiodata, Visit, RecordPlanner } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [biodata, setBiodata] = useState<PatientBiodata | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [planners, setPlanners] = useState<RecordPlanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
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

  const loadPatients = async () => {
    if (!user) return;
    try {
      const data = await apiService.getPatientsByUser(user.id);
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0]);
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DentalDesk</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.firstname} {user?.lastname}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patients
                </h2>
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                  title="Add Patient"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {patients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No patients yet. Click + to add one.
                  </div>
                ) : (
                  patients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`group relative w-full hover:bg-gray-50 transition ${
                        selectedPatient?.id === patient.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="w-full text-left p-4 pr-12 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {biodata && biodata.patient_id === patient.id
                              ? `${biodata.first_name} ${biodata.last_name}`
                              : `Patient #${patient.id}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(patient.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(patient);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Delete patient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Patient Header */}
                <div className="p-6 border-b border-gray-200">
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
                    <button
                      onClick={() => handleDeleteClick(selectedPatient)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Delete patient"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patient Selected</h3>
                <p className="text-gray-600 mb-4">Select a patient from the list or create a new one.</p>
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  Add Patient
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">Create New Patient</h3>
              <button
                onClick={() => {
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
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePatient(); }}>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="patient@example.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="123 Main St, City, State, ZIP"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          type="text"
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., Software Engineer, Teacher, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          id="emergency_contact_name"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="emergency_contact_phone"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Medical History</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="medical_history" className="block text-sm font-medium text-gray-700 mb-2">
                          Current and Past Illnesses
                        </label>
                        <textarea
                          id="medical_history"
                          name="medical_history"
                          rows={3}
                          value={formData.medical_history}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., diabetes, heart disease, hypertension, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                          Current Medications
                        </label>
                        <textarea
                          id="medications"
                          name="medications"
                          rows={2}
                          value={formData.medications}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Current medications and dosages"
                        />
                      </div>
                      <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                          Allergies
                        </label>
                        <textarea
                          id="allergies"
                          name="allergies"
                          rows={2}
                          value={formData.allergies}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Known allergies (especially to medications like antibiotics or anesthetics)"
                        />
                      </div>
                      <div>
                        <label htmlFor="previous_surgeries" className="block text-sm font-medium text-gray-700 mb-2">
                          Previous Surgeries
                        </label>
                        <textarea
                          id="previous_surgeries"
                          name="previous_surgeries"
                          rows={2}
                          value={formData.previous_surgeries}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="List any previous surgeries"
                        />
                      </div>
                      <div>
                        <label htmlFor="family_medical_history" className="block text-sm font-medium text-gray-700 mb-2">
                          Family Medical History
                        </label>
                        <textarea
                          id="family_medical_history"
                          name="family_medical_history"
                          rows={2}
                          value={formData.family_medical_history}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Family medical history relevant to dental care"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dental History */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Dental History</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="previous_dental_treatments" className="block text-sm font-medium text-gray-700 mb-2">
                          Previous Dental Treatments
                        </label>
                        <textarea
                          id="previous_dental_treatments"
                          name="previous_dental_treatments"
                          rows={2}
                          value={formData.previous_dental_treatments}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., fillings, extractions, braces, implants, root canals, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="gum_disease_history" className="block text-sm font-medium text-gray-700 mb-2">
                          History of Gum Disease or Oral Infections
                        </label>
                        <textarea
                          id="gum_disease_history"
                          name="gum_disease_history"
                          rows={2}
                          value={formData.gum_disease_history}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Any history of gum disease, gingivitis, periodontitis, or oral infections"
                        />
                      </div>
                      <div>
                        <label htmlFor="dental_visit_frequency" className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency of Dental Visits
                        </label>
                        <select
                          id="dental_visit_frequency"
                          name="dental_visit_frequency"
                          value={formData.dental_visit_frequency}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Every 3 months">Every 3 months</option>
                          <option value="Every 6 months">Every 6 months</option>
                          <option value="Annually">Annually</option>
                          <option value="Every 2 years">Every 2 years</option>
                          <option value="Rarely/Never">Rarely/Never</option>
                          <option value="Only when needed">Only when needed</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="oral_hygiene_habits" className="block text-sm font-medium text-gray-700 mb-2">
                          Oral Hygiene Habits
                        </label>
                        <textarea
                          id="oral_hygiene_habits"
                          name="oral_hygiene_habits"
                          rows={2}
                          value={formData.oral_hygiene_habits}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Brushing frequency, flossing habits, mouthwash use, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="dental_trauma_history" className="block text-sm font-medium text-gray-700 mb-2">
                          History of Dental Trauma
                        </label>
                        <textarea
                          id="dental_trauma_history"
                          name="dental_trauma_history"
                          rows={2}
                          value={formData.dental_trauma_history}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Any history of dental trauma or injuries"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle & Habits */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Lifestyle & Habits</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="smoking_tobacco_use" className="block text-sm font-medium text-gray-700 mb-2">
                          Smoking or Tobacco Use
                        </label>
                        <select
                          id="smoking_tobacco_use"
                          name="smoking_tobacco_use"
                          value={formData.smoking_tobacco_use}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Never">Never</option>
                          <option value="Former smoker">Former smoker</option>
                          <option value="Occasional">Occasional</option>
                          <option value="Daily">Daily</option>
                          <option value="Other tobacco products">Other tobacco products</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="alcohol_consumption" className="block text-sm font-medium text-gray-700 mb-2">
                          Alcohol Consumption
                        </label>
                        <select
                          id="alcohol_consumption"
                          name="alcohol_consumption"
                          value={formData.alcohol_consumption}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Never">Never</option>
                          <option value="Occasional">Occasional</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Regular">Regular</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="diet_habits" className="block text-sm font-medium text-gray-700 mb-2">
                          Diet Habits Affecting Oral Health
                        </label>
                        <textarea
                          id="diet_habits"
                          name="diet_habits"
                          rows={2}
                          value={formData.diet_habits}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., frequent consumption of sugary foods, acidic drinks, carbonated beverages, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insurance / Administrative */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Insurance / Administrative Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="insurance_provider" className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Provider
                        </label>
                        <input
                          type="text"
                          id="insurance_provider"
                          name="insurance_provider"
                          value={formData.insurance_provider}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., Delta Dental, Cigna, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700 mb-2">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="insurance_policy_number"
                          name="insurance_policy_number"
                          value={formData.insurance_policy_number}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Insurance policy number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="consent_forms" className="block text-sm font-medium text-gray-700 mb-2">
                          Consent Forms & Notes
                        </label>
                        <textarea
                          id="consent_forms"
                          name="consent_forms"
                          rows={2}
                          value={formData.consent_forms}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Notes about consent forms, special permissions, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Creating...' : 'Create Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
