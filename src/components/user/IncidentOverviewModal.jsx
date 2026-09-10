import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function IncidentOverviewModal({ incident, isOpen, onClose }) {
  const { ngos, addToast } = useApp();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !incident) return null;

  // Find assigned NGO details if any
  const assignedNgo = ngos.find(n => n.id === incident.assignedNgoId || n.name === incident.assignedNgoName);

  const handleCopyId = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`BridgeUp Incident ID: ${incident.id} - ${incident.title} (${incident.location})`);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
    addToast('Copied to Clipboard! 📋', 'Incident reference ID copied.', 'info');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `BridgeUp Distress: ${incident.title}`,
        text: `Incident status: ${incident.status}. Category: ${incident.category}. Location: ${incident.location}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyId();
    }
  };

  // Determine stage index: 0 = Reported, 1 = Assigned, 2 = In Progress, 3 = Resolved
  let currentStageIndex = 0;
  if (incident.status === 'Resolved') {
    currentStageIndex = 3;
  } else if (incident.status === 'In Progress' && incident.assignedNgoName) {
    currentStageIndex = 2;
  } else if (incident.assignedNgoName) {
    currentStageIndex = 1;
  }

  const stages = [
    {
      title: 'Distress Reported',
      subtitle: incident.createdAt ? new Date(incident.createdAt).toLocaleString() : 'Recently Reported',
      desc: `Filed by ${incident.reporterName || 'Concerned Citizen'} with live photo evidence and GPS coordinates.`
    },
    {
      title: 'NGO Assigned',
      subtitle: incident.assignedNgoName ? `Assigned to ${incident.assignedNgoName}` : 'Awaiting NGO Dispatch',
      desc: incident.assignedNgoName
        ? `Verified NGO accepted the case and coordinated field rescue units.`
        : `Broadcasting to verified NGOs in this area.`
    },
    {
      title: 'Field Action In Progress',
      subtitle: incident.status === 'In Progress' || incident.status === 'Resolved' ? 'Team On Site' : 'Pending',
      desc: 'Ground teams dispatched to provided GPS landmarks for physical intervention.'
    },
    {
      title: 'Case Resolved',
      subtitle: incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : 'Not Yet Resolved',
      desc: incident.status === 'Resolved'
        ? (incident.resolutionNotes || 'Case verified and resolved successfully.')
        : 'Awaiting field resolution verification and post-action proof.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold">
                REF: {incident.id}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                incident.status === 'Resolved'
                  ? 'bg-emerald-600 text-white'
                  : incident.status === 'In Progress'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-red-600 text-white'
              }`}>
                ● {incident.status.toUpperCase()}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                {incident.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white line-clamp-1">
              {incident.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* 1. Interactive 4-Step Lifecycle Timeline */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Incident Response Lifecycle</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {stages.map((stg, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      isCompleted
                        ? idx === 3
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {stg.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {stg.subtitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {stg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Photo Evidence (Before vs After) */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Visual Evidence Records
            </h3>
            
            <div className={`grid gap-4 ${incident.resolutionPhoto ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Original Report Photo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>📸 Reported Incident Photo (Before)</span>
                  <span className="text-[10px] font-bold text-amber-500">Evidence Verified</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:aspect-square max-h-56">
                  <img
                    src={incident.photo || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'}
                    alt="Original incident"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Resolution Proof Photo (if resolved) */}
              {incident.resolutionPhoto && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>✅ NGO Resolution Proof (After)</span>
                    <span className="text-[10px] font-bold text-emerald-500">Ground Proof</span>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:aspect-square max-h-56">
                    <img
                      src={incident.resolutionPhoto}
                      alt="Resolution Proof"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Incident Description & Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Dispatched Location & Situation Details
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {incident.location || 'Location Not Specified'}
                  </p>
                  {incident.coordinates && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      GPS: {incident.coordinates.lat?.toFixed?.(4) || incident.coordinates.lat || '28.6139'}° N, {incident.coordinates.lng?.toFixed?.(4) || incident.coordinates.lng || '77.2090'}° E
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                {incident.description}
              </p>
            </div>
          </div>

          {/* 4. Assigned NGO Information */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Assigned Organization (NGO) Status
            </h3>

            {incident.assignedNgoName ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {incident.assignedNgoName}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {assignedNgo?.focusArea || 'Authorized Emergency Relief Partner'}
                    </p>
                  </div>
                </div>

                {assignedNgo?.phone && (
                  <a
                    href={`tel:${assignedNgo.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Team</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Awaiting NGO Dispatch
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Disaster broadcast active. Local rescue teams are reviewing the incident.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5. Resolution Notes (if solved) */}
          {incident.status === 'Resolved' && incident.resolutionNotes && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field Resolution Log</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                "{incident.resolutionNotes}"
              </p>
              {incident.resolvedAt && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  Resolved on {new Date(incident.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Ref</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Report</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
}
