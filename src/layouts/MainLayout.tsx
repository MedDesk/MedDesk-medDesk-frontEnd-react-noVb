import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';

/**
 * MainLayout
 * Used for public pages like landing page and authentication pages.
 * Includes optional Header and Footer.
 */
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header can be added here if needed for public pages */}
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer can be added here if needed for public pages */}
    </div>
  );
};

export default MainLayout;
