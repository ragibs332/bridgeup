import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Heart,
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';

export default function UserProfile() {
  const { currentUser, incidents, adoptions, addToast } = useApp();

  const userIncidents = incidents.filter(
    i => currentUser && (i.reporterEmail === currentUser.email || i.reporterName === currentUser.name)
  );

  const bookmarkedAdoptions = adoptions.filter(a =>
    currentUser?.savedAdoptions?.includes(a.id)
  );

  const handleDownloadReceipt = (receiptId) => {
    addToast('80G Tax Receipt Downloaded 📄', `Official exemption certificate for ${receiptId} generated successfully.`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card-soft">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-brand-teal-600 shadow-lg"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{currentUser?.name || 'Citizen'}</h1>
                <p className="text-xs text-brand-teal-800 dark:text-brand-mint-300 font-bold mt-0.5">Verified Citizen & Community Impact Champion</p>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {currentUser?.badges?.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-900 dark:text-brand-mint-300 border border-brand-teal-200 dark:border-brand-teal-800 text-xs font-bold shadow-sm"
                  >
                    <Award className="w-3.5 h-3.5 text-brand-amber-500" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400 justify-center sm:justify-start pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser?.email || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {currentUser?.phone || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentUser?.location || 'India'}
              </span>
            </div>
          </div>
        </div>

        {/* Impact Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-brand-teal-50/70 dark:bg-brand-teal-950/40 border border-brand-teal-100 dark:border-brand-teal-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-teal-900 dark:text-brand-mint-300">₹{(currentUser?.totalDonated || 0).toLocaleString()}</div>
            <div className="text-xs font-bold text-brand-teal-700 dark:text-brand-mint-400 mt-1">Total Donations (80G)</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-brand-amber-700 dark:text-brand-amber-400">{currentUser?.volunteerHours || 0} hrs</div>
            <div className="text-xs font-bold text-brand-amber-800 dark:text-amber-300 mt-1">Volunteer Hours Logged</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-300">{userIncidents.length}</div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-1">Incidents Reported</div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-indigo-300">{bookmarkedAdoptions.length}</div>
            <div className="text-xs font-bold text-indigo-800 dark:text-indigo-400 mt-1">Adoption Bookmarks</div>
          </div>
        </div>
      </div>

      {/* Two Columns: 80G Tax Receipts + My Incident Reports History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Official 80G Tax Exemption Receipts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-teal-800" />
                80G Tax Exemption Receipts
              </h3>
              <p className="text-xs text-slate-500">Claim 50% income tax deduction under Section 80G</p>
            </div>
          </div>

          <div className="space-y-3">
            {currentUser.donationHistory?.length > 0 ? (
              currentUser.donationHistory.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">₹{item.amount.toLocaleString()}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {item.taxReceipt}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.campaignTitle}</h4>
                    <p className="text-[11px] text-slate-500">{item.ngoName} • {item.date}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadReceipt(item.taxReceipt)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-brand-teal-50 text-brand-teal-900 hover:border-brand-teal-300 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm flex-shrink-0"
                    title="Download Official 80G PDF"
                  >
                    <Download className="w-4 h-4 text-brand-teal-700" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No donations yet. Make a donation to generate instant tax receipts!</p>
            )}
          </div>
        </div>

        {/* Section 2: Reported Incidents by Me */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-brand-amber-500" />
                My Incident Tracking History
              </h3>
              <p className="text-xs text-slate-500">Live progress of distress cases reported by you</p>
            </div>
          </div>

          <div className="space-y-3">
            {userIncidents.length > 0 ? (
              userIncidents.map(inc => (
                <div
                  key={inc.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{inc.title}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      inc.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inc.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{inc.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span className="truncate max-w-[200px]">{inc.location}</span>
                    <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                  </div>

                  {inc.status === 'Resolved' && inc.resolutionNotes && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Resolved by {inc.assignedNgoName}
                      </p>
                      <p className="text-[11px] mt-0.5 text-emerald-800">{inc.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">You haven't reported any incidents yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
