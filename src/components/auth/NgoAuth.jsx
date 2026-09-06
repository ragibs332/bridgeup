import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, FileText, UploadCloud, ShieldCheck, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function NgoAuth({ onClose }) {
  const { loginAsNgo, registerNewNgo, ngos } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedExistingNgoId, setSelectedExistingNgoId] = useState(ngos[0]?.id || '');
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Govt_Societies_Registration_Cert.pdf', size: '2.4 MB' },
    { name: '80G_12A_Tax_Exemption_Order.pdf', size: '1.2 MB' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    panNumber: '',
    focusArea: 'Child Welfare & Education',
    location: '',
    contactEmail: '',
    phone: '',
    bio: '',
    password: ''
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const newDocs = files.map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...newDocs]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const createdNgo = registerNewNgo({
        name: formData.name || 'Hope Foundation',
        registrationNumber: formData.registrationNumber || 'NGO-DEL-2026-9912',
        panNumber: formData.panNumber || 'AAATE9912L',
        fcraNumber: 'FCRA-APPLIED',
        focusArea: formData.focusArea,
        location: formData.location || 'New Delhi, India',
        contactEmail: formData.contactEmail || 'contact@ngo.org',
        phone: formData.phone || '+91 98110 00000',
        bio: formData.bio || 'Working for humanitarian relief and child care across India.',
        documents: uploadedFiles.map(d => ({
          name: d.name,
          type: 'PDF',
          size: d.size,
          uploadDate: new Date().toISOString().split('T')[0],
          url: '#'
        }))
      });
    } else {
      const existing = ngos.find(n => n.id === selectedExistingNgoId) || ngos[0];
      loginAsNgo(existing);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-mint-500 text-brand-teal-950 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{isSignUp ? 'Register NGO Organization' : 'NGO Portal Sign In'}</h3>
              <p className="text-xs text-brand-mint-200">{isSignUp ? 'Requires Admin document verification' : 'Access organization console'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              !isSignUp ? 'bg-white text-brand-teal-800 border-b-2 border-brand-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In Existing NGO
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              isSignUp ? 'bg-white text-brand-teal-800 border-b-2 border-brand-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New NGO Registration
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isSignUp ? (
            /* Returning NGO Sign In */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Registered NGO</label>
                <select
                  value={selectedExistingNgoId}
                  onChange={(e) => setSelectedExistingNgoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none bg-slate-50"
                >
                  {ngos.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.verificationStatus.toUpperCase()}) - {n.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Contact Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    defaultValue="contact@ashachildcare.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portal Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* New NGO Sign Up with Document Uploads */
            <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NGO Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hope Foundation for Humanity"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration No. / Darpan ID</label>
                  <input
                    type="text"
                    required
                    placeholder="NGO-DEL-2026-XXXX"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PAN / Tax ID</label>
                  <input
                    type="text"
                    required
                    placeholder="AAATE1234K"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focus Area</label>
                  <select
                    value={formData.focusArea}
                    onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none bg-slate-50"
                  >
                    <option value="Child Welfare & Education">Child Welfare & Education</option>
                    <option value="Elder Care & Hospice">Elder Care & Hospice</option>
                    <option value="Hunger Relief & Food Rescue">Hunger Relief & Food Rescue</option>
                    <option value="Animal Welfare">Animal Welfare</option>
                    <option value="Disaster Relief & Environment">Disaster Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headquarters Location</label>
                  <input
                    type="text"
                    required
                    placeholder="Kolkata, West Bengal"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@ngo.org"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98300..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mission / Bio</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of your initiatives and impact..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none resize-none"
                />
              </div>

              {/* Document Upload Simulation */}
              <div className="p-3.5 rounded-2xl bg-brand-teal-50/60 border border-brand-teal-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-teal-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-mint-600" />
                    Upload Verification Documents (80G / Trust Deed / Gov Reg)
                  </span>
                  <label className="cursor-pointer text-[11px] font-bold text-brand-teal-700 hover:text-brand-teal-900 bg-white px-2.5 py-1 rounded-lg border border-brand-teal-300 shadow-sm">
                    + Add File
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                <div className="space-y-1.5">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-teal-100 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-brand-teal-600" />
                        <span className="text-slate-800 truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{f.size}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-brand-teal-800 mt-2 font-medium">
                  Note: Documents will be sent to Super Admin for verification before public verified badge is issued.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSignUp ? 'Submit NGO for Admin Verification' : 'Sign In to NGO Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
