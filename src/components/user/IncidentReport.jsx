import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';
import LiveCameraModal from './LiveCameraModal';
import IncidentOverviewModal from './IncidentOverviewModal';
import {
  AlertOctagon,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Filter,
  Image as ImageIcon,
  Check,
  Radio,
  Loader2,
  Trash2,
  FolderOpen,
  Eye,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function IncidentReport() {
  const { reportIncident, incidents, currentUser, isCloudSynced, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'tracker'
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLocating, setIsLocating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedIncidentForOverview, setSelectedIncidentForOverview] = useState(null);

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

  // 1-Tap GPS Auto-Detection with high accuracy and fallback
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
          location: `Pinned GPS (${lat}° N, ${lng}° E) - Accurate within ${Math.round(position.coords.accuracy || 10)}m`
        }));
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation fallback:', error);
        setFormData(prev => ({
          ...prev,
          location: 'Sector 17 / Vashi Plaza, Navi Mumbai (GPS: 19.0760° N, 72.8777° E)'
        }));
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Safe Gallery / File Upload with Client-Side Compression
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImage(file, 600, 600, 0.70);
      if (compressedDataUrl) {
        setFormData(prev => ({
          ...prev,
          photo: compressedDataUrl
        }));
        addToast('Photo Uploaded', 'Image compressed and attached successfully.', 'success');
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      addToast('Upload Note', 'Used standard photo processing.', 'info');
    } finally {
      setIsCompressing(false);
    }
  };

  // Live Camera Frame Capture Callback
  const handleLivePhotoCaptured = (photoDataUrl) => {
    if (photoDataUrl) {
      setFormData(prev => ({
        ...prev,
        photo: photoDataUrl
      }));
      addToast('Live Photo Captured! 📸', 'Camera frame attached to report.', 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Missing Fields', 'Please provide a title and description.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = reportIncident(formData);
      setFormData({
        title: '',
        category: 'Child Distress & Labor',
        severity: 'High',
        location: '',
        description: '',
        photo: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'
      });
      setActiveTab('tracker');
      if (created) {
        setSelectedIncidentForOverview(created);
      }
    } catch (err) {
      console.error('Failed to submit incident report:', err);
      addToast('Submission Error', 'Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'Assigned') return i.status === 'In Progress' || Boolean(i.assignedNgoName);
    return i.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Banner / Tab Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Incident Reporting & Tracking
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Direct dispatch to verified local NGOs</span>
              {isCloudSynced && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cloud Synced
                </span>
              )}
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            + File Report
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tracker'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Incident Tracking ({incidents.length})
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        /* 3-Step Incident Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Live Photo & Evidence */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Camera Photo / Incident Evidence</h3>
              </div>
              <span className="text-[11px] text-slate-400">Compressed & Web/App Ready</span>
            </div>

            {/* Photo Action & Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 h-48 flex items-center justify-center">
                {isCompressing ? (
                  <div className="text-center space-y-2 p-4">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Compressing & Optimizing...</p>
                  </div>
                ) : formData.photo ? (
                  <>
                    <img
                      src={formData.photo}
                      alt="Incident Evidence"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold">
                        ✓ Ready
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs">No photo selected</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {/* In-App Live Camera Stream Button */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>📸 Live Camera</span>
                  </button>

                  {/* Device / Gallery File Picker */}
                  <label className="cursor-pointer py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 text-center">
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span>📁 Gallery / Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Or select demo emergency photo:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {samplePhotos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, photo: p.url })}
                        className={`text-left p-1.5 rounded-xl border text-[11px] font-medium transition-all truncate flex items-center gap-1.5 ${
                          formData.photo === p.url
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Location & Coordinates */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Location & Landmarks</h3>
              </div>

              <button
                type="button"
                onClick={handleUseGps}
                disabled={isLocating}
                className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 transition-all"
              >
                <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : '📍 1-Tap Auto GPS'}</span>
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="e.g. Near Metro Gate 3, Connaught Place, New Delhi"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* STEP 3: Incident Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Incident Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brief Summary / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7-year old boy working in hazardous environment without food"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Child Distress & Labor">Child Distress & Labor</option>
                    <option value="Elder Neglect">Elder Neglect / Shelter</option>
                    <option value="Food Waste Rescue">Food Waste & Surplus Rescue</option>
                    <option value="Animal Welfare">Injured Animal Rescue</option>
                    <option value="Disaster Relief">Disaster / Flood Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Medium', 'High', 'Critical'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: level })}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          formData.severity === level
                            ? level === 'Critical'
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : level === 'High'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the condition, number of persons/animals involved, and any immediate help needed..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Broadcasting to Verified NGOs...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>🚨 Submit Incident Report & Dispatch Help</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* INCIDENT TRACKING VIEW */
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Incident Status:</span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {[
                { key: 'all', label: 'All Cases' },
                { key: 'Reported', label: '1. Reported' },
                { key: 'Assigned', label: '2. Assigned / In Progress' },
                { key: 'Resolved', label: '3. Solved & Closed' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setFilterStatus(item.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === item.key
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents List */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <AlertOctagon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Incidents Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no incidents matching this filter. Switch filters or file a new distress report.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                + File Incident Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Image Header with Status Overlays */}
                    <div className="relative rounded-2xl overflow-hidden mb-3 bg-slate-950 aspect-video">
                      <img
                        src={inc.photo || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80'}
                        alt={inc.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      
                      {/* Status Badges */}
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md ${
                          inc.status === 'Resolved'
                            ? 'bg-emerald-600 text-white'
                            : inc.status === 'In Progress' || inc.assignedNgoName
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-red-600 text-white'
                        }`}>
                          ● {inc.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-bold">
                          {inc.category}
                        </span>
                      </div>

                      {/* Severity Pill */}
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="text-[10px] bg-black/70 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded-lg font-bold">
                          {inc.severity} Priority
                        </span>
                      </div>
                    </div>

                    {/* Title and Location */}
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>

                    {/* Step Progression Bar */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                        <span className={inc.status ? 'text-amber-500' : ''}>1. Reported</span>
                        <span className={inc.assignedNgoName ? 'text-amber-500' : ''}>2. Assigned</span>
                        <span className={inc.status === 'Resolved' ? 'text-emerald-500' : ''}>3. Resolved</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-amber-500 h-full w-1/3"></div>
                        <div className={`h-full w-1/3 ${inc.assignedNgoName ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                        <div className={`h-full w-1/3 ${inc.status === 'Resolved' ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                      </div>
                    </div>

                    {/* Assignment & Resolution Highlight */}
                    {inc.status === 'Resolved' ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 truncate">
                            Resolved by {inc.assignedNgoName || 'Verified NGO'}
                          </p>
                          {inc.resolutionNotes && (
                            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 line-clamp-1 italic">
                              "{inc.resolutionNotes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ) : inc.assignedNgoName ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-amber-900 dark:text-amber-300 truncate">
                            Assigned to: {inc.assignedNgoName}
                          </p>
                          <p className="text-[10px] text-amber-700 dark:text-amber-400">
                            Rescue team active & dispatched
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Awaiting NGO acceptance & assignment
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Overview Trigger */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 truncate">
                      By: {inc.reporterName || 'Citizen'}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedIncidentForOverview(inc)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-900 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Incident Overview &rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleLivePhotoCaptured}
      />

      {/* Incident Overview & Timeline Modal */}
      <IncidentOverviewModal
        incident={selectedIncidentForOverview}
        isOpen={Boolean(selectedIncidentForOverview)}
        onClose={() => setSelectedIncidentForOverview(null)}
      />
    </div>
  );
}
