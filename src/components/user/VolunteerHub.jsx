import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function VolunteerHub() {
  const { volunteerDrives, applyForVolunteerDrive, currentUser } = useApp();

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-brand-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/20">
            <Users className="w-3.5 h-3.5" />
            <span>Community Volunteer Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Give Your Time, Transform a Community
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            Join local weekend mentorship sessions, night-shift food rescues, or elder companionship drives organized by verified NGOs.
          </p>
        </div>

        {/* Volunteer Stats Pill */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[150px]">
          <div className="text-3xl font-black text-brand-mint-300">{currentUser.volunteerHours} hrs</div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">Your Logged Impact</div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteerDrives.map(drive => {
          const isFull = drive.slotsFilled >= drive.slotsTotal;
          return (
            <div
              key={drive.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-teal-800 bg-brand-teal-50 px-2.5 py-1 rounded-md">
                    {drive.ngoName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFull ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isFull ? 'Drive Full' : `${drive.slotsTotal - drive.slotsFilled} Slots Left`}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{drive.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{drive.description}</p>

                <div className="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{drive.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{drive.location}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {drive.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => applyForVolunteerDrive(drive.id)}
                  disabled={isFull}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFull ? 'All Slots Filled' : 'Apply to Volunteer (+4 hrs)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
