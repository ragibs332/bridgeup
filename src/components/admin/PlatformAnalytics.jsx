import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  MapPin,
  Heart,
  ShieldCheck,
  Users,
  Baby,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

export default function PlatformAnalytics() {
  const { ngos, incidents, adoptions, campaigns } = useApp();

  const totalDonations = ngos.reduce((acc, curr) => acc + (curr.stats?.totalDonationsRaised || 0), 0);
  const totalIncidentsResolved = incidents.filter(i => i.status === 'Resolved').length;

  const regions = [
    { city: 'Delhi NCR', activeCases: 42, donations: '₹9.4L', verifiedNgos: 8, status: 'High Activity' },
    { city: 'Mumbai & MMR', activeCases: 28, donations: '₹6.8L', verifiedNgos: 6, status: 'High Activity' },
    { city: 'Bengaluru', activeCases: 34, donations: '₹5.2L', verifiedNgos: 5, status: 'Rapid Food Rescue' },
    { city: 'Kolkata', activeCases: 14, donations: '₹2.1L', verifiedNgos: 3, status: 'Growing Network' },
    { city: 'Pune & Western', activeCases: 19, donations: '₹3.6L', verifiedNgos: 4, status: 'Stable' }
  ];

  const causeBreakdown = [
    { name: 'Child Education & Welfare', percent: 42, color: 'bg-brand-teal-800' },
    { name: 'Hunger Relief & Food Rescue', percent: 28, color: 'bg-brand-mint-500' },
    { name: 'Elder Healthcare & Hospice', percent: 18, color: 'bg-brand-amber-500' },
    { name: 'Emergency Animal Rescue', percent: 12, color: 'bg-indigo-600' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-brand-teal-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/20">
            <TrendingUp className="w-4 h-4" />
            <span>Platform Bird's-Eye Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Analytics & Regional Heat-Map
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            High-level metrics for presentations, investor reports, and civic governance overviews. Track real-time impact across major metro areas.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[150px] border border-white/15">
          <div className="text-3xl font-black text-brand-mint-300">98.6%</div>
          <div className="text-xs text-slate-300 mt-0.5">Verified Fund Compliance</div>
        </div>
      </div>

      {/* 2-Column Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Regional Hubs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-teal-800" />
            Most Active Geographic Impact Regions
          </h3>
          <p className="text-xs text-slate-500">Live operational centers and donation inflows</p>

          <div className="space-y-3 pt-2">
            {regions.map((reg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-mint-500"></span>
                    {reg.city}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {reg.verifiedNgos} Verified NGOs • {reg.activeCases} Rescues Conducted
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">{reg.donations}</span>
                  <span className="text-[10px] font-bold text-brand-teal-800 bg-brand-teal-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                    {reg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Distribution by Sector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-amber-500" />
            Donation Capital Allocation by Sector
          </h3>
          <p className="text-xs text-slate-500">Breakdown of public donor contributions</p>

          <div className="space-y-4 pt-2">
            {causeBreakdown.map((c, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  <span className="font-black text-slate-900">{c.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${c.color} h-3 rounded-full transition-all duration-700`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-brand-teal-50 border border-brand-teal-200 text-xs text-brand-teal-900 mt-4 leading-relaxed">
            💡 <strong>Fast Incident Resolution:</strong> Surplus banquet food rescued in under 45 minutes on average, preserving over 8,500 kg of edible meals monthly.
          </div>
        </div>
      </div>
    </div>
  );
}
