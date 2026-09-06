import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  AlertOctagon,
  Heart,
  User,
  Building2,
  ShieldCheck,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function MobileBottomNav() {
  const {
    currentRole,
    activeUserTab,
    setActiveUserTab,
    activeNgoTab,
    setActiveNgoTab,
    activeAdminTab,
    setActiveAdminTab,
    incidents,
    ngos
  } = useApp();

  if (currentRole === 'guest') return null;

  const reportedIncidentsCount = incidents.filter(i => i.status === 'Reported').length;
  const pendingNgosCount = ngos.filter(n => n.verificationStatus === 'pending').length;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-colors">
      {/* Citizen / User Navigation */}
      {currentRole === 'user' && (
        <>
          <button
            onClick={() => setActiveUserTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeUserTab === 'dashboard'
                ? 'text-brand-teal-800 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveUserTab('incident-report')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeUserTab === 'incident-report'
                ? 'text-brand-amber-600 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-brand-amber-500" />
            <span>Report</span>
            {reportedIncidentsCount > 0 && (
              <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          <button
            onClick={() => setActiveUserTab('donations')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeUserTab === 'donations'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>Donate 80G</span>
          </button>

          <button
            onClick={() => setActiveUserTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeUserTab === 'profile'
                ? 'text-brand-teal-800 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </>
      )}

      {/* NGO Navigation */}
      {currentRole === 'ngo' && (
        <>
          <button
            onClick={() => setActiveNgoTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeNgoTab === 'dashboard'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveNgoTab('incident-solver')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeNgoTab === 'incident-solver'
                ? 'text-brand-amber-600 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-brand-amber-500" />
            <span>Incidents</span>
            {reportedIncidentsCount > 0 && (
              <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-brand-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveNgoTab('campaigns')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeNgoTab === 'campaigns'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>Campaigns</span>
          </button>

          <button
            onClick={() => setActiveNgoTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeNgoTab === 'profile'
                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>NGO Desk</span>
          </button>
        </>
      )}

      {/* Admin Navigation */}
      {currentRole === 'admin' && (
        <>
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeAdminTab === 'dashboard'
                ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('ngo-verification')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeAdminTab === 'ngo-verification'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify</span>
            {pendingNgosCount > 0 && (
              <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('incident-moderation')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeAdminTab === 'incident-moderation'
                ? 'text-brand-amber-600 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-brand-amber-500" />
            <span>Dispatch</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
              activeAdminTab === 'analytics'
                ? 'text-brand-teal-800 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </>
      )}
    </nav>
  );
}
