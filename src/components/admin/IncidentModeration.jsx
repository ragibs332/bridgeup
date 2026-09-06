import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Flag,
  MapPin,
  Building2,
  User,
  Filter
} from 'lucide-react';

export default function IncidentModeration() {
  const { incidents, moderateIncident, assignIncidentToNgo, ngos, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIncidents = incidents.filter(i => {
    if (selectedCategory === 'all') return true;
    return i.category === selectedCategory;
  });

  const handleFlagSpam = (incidentId) => {
    moderateIncident(incidentId, 'flag_spam', 'Flagged as spam or false report by Admin');
  };

  const handleReassign = (incidentId, ngoId) => {
    const targetNgo = ngos.find(n => n.id === ngoId);
    if (targetNgo) {
      assignIncidentToNgo(incidentId, targetNgo);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-amber-700 via-brand-amber-600 to-brand-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-bold border border-white/20">
            <ShieldAlert className="w-4 h-4" />
            <span>Platform-Wide Safety Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Incident Moderation & Escalation Feed
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            Review incoming distress tickets filed by citizens across India, flag spam/false reports, and reassign cases to verified local NGOs.
          </p>
        </div>

        <span className="p-4 rounded-2xl bg-black/20 backdrop-blur-md text-center min-w-[140px] text-white">
          <div className="text-3xl font-black">{incidents.length}</div>
          <div className="text-xs text-amber-200">Total Reports Logged</div>
        </span>
      </div>

      {/* Incidents Moderation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIncidents.map(inc => (
          <div
            key={inc.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img src={inc.photo} alt={inc.title} className="w-full h-44 object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md ${
                    inc.status === 'Resolved'
                      ? 'bg-emerald-600 text-white'
                      : inc.status === 'In Progress'
                      ? 'bg-amber-500 text-white'
                      : inc.status === 'Rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    ● {inc.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-bold">
                    {inc.category}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 mb-1">{inc.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {inc.location}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{inc.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Reporter: <strong>{inc.reporterName}</strong></span>
                  <span>{inc.reporterPhone}</span>
                </div>
                {inc.assignedNgoName && (
                  <div className="text-emerald-700 font-bold flex items-center gap-1 pt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Assigned: {inc.assignedNgoName}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Moderation Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <select
                  onChange={(e) => handleReassign(inc.id, e.target.value)}
                  defaultValue=""
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                >
                  <option value="" disabled>Assign / Reassign NGO...</option>
                  {ngos.filter(n => n.verificationStatus === 'verified').map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              {inc.status !== 'Rejected' && (
                <button
                  onClick={() => handleFlagSpam(inc.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Flag Spam</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
