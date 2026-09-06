import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  PlusCircle,
  Calendar,
  TrendingUp,
  X,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function NgoCampaigns() {
  const { campaigns, createCampaign, currentNgo } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Education',
    targetAmount: 250000,
    endDate: '2026-06-30',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    description: ''
  });

  const ngoCampaigns = campaigns.filter(c => c.ngoId === currentNgo.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCampaign(formData);
    setModalOpen(false);
    setFormData({
      title: '',
      category: 'Education',
      targetAmount: 250000,
      endDate: '2026-06-30',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
            <Heart className="w-3.5 h-3.5" />
            <span>Fundraising Programs & Campaigns</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Active Campaigns & Programs
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Launch verified fundraising drives. All donations are automatically receipted with 80G tax benefits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-teal-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ngoCampaigns.map(camp => {
          const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card-soft space-y-4"
            >
              <div className="relative h-44">
                <img src={camp.coverImage} alt={camp.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-extrabold bg-brand-teal-900/90 text-brand-mint-300 px-3 py-1 rounded-full shadow-sm">
                  {camp.category}
                </span>
              </div>

              <div className="p-6 pt-0 space-y-3">
                <h3 className="font-bold text-base text-slate-900 line-clamp-2">{camp.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{camp.description}</p>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-black text-slate-900">₹{camp.raisedAmount.toLocaleString()}</span>
                    <span className="text-slate-500 font-semibold">{percent}% of ₹{camp.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-teal-600 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{camp.donorsCount} Donors</span>
                  <span>Ends: {camp.endDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-brand-teal-900 to-brand-teal-700 text-white p-6 flex items-center justify-between">
              <h3 className="font-bold text-base">Launch New Fundraising Campaign</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-full text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Eye Surgeries & Medicines for 200 Elders"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none bg-slate-50"
                  >
                    <option value="Education">Education</option>
                    <option value="Elder Healthcare">Elder Healthcare</option>
                    <option value="Hunger Relief">Hunger Relief</option>
                    <option value="Animal Welfare">Animal Welfare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Impact</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe where the funds will be utilized..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Publish Campaign to Public Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
