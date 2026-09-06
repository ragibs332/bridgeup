import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  FileText,
  UploadCloud,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function NgoProfile() {
  const { currentNgo, addToast } = useApp();
  const [uploadedDocs, setUploadedDocs] = useState(currentNgo.documents || []);

  const handleUploadNewDoc = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const newItems = files.map(f => ({
        name: f.name,
        type: 'PDF',
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: '#'
      }));
      setUploadedDocs(prev => [...prev, ...newItems]);
      addToast('Document Uploaded 📄', 'Uploaded document sent to Platform Admin verification queue.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentNgo.logo}
            alt={currentNgo.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-brand-teal-600 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentNgo.name}</h1>
                <p className="text-xs text-brand-teal-800 font-bold mt-0.5">{currentNgo.focusArea}</p>
              </div>

              <div>
                {currentNgo.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified NGO Organization</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-black shadow-sm">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Verification Under Review</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {currentNgo.bio}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-600 justify-center sm:justify-start pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentNgo.contactEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {currentNgo.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {currentNgo.address}
              </span>
            </div>
          </div>
        </div>

        {/* Legal Identifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration Number</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentNgo.registrationNumber}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PAN / 80G Tax ID</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentNgo.panNumber}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FCRA Registration</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentNgo.fcraNumber}</span>
          </div>
        </div>
      </div>

      {/* Uploaded Verification Documents */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-teal-800" />
              Official Registration & Tax Documents
            </h3>
            <p className="text-xs text-slate-500">Visible to Super Admin for credentials verification</p>
          </div>

          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Additional Certificate</span>
            <input type="file" multiple className="hidden" onChange={handleUploadNewDoc} />
          </label>
        </div>

        <div className="space-y-3">
          {uploadedDocs.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-brand-teal-100 text-brand-teal-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  PDF
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500">Size: {doc.size} • Uploaded: {doc.uploadDate}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex-shrink-0">
                Uploaded & Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
