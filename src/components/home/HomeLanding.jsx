import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import Hero3DBridge from '../3d/Hero3DBridge';
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
  ChevronRight,
  TrendingUp,
  FileCheck,
  MapPin,
  Lock,
  Mail,
  Eye,
  EyeOff,
  HeartHandshake,
  ShieldAlert,
  UserPlus,
  LogIn,
  Award,
  X
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
    identifier: 'ragib', // Username or Email
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
        setAuthError('Invalid Admin Master Passkey. Use demo key: admin2026');
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-mint-300 selection:text-brand-teal-950 transition-colors duration-200">
      
      {/* 1. World-Class Sticky Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Logo size="lg" />

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              How It Works
            </a>
            <a href="#pillars" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              Core Causes
            </a>
            <a href="#impact" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              Impact
            </a>
            <a href="#ngos" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              Verified NGOs
            </a>
            <a href="#transparency" className="hover:text-brand-teal-700 dark:hover:text-brand-mint-300 transition-colors">
              80G Tax Exemption
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle showLabel={false} />

            <button
              onClick={() => openAuthWithRole('user', 'login')}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuthWithRole('user', 'signup')}
              className="px-4 py-2 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white text-xs font-extrabold shadow-md shadow-brand-teal-900/20 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Interactive 3D Bridge & Value Proposition */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Mission, Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-100/80 dark:bg-brand-teal-950/60 border border-brand-teal-300/60 dark:border-brand-teal-800 text-brand-teal-900 dark:text-brand-mint-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber-500" />
              <span>National Humanitarian Network • 100% Tax Deductible (80G)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18]">
              Connecting Compassion with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-800 via-brand-teal-600 to-brand-amber-500 dark:from-brand-mint-400 dark:via-brand-mint-300 dark:to-brand-amber-400">
                Verified Action
              </span>{' '}
              Across India.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              BridgeUp unites conscious citizens, accredited grassroots NGOs, and platform governance to deliver rapid emergency distress dispatch, legal child & elder adoptions, and transparent 80G tax-exempt donations.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => openAuthWithRole('user', 'signup')}
                className="px-6 py-3.5 rounded-2xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-extrabold text-sm shadow-xl shadow-brand-teal-900/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Enter Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuthWithRole('user', 'login')}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-sm shadow-sm hover:border-brand-teal-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-brand-amber-500" />
                <span>Report Emergency Distress</span>
              </button>
            </div>

            {/* Quick 1-Click Demo Shortcut Strip */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  ⚡ 1-Click Instant Demo Portals:
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  onClick={() => loginAsUser()}
                  className="px-3 py-1.5 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-900 dark:text-brand-mint-300 border border-brand-teal-200 dark:border-brand-teal-800 text-xs font-bold hover:bg-brand-teal-100 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Citizen User</span>
                </button>
                <button
                  onClick={() => loginAsNgo(currentNgo || ngos[0])}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>NGO Organization</span>
                </button>
                <button
                  onClick={() => loginAsAdmin()}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Three.js Bridge Visualization */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-brand-teal-950 via-brand-teal-900 to-slate-950 p-2 shadow-2xl border border-brand-teal-700/60 overflow-hidden group">
              <Hero3DBridge />

              {/* Floating Badge 1: 3D Visualizer Tip */}
              <div className="absolute top-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-brand-mint-400/30 text-white text-xs shadow-lg">
                <div className="flex items-center gap-2 font-bold text-brand-mint-300">
                  <span className="w-2 h-2 rounded-full bg-brand-mint-400 animate-ping"></span>
                  <span>Interactive 3D Compassion Bridge</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">Move mouse to explore live digital twin</p>
              </div>

              {/* Floating Badge 2: Live Network Node Stats */}
              <div className="absolute bottom-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-brand-amber-400/30 text-white text-xs shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-amber-500/20 text-brand-amber-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Active Live Nodes</div>
                  <div className="text-xs font-black text-brand-amber-300">Pan-India Verified Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Verified Impact Metrics Ticker */}
      <section id="impact" className="bg-brand-teal-900 dark:bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-y border-brand-teal-700/40 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-mint-300">₹1.82 Cr+</div>
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Aid Delivered (100% 80G)</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-amber-400">14,850+</div>
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Distress Cases Rescued</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-brand-mint-300">450+</div>
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Darpan-Vetted NGOs</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">&lt; 18 min</div>
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Average Emergency Triage</div>
          </div>
        </div>
      </section>

      {/* 4. How BridgeUp Works (3-Step Professional Flow) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-teal-700 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-brand-teal-950/60 px-3 py-1 rounded-full border border-brand-teal-200 dark:border-brand-teal-800">
            Streamlined Operational Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How BridgeUp Delivers Transparent Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Every step is authenticated, geolocated, and auditable under platform governance rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card-soft relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 flex items-center justify-center font-black text-lg mb-6 border border-brand-teal-200 dark:border-brand-teal-800">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Citizen Emergency & Need Report
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Citizens capture photo evidence and native GPS location for injured stray animals, surplus food rescue, child labor, or elder neglect with automatic AI triage.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card-soft relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-brand-amber-600 dark:text-brand-amber-400 flex items-center justify-center font-black text-lg mb-6 border border-amber-200 dark:border-amber-800">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Nearest Verified NGO Dispatched
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Geo-targeted dispatch notifies pre-vetted local NGO teams, who accept the distress ticket, deploy rescue vans, and upload timestamped proof of intervention.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card-soft relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-lg mb-6 border border-emerald-200 dark:border-emerald-800">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              100% Auditable 80G Tax Exemption
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Donors and supporters track real-time milestone delivery and instantly receive official 80G / Form 10BE tax exemption certificates for 50% tax savings.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Core Cause Pillars */}
      <section id="pillars" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-teal-700 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-brand-teal-950/60 px-3 py-1 rounded-full border border-brand-teal-200 dark:border-brand-teal-800">
              Holistic Impact Spectrum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Five Pillars of Humanitarian Relief
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              From emergency animal rescue to legal child adoptions and senior health.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-brand-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency & Stray Animal Rescue</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                24/7 rapid veterinary ambulance dispatch for injured street dogs, cattle, and birds with live recovery tracking.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-brand-teal-700 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Food Rescue & Hunger Mission</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero-waste excess cooked food collection from events and daily dry ration kits distribution to urban slums.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Child Welfare & Verified Adoptions</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Education sponsorship, school kits, and CARA-compliant vetted adoption & foster matching with legal audit logs.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Elder Care & Geriatric Sanctuaries</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Shelter for abandoned seniors, specialized geriatric healthcare, cataract surgeries, and foster companionship.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Tax Deductible 80G Donations</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct bank settlement to verified NGO accounts with automatic Form 10BE tax receipts delivered to your inbox.
              </p>
            </div>

            {/* Pillar 6: AI Assistant */}
            <div className="bg-gradient-to-br from-brand-teal-900 to-brand-teal-950 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-brand-mint-300 flex items-center justify-center border border-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multimodal Gemini AI Assistant</h3>
              <p className="text-xs text-brand-mint-100 leading-relaxed">
                24/7 multilingual conversational guidance (English, हिन्दी, मराठी), photo diagnosis, and 1-click emergency incident dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Verified NGOs Showcase */}
      <section id="ngos" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-teal-700 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-brand-teal-950/60 px-3 py-1 rounded-full border border-brand-teal-200 dark:border-brand-teal-800">
              Verified Partner Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Grassroots NGOs with Proven Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Every NGO on BridgeUp undergoes statutory 80G/12A and NITI Aayog Darpan vetting.
            </p>
          </div>

          {/* Cause Category Filters */}
          <div className="flex flex-wrap gap-2">
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

        {/* NGO Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNgos.slice(0, 3).map(ngo => (
            <div
              key={ngo.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={ngo.logo}
                      alt={ngo.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-teal-600/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{ngo.name}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{ngo.city}, {ngo.state}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300/40 uppercase">
                    ✓ Verified
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {ngo.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-[11px] mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Darpan Reg ID:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{ngo.darpanId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tax Exemption:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{ngo.taxExemptionStatus}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openAuthWithRole('user', 'login')}
                className="w-full py-2.5 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-800 dark:text-brand-mint-300 hover:bg-brand-teal-800 hover:text-white dark:hover:bg-brand-teal-800 text-xs font-bold transition-all border border-brand-teal-200 dark:border-brand-teal-800 flex items-center justify-center gap-1.5"
              >
                <span>Support This NGO &rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Statutory Transparency & 80G Tax Exemption Section */}
      <section id="transparency" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-teal-900 via-brand-teal-950 to-slate-950 text-white border-t border-brand-teal-700/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-brand-mint-300 text-xs font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4 text-brand-amber-400" />
              <span>Statutory Compliance & Legal Vetting</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Maximize Social Good & Save 50% on Income Tax Under Section 80G
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every NGO registered on BridgeUp undergoes strict 4-step statutory compliance audits, including Section 12A registration, Section 80G validity, NITI Aayog Darpan UID verification, and verified NGO bank account linkage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-brand-mint-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Form 10BE Tax Receipts</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Automated IT-compliant receipts issued for every donation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-brand-mint-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">0% Platform Cut to NGOs</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">100% of donor funding settles directly into vetted charity accounts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-amber-400" />
              <span>BridgeUp Governance Assurance</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-mint-400"></span>
                <span>Annual filing audits & CSR-1 registration check</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-mint-400"></span>
                <span>GPS camera verification on distress ticket resolution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-mint-400"></span>
                <span>Escrow dispute arbitration managed by Platform Super Admin</span>
              </li>
            </ul>

            <button
              onClick={() => openAuthWithRole('user', 'signup')}
              className="w-full py-3 rounded-2xl bg-brand-mint-400 hover:bg-brand-mint-300 text-brand-teal-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <span>Join Verified Network Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-slate-400 leading-relaxed">
              India's premier verified humanitarian network connecting citizens, grassroots NGOs, and government compliance for transparent social welfare.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Core Portals</h4>
            <ul className="space-y-2">
              <li><button onClick={() => openAuthWithRole('user', 'login')} className="hover:text-white transition-colors">Citizen & Donor Space</button></li>
              <li><button onClick={() => openAuthWithRole('ngo', 'login')} className="hover:text-white transition-colors">NGO Field Operations</button></li>
              <li><button onClick={() => openAuthWithRole('admin', 'login')} className="hover:text-white transition-colors">Super Admin Governance</button></li>
              <li><button onClick={() => openAuthWithRole('user', 'signup')} className="hover:text-white transition-colors">Create Free Account</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Social Causes</h4>
            <ul className="space-y-2">
              <li>Emergency Distress & Animal SOS</li>
              <li>Hunger Relief & Food Rescue</li>
              <li>Child Welfare & Legal Adoption</li>
              <li>Senior Citizen Shelter & Healthcare</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Compliance & Support</h4>
            <p className="leading-relaxed mb-2">
              Section 80G & 12A Certified • NITI Aayog Darpan Vetted • MCA CSR Compliance.
            </p>
            <div className="text-brand-mint-300 font-bold">
              24/7 AI Emergency Helpline Available
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © 2026 BRIDGEUP Humanitarian Platform • All rights reserved. Registered under Public Charitable Trust Regulations.
        </div>
      </footer>

      {/* 9. Seamless Authentication Modal (Sign In / Create Account with Real Username/Password) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-900 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                  <span className="text-[11px] font-bold text-brand-mint-300">Authentication Portal</span>
                </div>
                <h3 className="text-lg font-black">
                  {selectedRole === 'user' ? (authMode === 'login' ? 'Sign In to Citizen Space' : 'Create New Citizen Account') : selectedRole === 'ngo' ? 'NGO Organization Login' : 'Super Admin Passkey Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Role Selection Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
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
                  <span>NGO Org</span>
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

              {/* Citizen Mode Switcher: Sign In vs Create Account */}
              {selectedRole === 'user' && (
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                      authMode === 'login'
                        ? 'border-brand-teal-800 text-brand-teal-800 dark:text-brand-mint-300 dark:border-brand-mint-400'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                      authMode === 'signup'
                        ? 'border-brand-teal-800 text-brand-teal-800 dark:text-brand-mint-300 dark:border-brand-mint-400'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create New Account</span>
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Sign Up Form */}
              {selectedRole === 'user' && authMode === 'signup' ? (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Choose Username *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. mohammad_ragib"
                        value={signupForm.username}
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mohammad Ragib"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="citizen@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Citizen Account & Enter</span>
                  </button>
                </form>
              ) : (
                /* Sign In Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* NGO Organization Selection */}
                  {selectedRole === 'ngo' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Select Registered Organization
                      </label>
                      <select
                        value={loginForm.selectedNgoId}
                        onChange={(e) => setLoginForm({ ...loginForm, selectedNgoId: e.target.value })}
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

                  {/* Username or Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {selectedRole === 'admin' ? 'Admin Username / Email' : 'Username or Email Address'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                        placeholder="Enter username or email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                        {selectedRole === 'admin' ? 'Master Admin Passkey' : 'Password'}
                      </label>
                      {selectedRole === 'user' && (
                        <span
                          onClick={() => setAuthMode('signup')}
                          className="text-[11px] text-brand-teal-700 dark:text-brand-mint-400 cursor-pointer hover:underline"
                        >
                          New user? Register
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={selectedRole === 'admin' ? loginForm.adminPasskey : loginForm.password}
                        onChange={(e) => {
                          if (selectedRole === 'admin') {
                            setLoginForm({ ...loginForm, adminPasskey: e.target.value });
                          } else {
                            setLoginForm({ ...loginForm, password: e.target.value });
                          }
                        }}
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
              )}

              {/* 1-Click Demo Shortcut */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Instant Demo:{' '}
                  <button
                    type="button"
                    onClick={() => { loginAsUser(); setIsAuthModalOpen(false); }}
                    className="font-bold text-brand-teal-700 dark:text-brand-mint-400 hover:underline"
                  >
                    Citizen
                  </button>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => { loginAsNgo(currentNgo || ngos[0]); setIsAuthModalOpen(false); }}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    NGO
                  </button>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => { loginAsAdmin(); setIsAuthModalOpen(false); }}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Admin
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
