import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Heart,
  Baby,
  Users,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Download,
  FileText,
  Calendar,
  PhoneCall,
  Plus
} from 'lucide-react';

export default function UserDashboard() {
  const {
    currentUser,
    setActiveUserTab,
    incidents,
    requirements,
    addToast,
    isCloudSynced
  } = useApp();

  const userIncidents = incidents.filter(i => (currentUser && (i.reporterEmail === currentUser.email || i.reporterName === currentUser.name)));
  const recentDonations = currentUser?.donationHistory || [];
  const taxSaved = Math.round((currentUser?.totalDonated || 0) * 0.5);

  const handleDownloadReceipt = (receiptId, title) => {
    addToast('80G Receipt Downloaded', `Certificate ${receiptId} for ${title} has been downloaded.`, 'success');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      
      {/* 1. Citizen Welcome & Impact Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white p-5 sm:p-7 shadow-xl border border-brand-teal-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber-400" />
                <span>Verified Citizen</span>
              </span>
              {isCloudSynced && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Multi-Device Synced
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {currentUser?.name || 'Citizen'}!
            </h1>
            
            <p className="text-xs sm:text-sm text-brand-mint-100 max-w-lg leading-relaxed">
              Track your emergency dispatches, download 80G tax certificates, and support urgent grassroots requirements.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setActiveUserTab('incident-report')}
                className="px-4 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>+ Report Distress Incident</span>
              </button>
              <button
                onClick={() => setActiveUserTab('donations')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-brand-mint-300" />
                <span>Explore 80G Causes</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center min-w-[95px]">
              <div className="text-lg sm:text-2xl font-black text-brand-mint-300">₹{(currentUser?.totalDonated || 0).toLocaleString()}</div>
              <div className="text-[10px] text-slate-300 font-semibold">80G Donated</div>
              <div className="text-[9px] text-brand-amber-300 font-bold mt-0.5">₹{taxSaved.toLocaleString()} Saved</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center min-w-[95px]">
              <div className="text-lg sm:text-2xl font-black text-brand-amber-400">{currentUser?.volunteerHours || 0}h</div>
              <div className="text-[10px] text-slate-300 font-semibold">Volunteered</div>
              <div className="text-[9px] text-slate-300 font-medium mt-0.5">Field Aid</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center min-w-[95px]">
              <div className="text-lg sm:text-2xl font-black text-white">{userIncidents.length}</div>
              <div className="text-[10px] text-slate-300 font-semibold">Reports Filed</div>
              <div className="text-[9px] text-emerald-300 font-bold mt-0.5">{userIncidents.filter(i => i.status === 'Resolved').length} Solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Clean Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Incidents & Tax Receipts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section A: Active Community Distress Cases */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-500" />
                  <span>Live Distress Dispatch Tracker</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time status of emergency incidents handled by verified NGOs
                </p>
              </div>

              <button
                onClick={() => setActiveUserTab('incident-report')}
                className="text-xs font-bold text-teal-700 dark:text-brand-mint-300 hover:underline flex items-center gap-1"
              >
                <span>All Cases &rarr;</span>
              </button>
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                >
                  <img
                    src={inc.photo}
                    alt={inc.title}
                    className="w-full sm:w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-900"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : inc.status === 'In Progress'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                      }`}>
                        ● {inc.status}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {inc.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {inc.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{inc.location}</span>
                    </p>

                    {inc.status === 'Resolved' && inc.resolutionNotes ? (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                        ✓ Solved by {inc.assignedNgoName}
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Assigned to {inc.assignedNgoName || 'Nearest Response Team'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: 80G Tax Exemption Receipts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700 dark:text-brand-mint-400" />
                  <span>80G Tax Exemption Receipts (Form 10BE)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant IT-compliant tax receipts ready for tax filing
                </p>
              </div>

              <button
                onClick={() => setActiveUserTab('profile')}
                className="text-xs font-bold text-teal-700 dark:text-brand-mint-300 hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {recentDonations.slice(0, 3).map(txn => (
                <div
                  key={txn.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {txn.campaignTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {txn.ngoName} • {txn.date} • <span className="font-semibold text-teal-700 dark:text-brand-mint-400">{txn.taxReceipt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      ₹{txn.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDownloadReceipt(txn.taxReceipt, txn.campaignTitle)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-brand-mint-300 hover:bg-teal-800 hover:text-white transition-colors border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">80G PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Urgent Needs & Volunteer Drives */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Urgent Needs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500" />
                <span>Urgent Needs in Your City</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Rations, medical supplies & dry kits</p>
            </div>

            <div className="space-y-3">
              {requirements.slice(0, 2).map(req => {
                const percent = Math.round((req.raisedValue / req.targetValue) * 100);
                return (
                  <div key={req.id} className="p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 dark:text-amber-300">
                      <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">{req.urgency}</span>
                      <span>{percent}% Funded</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{req.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{req.ngoName}</p>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-0.5 text-[10px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        ₹{req.raisedValue.toLocaleString()} / ₹{req.targetValue.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setActiveUserTab('donations')}
                        className="font-bold text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Contribute &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volunteer Weekend Drive */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Volunteer Drive</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Join weekend field mission</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-900 dark:text-indigo-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>This Saturday • 9:00 AM</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Meal Recovery & Distribution
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Asha Child Care • South Delhi
              </p>
              <button
                onClick={() => setActiveUserTab('volunteers')}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors mt-1"
              >
                Register as Volunteer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
