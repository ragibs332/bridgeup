import React from 'react';
import { useApp } from '../../context/AppContext';
import Card3D from '../3d/Card3D';
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
  ChevronRight
} from 'lucide-react';

export default function UserDashboard() {
  const {
    currentUser,
    setActiveUserTab,
    setIsDrawerOpen,
    incidents,
    campaigns,
    requirements,
    adoptions
  } = useApp();

  const userIncidents = incidents.filter(i => i.reporterEmail === currentUser.email || i.reporterName === currentUser.name);
  const activeIncidents = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress');
  const featuredCampaign = campaigns[0];
  const publicAdoptions = adoptions.filter(a => a.status === 'Approved');

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white p-6 sm:p-8 shadow-2xl border border-brand-teal-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome Back, {currentUser.name}!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Bridge Compassion & Action?
            </h1>
            <p className="text-sm text-brand-mint-100 max-w-xl">
              Tap the <strong>Three-Pin Menu (☰)</strong> in the top-left to access your Profile, Adoptions, 80G Donations, Volunteering, or report emergency distress cases.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 min-w-[120px] text-center shadow-lg">
              <div className="text-2xl font-black text-brand-mint-300">₹{currentUser.totalDonated.toLocaleString()}</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Donated (80G)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 min-w-[120px] text-center shadow-lg">
              <div className="text-2xl font-black text-brand-amber-400">{currentUser.volunteerHours} hrs</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Volunteered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 min-w-[120px] text-center shadow-lg">
              <div className="text-2xl font-black text-white">{userIncidents.length}</div>
              <div className="text-[11px] text-slate-300 font-semibold mt-0.5">Reports Filed</div>
            </div>
          </div>
        </div>

        {/* 3-Pin Drawer Floating Hint */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 text-brand-mint-300 hover:text-white font-bold transition-colors bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 shadow-sm"
          >
            <Menu className="w-4 h-4" />
            <span>Open 3-Pin Dashboard Drawer &rarr;</span>
          </button>
          <span className="text-slate-300 text-[11px]">
            💡 Tip: Use the bottom-left AI chatbot anytime for instant guidance!
          </span>
        </div>
      </div>

      {/* 4 Feature Quick Action Cards with 3D Tilt Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Action 1: Incident Reporting */}
        <Card3D depth={20} onClick={() => setActiveUserTab('incident-report')}>
          <div className="cursor-pointer group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-brand-amber-500 dark:hover:border-brand-amber-500 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-brand-amber-600 dark:text-brand-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-amber-600 dark:group-hover:text-brand-amber-400 transition-colors">
                  Incident Reporting
                </h3>
                {activeIncidents.length > 0 && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300/40">
                    {activeIncidents.length} Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                Report child labor, elder neglect, food rescue, or injured animals for instant NGO dispatch.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-brand-amber-600 dark:text-brand-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Report or Track Case &rarr;</span>
            </div>
          </div>
        </Card3D>

        {/* Action 2: Donations & Urgent Needs */}
        <Card3D depth={20} onClick={() => setActiveUserTab('donations')}>
          <div className="cursor-pointer group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-brand-teal-600 dark:hover:border-brand-mint-400 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-teal-800 dark:group-hover:text-brand-mint-300 transition-colors">
                  80G Donations
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
                  50% Tax Save
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                Fund verified NGO campaigns, supply emergency ration grains, and download instant 80G tax receipts.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 group-hover:translate-x-1 transition-transform">
              <span>Explore Campaigns &rarr;</span>
            </div>
          </div>
        </Card3D>

        {/* Action 3: Adoption & Companionship */}
        <Card3D depth={20} onClick={() => setActiveUserTab('adoptions')}>
          <div className="cursor-pointer group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-brand-mint-500 dark:hover:border-brand-mint-400 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-brand-mint-600 dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Baby className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-mint-700 dark:group-hover:text-emerald-300 transition-colors">
                  Adoption Portal
                </h3>
                <span className="text-[10px] bg-brand-mint-100 dark:bg-brand-mint-950/60 text-brand-teal-900 dark:text-brand-mint-300 font-bold px-2 py-0.5 rounded-full border border-brand-mint-400/40">
                  Admin Vetted
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                Browse legally verified child adoption and elder foster companionship profiles with full safety records.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-brand-mint-700 dark:text-emerald-300 group-hover:translate-x-1 transition-transform">
              <span>View {publicAdoptions.length} Profiles &rarr;</span>
            </div>
          </div>
        </Card3D>

        {/* Action 4: Volunteer Drives */}
        <Card3D depth={20} onClick={() => setActiveUserTab('volunteers')}>
          <div className="cursor-pointer group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Volunteer Drives
                </h3>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-300/40">
                  Weekends
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                Join local NGO community drives for teaching kids, food recovery, and elderly care.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Join a Drive &rarr;</span>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Two Column Section: Live Incident Status + Urgent Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Incidents & Impact Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-brand-amber-500" />
                  Live Community Incident Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time distress rescue lifecycle across India</p>
              </div>
              <button
                onClick={() => setActiveUserTab('incident-report')}
                className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 hover:text-brand-teal-900 bg-brand-teal-50 dark:bg-brand-teal-950/60 px-3 py-1.5 rounded-xl border border-brand-teal-200 dark:border-brand-teal-800 transition-colors"
              >
                + Report New
              </button>
            </div>

            <div className="space-y-4">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <img
                    src={inc.photo}
                    alt={inc.title}
                    className="w-full sm:w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
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
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{inc.location}</span>
                    </p>
                    {inc.status === 'Resolved' && inc.resolutionNotes && (
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/50 p-1.5 rounded-lg mt-1.5 line-clamp-1 border border-emerald-200 dark:border-emerald-800/50">
                        ✓ {inc.assignedNgoName}: {inc.resolutionNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Requirements Board */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-brand-amber-500" />
                  Urgent NGO Needs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Food, medicines & emergency items</p>
              </div>
            </div>

            <div className="space-y-4">
              {requirements.slice(0, 2).map(req => {
                const percent = Math.round((req.raisedValue / req.targetValue) * 100);
                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                      <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">{req.urgency}</span>
                      <span>{percent}% Funded</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">{req.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{req.ngoName}</p>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2.5 overflow-hidden">
                      <div
                        className="bg-brand-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">₹{req.raisedValue.toLocaleString()} of ₹{req.targetValue.toLocaleString()}</span>
                      <button
                        onClick={() => setActiveUserTab('donations')}
                        className="font-bold text-brand-amber-700 dark:text-brand-amber-400 hover:text-brand-amber-900 underline"
                      >
                        Contribute &rarr;
                      </button>
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
