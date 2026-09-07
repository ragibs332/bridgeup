import React from 'react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import {
  Menu,
  X,
  Bell,
  User,
  Building2,
  ShieldCheck,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const {
    currentRole,
    currentUser,
    currentNgo,
    isDrawerOpen,
    setIsDrawerOpen,
    logout,
    incidents,
    ngos,
    adoptions,
    disputes,
    setActiveUserTab,
    setActiveNgoTab,
    setActiveAdminTab
  } = useApp();

  const reportedCount = incidents.filter(i => i.status === 'Reported').length;
  const pendingNgoCount = ngos.filter(n => n.verificationStatus === 'pending').length;
  const pendingAdopCount = adoptions.filter(a => a.status === 'Pending Admin Review').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: 3-Pin / Hamburger Drawer Trigger for ALL Roles + Logo */}
        <div className="flex items-center gap-3">
          {currentRole !== 'guest' && (
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-brand-teal-900 hover:bg-slate-100 transition-all border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-600 flex items-center justify-center group"
              aria-label="Toggle Navigation Drawer (3-Pin Pattern)"
              title="Open Role Dashboard Menu (3 Pins)"
            >
              {isDrawerOpen ? (
                <X className="w-5 h-5 text-brand-teal-800" />
              ) : (
                <div className="flex flex-col gap-1 items-center justify-center w-5 h-5">
                  <span className="w-4 h-0.5 bg-brand-teal-800 rounded-full group-hover:bg-brand-amber-500 transition-colors"></span>
                  <span className="w-4 h-0.5 bg-brand-teal-800 rounded-full group-hover:bg-brand-mint-500 transition-colors"></span>
                  <span className="w-4 h-0.5 bg-brand-teal-800 rounded-full group-hover:bg-brand-teal-600 transition-colors"></span>
                </div>
              )}
            </button>
          )}

          <div
            className="cursor-pointer flex items-center"
            onClick={() => {
              if (currentRole === 'user') setActiveUserTab('dashboard');
              if (currentRole === 'ngo') setActiveNgoTab('dashboard');
              if (currentRole === 'admin') setActiveAdminTab('dashboard');
            }}
          >
            <Logo size="md" />
          </div>
        </div>

        {/* Center / Role Badge */}
        <div className="hidden md:flex items-center gap-2">
          {currentRole === 'user' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-mint-500 animate-pulse"></span>
              <span>Citizen & Donor Space</span>
            </div>
          )}

          {currentRole === 'ngo' && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              currentNgo.verificationStatus === 'verified'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentNgo.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${
                currentNgo.verificationStatus === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white animate-pulse'
              }`}>
                {currentNgo.verificationStatus === 'verified' ? 'Verified NGO' : 'Verification Pending'}
              </span>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Super Admin Governance</span>
            </div>
          )}
        </div>

        {/* Right Section: Dark Mode Toggle, Notifications & Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Mode Toggle Button in Top Right Corner */}
          <ThemeToggle showLabel={false} />

          {/* Notifications / Alert Indicator */}
          {currentRole !== 'guest' && (
            <div className="relative">
              <button
                onClick={() => {
                  if (currentRole === 'user') setActiveUserTab('incident-report');
                  if (currentRole === 'ngo') setActiveNgoTab('incident-solver');
                  if (currentRole === 'admin') setActiveAdminTab('ngo-verification');
                }}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-teal-900 dark:hover:text-brand-mint-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {currentRole === 'admin' && pendingNgoCount > 0 ? (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-amber-500 text-[10px] font-bold text-white shadow-sm">
                    {pendingNgoCount}
                  </span>
                ) : reportedCount > 0 ? (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-amber-500 text-[10px] font-bold text-white shadow-sm">
                    {reportedCount}
                  </span>
                ) : null}
              </button>
            </div>
          )}

          {/* User Profile Pill */}
          {currentRole === 'user' && currentUser && (
            <button
              onClick={() => setActiveUserTab('profile')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-teal-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name || 'Citizen'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-teal-600"
              />
              <span className="hidden sm:inline font-semibold">{currentUser.name?.split(' ')[0] || 'Citizen'}</span>
            </button>
          )}

          {/* NGO Profile Pill */}
          {currentRole === 'ngo' && (
            <button
              onClick={() => setActiveNgoTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <img
                src={currentNgo.logo}
                alt={currentNgo.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-600"
              />
              <span className="hidden sm:inline font-semibold truncate max-w-[100px]">{currentNgo.name}</span>
            </button>
          )}

          {/* Logout Button */}
          {currentRole !== 'guest' && (
            <button
              onClick={logout}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
              title="Logout / Return to Landing"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
