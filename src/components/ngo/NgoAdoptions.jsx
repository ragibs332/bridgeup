import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Baby,
  PlusCircle,
  ShieldCheck,
  Clock,
  CheckCircle2,
  X,
  Send,
  Sparkles
} from 'lucide-react';

export default function NgoAdoptions() {
  const { adoptions, addAdoptionListing, currentNgo } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    category: 'Child',
    gender: 'Female',
    story: '',
    photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
    legalStatus: 'CARA Safety Protocol Verification Attached'
  });

  const ngoListings = adoptions.filter(a => a.ngoId === currentNgo.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdoptionListing(formData);
    setModalOpen(false);
    setFormData({
      name: '',
      age: '',
      category: 'Child',
      gender: 'Female',
      story: '',
      photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
      legalStatus: 'CARA Safety Protocol Verification Attached'
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-mint-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
            <Baby className="w-3.5 h-3.5" />
            <span>Adoption & Foster Listings Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Adoption Profiles & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl">
            Register children and elderly foster companions. For security and child safety, all profiles are reviewed by Platform Admin before appearing on the public portal.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-teal-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Child / Elder Profile</span>
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngoListings.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card-soft space-y-4"
          >
            <div className="relative h-48">
              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md ${
                  item.status === 'Approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  ● {item.status.toUpperCase()}
                </span>
                <span className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-bold">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.age}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3">{item.story}</p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Legal Status:</span>
                  <span className="font-bold text-slate-800">{item.legalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inquiries Received:</span>
                  <span className="font-bold text-brand-teal-800">{item.inquiries || 0} interested families</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-brand-teal-900 to-brand-teal-700 text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">Add Adoption / Foster Profile</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                🛡️ <strong>Safety Clearance Note:</strong> This listing will be routed to Super Admin for verification of medical certificates and CARA clearance before public visibility.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name / Alias</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Aarav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age / Approximate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 years"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none bg-slate-50"
                  >
                    <option value="Child">Child</option>
                    <option value="Siblings">Siblings</option>
                    <option value="Elderly Companion">Elderly Companion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none bg-slate-50"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Story & Hobbies</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe personality, favorite activities, and temperament..."
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Submit for Admin Safety Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
