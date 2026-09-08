import React, { useState } from 'react';
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
  ChevronDown,
  RefreshCw,
  Layers
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
    loginAsUser,
    loginAsNgo,
    loginAsAdmin,
    selectCurrentNgo,
    resetDemoData,
    setActiveUserTab,
    setActiveNgoTab,
    setActiveAdminTab,
    isCloudSynced
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const reportedCount = incidents.filter(i => i.status === 'Reported').length;
  const pendingNgoCount = ngos.filter(n => n.verificationStatus === 'pending').length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Drawer Menu Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          {currentRole !== 'guest' && (
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center group"
              aria-label="Toggle Navigation Drawer"
            >
              {isDrawerOpen ? (
                <X className="w-5 h-5 text-brand-teal-800 dark:text-brand-mint-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
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

        {/* Center Section: Integrated Role Switcher & Cloud Sync Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Role Switcher Pills */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => loginAsUser()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'user'
                  ? 'bg-brand-teal-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => loginAsNgo(currentNgo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'ngo'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO</span>
            </button>

            <button
              onClick={() => loginAsAdmin()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentRole === 'admin'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Cloud Sync Status */}
          {isCloudSynced && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Synced</span>
            </div>
          )}
        </div>

        {/* Right Section: Theme Toggle, Notifications, Account & Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle showLabel={false} />

          {/* Notifications */}
          {currentRole !== 'guest' && (
            <button
              onClick={() => {
                if (currentRole === 'user') setActiveUserTab('incident-report');
                if (currentRole === 'ngo') setActiveNgoTab('incident-solver');
                if (currentRole === 'admin') setActiveAdminTab('ngo-verification');
              }}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {(currentRole === 'admin' ? pendingNgoCount : reportedCount) > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                  {currentRole === 'admin' ? pendingNgoCount : reportedCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile Pill */}
          {currentRole === 'user' && currentUser && (
            <button
              onClick={() => setActiveUserTab('profile')}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-brand-teal-600"
              />
              <span className="hidden sm:inline">{currentUser.name?.split(' ')[0]}</span>
            </button>
          )}

          {/* NGO Profile Pill */}
          {currentRole === 'ngo' && (
            <button
              onClick={() => setActiveNgoTab('profile')}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <img
                src={currentNgo.logo}
                alt={currentNgo.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-600"
              />
              <span className="hidden sm:inline truncate max-w-[100px]">{currentNgo.name}</span>
            </button>
          )}

          {/* Reset Demo State Button */}
          {currentRole !== 'guest' && (
            <button
              onClick={resetDemoData}
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden sm:flex"
              title="Reset Demo Data to Initial State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Logout */}
          {currentRole !== 'guest' && (
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
