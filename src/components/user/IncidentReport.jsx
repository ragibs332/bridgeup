import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UploadCloud,
  Eye,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  Filter
} from 'lucide-react';

export default function IncidentReport() {
  const { reportIncident, incidents, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'tracker'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'Reported' | 'In Progress' | 'Resolved'
  const [isLocating, setIsLocating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Child Distress & Labor',
    severity: 'High',
    location: '',
    description: '',
    photo: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'
  });

  const samplePhotos = [
    { label: 'Child Labor / Distress', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80' },
    { label: 'Elder Neglect / Shelter', url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80' },
    { label: 'Surplus Food Rescue', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80' },
    { label: 'Injured Animal Rescue', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80' }
  ];

  // Native Device GPS Auto-Detection (navigator.geolocation API)
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setFormData(prev => ({
        ...prev,
        location: 'Connaught Place, New Delhi (GPS: 28.6328° N, 77.2197° E)'
      }));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lng = position.coords.longitude.toFixed(4);
        setFormData(prev => ({
          ...prev,
          location: `Pinned GPS Location (${lat}° N, ${lng}° E) - Accurate to within ${Math.round(position.coords.accuracy || 10)}m`
        }));
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error or denied:', error);
        // Fallback default realistic location
        setFormData(prev => ({
          ...prev,
          location: 'Sector 17 / Vashi Plaza, Navi Mumbai (GPS: 19.0760° N, 72.8777° E)'
        }));
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Real Mobile Camera Photo Capture & File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        photo: event.target?.result || ''
      }));
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    reportIncident(formData);
    setFormData({
      title: '',
      category: 'Child Distress & Labor',
      severity: 'High',
      location: '',
      description: '',
      photo: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'
    });
    setActiveTab('tracker');
  };

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-amber-600 via-brand-amber-500 to-brand-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-bold border border-white/20">
            <AlertOctagon className="w-3.5 h-3.5 text-white" />
            <span>Real-Time Citizen Distress Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Report an Incident or Community Emergency
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            Your report immediately alerts verified local NGOs and platform moderators. When an NGO takes action and uploads resolution proof, you will see it updated live here!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'report'
                ? 'bg-white text-brand-amber-800 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            + File New Report
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'tracker'
                ? 'bg-white text-brand-amber-800 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Track Reports ({incidents.length})
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        /* Form View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-amber-500" />
              Incident Incident Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7-year old boy working in brick kiln without food"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none bg-slate-50"
                  >
                    <option value="Child Distress & Labor">Child Distress & Labor</option>
                    <option value="Elder Neglect">Elder Neglect / Abandonment</option>
                    <option value="Food Waste Rescue">Food Waste & Surplus Rescue</option>
                    <option value="Animal Welfare">Injured Animal Rescue</option>
                    <option value="Disaster Relief">Disaster / Flood Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Severity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Medium', 'High', 'Critical'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: level })}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.severity === level
                            ? level === 'Critical'
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : level === 'High'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Location / Landmark</label>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    disabled={isLocating}
                    className="text-xs font-bold text-brand-teal-800 dark:text-brand-mint-400 hover:text-brand-teal-900 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-teal-50 dark:bg-slate-800 border border-brand-teal-200 dark:border-slate-700 shadow-sm transition-all"
                  >
                    <MapPin className={`w-3.5 h-3.5 text-brand-mint-500 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Pinpointing GPS...' : '📍 Auto-Detect Current GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 18 Market, Near Auto Hub, Noida"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide any details about the situation, number of persons affected, urgency, and nearby reference points..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Real Mobile Camera Capture & Photo Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    Incident Evidence Photo
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-amber-50 dark:bg-amber-950/40 text-brand-amber-700 dark:text-amber-300 border border-brand-amber-200 dark:border-brand-amber-800 text-xs font-bold hover:bg-brand-amber-100 transition-all">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? 'Processing...' : '📸 Open Camera / Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected/Captured Photo Preview */}
                {formData.photo && (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-brand-amber-500 max-h-48 w-full bg-slate-950 flex items-center justify-center">
                    <img
                      src={formData.photo}
                      alt="Incident Preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-amber-400" />
                      <span>Ready for Instant Dispatch</span>
                    </div>
                  </div>
                )}

                {/* Quick Presets */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">Or choose scenario template:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, photo: p.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                          formData.photo === p.url ? 'border-brand-amber-500 ring-2 ring-brand-amber-400' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-14 object-cover" />
                        <span className="block text-[10px] font-bold text-slate-800 dark:text-slate-200 p-1 bg-white dark:bg-slate-800 truncate">
                          {p.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-amber-600 to-brand-amber-500 hover:from-brand-amber-500 hover:to-brand-amber-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Incident to Verified NGOs</span>
              </button>
            </form>
          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            <div className="bg-brand-teal-900 text-white rounded-3xl p-6 shadow-card-soft space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-brand-mint-300">
                <ShieldAlert className="w-5 h-5 text-brand-amber-400" />
                Emergency Protocols
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Reports filed here are dispatched in real-time to registered NGOs with rapid rescue vehicles and food vans.
              </p>

              <div className="space-y-2.5 pt-2 text-xs border-t border-brand-teal-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint-400" />
                  <span>GPS Geo-tagging helps rescuers navigate.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint-400" />
                  <span>NGOs must submit proof photos to resolve.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint-400" />
                  <span>Admin moderates fake or duplicate reports.</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-amber-800 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                Life-Threatening Emergency?
              </h4>
              <p className="text-xs leading-relaxed text-amber-800">
                For immediate life threats, call National Emergency <strong>112</strong> or Childline <strong>1098</strong> in addition to logging your ticket here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Tracker View */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Filter Incidents:</span>
            </div>

            <div className="flex gap-1.5">
              {['all', 'Reported', 'In Progress', 'Resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === status
                      ? 'bg-brand-teal-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All Incidents' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIncidents.map(inc => (
              <div
                key={inc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
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
                          : 'bg-red-600 text-white'
                      }`}>
                        ● {inc.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-bold">
                        {inc.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">{inc.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{inc.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>
                </div>

                {/* Resolution Block if resolved by NGO */}
                {inc.status === 'Resolved' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Solved by: {inc.assignedNgoName}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        {inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleDateString() : 'Verified'}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-800 leading-relaxed">
                      "{inc.resolutionNotes}"
                    </p>

                    {inc.resolutionPhoto && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-emerald-900 block mb-1">Resolution Evidence Photo:</span>
                        <img
                          src={inc.resolutionPhoto}
                          alt="Resolution proof"
                          className="w-full h-24 object-cover rounded-xl border border-emerald-300"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Status Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Reported by: <strong>{inc.reporterName || 'Concerned Citizen'}</strong></span>
                  <span>{inc.createdAt ? new Date(inc.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
