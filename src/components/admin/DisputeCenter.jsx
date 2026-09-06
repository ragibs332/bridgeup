import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Building2,
  FileText,
  Send
} from 'lucide-react';

export default function DisputeCenter() {
  const { disputes, resolveDispute, addToast } = useApp();
  const [resolutionText, setResolutionText] = useState('');
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);

  const handleResolve = (disputeId) => {
    if (!resolutionText.trim()) return;
    resolveDispute(disputeId, resolutionText);
    setResolutionText('');
    setSelectedDisputeId(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-brand-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-red-100 text-xs font-bold border border-white/20">
            <Scale className="w-4 h-4" />
            <span>Platform Grievance & Tax Redressal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Dispute & Grievance Resolution Desk
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
            Investigate donor claims regarding 80G tax certificates, inspect community spam flags, and resolve user-NGO disputes with complete audit logs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-md text-center min-w-[140px] text-white">
          <div className="text-3xl font-black">{disputes.filter(d => d.status === 'Pending Admin Review').length}</div>
          <div className="text-xs text-red-200">Open Grievances</div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map(disp => (
          <div
            key={disp.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                  disp.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800 animate-pulse'
                }`}>
                  ● {disp.status.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-slate-500">{disp.category}</span>
              </div>

              <span className="text-xs text-slate-400">
                Logged: {new Date(disp.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">{disp.subject}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {disp.details}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 pt-1">
              <span>Raised by: <strong>{disp.raisedBy}</strong></span>
              <span>Target Entity: <strong>{disp.againstNgo}</strong></span>
            </div>

            {disp.status === 'Resolved' ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resolution Action:
                </p>
                <p className="text-[11px] mt-0.5 text-emerald-800">{disp.resolutionNote}</p>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter official admin resolution remarks..."
                    value={selectedDisputeId === disp.id ? resolutionText : ''}
                    onChange={(e) => {
                      setSelectedDisputeId(disp.id);
                      setResolutionText(e.target.value);
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleResolve(disp.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolve Case</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
