import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function UserAuth({ onClose }) {
  const { loginAsUser } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const newUser = {
        id: `user-${Date.now().toString().slice(-4)}`,
        name: formData.name || 'New Citizen',
        email: formData.email || 'citizen@bridgeup.org',
        phone: formData.phone || '+91 98765 00000',
        location: formData.location || 'New Delhi, India',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        totalDonated: 0,
        donationsCount: 0,
        volunteerHours: 0,
        badges: ['New Explorer'],
        savedAdoptions: [],
        donationHistory: []
      };
      loginAsUser(newUser);
    } else {
      loginAsUser({
        id: 'user-1',
        name: formData.name || 'Mohammad Ragib',
        email: formData.email || 'ragib@bridgeup.org',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        totalDonated: 12500,
        donationsCount: 4,
        volunteerHours: 16,
        badges: ['Star Donor', 'Compassion Scout', 'Verified Reporter'],
        savedAdoptions: ['adop-1', 'adop-3'],
        donationHistory: [
          { id: 'TXN-88219', campaignTitle: 'Mission Sharda: School Kits', ngoName: 'Asha Child Care Foundation', amount: 5000, date: '2026-02-20', taxReceipt: '80G-DEL-2026-8821' },
          { id: 'TXN-77312', campaignTitle: 'Winter Warmth & Medical Clinic', ngoName: 'Care & Hope Elder Sanctuary', amount: 3500, date: '2026-01-14', taxReceipt: '80G-MUM-2026-7731' }
        ]
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal-700 flex items-center justify-center text-brand-mint-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{isSignUp ? 'Create Citizen Account' : 'Citizen Sign In'}</h3>
              <p className="text-xs text-brand-mint-200">{isSignUp ? 'Join BridgeUp community' : 'Access your dashboard & reports'}</p>
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
            Sign In (Returning User)
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 text-xs font-bold transition-all ${
              isSignUp ? 'bg-white text-brand-teal-800 border-b-2 border-brand-teal-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            First Time? Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mohammad Ragib"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address or Citizen ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="citizen@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="New Delhi"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isSignUp ? 'Complete Registration & Enter' : 'Sign In to BridgeUp'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-[11px] text-slate-500 pt-2">
            Protected with end-to-end 256-bit encryption. 100% privacy guaranteed.
          </p>
        </form>
      </div>
    </div>
  );
}
