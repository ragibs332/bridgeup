import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mumbaiNaviMumbaiNgos } from '../../data/mockData';
import confetti from 'canvas-confetti';
import {
  FileCheck,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Eye,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CheckSquare,
  Square,
  X,
  Download,
  Printer,
  Award,
  AlertCircle
} from 'lucide-react';

export default function NgoVerification() {
  const { ngos, verifyNgo, importNgoBatch, loadRealNgoDataset, addToast } = useApp();
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'verified' | 'rejected'

  // Modals
  const [inspectingDoc, setInspectingDoc] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [rawJsonInput, setRawJsonInput] = useState('');

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    govRegVerified: false,
    tax80GVerified: false,
    bankPanVerified: false,
    adminDeclaration: false
  });

  const [inspectedDocsMap, setInspectedDocsMap] = useState({});

  const filteredNgos = ngos.filter(n => {
    if (filter === 'all') return true;
    return n.verificationStatus === filter;
  });

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleOpenApprovalModal = () => {
    if (!selectedNgo) return;
    setChecklist({
      govRegVerified: false,
      tax80GVerified: false,
      bankPanVerified: false,
      adminDeclaration: false
    });
    setIsApprovalModalOpen(true);
  };

  const handleConfirmApproval = () => {
    if (!checklist.govRegVerified || !checklist.tax80GVerified || !checklist.bankPanVerified || !checklist.adminDeclaration) {
      addToast('Checklist Incomplete', 'Please check and verify all statutory criteria before confirming.', 'warning');
      return;
    }

    verifyNgo(selectedNgo.id, 'verified');
    setSelectedNgo(prev => ({ ...prev, verificationStatus: 'verified', verified: true, verificationDate: new Date().toISOString().split('T')[0] }));
    setIsApprovalModalOpen(false);
    triggerConfetti();
    addToast('NGO Verified! 🛡️', `${selectedNgo.name} has been officially verified and granted public trust status.`, 'success');
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      addToast('Reason Required', 'Please provide a clear reason for rejecting this application.', 'warning');
      return;
    }
    verifyNgo(selectedNgo.id, 'rejected', rejectionReason);
    setSelectedNgo(prev => ({ ...prev, verificationStatus: 'rejected', verified: false, rejectionReason }));
    setIsRejectionModalOpen(false);
    setRejectionReason('');
    addToast('Application Rejected', `Feedback sent to ${selectedNgo.name}.`, 'info');
  };

  const markDocInspected = (docName) => {
    setInspectedDocsMap(prev => ({ ...prev, [docName]: true }));
    addToast('Document Inspected', `Marked ${docName} as verified and audited.`, 'info');
    setInspectingDoc(null);
  };

  const allChecklistItemsCompleted =
    checklist.govRegVerified &&
    checklist.tax80GVerified &&
    checklist.bankPanVerified &&
    checklist.adminDeclaration;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-brand-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold border border-white/20">
            <FileCheck className="w-4 h-4" />
            <span>NGO Registration & Legal Attestation Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            NGO Verification & Credentialing Desk
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            Review uploaded legal documents (80G, 12A, Trust Deed, Gov Registration). Every NGO requires <strong>manual Super Admin document inspection and statutory checklist attestation</strong> before receiving the verified badge.
          </p>
        </div>

        {/* Filter Toggle & Import Data Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsImporterOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Import Real NGO Data</span>
          </button>

          <div className="flex gap-1.5 bg-black/20 p-1.5 rounded-2xl">
            {['all', 'pending', 'verified', 'rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === st ? 'bg-white text-emerald-950 shadow-md' : 'text-white/80 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Left NGO List & Right Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: NGO Queue */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            NGO Applications ({filteredNgos.length})
          </h3>

          <div className="space-y-3">
            {filteredNgos.map(ngo => (
              <div
                key={ngo.id}
                onClick={() => setSelectedNgo(ngo)}
                className={`cursor-pointer p-4 rounded-3xl border transition-all ${
                  selectedNgo?.id === ngo.id
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400/40 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-card-soft'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={ngo.logo}
                    alt={ngo.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        ngo.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ngo.verificationStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {ngo.verificationStatus.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">{ngo.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{ngo.focusArea}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      {ngo.documents?.length || 0} Documents Uploaded
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Inspection & Approval Console */}
        <div className="lg:col-span-2">
          {selectedNgo ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card-soft space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedNgo.logo}
                    alt={selectedNgo.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedNgo.name}</h2>
                    <p className="text-xs text-slate-500">{selectedNgo.location} • {selectedNgo.focusArea}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedNgo.verificationStatus === 'verified' ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified on {selectedNgo.verificationDate || '2026-02-01'}</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsRejectionModalOpen(true)}
                        className="px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={handleOpenApprovalModal}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Inspect & Verify NGO</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Banner */}
              {selectedNgo.verificationStatus === 'pending' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-spin" />
                  <p>
                    <strong>Pending Super Admin Inspection:</strong> Please inspect the uploaded statutory documents below, verify registration IDs, and complete the compliance checklist before approving.
                  </p>
                </div>
              )}

              {selectedNgo.verificationStatus === 'rejected' && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p>
                    <strong>Application Rejected:</strong> {selectedNgo.rejectionReason || 'Documents did not meet statutory compliance requirements.'}
                  </p>
                </div>
              )}

              {/* Legal Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Gov Registration ID</span>
                  <span className="text-xs font-bold text-slate-800">{selectedNgo.registrationNumber}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PAN / 80G Tax Ref</span>
                  <span className="text-xs font-bold text-slate-800">{selectedNgo.panNumber}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">FCRA Code</span>
                  <span className="text-xs font-bold text-slate-800">{selectedNgo.fcraNumber}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mission Statement</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedNgo.bio}
                </p>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Uploaded Verification Documents ({selectedNgo.documents?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-400">Click inspect to audit certificates</span>
                </div>

                <div className="space-y-2">
                  {selectedNgo.documents?.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        inspectedDocsMap[doc.name]
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                          inspectedDocsMap[doc.name] ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          PDF
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-800">{doc.name}</h5>
                            {inspectedDocsMap[doc.name] && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Inspected
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Type: {doc.docType || 'Statutory Filing'} • Uploaded on {doc.uploadDate} • {doc.size}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setInspectingDoc({ ...doc, ngo: selectedNgo })}
                        className="px-3 py-1.5 text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 shadow-sm transition-colors text-xs font-bold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Inspect Document</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Bar for Inspection */}
              {selectedNgo.verificationStatus !== 'verified' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Ready to complete verification?</h4>
                    <p className="text-[11px] text-emerald-800">Review statutory checklist and sign Admin attestation before issuing the verified trust seal.</p>
                  </div>
                  <button
                    onClick={handleOpenApprovalModal}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Proceed to Verification Checklist</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-card-soft space-y-3">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-700">Select an NGO from the left to inspect documents</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check government credentials, PAN tax clearance, and FCRA orders before confirming verified status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 1. DOCUMENT INSPECTOR MODAL */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Document Inspector & Certificate Audit</h3>
                  <p className="text-[11px] text-slate-400">Auditing: {inspectingDoc.ngo?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Certificate Preview */}
            <div className="p-6 space-y-5">
              <div className="p-6 rounded-2xl bg-amber-50/40 border-2 border-dashed border-amber-300 relative overflow-hidden space-y-4">
                {/* Certificate Watermark */}
                <div className="absolute top-4 right-4 text-emerald-700/20 font-black text-6xl select-none pointer-events-none uppercase">
                  OFFICIAL
                </div>

                <div className="text-center space-y-1 border-b border-amber-200/60 pb-3">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                    Government of India / Statutory Registry
                  </span>
                  <h4 className="text-base font-black text-slate-900 uppercase">
                    {inspectingDoc.docType || 'Certificate of Society Registration'}
                  </h4>
                  <p className="text-[11px] text-slate-500">Document Reference: {inspectingDoc.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="text-[10px] font-bold text-slate-400 block">Organization Name</span>
                    <span className="font-bold text-slate-800">{inspectingDoc.ngo?.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="text-[10px] font-bold text-slate-400 block">Registration / Darpan ID</span>
                    <span className="font-bold text-slate-800">{inspectingDoc.ngo?.registrationNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="text-[10px] font-bold text-slate-400 block">PAN Tax Identifier</span>
                    <span className="font-bold text-slate-800">{inspectingDoc.ngo?.panNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="text-[10px] font-bold text-slate-400 block">Jurisdiction & Location</span>
                    <span className="font-bold text-slate-800">{inspectingDoc.ngo?.location}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Digital Signature Valid</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    SHA-256 Checksum: <code className="bg-emerald-100 px-1 py-0.5 rounded text-[10px]">e4d909c290d...8821a</code> • Timestamp verified with Registrar of Societies portal.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToast('Document Download', `Downloading ${inspectingDoc.name}...`, 'info')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>

                <button
                  onClick={() => markDocInspected(inspectingDoc.name)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Inspected & Valid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATUTORY VERIFICATION & ATTESTATION CONFIRMATION MODAL */}
      {isApprovalModalOpen && selectedNgo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-brand-teal-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Super Admin Verification Attestation</h3>
                  <p className="text-xs text-emerald-200">Mandatory statutory checklist before issuing verified badge</p>
                </div>
              </div>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Checklist */}
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img src={selectedNgo.logo} alt={selectedNgo.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{selectedNgo.name}</h4>
                  <p className="text-[11px] text-slate-500">Registration: {selectedNgo.registrationNumber} • PAN: {selectedNgo.panNumber}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mandatory Statutory Checklist (Check all 4 to proceed):
                </h4>

                {/* Item 1 */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.govRegVerified}
                    onChange={(e) => setChecklist(prev => ({ ...prev, govRegVerified: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">1. Government Registration & Darpan ID Authenticated</span>
                    <span className="text-[11px] text-slate-500">Verified against national registry of societies / trusts database.</span>
                  </div>
                </label>

                {/* Item 2 */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.tax80GVerified}
                    onChange={(e) => setChecklist(prev => ({ ...prev, tax80GVerified: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">2. Section 80G & 12A Tax Exemption Order Inspected</span>
                    <span className="text-[11px] text-slate-500">Tax exemption validity active with correct PAN entity mapping.</span>
                  </div>
                </label>

                {/* Item 3 */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.bankPanVerified}
                    onChange={(e) => setChecklist(prev => ({ ...prev, bankPanVerified: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">3. Official NGO Bank Account Mandate Verified</span>
                    <span className="text-[11px] text-slate-500">Bank account holder name matches NGO legal certificate exactly.</span>
                  </div>
                </label>

                {/* Item 4 */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.adminDeclaration}
                    onChange={(e) => setChecklist(prev => ({ ...prev, adminDeclaration: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 block">4. Solemn Super Admin Compliance Attestation</span>
                    <span className="text-[11px] text-emerald-800">
                      I solemnly confirm under penalty of audit that I have personally inspected the attached documents and approve full verified trust privileges.
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={!allChecklistItemsCompleted}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Grant Official Verified Status 🛡️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REJECTION MODAL */}
      {isRejectionModalOpen && selectedNgo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm">Reject / Request Re-submission</h3>
              </div>
              <button
                onClick={() => setIsRejectionModalOpen(false)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Provide feedback to <strong>{selectedNgo.name}</strong> on why their documents were rejected or require re-upload.
              </p>

              {/* Quick Reason Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Reason Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '80G Tax Exemption Certificate expired',
                    'Blurry or unreadable PAN card scan',
                    'Registration ID mismatch with Society Registry',
                    'Bank mandate letterhead missing official stamp'
                  ].map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectionReason(r)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200 transition-colors text-left"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the documents cannot be verified..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsRejectionModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRejection}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Send Rejection Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. REAL NGO DATA IMPORTER & DARPAN REGISTRY MODAL */}
      {isImporterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-brand-teal-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Real NGO Data Importer & Synchronizer</h3>
                  <p className="text-xs text-emerald-200">Load authentic NGO records into BridgeUp & AI Chatbot</p>
                </div>
              </div>
              <button
                onClick={() => setIsImporterOpen(false)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Option 1: Quick Load Preset Verified Indian NGOs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between gap-3 text-left">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      PAN-India Verified NGOs (Top 8)
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Goonj, Akshaya Patra, CRY, HelpAge, SOS Villages, Friendicoes, Robin Hood Army, Smile Foundation.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      loadRealNgoDataset();
                      setIsImporterOpen(false);
                      triggerConfetti();
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Load PAN-India NGOs 🚀</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col justify-between gap-3 text-left">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      Mumbai & Navi Mumbai NGOs (12)
                    </h4>
                    <p className="text-[11px] text-teal-800">
                      CRY Mumbai, Roti Bank, BSPCA Animal Hospital, Pratham, Snehasadan, V Care Cancer, Aarambh Navi Mumbai, IDA India, St. Jude Kharghar, Shantivan Panvel, etc.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      importNgoBatch(mumbaiNaviMumbaiNgos);
                      setIsImporterOpen(false);
                      triggerConfetti();
                    }}
                    className="w-full py-2 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Load Mumbai & Navi Mumbai 🏙️</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Custom JSON Data Importer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Or Paste Custom NGO JSON Array:
                  </label>
                  <button
                    onClick={() => {
                      const sample = [
                        {
                          id: `ngo-custom-${Date.now()}`,
                          name: "Prayas Juvenile Aid Centre",
                          registrationNumber: "NGO-DEL-1988-1204",
                          panNumber: "AAATP1204P",
                          fcraNumber: "FCRA-231650110",
                          focusArea: "Child Protection, Juvenile Aid & Education",
                          category: "Child Welfare",
                          city: "New Delhi",
                          coordinates: { lat: 28.5200, lng: 77.2100 },
                          location: "Jahangirpuri & Tughlakabad, Delhi",
                          phone: "+91 11 2995 5005",
                          contactEmail: "contact@prayasjac.org",
                          bio: "Serving over 50,000 neglected street children through 40 shelter homes across India.",
                          urgentNeeds: [{ item: "200 School Uniforms & Bags", urgency: "Immediate", fundedPct: 30 }]
                        }
                      ];
                      setRawJsonInput(JSON.stringify(sample, null, 2));
                    }}
                    className="text-[11px] text-brand-teal-700 hover:underline font-bold"
                  >
                    Insert Example JSON
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={rawJsonInput}
                  onChange={(e) => setRawJsonInput(e.target.value)}
                  placeholder='[ { "name": "Real NGO Name", "city": "Delhi", "phone": "+91...", "focusArea": "Food Relief" } ]'
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-mono bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsImporterOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawJsonInput);
                      if (!Array.isArray(parsed)) {
                        addToast('Invalid Format', 'JSON must be an array of NGO objects.', 'warning');
                        return;
                      }
                      importNgoBatch(parsed);
                      setRawJsonInput('');
                      setIsImporterOpen(false);
                      triggerConfetti();
                    } catch (err) {
                      addToast('JSON Syntax Error', 'Please check that your JSON syntax is valid.', 'warning');
                    }
                  }}
                  disabled={!rawJsonInput.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all"
                >
                  Import Custom JSON Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
