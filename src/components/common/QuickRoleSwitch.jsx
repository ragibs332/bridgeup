import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Building2, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function QuickRoleSwitch() {
  const {
    currentRole,
    loginAsUser,
    loginAsNgo,
    loginAsAdmin,
    ngos,
    currentNgo,
    selectCurrentNgo,
    resetDemoData
  } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-slate-900/95 text-white p-2 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-lg flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-400 border-r border-slate-700">
          <Layers className="w-3.5 h-3.5 text-brand-mint-400" />
          <span>Demo Switcher</span>
        </div>

        {/* User Button */}
        <button
          onClick={() => loginAsUser()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentRole === 'user'
              ? 'bg-brand-teal-800 text-brand-mint-300 shadow-md ring-1 ring-brand-mint-400/50 font-bold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Switch to Citizen / Donor / Volunteer view"
        >
          <User className="w-3.5 h-3.5" />
          <span>User</span>
        </button>

        {/* NGO Dropdown / Button */}
        <div className="relative group">
          <button
            onClick={() => loginAsNgo(currentNgo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentRole === 'ngo'
                ? 'bg-brand-teal-800 text-brand-mint-300 shadow-md ring-1 ring-brand-mint-400/50 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Switch to NGO view"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO {currentNgo?.verificationStatus === 'verified' ? '🛡️' : '⏳'}</span>
          </button>

          {/* Quick NGO Switch Menu */}
          <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-xl w-60 z-50 text-xs">
            <span className="text-[10px] text-slate-400 font-bold px-2 py-1 uppercase tracking-wider">Select NGO Organization</span>
            {ngos.map(ngo => (
              <button
                key={ngo.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectCurrentNgo(ngo.id);
                  loginAsNgo(ngo);
                }}
                className={`text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  currentNgo?.id === ngo.id ? 'bg-brand-teal-800/80 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate max-w-[130px]">{ngo.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  ngo.verificationStatus === 'verified' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {ngo.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Button */}
        <button
          onClick={() => loginAsAdmin()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentRole === 'admin'
              ? 'bg-brand-amber-600 text-white shadow-md ring-1 ring-brand-amber-300 font-bold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Switch to Super Admin Governance Console"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors ml-1"
          title="Reset all demo data to pristine default"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
