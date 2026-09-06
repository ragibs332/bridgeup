import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  UploadCloud,
  Send,
  ShieldCheck,
  Filter,
  User,
  Phone,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IncidentSolver() {
  const { incidents, resolveIncident, assignIncidentToNgo, currentNgo, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'solved'
  const [resolvingModal, setResolvingModal] = useState(null); // incident object or null

  const [resolutionForm, setResolutionForm] = useState({
    notes: '',
    photo: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80'
  });

  const sampleResolutionPhotos = [
    { label: 'Food Distributed & Verified', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Elder Admitted to Shelter Room', url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop&q=80' },
    { label: 'Child Rescued & Enrolled in Care', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop&q=80' },
    { label: 'Animal Vet Care Completed', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80' }
  ];

  // Active incidents: either unassigned (Reported) or assigned to this NGO and in progress
  const activeIncidents = incidents.filter(i =>
    (i.status === 'Reported') ||
    (i.assignedNgoId === currentNgo.id && i.status === 'In Progress')
  );

  // Solved incidents: assigned to this NGO and status === 'Resolved'
  const solvedIncidents = incidents.filter(i =>
    i.assignedNgoId === currentNgo.id && i.status === 'Resolved'
  );

  const handleStartWorking = (incident) => {
    assignIncidentToNgo(incident.id, currentNgo);
  };

  const handleOpenResolveModal = (incident) => {
    setResolvingModal(incident);
    setResolutionForm({
      notes: '',
      photo: sampleResolutionPhotos[0].url
    });
  };

  const executeResolution = (e) => {
    e.preventDefault();
    if (!resolutionForm.notes.trim()) return;

    resolveIncident(resolvingModal.id, resolutionForm);
    setResolvingModal(null);
    setActiveTab('solved');

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-amber-600 via-brand-amber-500 to-brand-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-bold border border-white/20">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>NGO Incident Action Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Community Distress Case Management
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            Accept reported cases in your jurisdiction, dispatch ground teams, upload resolution proof, and automatically archive to the Solved Cases registry.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'active'
                ? 'bg-white text-brand-amber-800 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Active / Incoming Cases ({activeIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab('solved')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'solved'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Solved Incidents ({solvedIncidents.length})
          </button>
        </div>
      </div>

      {activeTab === 'active' ? (
        /* Active Incidents View */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold">
              Showing {activeIncidents.length} actionable distress incidents ready for NGO intervention
            </span>
          </div>

          {activeIncidents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeIncidents.map(inc => (
                <div
                  key={inc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="relative rounded-2xl overflow-hidden mb-4">
                      <img src={inc.photo} alt={inc.title} className="w-full h-44 object-cover" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md ${
                          inc.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
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
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{inc.description}</p>

                    {/* Reporter Info */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {inc.reporterName}
                      </span>
                      <span className="text-slate-500 text-[11px]">{inc.reporterPhone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    {inc.status === 'Reported' ? (
                      <button
                        onClick={() => handleStartWorking(inc)}
                        className="w-full py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Accept & Mark In Progress</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenResolveModal(inc)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Proof & Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-slate-900">All Clear! No Active Pending Incidents</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any new distress reports filed by citizens will appear immediately here.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Solved Incidents View */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-bold">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {solvedIncidents.length} Successfully Solved Incidents with Photographic Evidence
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solvedIncidents.map(inc => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    ✓ RESOLVED & VERIFIED
                  </span>
                  <span className="text-xs text-slate-400">
                    {inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{inc.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{inc.location}</p>
                </div>

                {/* Resolution Summary Block */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolution Actions Taken:
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {inc.resolutionNotes}
                  </p>

                  {inc.resolutionPhoto && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-emerald-900 block mb-1">Attached Verification Photo:</span>
                      <img
                        src={inc.resolutionPhoto}
                        alt="Resolution proof"
                        className="w-full h-32 object-cover rounded-xl border border-emerald-300 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Reported by: {inc.reporterName}</span>
                  <span>Handled by: {currentNgo.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Submission Modal */}
      {resolvingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                  Incident Resolution Workflow
                </span>
                <h3 className="font-bold text-base mt-0.5">Solve: {resolvingModal.title}</h3>
              </div>
              <button
                onClick={() => setResolvingModal(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={executeResolution} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resolution Notes & Proof Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Dispatched rescue ambulance at 14:00. Rescued child and safely transferred to shelter home..."
                  value={resolutionForm.notes}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select / Attach Resolution Evidence Photo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sampleResolutionPhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setResolutionForm({ ...resolutionForm, photo: p.url })}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                        resolutionForm.photo === p.url ? 'border-emerald-600 ring-2 ring-emerald-500' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-16 object-cover" />
                      <span className="block text-[10px] font-bold text-slate-800 p-1 bg-white truncate">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Resolution & Move to Solved Registry</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
