import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  PlusCircle,
  AlertTriangle,
  X,
  Send,
  Heart
} from 'lucide-react';

export default function NgoRequirements() {
  const { requirements, postRequirement, currentNgo } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Food Supplies',
    urgency: 'Immediate',
    targetValue: 30000,
    unit: '₹ or grains',
    description: ''
  });

  const ngoRequirements = requirements.filter(r => r.ngoId === currentNgo.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    postRequirement(formData);
    setModalOpen(false);
    setFormData({
      title: '',
      category: 'Food Supplies',
      urgency: 'Immediate',
      targetValue: 30000,
      unit: '₹ or grains',
      description: ''
    });
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-gradient-to-r from-brand-amber-600 to-brand-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-amber-100 text-xs font-bold border border-white/20">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Urgent Shelter & Pantry Needs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Urgent Requirements Board
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Post immediate requirements for ration bags, blankets, medicines, or emergency shelter supplies.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-brand-amber-800 hover:bg-amber-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Requirement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngoRequirements.map(req => {
          const percent = Math.min(100, Math.round((req.raisedValue / req.targetValue) * 100));
          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">
                  🚨 {req.urgency}
                </span>
                <span className="text-slate-500 font-bold">{req.category}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{req.title}</h3>
              <p className="text-xs text-slate-600">{req.description}</p>

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-black text-slate-900">₹{req.raisedValue.toLocaleString()}</span>
                  <span className="text-slate-500 font-semibold">{percent}% of ₹{req.targetValue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-amber-500 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-brand-amber-600 to-brand-amber-500 text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">Post Urgent Requirement</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 300 kg Rice & 100 blankets for winter"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none bg-slate-50"
                  >
                    <option value="Immediate">Immediate (24 hrs)</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                    <option value="Within a Week">Within a Week</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this is urgently needed..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Post Appeal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
