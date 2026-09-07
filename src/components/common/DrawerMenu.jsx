import React from 'react';
import { useApp } from '../../context/AppContext';
import Logo from './Logo';
import {
  LayoutDashboard,
  User,
  HeartHandshake,
  Heart,
  Baby,
  AlertOctagon,
  Users,
  LogOut,
  X,
  FileText,
  ShieldCheck,
  PhoneCall,
  Building2,
  FileCheck,
  Scale,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DrawerMenu() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    currentRole,
    activeUserTab,
    setActiveUserTab,
    activeNgoTab,
    setActiveNgoTab,
    activeAdminTab,
    setActiveAdminTab,
    currentUser,
    currentNgo,
    logout,
    incidents,
    ngos,
    adoptions,
    disputes
  } = useApp();

  if (!isDrawerOpen) return null;

  const activeReportsCount = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress').length;
  const pendingNgoCount = ngos.filter(n => n.verificationStatus === 'pending').length;
  const pendingAdopCount = adoptions.filter(a => a.status === 'Pending Admin Review').length;
  const pendingDisputeCount = disputes.filter(d => d.status === 'Pending Admin Review').length;

  // Role-specific drawer menus
  const userMenuItems = [
    {
      id: 'dashboard',
      label: 'Home Dashboard',
      icon: LayoutDashboard,
      description: 'Overview, quick actions & news'
    },
    {
      id: 'profile',
      label: 'My Profile & Tax Receipts',
      icon: User,
      description: 'Badges, donation 80G history, hours'
    },
    {
      id: 'incident-report',
      label: 'Incident Reporting',
      icon: AlertOctagon,
      badge: activeReportsCount > 0 ? `${activeReportsCount} Active` : null,
      badgeColor: 'bg-brand-amber-500 text-white',
      description: 'Report child distress, elder neglect, food rescue'
    },
    {
      id: 'donations',
      label: 'Donations & Urgent Needs',
      icon: Heart,
      description: 'Verified campaigns, food ration & supplies'
    },
    {
      id: 'adoptions',
      label: 'Adoption & Companionship',
      icon: Baby,
      description: 'Vetted child & elder foster profiles'
    },
    {
      id: 'volunteers',
      label: 'Volunteer Drives',
      icon: Users,
      description: 'Join local weekend teaching & food drives'
    }
  ];

  const ngoMenuItems = [
    {
      id: 'dashboard',
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
      description: 'Fundraising, adoption rate & impact metrics'
    },
    {
      id: 'incident-solver',
      label: 'Incident Solver Hub',
      icon: AlertOctagon,
      badge: activeReportsCount > 0 ? `${activeReportsCount} Pending` : null,
      badgeColor: 'bg-brand-amber-500 text-white',
      description: 'Accept cases, upload proof & move to Solved'
    },
    {
      id: 'campaigns',
      label: '80G Campaigns & Programs',
      icon: Heart,
      description: 'Launch and manage fundraising drives'
    },
    {
      id: 'requirements',
      label: 'Urgent Requirements Board',
      icon: ShoppingBag,
      description: 'Post emergency appeals for food & funds'
    },
    {
      id: 'adoptions',
      label: 'Adoption Listings & Inquiries',
      icon: Baby,
      description: 'List child/elder profiles & manage applications'
    },
    {
      id: 'profile',
      label: 'NGO Legal Profile & Docs',
      icon: FileCheck,
      badge: currentNgo.verificationStatus === 'verified' ? 'Verified' : 'Pending',
      badgeColor: currentNgo.verificationStatus === 'verified' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white',
      description: '80G, PAN, registration & verification docs'
    }
  ];

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Bird\'s-Eye Overview',
      icon: LayoutDashboard,
      description: 'Platform summary, total funds & active cases'
    },
    {
      id: 'ngo-verification',
      label: 'Verify NGO Documents',
      icon: FileCheck,
      badge: pendingNgoCount > 0 ? `${pendingNgoCount} Pending` : null,
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Review 80G/Gov certificates & verify NGOs'
    },
    {
      id: 'incident-moderation',
      label: 'Incident Moderation Feed',
      icon: AlertOctagon,
      badge: `${incidents.length} Total`,
      badgeColor: 'bg-slate-700 text-white',
      description: 'Flag spam, inspect reports & assign to NGOs'
    },
    {
      id: 'adoption-approvals',
      label: 'Adoption Safety Approvals',
      icon: Baby,
      badge: pendingAdopCount > 0 ? `${pendingAdopCount} Review` : null,
      badgeColor: 'bg-brand-teal-700 text-white',
      description: 'Approve child/elder profiles for public view'
    },
    {
      id: 'disputes',
      label: 'Dispute & Grievance Desk',
      icon: Scale,
      badge: pendingDisputeCount > 0 ? `${pendingDisputeCount} Open` : null,
      badgeColor: 'bg-red-600 text-white',
      description: 'Resolve donor claims & tax certificate issues'
    },
    {
      id: 'analytics',
      label: 'Platform Analytics & Map',
      icon: TrendingUp,
      description: 'Regional activity heatmap & donor insights'
    }
  ];

  const currentItems =
    currentRole === 'user'
      ? userMenuItems
      : currentRole === 'ngo'
      ? ngoMenuItems
      : adminMenuItems;

  const currentActiveTab =
    currentRole === 'user'
      ? activeUserTab
      : currentRole === 'ngo'
      ? activeNgoTab
      : activeAdminTab;

  const handleNavClick = (tabId) => {
    if (currentRole === 'user') setActiveUserTab(tabId);
    if (currentRole === 'ngo') setActiveNgoTab(tabId);
    if (currentRole === 'admin') setActiveAdminTab(tabId);
    setIsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-80 sm:w-96 max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          currentRole === 'admin'
            ? 'bg-gradient-to-r from-brand-amber-700 via-brand-amber-600 to-brand-amber-500'
            : currentRole === 'ngo'
            ? 'bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-emerald-900'
            : 'bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-700'
        }`}>
          <Logo size="sm" variant="full" />
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Identity Banner */}
        {currentRole === 'user' && currentUser && (
          <div className="p-4 bg-brand-teal-50 dark:bg-brand-teal-950/40 border-b border-brand-teal-100/60 dark:border-brand-teal-800 flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name || 'Citizen'}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-teal-600 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser.name || 'Citizen'}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{currentUser.email || ''}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-brand-mint-100 dark:bg-brand-mint-950/60 text-brand-teal-900 dark:text-brand-mint-300 px-2 py-0.5 rounded-full font-bold">
                  {currentUser.badges?.[0] || 'Verified Citizen'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  ₹{(currentUser.totalDonated || 0).toLocaleString()} donated
                </span>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'ngo' && (
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-3">
            <img
              src={currentNgo.logo}
              alt={currentNgo.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-600 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900 truncate">{currentNgo.name}</h4>
              </div>
              <p className="text-xs text-slate-600 truncate">{currentNgo.focusArea}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                  currentNgo.verificationStatus === 'verified'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {currentNgo.verificationStatus === 'verified' ? '✓ Verified NGO' : '⏳ Pending Review'}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {currentNgo.registrationNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'admin' && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber-500 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-slate-900">Platform Super Admin</h4>
              <p className="text-xs text-brand-amber-800 font-semibold">Governance & Security Authority</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-amber-100 text-brand-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {pendingNgoCount} NGO Reviews Pending
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            {currentRole.toUpperCase()} Dashboard Features
          </p>

          {currentItems.map(item => {
            const Icon = item.icon;
            const isActive = currentActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left p-3 rounded-2xl flex items-start gap-3.5 transition-all ${
                  isActive
                    ? currentRole === 'admin'
                      ? 'bg-brand-amber-600 text-white shadow-md'
                      : 'bg-brand-teal-800 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl flex-shrink-0 ${
                  isActive
                    ? currentRole === 'admin'
                      ? 'bg-brand-amber-700 text-white'
                      : 'bg-brand-teal-700 text-brand-mint-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${item.badgeColor || 'bg-brand-amber-500 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${
                    isActive
                      ? currentRole === 'admin' ? 'text-amber-100' : 'text-brand-mint-200'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-2">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-brand-mint-600" />
              24/7 Helpline: 1800-BRIDGE-UP
            </span>
          </div>

          <button
            onClick={() => {
              setIsDrawerOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
