import React from 'react';
import { useApp } from '../../context/AppContext';
import Card3D from '../3d/Card3D';
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
  Menu
} from 'lucide-react';

export default function NgoDashboard() {
  const { currentNgo, incidents, setActiveNgoTab, setIsDrawerOpen, adoptions, campaigns, requirements } = useApp();

  const ngoIncidents = incidents.filter(i => i.assignedNgoId === currentNgo.id || (!i.assignedNgoId && i.status === 'Reported'));
  const activeNgoIncidents = incidents.filter(i => (i.assignedNgoId === currentNgo.id && i.status === 'In Progress') || i.status === 'Reported');
  const solvedNgoIncidents = incidents.filter(i => i.assignedNgoId === currentNgo.id && i.status === 'Resolved');
  const ngoAdoptions = adoptions.filter(a => a.ngoId === currentNgo.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Verification Status Alert Banner with Stepper */}
      {currentNgo.verificationStatus === 'verified' ? (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                Official Verified NGO Trust Seal Active 🛡️
              </h3>
              <p className="text-xs text-emerald-800">
                Verified on {currentNgo.verificationDate || '2026-02-01'} by Super Admin. 80G Tax Exemption enabled for public donors.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveNgoTab('profile')}
            className="text-xs font-bold text-emerald-900 bg-white hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300 shadow-sm flex-shrink-0 self-start md:self-auto"
          >
            View Verified Certificates &rarr;
          </button>
        </div>
      ) : currentNgo.verificationStatus === 'rejected' ? (
        <div className="p-5 rounded-3xl bg-red-50 border border-red-300 text-red-900 space-y-3 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-red-950">
                  Verification Re-submission Required ⚠️
                </h3>
                <p className="text-xs text-red-800 mt-0.5">
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
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-300 text-amber-950 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  Document Verification In Progress (Awaiting Admin Review) ⏳
                </h3>
                <p className="text-xs text-amber-800">
                  Your legal certificates have been placed in the Platform Super Admin inspection queue.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveNgoTab('profile')}
              className="text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-300 shadow-sm flex-shrink-0"
            >
              Manage Uploaded Docs &rarr;
            </button>
          </div>

          {/* 3-Step Pipeline Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-200/80">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-100/60 text-emerald-900 text-[11px] font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
              <span>1. Documents Uploaded ({currentNgo.documents?.length || 0})</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-200/80 text-amber-950 text-[11px] font-bold ring-1 ring-amber-400 animate-pulse">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>2. Super Admin Inspection (Current)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 text-slate-400 text-[11px] font-bold">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">3</span>
              <span>3. Verified Trust Seal & Public 80G</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Welcome Card with 3-Pin Drawer Button Hint */}
      <div className="bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-teal-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO Organization Console: {currentNgo.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Organizational Impact & Dispatch Center
            </h1>
            <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl leading-relaxed">
              Manage incoming community distress cases, publish urgent food rations, launch 80G fundraisers, and supervise child/elder adoption programs.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveNgoTab('incident-solver')}
              className="px-4 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Solve Incidents ({activeNgoIncidents.length})</span>
            </button>
          </div>
        </div>

        {/* 3-Pin Drawer Floating Hint */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 text-brand-mint-300 hover:text-white font-bold transition-colors bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 shadow-sm"
          >
            <Menu className="w-4 h-4" />
            <span>Open 3-Pin NGO Navigation Drawer &rarr;</span>
          </button>
          <span className="text-slate-300 text-[11px]">
            💡 Tip: Access Incident Solver, 80G Campaigns, Urgent Needs, and Doc Verification from the left drawer.
          </span>
        </div>
      </div>

      {/* 4 Stats Cards with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Total Funds Raised</span>
              <div className="w-8 h-8 rounded-xl bg-brand-teal-50 text-brand-teal-800 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-brand-teal-900">
              ₹{(currentNgo.stats?.totalDonationsRaised || 0).toLocaleString()}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
              ● 80G Tax Exempted
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Incidents Solved</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-900">
              {solvedNgoIncidents.length + (currentNgo.stats?.incidentsResolved || 0)}
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 inline-block">
              {activeNgoIncidents.length} currently active
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Listed Adoptions</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-brand-amber-600 flex items-center justify-center">
                <Baby className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-brand-amber-800">
              {ngoAdoptions.length} Profiles
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 inline-block">
              Admin safety cleared
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Volunteer Network</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-900">
              {currentNgo.stats?.activeVolunteers || 45} Active
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1 inline-block">
              Available on call
            </span>
          </div>
        </Card3D>
      </div>

      {/* Feature Action Shortcuts with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card3D depth={18} onClick={() => setActiveNgoTab('incident-solver')}>
          <div className="cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-amber-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-brand-amber-700 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Incident Solving Desk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review user-reported cases, assign rescue teams, upload resolution proof, and move to Solved Archive.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-amber-700 pt-2">
              Open Solver Desk &rarr;
            </span>
          </div>
        </Card3D>

        <Card3D depth={18} onClick={() => setActiveNgoTab('requirements')}>
          <div className="cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-teal-600 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-brand-teal-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Post Urgent Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need rice, medicines, or blankets urgently? Post an appeal with a progress meter for donors to fund directly.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal-800 pt-2">
              Post Requirement &rarr;
            </span>
          </div>
        </Card3D>

        <Card3D depth={18} onClick={() => setActiveNgoTab('adoptions')}>
          <div className="cursor-pointer bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-mint-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-mint-700 flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Adoption Listings Manager</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add child or elder foster profiles with safety documentation for Platform Admin review and public listing.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-mint-700 pt-2">
              Manage Listings &rarr;
            </span>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
