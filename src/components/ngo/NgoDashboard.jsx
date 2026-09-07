import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  TrendingUp,
  Heart,
  Baby,
  AlertOctagon,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Menu,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function NgoDashboard() {
  const { currentNgo, incidents, setActiveNgoTab, setIsDrawerOpen, adoptions, campaigns, requirements, assignIncidentToNgo } = useApp();

  const ngoIncidents = incidents.filter(i => i.assignedNgoId === currentNgo.id || (!i.assignedNgoId && i.status === 'Reported'));
  const activeNgoIncidents = incidents.filter(i => (i.assignedNgoId === currentNgo.id && i.status === 'In Progress') || i.status === 'Reported');
  const solvedNgoIncidents = incidents.filter(i => i.assignedNgoId === currentNgo.id && i.status === 'Resolved');
  const ngoAdoptions = adoptions.filter(a => a.ngoId === currentNgo.id);
  const ngoRequirements = requirements.filter(r => r.ngoName === currentNgo.name || r.ngoId === currentNgo.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Verification Status Alert Banner */}
      {currentNgo.verificationStatus === 'verified' ? (
        <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                Official Verified NGO Trust Seal Active 🛡️
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Verified on {currentNgo.verificationDate || '2026-02-01'} by Super Admin. 80G Tax Exemption enabled for public donors.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveNgoTab('profile')}
            className="text-xs font-bold text-emerald-900 dark:text-emerald-100 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm flex-shrink-0 self-start md:self-auto transition-colors"
          >
            View Verified Certificates &rarr;
          </button>
        </div>
      ) : currentNgo.verificationStatus === 'rejected' ? (
        <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-3 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-red-950 dark:text-red-100">
                  Verification Re-submission Required ⚠️
                </h3>
                <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">
                  <strong>Reason from Admin:</strong> {currentNgo.rejectionReason || 'Uploaded certificates did not match statutory requirements. Please upload updated valid certificates.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveNgoTab('profile')}
              className="text-xs font-bold text-red-900 bg-white hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-300 shadow-sm flex-shrink-0"
            >
              Re-upload Documents &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  Document Verification In Progress (Awaiting Admin Review) ⏳
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Your legal certificates have been placed in the Platform Super Admin inspection queue.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveNgoTab('profile')}
              className="text-xs font-bold text-amber-900 dark:text-amber-100 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 shadow-sm flex-shrink-0"
            >
              Manage Uploaded Docs &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-teal-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO Operations Control • {currentNgo.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Field Operations & Distress Triage Hub
            </h1>
            <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl leading-relaxed">
              Manage live incoming community distress cases, deploy field ambulances, track urgent supply campaigns, and manage adoption files.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveNgoTab('incident-solver')}
              className="px-5 py-3 rounded-2xl bg-brand-amber-500 hover:bg-brand-amber-600 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Solve Incidents ({activeNgoIncidents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Real Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Funds Raised</span>
            <div className="w-8 h-8 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-teal-900 dark:text-white">
            ₹{(currentNgo.stats?.totalDonationsRaised || 1250000).toLocaleString()}
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
            ● 100% Direct Bank Settlement
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Incidents Solved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-300">
            {solvedNgoIncidents.length + (currentNgo.stats?.incidentsResolved || 14)}
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1 inline-block">
            {activeNgoIncidents.length} pending intervention
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Adoption Files</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-brand-amber-600 dark:text-brand-amber-300 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-amber-800 dark:text-brand-amber-300">
            {ngoAdoptions.length || 3} Listed
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Admin legal cleared
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Volunteers On Call</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900 dark:text-indigo-300">
            {currentNgo.stats?.activeVolunteers || 48} Active
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Ready for weekend dispatch
          </span>
        </div>
      </div>

      {/* 2 Main Operational Columns: Live Incoming Distress Queue & Active Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Real-Time Incoming Dispatch Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-brand-amber-500" />
                  <span>Incoming Community Distress Queue (Action Required)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Citizen reports in your operational radius requiring immediate shelter or rescue van dispatch
                </p>
              </div>

              <button
                onClick={() => setActiveNgoTab('incident-solver')}
                className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 hover:underline flex items-center gap-1"
              >
                <span>Full Solver Desk &rarr;</span>
              </button>
            </div>

            {/* Queue items */}
            <div className="space-y-3.5">
              {activeNgoIncidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={inc.photo}
                      alt={inc.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          inc.status === 'In Progress'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}>
                          ● {inc.status}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {inc.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{inc.location}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveNgoTab('incident-solver')}
                    className="px-4 py-2 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center"
                  >
                    <span>Deploy / Resolve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Active Emergency Supply Appeals */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-teal-700 dark:text-brand-mint-400" />
                  <span>Emergency Appeals</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your live grain & medical requests</p>
              </div>

              <button
                onClick={() => setActiveNgoTab('requirements')}
                className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 hover:underline"
              >
                + Post Appeal
              </button>
            </div>

            <div className="space-y-4">
              {requirements.slice(0, 2).map(req => {
                const percent = Math.round((req.raisedValue / req.targetValue) * 100);
                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-teal-50/50 dark:bg-brand-teal-950/30 border border-teal-200/70 dark:border-brand-teal-800/50 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-brand-teal-900 dark:text-brand-mint-300">
                      <span>{req.urgency} Urgency</span>
                      <span>{percent}% Raised</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{req.title}</h4>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-teal-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <span>₹{req.raisedValue.toLocaleString()} / ₹{req.targetValue.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
