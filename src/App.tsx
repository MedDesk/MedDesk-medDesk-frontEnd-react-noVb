import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/admin/dashboard/DashbaordPage';
import PatientsPage from './pages/admin/patient/PatientsPage';
import DoctorsPage from './pages/admin/doctor/DoctorsPage';
import WorkingHoursPage from './pages/wokringHours/WokringHoursPage';
import AppointmentsPage from './pages/admin/appointments/AppointmentsPage';
import MedicalRecordsListPage from './pages/admin/medicalRecords/MedicalRecordsListPage';
import MedicalRecordDetails from './pages/admin/medicalRecords/MedicalRecordDetails';
import PatientDetails from './pages/admin/patient/PatientDetails';
import DoctorDetails from './pages/admin/doctor/DoctorDetails';
import DisplayAppointments from './pages/admin/displayAppointments/DisplayAppointments';
import UsersListPage from './pages/admin/usres/UsersListPage';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'; // Make sure this import exists
import MyProfilePage from './pages/admin/Profile/MyPrfilePage';

// --- GUARD COMPONENTS ---

// 1. Public Route: Only accessible if NOT logged in (Login/Register)
const PublicRoute = () => {
  const token = localStorage.getItem('accessToken');
  // If token exists, user is already logged in, send them to dashboard
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// 2. Protected Route: Only accessible if logged in (Dashboard)
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  // If no token, user is not logged in, send them to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Placeholder for missing pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-slate-800">{name} Page</h1>
    <p className="text-slate-500 mt-2">This component is coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ACCESS --- */}
        <Route path="/" element={<HomePage />} />

        {/* --- GUEST ONLY (Redirects to dashboard if logged in) --- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* --- PROTECTED ROUTES (Redirects to login if logged out) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorDetails />} />
            <Route path="working-hours" element={<WorkingHoursPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="appointments-display" element={<DisplayAppointments />} />
            <Route path="medical-records" element={<MedicalRecordsListPage />} />
            <Route path="medical-records/:id" element={<MedicalRecordDetails />} />
            <Route path="lab" element={<Placeholder name="Lab Results" />} />
            <Route path="prescriptions" element={<Placeholder name="Prescriptions" />} />
            <Route path="departments" element={<Placeholder name="Departments" />} />
            <Route path="records" element={<Placeholder name="Medical Records" />} />
            <Route path='profile' element = {<MyProfilePage/>} />
          </Route>
        </Route>

        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;