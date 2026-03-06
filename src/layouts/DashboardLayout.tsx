import { Outlet } from 'react-router-dom';
import Sidebar from '../components/commun/sidbar/Sidebar';
import Header from '../components/commun/header/Header';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}