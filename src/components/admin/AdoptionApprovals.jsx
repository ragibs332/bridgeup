import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Baby,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  MapPin
} from 'lucide-react';

export default function AdoptionApprovals() {
  const { adoptions, approveAdoptionListing } = useApp();

  const pendingListings = adoptions.filter(a => a.status === 'Pending Admin Review');
  const approvedListings = adoptions.filter(a => a.status === 'Approved');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
            <Baby className="w-4 h-4" />
            <span>Child & Elder Safety Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Adoption Listing Approvals Queue
          </h1>
          <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl leading-relaxed">
            Due to the critical sensitivity of child welfare and elder foster programs, all NGO-submitted profiles must be reviewed and approved by Platform Admin before becoming visible to the public.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[140px] text-white">
          <div className="text-3xl font-black text-brand-mint-300">{pendingListings.length}</div>
          <div className="text-xs text-brand-mint-200">Pending Safety Clearance</div>
        </div>
      </div>

      {/* Pending Safety Approvals Queue */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-amber-500 animate-spin" />
          Pending Safety Verification Queue ({pendingListings.length})
        </h3>

        {pendingListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingListings.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-card-soft space-y-4"
              >
                <div className="flex gap-4">
                  <img src={item.photo} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                      ⏳ Pending Safety Clearance
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{item.name}</h4>
                    <p className="text-xs text-slate-500">Age: {item.age} • Category: {item.category}</p>
                    <p className="text-xs text-brand-teal-800 font-bold mt-0.5">{item.ngoName}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
                  {item.story}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Legal Status: <strong>{item.legalStatus}</strong></span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => approveAdoptionListing(item.id, 'Approved')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve for Public Listing</span>
                  </button>
                  <button
                    onClick={() => approveAdoptionListing(item.id, 'Rejected')}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">All pending adoption profiles have been vetted and processed.</p>
          </div>
        )}
      </div>

      {/* Approved Live Listings */}
      <div className="space-y-4 pt-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Active Publicly Approved Listings ({approvedListings.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedListings.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <img src={item.photo} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ✓ Public Active
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{item.name}</h4>
                <p className="text-xs text-slate-500">{item.ngoName}</p>
                <p className="text-[11px] text-brand-teal-800 font-semibold">{item.inquiries || 0} family inquiries</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
