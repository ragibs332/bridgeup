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
  Heart,
  AlertTriangle,
  Baby,
  Users,
  CheckCircle2,
  FileCheck,
  MapPin,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Award,
  X,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function HomeLanding() {
  const {
    loginAsUser,
    loginAsNgo,
    loginAsAdmin,
    registerUser,
    authenticateUser,
    ngos,
    currentNgo
  } = useApp();

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' | 'ngo' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Category Filter for NGO Showcase
  const [activeNgoCategory, setActiveNgoCategory] = useState('all');

  // Form states
  const [loginForm, setLoginForm] = useState({
    identifier: 'ragib',
    password: 'password123',
    selectedNgoId: ngos[0]?.id || '',
    adminPasskey: 'admin2026'
  });

  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    location: 'Mumbai, India'
  });

  const openAuthWithRole = (role, mode = 'login') => {
    setSelectedRole(role);
    setAuthMode(mode);
    setAuthError('');
    setIsAuthModalOpen(true);
    if (role === 'user') {
      setLoginForm(prev => ({ ...prev, identifier: 'ragib', password: 'password123' }));
    } else if (role === 'ngo') {
      setLoginForm(prev => ({ ...prev, identifier: 'contact@ashachildcare.org', password: 'password123' }));
    } else if (role === 'admin') {
      setLoginForm(prev => ({ ...prev, identifier: 'superadmin@bridgeup.org', adminPasskey: 'admin2026' }));
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setAuthError('');
    if (role === 'user') {
      setLoginForm(prev => ({ ...prev, identifier: 'ragib', password: 'password123' }));
    } else if (role === 'ngo') {
      setLoginForm(prev => ({ ...prev, identifier: 'contact@ashachildcare.org', password: 'password123' }));
    } else if (role === 'admin') {
      setLoginForm(prev => ({ ...prev, identifier: 'superadmin@bridgeup.org', adminPasskey: 'admin2026' }));
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (selectedRole === 'user') {
      const result = authenticateUser({
        identifier: loginForm.identifier,
        password: loginForm.password
      });
      if (!result.success) {
        setAuthError(result.message);
      } else {
        setIsAuthModalOpen(false);
      }
    } else if (selectedRole === 'ngo') {
      const targetNgo = ngos.find(n => n.id === loginForm.selectedNgoId) || currentNgo || ngos[0];
      loginAsNgo(targetNgo);
      setIsAuthModalOpen(false);
    } else if (selectedRole === 'admin') {
      if (loginForm.adminPasskey.trim() === 'admin2026' || loginForm.adminPasskey.trim() === 'admin') {
        loginAsAdmin();
        setIsAuthModalOpen(false);
      } else {
        setAuthError('Invalid Admin Passkey. Demo passkey: admin2026');
      }
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (signupForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    const result = registerUser({
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name || signupForm.username,
      phone: signupForm.phone,
      location: signupForm.location
    });

    if (!result.success) {
      setAuthError(result.message);
    } else {
      setIsAuthModalOpen(false);
    }
  };

  const filteredNgos = activeNgoCategory === 'all'
    ? ngos
    : ngos.filter(n => n.causeCategory?.toLowerCase().includes(activeNgoCategory.toLowerCase()) || n.causes?.some(c => c.toLowerCase().includes(activeNgoCategory.toLowerCase())));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-teal-500/20 selection:text-brand-teal-900 transition-colors duration-200">
      
      {/* 1. Clean Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              How It Works
            </a>
            <a href="#pillars" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              Core Causes
            </a>
            <a href="#ngos" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              Verified NGOs
            </a>
            <a href="#transparency" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              80G Tax Benefit
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle showLabel={false} />

            <button
              onClick={() => openAuthWithRole('user', 'login')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuthWithRole('user', 'signup')}
              className="px-4 py-2 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Clean, uncluttered, focused */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-teal-50 dark:bg-brand-teal-950/60 border border-brand-teal-200 dark:border-brand-teal-800 text-brand-teal-800 dark:text-brand-mint-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>National Verified Humanitarian Network • 80G Tax Deductible</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Connecting Compassion with <span className="text-brand-teal-700 dark:text-brand-mint-400">Verified Action</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            BridgeUp unites conscious citizens, accredited grassroots NGOs, and platform governance to deliver rapid distress rescue, legal child adoptions, and 100% auditable 80G tax-exempt donations.
          </p>
        </div>

        {/* 3 Main Role Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          
          {/* Card 1: Citizen Portal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Citizen & Donor Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Report emergency distress, fund urgent ration kits, save 50% on income tax with 80G receipts, and join volunteer drives.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => loginAsUser()}
                className="w-full py-2.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enter as Citizen (Demo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openAuthWithRole('user', 'login')}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In / Register
              </button>
            </div>
          </div>

          {/* Card 2: NGO Organization */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">NGO Field Operations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Receive live distress alerts, dispatch ambulances, publish urgent grain appeals, and upload verified intervention proofs.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => loginAsNgo(currentNgo || ngos[0])}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enter as NGO Org (Demo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openAuthWithRole('ngo', 'login')}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                NGO Sign In / Register
              </button>
            </div>
          </div>

          {/* Card 3: Super Admin */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Super Admin</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Audit 80G/12A certificates, verify Darpan credentials, inspect distress dispatches, and ensure platform safety standards.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => loginAsAdmin()}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enter as Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openAuthWithRole('admin', 'login')}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Passkey Verification
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Clean Impact Stats Bar */}
      <section className="bg-brand-teal-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-y border-brand-teal-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-mint-300">₹1.82 Cr+</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">100% Direct Aid</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">14,850+</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">Distress Cases Rescued</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-mint-300">450+</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">Darpan-Vetted NGOs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">&lt; 18 min</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">Average Response Time</div>
          </div>
        </div>
      </section>

      {/* 4. How It Works: Simplified 3-Step Flow */}
      <section id="how-it-works" className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-800 dark:text-brand-mint-400">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Transparent Operations in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Report Distress</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Citizens capture a photo and 1-tap GPS location for child distress, injured animals, or surplus food rescue.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">NGO Dispatched</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nearby verified NGOs accept the ticket in real time, deploy rescue teams, and upload proof of intervention.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">80G Tax Exemption</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Donors receive instant Section 80G Form 10BE tax receipts for 50% tax savings, directly verified by Super Admin.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Core Causes */}
      <section id="pillars" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-800 dark:text-brand-mint-400">
              Impact Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Supporting Communities Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Animal Rescue SOS</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">24/7 veterinary assistance and ambulance dispatch for injured animals.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand-teal-700 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Food & Hunger Mission</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Surplus cooked food rescue from events and dry ration distribution.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                <Baby className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Child Welfare & Adoption</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Education sponsorship and CARA-compliant vetted adoption files.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Elder Care Sanctuaries</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Shelter, geriatric healthcare, and companionship for abandoned seniors.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% 80G Tax Deductions</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Direct bank settlements with automated Form 10BE tax certificates.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-brand-mint-50 dark:bg-brand-mint-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gemini AI Assistant</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">24/7 multilingual conversational guidance in English, हिन्दी, and मराठी.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Verified NGOs Spotlight */}
      <section id="ngos" className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-800 dark:text-brand-mint-400">
              Verified Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Accredited Grassroots NGOs
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Child Welfare', 'Elder Care', 'Animal Rescue', 'Hunger Relief'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveNgoCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeNgoCategory === cat
                    ? 'bg-brand-teal-800 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Causes' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNgos.slice(0, 3).map(ngo => (
            <div
              key={ngo.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ngo.logo}
                      alt={ngo.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{ngo.name}</h4>
                      <p className="text-[11px] text-slate-500">{ngo.city}, {ngo.state}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    ✓ Verified
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ngo.description}
                </p>
              </div>

              <button
                onClick={() => openAuthWithRole('user', 'login')}
                className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-teal-800 hover:text-white text-xs font-bold text-brand-teal-800 dark:text-brand-mint-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Support This NGO &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. 80G Tax Exemption & Statutory Compliance Banner */}
      <section id="transparency" className="py-12 px-4 sm:px-6 lg:px-8 bg-brand-teal-900 text-white border-t border-brand-teal-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-brand-mint-300 uppercase tracking-wider">
              Statutory 80G & 12A Compliance
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Save 50% on Income Tax Under Section 80G
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every donation through BridgeUp settles directly into verified NGO bank accounts and instantly generates Form 10BE tax certificates.
            </p>
          </div>

          <button
            onClick={() => openAuthWithRole('user', 'signup')}
            className="px-6 py-3 rounded-2xl bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-teal-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Create Free Citizen Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            © 2026 BRIDGEUP Humanitarian Platform • NITI Aayog Darpan & 80G Certified
          </p>
          <div className="flex gap-4 text-[11px]">
            <button onClick={() => openAuthWithRole('user', 'login')} className="hover:text-white transition-colors">Citizen</button>
            <button onClick={() => openAuthWithRole('ngo', 'login')} className="hover:text-white transition-colors">NGO Org</button>
            <button onClick={() => openAuthWithRole('admin', 'login')} className="hover:text-white transition-colors">Admin</button>
          </div>
        </div>
      </footer>

      {/* 9. Clean Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Header */}
            <div className="p-5 bg-brand-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">
                  {selectedRole === 'user' ? (authMode === 'login' ? 'Citizen Sign In' : 'Create Citizen Account') : selectedRole === 'ngo' ? 'NGO Portal Sign In' : 'Super Admin Verification'}
                </h3>
                <p className="text-[11px] text-brand-mint-300">
                  {selectedRole === 'user' ? 'Access your donor history & reports' : selectedRole === 'ngo' ? 'Manage field operations' : 'Platform governance'}
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Role Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleRoleChange('user')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'user'
                      ? 'bg-brand-teal-800 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('ngo')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'ngo'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  NGO
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Citizen Mode Switcher */}
              {selectedRole === 'user' && (
                <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-all ${
                      authMode === 'login'
                        ? 'border-brand-teal-800 text-brand-teal-800 dark:text-brand-mint-300 dark:border-brand-mint-400'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className={`flex-1 py-2 font-bold border-b-2 transition-all ${
                      authMode === 'signup'
                        ? 'border-brand-teal-800 text-brand-teal-800 dark:text-brand-mint-300 dark:border-brand-mint-400'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-medium">
                  {authError}
                </div>
              )}

              {/* Sign In Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  {selectedRole === 'ngo' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select NGO</label>
                      <select
                        value={loginForm.selectedNgoId}
                        onChange={(e) => setLoginForm({ ...loginForm, selectedNgoId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        {ngos.map(n => (
                          <option key={n.id} value={n.id}>{n.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : selectedRole === 'admin' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Passkey</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter admin passkey (demo: admin2026)"
                        value={loginForm.adminPasskey}
                        onChange={(e) => setLoginForm({ ...loginForm, adminPasskey: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username or Email</label>
                        <input
                          type="text"
                          required
                          value={loginForm.identifier}
                          onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input
                          type="password"
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all mt-2"
                  >
                    Enter {selectedRole === 'user' ? 'Citizen Space' : selectedRole === 'ngo' ? 'NGO Portal' : 'Admin Console'}
                  </button>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignupSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                      <input
                        type="text"
                        required
                        placeholder="johndoe"
                        value={signupForm.username}
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 chars"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm</label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all mt-2"
                  >
                    Create Citizen Account
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
