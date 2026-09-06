import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Baby,
  Heart,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Calendar,
  Smile,
  X,
  Send,
  Sparkles,
  Info
} from 'lucide-react';

export default function AdoptionPortal() {
  const { adoptions, submitAdoptionInquiry, currentUser, addToast } = useApp();

  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'Child' | 'Siblings' | 'Elderly Companion'
  const [activeProfile, setActiveProfile] = useState(null);
  const [inquiryModal, setInquiryModal] = useState(null);

  const [inquiryForm, setInquiryForm] = useState({
    applicantName: currentUser.name,
    applicantPhone: currentUser.phone,
    applicantEmail: currentUser.email,
    familyDetails: '',
    residenceType: 'Own House',
    experienceWithCare: 'Yes, experienced with family',
    message: ''
  });

  // Only display Approved listings to the public (strict safety policy!)
  const approvedListings = adoptions.filter(a => a.status === 'Approved');

  const filteredListings = approvedListings.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    submitAdoptionInquiry(inquiryModal.id, inquiryForm);
    setInquiryModal(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-mint-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-mint-300" />
            <span>CARA Regulated & Mandatory Admin Safety Clearance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Adoption & Elder Foster Companionship
          </h1>
          <p className="text-xs sm:text-sm text-brand-mint-100 max-w-xl leading-relaxed">
            Every child deserves a warm family, and every elder deserves dignity and love. All profiles undergo rigorous legal background check and platform admin vetting.
          </p>
        </div>

        {/* Safety Badge */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs space-y-1 max-w-xs">
          <div className="font-bold text-brand-mint-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-amber-400" />
            Ethical & Child-Safe Standards
          </div>
          <p className="text-slate-200 text-[11px] leading-relaxed">
            Direct adoption approvals occur via licensed counselors and official legal authorities.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Baby className="w-4 h-4 text-brand-teal-800" />
          <span className="text-xs font-bold text-slate-700">Filter Listings:</span>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Vetted Profiles' },
            { id: 'Child', label: 'Children (Single)' },
            { id: 'Siblings', label: 'Siblings (Joint Home)' },
            { id: 'Elderly Companion', label: 'Elder Foster Companionship' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === f.id
                  ? 'bg-brand-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adoption Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 overflow-hidden group">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] font-extrabold bg-brand-teal-900/90 backdrop-blur-md text-brand-mint-300 px-3 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                  <span className="text-xs font-black text-brand-teal-800 bg-brand-teal-50 px-2.5 py-1 rounded-lg">
                    Age: {item.age}
                  </span>
                </div>

                <p className="text-xs text-brand-teal-800 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.ngoName} • {item.location}
                </p>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.story}
                </p>

                {/* Hobbies / Interests */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.hobbies?.map((h, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-2">
              <button
                onClick={() => setActiveProfile(item)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Full Story & Details
              </button>
              <button
                onClick={() => setInquiryModal(item)}
                className="flex-1 py-2.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-brand-mint-300" />
                <span>Express Interest</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Details Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="relative h-56 flex-shrink-0">
              <img src={activeProfile.photo} alt={activeProfile.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setActiveProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{activeProfile.name}</h3>
                  <p className="text-xs text-brand-teal-800 font-semibold">{activeProfile.ngoName}</p>
                </div>
                <span className="text-xs font-black bg-brand-teal-100 text-brand-teal-900 px-3 py-1 rounded-full">
                  Age: {activeProfile.age}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Biography & Background</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{activeProfile.story}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Legal Classification:</span>
                  <span className="font-bold text-slate-800">{activeProfile.legalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Managing Organization:</span>
                  <span className="font-bold text-slate-800">{activeProfile.ngoName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-800">{activeProfile.location}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setInquiryModal(activeProfile);
                  setActiveProfile(null);
                }}
                className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-brand-mint-300" />
                <span>Submit Adoption Inquiry & Counseling Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-brand-teal-900 to-brand-teal-700 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-mint-300 uppercase tracking-wider">
                  Adoption Inquiry Application
                </span>
                <h3 className="font-bold text-base mt-0.5">Inquiry for {inquiryModal.name}</h3>
              </div>
              <button
                onClick={() => setInquiryModal(null)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-brand-teal-50 rounded-2xl text-xs text-brand-teal-900 border border-brand-teal-200 leading-relaxed">
                Your application will be routed directly to <strong>{inquiryModal.ngoName}</strong> counselors to schedule an initial orientation and home verification.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.applicantName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, applicantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inquiryForm.applicantPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, applicantPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Family & Household Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Married couple with no kids, nuclear family with pet dog"
                  value={inquiryForm.familyDetails}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, familyDetails: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Personal Note to Counselor</label>
                <textarea
                  rows={3}
                  placeholder="Share why you wish to adopt or provide foster companionship..."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-teal-600 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Confidential Application</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
