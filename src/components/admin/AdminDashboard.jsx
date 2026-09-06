import React from 'react';
import { useApp } from '../../context/AppContext';
import Card3D from '../3d/Card3D';
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
  Menu
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    ngos,
    incidents,
    adoptions,
    campaigns,
    disputes,
    setActiveAdminTab,
    setIsDrawerOpen
  } = useApp();

  const pendingNgos = ngos.filter(n => n.verificationStatus === 'pending');
  const verifiedNgos = ngos.filter(n => n.verificationStatus === 'verified');
  const pendingAdoptions = adoptions.filter(a => a.status === 'Pending Admin Review');
  const activeIncidents = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress');
  const pendingDisputes = disputes.filter(d => d.status === 'Pending Admin Review');

  const totalPlatformDonations = ngos.reduce((acc, curr) => acc + (curr.stats?.totalDonationsRaised || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner with 3-Pin Drawer Button Hint */}
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
              Verify NGO registrations, enforce child safety checks on adoption listings, moderate user incident feeds, resolve donor disputes, and review platform-wide analytics.
            </p>
          </div>

          {/* Quick Review Alert Badge */}
          {(pendingNgos.length > 0 || pendingAdoptions.length > 0 || pendingDisputes.length > 0) && (
            <div className="p-4 bg-white text-slate-900 rounded-2xl shadow-lg space-y-1 text-xs font-bold max-w-xs border border-amber-300">
              <span className="text-brand-amber-700 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <Clock className="w-3.5 h-3.5 animate-spin text-brand-amber-600" />
                Action Required
              </span>
              <p className="text-slate-700 font-semibold text-[11px]">
                {pendingNgos.length} NGO verifications, {pendingAdoptions.length} adoption approvals & {pendingDisputes.length} disputes pending.
              </p>
            </div>
          )}
        </div>

        {/* 3-Pin Drawer Floating Hint */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 text-white hover:text-amber-100 font-bold transition-colors bg-white/15 px-3.5 py-2 rounded-xl border border-white/20 shadow-sm"
          >
            <Menu className="w-4 h-4" />
            <span>Open 3-Pin Admin Navigation Drawer &rarr;</span>
          </button>
          <span className="text-amber-100 text-[11px]">
            💡 Tip: Switch between NGO verification, Incident moderation, Adoption reviews, and Analytics from the left drawer.
          </span>
        </div>
      </div>

      {/* Bird's-Eye Platform Stats Grid with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Platform Donations</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-brand-teal-800 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{totalPlatformDonations.toLocaleString()}</div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
              Across {verifiedNgos.length} verified NGOs
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">NGO Verification</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{verifiedNgos.length} Verified</div>
            <span className={`text-[11px] font-bold mt-1 inline-block ${pendingNgos.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {pendingNgos.length} pending review
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Active Incidents</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-brand-amber-600 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{activeIncidents.length} Active</div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
              {incidents.filter(i => i.status === 'Resolved').length} resolved with proof
            </span>
          </div>
        </Card3D>

        <Card3D depth={15}>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Adoption Listings</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Baby className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{adoptions.filter(a => a.status === 'Approved').length} Live</div>
            <span className={`text-[11px] font-bold mt-1 inline-block ${pendingAdoptions.length > 0 ? 'text-brand-amber-600' : 'text-slate-400'}`}>
              {pendingAdoptions.length} in safety review
            </span>
          </div>
        </Card3D>
      </div>

      {/* Admin Modules Navigation Cards with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: NGO Verification */}
        <Card3D depth={18} onClick={() => setActiveAdminTab('ngo-verification')}>
          <div className="cursor-pointer group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6" />
                </div>
                {pendingNgos.length > 0 && (
                  <span className="text-[11px] font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full animate-pulse">
                    {pendingNgos.length} Pending
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                NGO Document Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review uploaded 80G tax orders, trust deeds, and government society registrations before granting verified status.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform pt-2">
              Review Documents &rarr;
            </span>
          </div>
        </Card3D>

        {/* Module 2: Adoption Safety Queue */}
        <Card3D depth={18} onClick={() => setActiveAdminTab('adoption-approvals')}>
          <div className="cursor-pointer group bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-mint-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Baby className="w-6 h-6" />
                </div>
                {pendingAdoptions.length > 0 && (
                  <span className="text-[11px] font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full animate-pulse">
                    {pendingAdoptions.length} Pending
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-teal-800 transition-colors">
                Adoption Listing Approvals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Safety checkpoint: Inspect child and elderly foster listings submitted by NGOs before they are published to citizens.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-800 group-hover:translate-x-1 transition-transform pt-2">
              Examine Profiles &rarr;
            </span>
          </div>
        </Card3D>

        {/* Module 3: Incident Report Moderation */}
        <Card3D depth={18} onClick={() => setActiveAdminTab('incident-moderation')}>
          <div className="cursor-pointer group bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-amber-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {incidents.length} Reports
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-amber-700 transition-colors">
                Incident Moderation Feed
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor incoming user distress reports, filter spam/fake entries, reassign cases to nearby NGOs, and enforce truthfulness.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-amber-700 group-hover:translate-x-1 transition-transform pt-2">
              Moderate Feed &rarr;
            </span>
          </div>
        </Card3D>

        {/* Module 4: Dispute Resolution */}
        <Card3D depth={18} onClick={() => setActiveAdminTab('disputes')}>
          <div className="cursor-pointer group bg-white rounded-3xl p-6 border border-slate-200 hover:border-red-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale className="w-6 h-6" />
                </div>
                {pendingDisputes.length > 0 && (
                  <span className="text-[11px] font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded-full">
                    {pendingDisputes.length} Open
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-700 transition-colors">
                Dispute & Grievance Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resolve donor claims, 80G tax receipt duplicate requests, user complaints, and misallocation disputes.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform pt-2">
              Resolve Grievances &rarr;
            </span>
          </div>
        </Card3D>

        {/* Module 5: Platform Bird's-Eye Analytics */}
        <Card3D depth={18} onClick={() => setActiveAdminTab('analytics')}>
          <div className="cursor-pointer group bg-white rounded-3xl p-6 border border-slate-200 hover:border-indigo-500 shadow-card-soft hover:shadow-xl transition-all space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                  Full Insights
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                Bird's-Eye Analytics & Geo Map
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual graphs for donation velocity, active disaster rescue regions, adoption growth, and impact metrics.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform pt-2">
              View Analytics &rarr;
            </span>
          </div>
        </Card3D>
      </div>
    </div>
  );
}
