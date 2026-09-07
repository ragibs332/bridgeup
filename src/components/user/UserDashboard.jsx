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
  Menu,
  Download,
  FileText,
  Calendar,
  PhoneCall,
  AlertTriangle,
  Plus
} from 'lucide-react';

export default function UserDashboard() {
  const {
    currentUser,
    setActiveUserTab,
    setIsDrawerOpen,
    incidents,
    campaigns,
    requirements,
    adoptions,
    addToast
  } = useApp();

  const userIncidents = incidents.filter(i => (currentUser && (i.reporterEmail === currentUser.email || i.reporterName === currentUser.name)));
  const activeIncidents = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress');
  const recentDonations = currentUser?.donationHistory || [];
  const taxSaved = Math.round((currentUser?.totalDonated || 0) * 0.5);

  const handleDownloadReceipt = (receiptId, title) => {
    addToast('80G Receipt Downloaded', `Certificate ${receiptId} for ${title} has been downloaded.`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Executive Citizen Impact Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white p-6 sm:p-8 shadow-2xl border border-brand-teal-700/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber-400" />
                <span>Verified Citizen & Donor</span>
              </div>
              {currentUser?.badges?.map(b => (
                <span key={b} className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 font-semibold text-slate-200">
                  ★ {b}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {currentUser?.name || 'Citizen'}!
            </h1>
            
            <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl leading-relaxed">
              Your personal dashboard tracks active distress rescue dispatches, statutory 80G tax deductions, and verified community campaigns.
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setActiveUserTab('incident-report')}
                className="px-4 py-2 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>+ Report Distress Case</span>
              </button>
              <button
                onClick={() => setActiveUserTab('donations')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-brand-mint-300" />
                <span>Explore 80G Causes</span>
              </button>
            </div>
          </div>

          {/* Citizen Lifetime Impact Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-lg min-w-[110px]">
              <div className="text-xl sm:text-2xl font-black text-brand-mint-300">₹{(currentUser?.totalDonated || 0).toLocaleString()}</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">80G Donated</div>
              <div className="text-[10px] text-brand-amber-300 font-bold mt-1">₹{taxSaved.toLocaleString()} Saved</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-lg min-w-[110px]">
              <div className="text-xl sm:text-2xl font-black text-brand-amber-400">{currentUser?.volunteerHours || 0} hrs</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Volunteered</div>
              <div className="text-[10px] text-slate-300 font-medium mt-1">Community Aid</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-lg min-w-[110px]">
              <div className="text-xl sm:text-2xl font-black text-white">{userIncidents.length}</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Reports Filed</div>
              <div className="text-[10px] text-emerald-300 font-bold mt-1">{userIncidents.filter(i => i.status === 'Resolved').length} Rescued</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Live Incidents Tracker & Recent 80G Receipts */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section A: Live Community Distress & My Reports Tracker */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-brand-amber-500" />
                  <span>Live Distress Dispatch & Rescue Tracker</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time status of emergency incidents handled by verified local NGOs
                </p>
              </div>

              <button
                onClick={() => setActiveUserTab('incident-report')}
                className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 hover:underline flex items-center gap-1"
              >
                <span>View All Cases &rarr;</span>
              </button>
            </div>

            {/* Incidents Feed */}
            <div className="space-y-4">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <img
                    src={inc.photo}
                    alt={inc.title}
                    className="w-full sm:w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                          : inc.status === 'In Progress'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40'
                          : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300/40'
                      }`}>
                        ● {inc.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {inc.category}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-auto">
                        Ticket: #{inc.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {inc.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </p>

                    {inc.status === 'Resolved' && inc.resolutionNotes ? (
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200">
                        <strong>✓ Action Taken by {inc.assignedNgoName}:</strong> {inc.resolutionNotes}
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Assigned to {inc.assignedNgoName || 'Nearest Local Response Team'} (In Transit)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: 80G Tax Certificates & Donation Records */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-teal-700 dark:text-brand-mint-400" />
                  <span>80G Tax Exemption Receipts (Form 10BE)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant certified tax receipts ready for income tax filing
                </p>
              </div>

              <button
                onClick={() => setActiveUserTab('profile')}
                className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 hover:underline"
              >
                View History &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recentDonations.slice(0, 3).map(txn => (
                <div
                  key={txn.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {txn.campaignTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {txn.ngoName} • {txn.date} • <span className="font-semibold text-brand-teal-700 dark:text-brand-mint-400">{txn.taxReceipt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{txn.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDownloadReceipt(txn.taxReceipt, txn.campaignTitle)}
                      className="p-2 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 hover:bg-brand-teal-800 hover:text-white transition-colors border border-brand-teal-200 dark:border-brand-teal-800 text-xs font-bold flex items-center gap-1"
                      title="Download 80G Form 10BE Tax Receipt PDF"
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

        {/* Right Column (4 cols): Urgent Needs Radar & Community Engagement */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Urgent Food & Medicine Needs Board */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-amber-500" />
                <span>Urgent Local NGO Needs</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rations, medical supplies & dry kits</p>
            </div>

            <div className="space-y-4">
              {requirements.slice(0, 2).map(req => {
                const percent = Math.round((req.raisedValue / req.targetValue) * 100);
                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300">
                      <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">{req.urgency}</span>
                      <span>{percent}% Funded</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{req.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{req.ngoName}</p>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        ₹{req.raisedValue.toLocaleString()} / ₹{req.targetValue.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setActiveUserTab('donations')}
                        className="font-bold text-brand-amber-700 dark:text-brand-amber-400 hover:underline"
                      >
                        Contribute &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Volunteer Drives */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Volunteer Drives</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Join weekend community aid</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/50 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>This Saturday • 9:00 AM - 1:00 PM</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Food Recovery & Packaged Meal Distribution
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Asha Child Care Foundation • South Delhi
              </p>
              <button
                onClick={() => setActiveUserTab('volunteers')}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors mt-2"
              >
                Register for Drive
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
