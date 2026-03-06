import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashbaordPage';
import PatientsPage from './pages/patient/PatientsPage';
import DoctorsPage from './pages/doctor/DoctorsPage';
// Simple placeholders for pages you haven't built yet
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
        {/* 1. When the user opens the site, redirect them to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 2. Dashboard Routes wrapped in the Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* This is the main content (stats, banner, etc.) */}
          <Route index element={<DashboardPage />} />
          
          {/* Sub-pages: These show up inside the same Sidebar/Header layout */}
          <Route path="patients" element={<PatientsPage />} />
          <Route path="doctors" element={<DoctorsPage/>} />
          <Route path="appointments" element={<Placeholder name="Appointments" />} />
          <Route path="lab" element={<Placeholder name="Lab Results" />} />
          <Route path="prescriptions" element={<Placeholder name="Prescriptions" />} />
          <Route path="departments" element={<Placeholder name="Departments" />} />
          <Route path="records" element={<Placeholder name="Medical Records" />} />
        </Route>

        {/* 3. Catch-all for 404 errors */}
        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;