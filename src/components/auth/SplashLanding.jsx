import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import Hero3DBridge from '../3d/Hero3DBridge';
import Card3D from '../3d/Card3D';
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
  Compass,
  Play
} from 'lucide-react';
import UserAuth from './UserAuth';
import NgoAuth from './NgoAuth';
import AdminAuth from './AdminAuth';

export default function SplashLanding() {
  const { loginAsUser, loginAsNgo, loginAsAdmin, ngos, currentNgo } = useApp();
  const [authModal, setAuthModal] = useState(null); // 'user' | 'ngo' | 'admin' | null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-brand-mint-300 selection:text-brand-teal-950 relative overflow-hidden transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="lg" />

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 font-semibold">Instant Demo Access:</span>
            <button
              onClick={() => loginAsUser()}
              className="px-3 py-1.5 rounded-xl bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-900 dark:text-brand-mint-300 border border-brand-teal-200 dark:border-brand-teal-800 hover:bg-brand-teal-100 dark:hover:bg-brand-teal-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>User</span>
            </button>
            <button
              onClick={() => loginAsNgo(currentNgo)}
              className="px-3 py-1.5 rounded-xl bg-brand-mint-50 dark:bg-emerald-950/60 text-brand-mint-700 dark:text-emerald-300 border border-brand-mint-200 dark:border-emerald-800 hover:bg-brand-mint-100 dark:hover:bg-emerald-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO</span>
            </button>
            <button
              onClick={() => loginAsAdmin()}
              className="px-3 py-1.5 rounded-xl bg-brand-amber-50 dark:bg-amber-950/60 text-brand-amber-700 dark:text-amber-300 border border-brand-amber-200 dark:border-amber-800 hover:bg-brand-amber-100 dark:hover:bg-amber-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Dark / Light Mode Toggle in Top Right Corner */}
            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive 3D Three.js Bridge */}
      <main className="flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mb-12">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal-100/80 border border-brand-teal-300/60 text-brand-teal-900 text-xs font-bold shadow-sm animate-pulse-subtle">
              <Sparkles className="w-4 h-4 text-brand-amber-500" />
              <span>Transformative Social Good Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Lift Lives, Empower Communities with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-800 via-brand-teal-600 to-brand-amber-500">
                BRIDGEUP
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              A unified platform connecting compassionate citizens, verified NGOs, and platform governance for real-time incident distress reporting, verified adoptions, and transparent 80G tax donations.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setAuthModal('user')}
                className="px-6 py-3.5 rounded-2xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-extrabold text-sm shadow-xl shadow-brand-teal-900/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Get Started (Citizen Portal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthModal('ngo')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-brand-mint-50 text-brand-teal-900 border border-slate-200 font-bold text-sm shadow-sm hover:border-brand-mint-400 transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-brand-mint-600" />
                <span>Register NGO (80G Vetting)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Three.js Bridge & Network Canvas */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-brand-teal-950 via-brand-teal-900 to-slate-950 p-2 shadow-2xl border border-brand-teal-700/60 overflow-hidden group">
              {/* 3D Canvas */}
              <Hero3DBridge />

              {/* Floating 3D Overlay Badges */}
              <div className="absolute top-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-brand-mint-400/40 text-white text-xs shadow-lg">
                <div className="flex items-center gap-2 font-bold text-brand-mint-300">
                  <span className="w-2 h-2 rounded-full bg-brand-mint-400 animate-ping"></span>
                  <span>Interactive 3D Bridge Visualizer</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">Move your cursor to orbit 3D camera</p>
              </div>

              <div className="absolute bottom-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-brand-amber-400/40 text-white text-xs shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-amber-500/20 text-brand-amber-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Active Live Nodes</div>
                  <div className="text-xs font-black text-brand-amber-300">Verified Citizen & NGO Net</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Interactive 3D Tilt Role Selection Cards */}
        <div className="text-center mb-6">
          <span className="text-xs font-black text-brand-teal-800 uppercase tracking-widest bg-brand-teal-50 px-3 py-1 rounded-full border border-brand-teal-200">
            Select Your Role & Experience Dynamic Features
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl mb-16">
          {/* Card 1: Citizen / Public User (with 3D Tilt) */}
          <Card3D depth={25}>
            <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-brand-teal-600 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-teal-800 text-brand-mint-300 flex items-center justify-center mb-6 shadow-md shadow-brand-teal-900/20">
                  <User className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-teal-700 bg-brand-teal-50 px-2.5 py-1 rounded-md">
                    Citizen Portal
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">User & Public</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Report distress cases with GPS & photos, browse vetted child/elder adoption listings, donate to urgent food drives with 80G tax receipts, and volunteer.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>Left 3-Pin Sliding Dashboard Drawer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>Real-Time Incident Solver Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>24/7 Bottom-Left AI Chatbot Assistant</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setAuthModal('user')}
                  className="w-full py-3 px-4 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Login / Register Citizen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loginAsUser()}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-brand-teal-800 hover:bg-brand-teal-50 border border-brand-teal-200 transition-colors"
                >
                  1-Click Quick Demo Login &rarr;
                </button>
              </div>
            </div>
          </Card3D>

          {/* Card 2: NGO Organization (with 3D Tilt) */}
          <Card3D depth={25}>
            <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-brand-mint-500 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-mint-500 text-brand-teal-950 flex items-center justify-center mb-6 shadow-md shadow-brand-mint-600/20">
                  <Building2 className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-mint-700 bg-brand-mint-50 px-2.5 py-1 rounded-md">
                    Organization Portal
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">NGO Organization</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Upload 80G/Gov registration certificates for verification, accept and solve community distress reports with proof, run campaigns, and post urgent needs.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>Left 3-Pin NGO Navigation Drawer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>Incident Solver with "Solved" Archive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-mint-500" />
                    <span>Document Upload & Verified Badge</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setAuthModal('ngo')}
                  className="w-full py-3 px-4 rounded-xl bg-brand-mint-500 hover:bg-brand-mint-400 text-brand-teal-950 font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Login / Register NGO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loginAsNgo(currentNgo)}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-brand-teal-800 hover:bg-brand-mint-50 border border-brand-mint-200 transition-colors"
                >
                  1-Click Quick Demo Login &rarr;
                </button>
              </div>
            </div>
          </Card3D>

          {/* Card 3: Platform Super Admin (with 3D Tilt) */}
          <Card3D depth={25}>
            <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-brand-amber-500 shadow-card-soft hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-amber-500 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-amber-600/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brand-amber-800 bg-brand-amber-50 px-2.5 py-1 rounded-md">
                    Governance Console
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">Platform Admin</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  Review and verify uploaded NGO registration documents, approve sensitive adoption listings, moderate user incident reports, and review bird's-eye platform metrics.
                </p>

                <div className="space-y-2 mb-8 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber-500" />
                    <span>Left 3-Pin Admin Governance Drawer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber-500" />
                    <span>Verify NGO Legal Credentials (80G/Gov)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber-500" />
                    <span>Adoption Safety & Dispute Redressal</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setAuthModal('admin')}
                  className="w-full py-3 px-4 rounded-xl bg-brand-amber-600 hover:bg-brand-amber-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Admin Passkey Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loginAsAdmin()}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-brand-amber-800 hover:bg-brand-amber-50 border border-brand-amber-200 transition-colors"
                >
                  1-Click Quick Demo Login &rarr;
                </button>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Live Platform Stats Row */}
        <div className="w-full max-w-5xl bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-950 rounded-3xl p-8 text-white shadow-2xl border border-brand-teal-700/50">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-brand-mint-300 uppercase tracking-widest">
              Live Platform Impact Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-brand-mint-300">₹19.7L+</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Total Verified Donations</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-brand-amber-400">175+</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Incidents Solved with Proof</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-brand-mint-300">57</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Approved Adoptions & Foster</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-brand-amber-400">210+</div>
              <div className="text-xs text-slate-300 mt-1 font-semibold">Active Registered Volunteers</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 BRIDGEUP Platform. Designed with Deep Teal, Mint & Warm Amber with real-time 3D animation.</p>
      </footer>

      {/* Auth Modals */}
      {authModal === 'user' && <UserAuth onClose={() => setAuthModal(null)} />}
      {authModal === 'ngo' && <NgoAuth onClose={() => setAuthModal(null)} />}
      {authModal === 'admin' && <AdminAuth onClose={() => setAuthModal(null)} />}
    </div>
  );
}
