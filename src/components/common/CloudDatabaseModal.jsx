import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Key,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials
} from '../../services/supabase';

const SQL_SCHEMA_STRING = `-- =======================================================
-- BRIDGEUP SUPABASE POSTGRESQL SCHEMA
-- Run this in your Supabase project: SQL Editor -> New Query -> Run
-- =======================================================

create table if not exists public.incidents (
  id text primary key,
  title text not null,
  category text not null,
  severity text not null,
  status text not null default 'Reported',
  location text,
  coordinates jsonb default '{"lat": 28.6139, "lng": 77.2090}'::jsonb,
  description text,
  photo text,
  reporter_name text,
  reporter_email text,
  reporter_phone text,
  created_at timestamptz default now(),
  assigned_ngo_id text,
  assigned_ngo_name text,
  resolution_notes text,
  resolution_photo text,
  resolved_at timestamptz,
  admin_moderation_note text
);

create table if not exists public.registered_users (
  id text primary key,
  username text unique not null,
  email text unique not null,
  password text not null,
  name text,
  phone text,
  location text,
  avatar text,
  total_donated numeric default 0,
  donations_count int default 0,
  volunteer_hours int default 0,
  badges text[] default array['New Citizen', 'Verified Explorer'],
  saved_adoptions text[] default array[]::text[],
  donation_history jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.ngos (
  id text primary key,
  name text not null,
  registration_number text,
  pan_number text,
  fcra_number text,
  focus_area text,
  verified boolean default false,
  verification_status text default 'pending',
  verification_date timestamptz,
  verified_by text,
  location text,
  address text,
  contact_email text,
  phone text,
  bio text,
  logo text,
  banner text,
  documents jsonb default '[]'::jsonb,
  stats jsonb default '{"totalDonationsRaised": 0, "incidentsResolved": 0, "activeCampaignsCount": 1, "volunteersCount": 0}'::jsonb,
  created_at timestamptz default now()
);

alter table public.incidents enable row level security;
alter table public.registered_users enable row level security;
alter table public.ngos enable row level security;

create policy "Allow public read incidents" on public.incidents for select using (true);
create policy "Allow public insert incidents" on public.incidents for insert with check (true);
create policy "Allow public update incidents" on public.incidents for update using (true);

create policy "Allow public read users" on public.registered_users for select using (true);
create policy "Allow public insert users" on public.registered_users for insert with check (true);
create policy "Allow public update users" on public.registered_users for update using (true);

create policy "Allow public read ngos" on public.ngos for select using (true);
create policy "Allow public insert ngos" on public.ngos for insert with check (true);
create policy "Allow public update ngos" on public.ngos for update using (true);

alter publication supabase_realtime add table public.incidents;
alter publication supabase_realtime add table public.registered_users;
alter publication supabase_realtime add table public.ngos;
`;

export default function CloudDatabaseModal({ isOpen, onClose }) {
  const { addToast, triggerManualSync, isSyncing } = useApp();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url || '');
      setKey(creds.key || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      addToast('Missing Details', 'Please provide both your Supabase URL and Anon Key.', 'error');
      return;
    }

    saveSupabaseCredentials(url.trim(), key.trim());
    setIsSaved(true);
    addToast('Supabase Connected! 🚀', 'Connecting to your cloud PostgreSQL database and pulling records...', 'success');

    setTimeout(() => {
      triggerManualSync();
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleCopySql = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SQL_SCHEMA_STRING);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
    addToast('SQL Copied! 📋', 'Paste this into your Supabase SQL Editor and click Run.', 'info');
  };

  const isConnected = Boolean(url && key && url.includes('supabase.co'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                Cross-Device Cloud Database
              </span>
              <h3 className="font-bold text-base text-white">Supabase (PostgreSQL) Sync</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {isConnected ? 'Connected to Cloud PostgreSQL' : 'Supabase Credentials Needed'}
                </p>
                <p className="text-[11px] opacity-80">
                  {isConnected
                    ? 'All distress reports, accounts, and NGO cases sync instantly across phones & PCs.'
                    : 'Paste your Supabase project credentials below to enable permanent cross-device sync.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzabcdefghijklmnop.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Supabase Anon / Public API Key</span>
              </label>
              <input
                type="text"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>SQL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy 1-Click SQL Schema</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={isSaved}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaved ? 'Saving...' : 'Save & Connect'}</span>
              </button>
            </div>
          </form>

          {/* Quick Guide */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">Quick 2-Step Supabase Setup:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Create project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline">supabase.com</a></li>
              <li>Go to <strong>Project Settings</strong> &rarr; <strong>API</strong> to copy your URL and Anon Key.</li>
              <li>Go to <strong>SQL Editor</strong>, click Copy 1-Click SQL Schema above, and click <strong>Run</strong>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
