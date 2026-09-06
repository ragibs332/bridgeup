import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import {
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  HeartHandshake,
  ShieldAlert
} from 'lucide-react';

export default function UnifiedLoginLanding() {
  const {
    loginAsUser,
    loginAsNgo,
    loginAsAdmin,
    ngos,
    currentNgo
  } = useApp();

  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'ngo' | 'admin'
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: 'Mohammad Ragib',
    email: 'ragib@bridgeup.org',
    password: 'password123',
    selectedNgoId: ngos[0]?.id || '',
    ngoName: 'Asha Child Care Foundation',
    adminPasskey: 'admin2026'
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'user') {
      setFormData(prev => ({ ...prev, email: 'ragib@bridgeup.org', name: 'Mohammad Ragib' }));
    } else if (role === 'ngo') {
      setFormData(prev => ({ ...prev, email: 'contact@ashachildcare.org' }));
    } else if (role === 'admin') {
      setFormData(prev => ({ ...prev, email: 'superadmin@bridgeup.org' }));
    }
  };

  const handleStandardSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'user') {
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
          { id: 'TXN-88219', campaignTitle: 'Mission Sharda: School Kits', ngoName: 'Asha Child Care Foundation', amount: 5000, date: '2026-02-20', taxReceipt: '80G-DEL-2026-8821' }
        ]
      });
    } else if (selectedRole === 'ngo') {
      const targetNgo = ngos.find(n => n.id === formData.selectedNgoId) || currentNgo || ngos[0];
      loginAsNgo(targetNgo);
    } else if (selectedRole === 'admin') {
      loginAsAdmin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-brand-mint-300 selection:text-brand-teal-950 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
              Transformative Humanitarian Network
            </span>
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </header>

      {/* Main Login Screen Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Left Column: Brand & Value Proposition Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient visual orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mint-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-mint-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber-400" />
                <span>Unified Civic & Social Good</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Welcome to <span className="text-brand-mint-300">BRIDGEUP</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Connect directly with verified NGOs across India for emergency distress dispatch, 80G tax donations, and child/elder adoptions.
              </p>
            </div>

            {/* Instant Demo Login Preset Box */}
            <div className="mt-6 pt-6 border-t border-white/15 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-mint-300">
                  ⚡ 1-Click Demo Login
                </span>
                <span className="text-[10px] bg-brand-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full border border-brand-amber-400/30 font-bold">
                  No Password Required
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loginAsUser()}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-center transition-all group hover:scale-105"
                  title="Demo Citizen Login"
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-brand-mint-300 group-hover:text-white" />
                  <span className="block text-[11px] font-bold text-white">Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsNgo(currentNgo || ngos[0])}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-center transition-all group hover:scale-105"
                  title="Demo NGO Worker Login"
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-300 group-hover:text-white" />
                  <span className="block text-[11px] font-bold text-white">NGO Org</span>
                </button>

                <button
                  type="button"
                  onClick={() => loginAsAdmin()}
                  className="p-2.5 rounded-xl bg-brand-amber-500/20 hover:bg-brand-amber-500/30 border border-brand-amber-400/30 text-center transition-all group hover:scale-105"
                  title="Demo Super Admin Login"
                >
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-brand-amber-300 group-hover:text-white" />
                  <span className="block text-[11px] font-bold text-white">Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Role Selection Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Select Login Role:
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('user')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === 'user'
                        ? 'bg-brand-teal-800 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('ngo')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === 'ngo'
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>NGO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === 'admin'
                        ? 'bg-brand-amber-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleStandardSubmit} className="space-y-4">
                {/* Role Specific Notice */}
                {selectedRole === 'user' && (
                  <div className="p-3 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/40 border border-brand-teal-200 dark:border-brand-teal-800 text-xs text-brand-teal-900 dark:text-brand-mint-300 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                    <span>Citizen Portal: Report distress, track resolutions & claim 80G tax receipts.</span>
                  </div>
                )}

                {selectedRole === 'ngo' && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>NGO Workspace: Solve dispatched local distress incidents and publish urgent needs.</span>
                  </div>
                )}

                {selectedRole === 'admin' && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-brand-amber-600 flex-shrink-0" />
                    <span>Super Admin Governance: Review statutory 80G/12A legal documents and moderate feeds.</span>
                  </div>
                )}

                {/* If NGO role, allow instant selection of any registered NGO organization */}
                {selectedRole === 'ngo' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Select Registered Organization
                    </label>
                    <select
                      value={formData.selectedNgoId}
                      onChange={(e) => setFormData({ ...formData, selectedNgoId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {ngos.map(n => (
                        <option key={n.id} value={n.id}>
                          {n.name} ({n.city} - {n.verificationStatus.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Email / Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {selectedRole === 'admin' ? 'Super Admin ID / Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@bridgeup.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password / Passkey */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                      {selectedRole === 'admin' ? 'Admin Master Passkey' : 'Password'}
                    </label>
                    <span className="text-[11px] text-brand-teal-700 dark:text-brand-mint-400 cursor-pointer hover:underline">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 ${
                    selectedRole === 'admin'
                      ? 'bg-brand-amber-600 hover:bg-brand-amber-500'
                      : selectedRole === 'ngo'
                      ? 'bg-emerald-700 hover:bg-emerald-600'
                      : 'bg-brand-teal-800 hover:bg-brand-teal-700'
                  }`}
                >
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Demo Switcher Shortcut */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Want to bypass login? Click{' '}
                <button
                  type="button"
                  onClick={() => loginAsUser()}
                  className="font-bold text-brand-teal-700 dark:text-brand-mint-400 hover:underline"
                >
                  Demo Login (Citizen)
                </button>
                {' · '}
                <button
                  type="button"
                  onClick={() => loginAsNgo(currentNgo || ngos[0])}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Demo (NGO)
                </button>
                {' · '}
                <button
                  type="button"
                  onClick={() => loginAsAdmin()}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Demo (Admin)
                </button>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
        © 2026 BRIDGEUP Humanitarian Platform • Certified 80G & Legal Compliance Attestation
      </footer>
    </div>
  );
}
