import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  AlertOctagon,
  Heart,
  Baby,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Scale,
  Menu,
  MapPin,
  XCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    ngos,
    incidents,
    adoptions,
    campaigns,
    disputes,
    setActiveAdminTab,
    setIsDrawerOpen,
    verifyNgo,
    rejectNgo,
    resolveDispute
  } = useApp();

  const pendingNgos = ngos.filter(n => n.verificationStatus === 'pending');
  const verifiedNgos = ngos.filter(n => n.verificationStatus === 'verified');
  const pendingAdoptions = adoptions.filter(a => a.status === 'Pending Admin Review');
  const activeIncidents = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress');
  const pendingDisputes = disputes.filter(d => d.status === 'Pending Admin Review');

  const totalPlatformDonations = ngos.reduce((acc, curr) => acc + (curr.stats?.totalDonationsRaised || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner with Governance Oversight */}
      <div className="bg-gradient-to-r from-brand-amber-700 via-brand-amber-600 to-brand-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Governance & Bird's-Eye Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Super Administrator Control Console
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              Verify NGO statutory 80G/12A registrations, enforce child/elder foster safety audits, moderate distress incident feeds, and arbitrate donor escrow disputes.
            </p>
          </div>

          {/* Action Required Badge */}
          {(pendingNgos.length > 0 || pendingAdoptions.length > 0 || pendingDisputes.length > 0) && (
            <div className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-lg space-y-1 text-xs font-bold max-w-xs border border-amber-300 dark:border-amber-600">
              <span className="text-brand-amber-700 dark:text-brand-amber-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <Clock className="w-3.5 h-3.5 animate-spin text-brand-amber-600" />
                Urgent Action Queue
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                {pendingNgos.length} NGO verifications, {pendingAdoptions.length} adoption approvals & {pendingDisputes.length} disputes awaiting review.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bird's-Eye Platform Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Donated</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">₹{totalPlatformDonations.toLocaleString()}</div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
            Across {verifiedNgos.length} verified NGOs
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">NGO Verification</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{verifiedNgos.length} Verified</div>
          <span className={`text-[11px] font-bold mt-1 inline-block ${pendingNgos.length > 0 ? 'text-brand-amber-600' : 'text-slate-400'}`}>
            {pendingNgos.length} pending legal audit
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Live Distress Cases</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-brand-amber-600 dark:text-brand-amber-300 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{activeIncidents.length} Active</div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
            {incidents.filter(i => i.status === 'Resolved').length} resolved with GPS proof
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Escrow Disputes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{pendingDisputes.length} Open</div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 inline-block">
            0 arbitration breaches
          </span>
        </div>
      </div>

      {/* 2 Main Operational Columns: Pending NGO Approvals & Real-Time Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): NGO Verification Queue */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pending NGO 80G Statutory Verifications</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Inspect 12A/80G orders & NITI Aayog Darpan UID</p>
              </div>

              <button
                onClick={() => setActiveAdminTab('ngo-verification')}
                className="text-xs font-bold text-brand-amber-700 dark:text-brand-amber-400 hover:underline"
              >
                Inspect All &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {pendingNgos.length > 0 ? (
                pendingNgos.slice(0, 3).map(ngo => (
                  <div
                    key={ngo.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ngo.logo} alt={ngo.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ngo.name}</h4>
                        <span className="text-[11px] text-slate-500">{ngo.city} • Darpan: {ngo.darpanId}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyNgo(ngo.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve 80G</span>
                      </button>
                      <button
                        onClick={() => rejectNgo(ngo.id, 'Incomplete documentation')}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-semibold text-center border border-emerald-200 dark:border-emerald-800">
                  ✓ All NGO applications verified! No pending items in queue.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Incident Moderation Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-brand-amber-500" />
                  <span>Incident Feed Moderation</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time spam & truthfulness inspection</p>
              </div>

              <button
                onClick={() => setActiveAdminTab('incident-moderation')}
                className="text-xs font-bold text-brand-amber-700 dark:text-brand-amber-400 hover:underline"
              >
                Moderate Feed &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</span>
                    <span className="text-[11px] text-slate-500">{inc.reporterName} • {inc.category}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    inc.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
