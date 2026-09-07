import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import DrawerMenu from './components/common/DrawerMenu';
import Chatbot from './components/common/Chatbot';
import QuickRoleSwitch from './components/common/QuickRoleSwitch';
import ToastContainer from './components/common/ToastContainer';
import MobileBottomNav from './components/common/MobileBottomNav';
import HomeLanding from './components/home/HomeLanding';
import Ambient3DBackground from './components/3d/Ambient3DBackground';

// User Views
import UserDashboard from './components/user/UserDashboard';
import UserProfile from './components/user/UserProfile';
import IncidentReport from './components/user/IncidentReport';
import DonationPortal from './components/user/DonationPortal';
import AdoptionPortal from './components/user/AdoptionPortal';
import VolunteerHub from './components/user/VolunteerHub';

// NGO Views
import NgoDashboard from './components/ngo/NgoDashboard';
import NgoProfile from './components/ngo/NgoProfile';
import IncidentSolver from './components/ngo/IncidentSolver';
import NgoCampaigns from './components/ngo/NgoCampaigns';
import NgoRequirements from './components/ngo/NgoRequirements';
import NgoAdoptions from './components/ngo/NgoAdoptions';

// Admin Views
import AdminDashboard from './components/admin/AdminDashboard';
import NgoVerification from './components/admin/NgoVerification';
import IncidentModeration from './components/admin/IncidentModeration';
import AdoptionApprovals from './components/admin/AdoptionApprovals';
import DisputeCenter from './components/admin/DisputeCenter';
import PlatformAnalytics from './components/admin/PlatformAnalytics';

function MainContent() {
  const {
    currentRole,
    activeUserTab,
    activeNgoTab,
    activeAdminTab
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative transition-colors duration-200">
      {/* Ambient 3D Floating Geometry Atmosphere */}
      <Ambient3DBackground />

      {/* If Guest, render World-Class Professional Home & Landing Portal */}
      {currentRole === 'guest' ? (
        <HomeLanding />
      ) : (
        <>
          {/* Top Main Navbar with Left 3-Pin Pattern Trigger for All Roles */}
          <Navbar />

          {/* Unified 3-Pin Sliding Drawer Menu for User, NGO, and Admin */}
          <DrawerMenu />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full relative z-10">
            {/* User Content Routing */}
            {currentRole === 'user' && (
              <>
                {activeUserTab === 'dashboard' && <UserDashboard />}
                {activeUserTab === 'profile' && <UserProfile />}
                {activeUserTab === 'incident-report' && <IncidentReport />}
                {activeUserTab === 'donations' && <DonationPortal />}
                {activeUserTab === 'adoptions' && <AdoptionPortal />}
                {activeUserTab === 'volunteers' && <VolunteerHub />}
              </>
            )}

            {/* NGO Content Routing */}
            {currentRole === 'ngo' && (
              <>
                {activeNgoTab === 'dashboard' && <NgoDashboard />}
                {activeNgoTab === 'incident-solver' && <IncidentSolver />}
                {activeNgoTab === 'campaigns' && <NgoCampaigns />}
                {activeNgoTab === 'requirements' && <NgoRequirements />}
                {activeNgoTab === 'adoptions' && <NgoAdoptions />}
                {activeNgoTab === 'profile' && <NgoProfile />}
              </>
            )}

            {/* Admin Content Routing */}
            {currentRole === 'admin' && (
              <>
                {activeAdminTab === 'dashboard' && <AdminDashboard />}
                {activeAdminTab === 'ngo-verification' && <NgoVerification />}
                {activeAdminTab === 'incident-moderation' && <IncidentModeration />}
                {activeAdminTab === 'adoption-approvals' && <AdoptionApprovals />}
                {activeAdminTab === 'disputes' && <DisputeCenter />}
                {activeAdminTab === 'analytics' && <PlatformAnalytics />}
              </>
            )}
          </main>
        </>
      )}

      {/* Dedicated Floating Chatbot Assistant in Bottom-Left Corner (Always Active on All Screens) */}
      <Chatbot />

      {/* Demo Role Switcher Dock for Instant Presentation */}
      <QuickRoleSwitch />

      {/* Mobile-First Responsive Bottom Navigation */}
      <MobileBottomNav />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return <MainContent />;
}
