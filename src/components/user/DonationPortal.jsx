import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  QrCode,
  CheckCircle2,
  Download,
  X,
  Sparkles,
  ShoppingBag,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DonationPortal() {
  const { campaigns, requirements, makeDonation, contributeToRequirement, currentUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'requirements'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [donationModal, setDonationModal] = useState(null); // campaign object or null
  const [reqModal, setReqModal] = useState(null); // requirement object or null

  const [customAmount, setCustomAmount] = useState(1000);
  const [paymentMode, setPaymentMode] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  const categories = ['all', 'Education', 'Elder Healthcare', 'Hunger Relief'];

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const handleOpenDonate = (campaign) => {
    setDonationModal(campaign);
    setCustomAmount(1000);
    setSuccessReceipt(null);
  };

  const handleOpenReq = (req) => {
    setReqModal(req);
    setCustomAmount(500);
  };

  const executeDonation = (e) => {
    e.preventDefault();
    if (!customAmount || customAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const receipt = makeDonation(donationModal.id, customAmount, { paymentMode });
      setIsProcessing(false);
      setSuccessReceipt(receipt);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully if canvas unavailable
      }
    }, 800);
  };

  const executeReqContribution = (e) => {
    e.preventDefault();
    if (!customAmount || customAmount <= 0) return;

    contributeToRequirement(reqModal.id, customAmount);
    setReqModal(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-teal-900 via-brand-teal-800 to-brand-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint-400/20 text-brand-mint-300 text-xs font-bold border border-brand-mint-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Verified NGOs & Section 80G Tax Exemption</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Transparent Giving & Urgent NGO Needs
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Every rupee is accounted for. Track campaign progress in real time and download your official 80G income tax deduction receipts immediately.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'campaigns'
                ? 'bg-brand-mint-400 text-brand-teal-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Verified Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              activeTab === 'requirements'
                ? 'bg-brand-amber-500 text-white shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Urgent Needs & Rations ({requirements.length})
          </button>
        </div>
      </div>

      {activeTab === 'campaigns' ? (
        /* Campaigns View */
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Filter Campaigns:</span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-teal-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Causes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(camp => {
              const percent = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));
              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-card-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img src={camp.coverImage} alt={camp.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-extrabold bg-brand-teal-900/90 backdrop-blur-md text-brand-mint-300 px-3 py-1 rounded-full shadow-sm">
                          {camp.category}
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm">
                          80G Tax Benefit
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="text-[11px] font-bold text-brand-teal-800">
                        {camp.ngoName}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>

                      {/* Progress bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-black text-slate-900">₹{camp.raisedAmount.toLocaleString()}</span>
                          <span className="text-slate-500 font-semibold">of ₹{camp.targetAmount.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-brand-teal-600 to-brand-mint-400 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleOpenDonate(camp)}
                      className="w-full py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-brand-mint-300" />
                      <span>Donate Now (Get 80G Receipt)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Urgent Requirements View */
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-amber-600 flex-shrink-0" />
            <span>
              <strong>Urgent Community Appeals:</strong> Direct micro-contributions toward critical food stocks, medicines, and winter supplies posted by verified shelters.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requirements.map(req => {
              const percent = Math.min(100, Math.round((req.raisedValue / req.targetValue) * 100));
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">
                        🚨 {req.urgency}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">{req.category}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{req.title}</h3>
                    <p className="text-xs text-brand-teal-800 font-bold">{req.ngoName}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-black text-slate-900">₹{req.raisedValue.toLocaleString()}</span>
                        <span className="text-slate-500 font-semibold">Goal: ₹{req.targetValue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-brand-amber-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenReq(req)}
                    className="mt-6 w-full py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Fulfill Need & Support</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {donationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-700 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-mint-300 uppercase tracking-wider">
                  Secure 80G Contribution
                </span>
                <h3 className="font-bold text-base mt-0.5 truncate max-w-sm">{donationModal.title}</h3>
              </div>
              <button
                onClick={() => setDonationModal(null)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successReceipt ? (
              /* Success & Receipt Download View */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black text-slate-900">Donation Successful!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{currentUser.name}</strong>! Your contribution of <strong>₹{successReceipt.amount.toLocaleString()}</strong> has been dispatched to <strong>{successReceipt.ngoName}</strong>.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex justify-between"><span className="text-slate-500">Transaction ID:</span> <span className="font-bold">{successReceipt.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">80G Tax Exemption Ref:</span> <span className="font-bold text-emerald-700">{successReceipt.taxReceipt}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date:</span> <span className="font-bold">{successReceipt.date}</span></div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToast('Tax Certificate Saved', 'Saved to your profile receipts.');
                      setDonationModal(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official 80G Receipt</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Donation Form */
              <form onSubmit={executeDonation} className="p-6 space-y-5">
                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Select Donation Amount</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[500, 1000, 2500, 5000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(amt)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          customAmount === amt
                            ? 'bg-brand-teal-800 text-white border-brand-teal-800 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="50"
                      required
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-brand-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Impact Calculator Preview */}
                <div className="p-3.5 rounded-2xl bg-brand-teal-50 border border-brand-teal-200 text-xs text-brand-teal-900 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-brand-mint-600 flex-shrink-0" />
                  <span>
                    Your <strong>₹{customAmount.toLocaleString()}</strong> can sponsor roughly <strong>{Math.max(1, Math.round(customAmount / 50))} wholesome meals</strong> or <strong>{Math.max(1, Math.round(customAmount / 500))} learning kits</strong>.
                  </span>
                </div>

                {/* Payment Simulation Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Payment Method Simulation</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                      { id: 'card', label: 'Debit/Credit Card', icon: CreditCard },
                      { id: 'netbank', label: 'Net Banking', icon: FileCheck }
                    ].map(mode => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setPaymentMode(mode.id)}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                            paymentMode === mode.id
                              ? 'bg-brand-teal-50 border-brand-teal-600 text-brand-teal-900 shadow-sm ring-1 ring-brand-teal-600'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-brand-mint-300" />
                  <span>{isProcessing ? 'Processing Donation...' : `Complete ₹${customAmount.toLocaleString()} Donation`}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Requirement Modal */}
      {reqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-brand-amber-600 to-brand-amber-500 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">
                  Urgent Supply Fulfillment
                </span>
                <h3 className="font-bold text-base mt-0.5 truncate max-w-xs">{reqModal.title}</h3>
              </div>
              <button
                onClick={() => setReqModal(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={executeReqContribution} className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">{reqModal.description}</p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contribution Amount (₹)</label>
                <input
                  type="number"
                  min="50"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm Contribution of ₹{customAmount.toLocaleString()}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
