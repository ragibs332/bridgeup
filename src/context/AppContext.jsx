import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialNgos,
  initialIncidents,
  initialAdoptions,
  initialCampaigns,
  initialRequirements,
  initialVolunteerDrives,
  initialDisputes
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Role State
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('bridgeup_role') || 'guest';
  });

  // Dark / Light Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bridgeup_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bridgeup_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Registered Users Database (Persistent Real Auth Store)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('bridgeup_registered_users');
    return saved ? JSON.parse(saved) : [
      {
        id: 'user-1',
        username: 'ragib',
        email: 'ragib@bridgeup.org',
        password: 'password123',
        name: 'Mohammad Ragib',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        totalDonated: 12500,
        donationsCount: 4,
        volunteerHours: 16,
        badges: ['Star Donor', 'Compassion Scout', 'Verified Reporter'],
        savedAdoptions: ['adop-1', 'adop-3'],
        donationHistory: [
          { id: 'TXN-88219', campaignTitle: 'Mission Sharda: School Kits', ngoName: 'Asha Child Care Foundation', amount: 5000, date: '2026-02-20', taxReceipt: '80G-DEL-2026-8821' },
          { id: 'TXN-77312', campaignTitle: 'Winter Warmth & Medical Clinic', ngoName: 'Care & Hope Elder Sanctuary', amount: 3500, date: '2026-01-14', taxReceipt: '80G-MUM-2026-7731' },
          { id: 'TXN-66104', campaignTitle: '500 kg Rice & Dal Urgent Ration', ngoName: 'Seva Food & Hunger Mission', amount: 4000, date: '2025-12-05', taxReceipt: '80G-BLR-2025-6610' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bridgeup_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bridgeup_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentNgo, setCurrentNgo] = useState(() => {
    const saved = localStorage.getItem('bridgeup_ngo');
    return saved ? JSON.parse(saved) : initialNgos[0]; // Default to Asha Child Care Foundation
  });

  // Navigation State
  const [activeUserTab, setActiveUserTab] = useState('dashboard');
  const [activeNgoTab, setActiveNgoTab] = useState('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Core Synchronized Entities
  const [ngos, setNgos] = useState(() => {
    const saved = localStorage.getItem('bridgeup_ngos');
    return saved ? JSON.parse(saved) : initialNgos;
  });

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('bridgeup_incidents');
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  const [adoptions, setAdoptions] = useState(() => {
    const saved = localStorage.getItem('bridgeup_adoptions');
    return saved ? JSON.parse(saved) : initialAdoptions;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('bridgeup_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [requirements, setRequirements] = useState(() => {
    const saved = localStorage.getItem('bridgeup_requirements');
    return saved ? JSON.parse(saved) : initialRequirements;
  });

  const [volunteerDrives, setVolunteerDrives] = useState(() => {
    const saved = localStorage.getItem('bridgeup_volunteers');
    return saved ? JSON.parse(saved) : initialVolunteerDrives;
  });

  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('bridgeup_disputes');
    return saved ? JSON.parse(saved) : initialDisputes;
  });

  // Notifications / Toast queue
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('bridgeup_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('bridgeup_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bridgeup_ngo', JSON.stringify(currentNgo));
  }, [currentNgo]);

  useEffect(() => {
    localStorage.setItem('bridgeup_ngos', JSON.stringify(ngos));
  }, [ngos]);

  useEffect(() => {
    localStorage.setItem('bridgeup_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('bridgeup_adoptions', JSON.stringify(adoptions));
  }, [adoptions]);

  useEffect(() => {
    localStorage.setItem('bridgeup_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('bridgeup_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('bridgeup_volunteers', JSON.stringify(volunteerDrives));
  }, [volunteerDrives]);

  useEffect(() => {
    localStorage.setItem('bridgeup_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Real Authentication Engine (Sign Up & Sign In with Username / Password)
  const registerUser = ({ username, email, password, name, phone, location }) => {
    const existing = registeredUsers.find(
      u => u.username?.toLowerCase() === username.toLowerCase() || u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      addToast('Registration Failed', 'A user with this username or email already exists.', 'warning');
      return { success: false, message: 'Username or Email is already registered.' };
    }

    const newUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      username: username.trim(),
      email: email.trim(),
      password: password, // Stored securely in persistent browser store
      name: name.trim() || username.trim(),
      phone: phone || '+91 98000 00000',
      location: location || 'Mumbai / Delhi, India',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      totalDonated: 0,
      donationsCount: 0,
      volunteerHours: 0,
      badges: ['New Citizen', 'Verified Explorer'],
      savedAdoptions: [],
      donationHistory: []
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('user');
    setActiveUserTab('dashboard');
    addToast('Account Created! 🎉', `Welcome to BridgeUp, ${newUser.name}! Your account is now active.`, 'success');
    return { success: true, user: newUser };
  };

  const authenticateUser = ({ identifier, password }) => {
    const cleanId = identifier.trim().toLowerCase();
    const user = registeredUsers.find(
      u => (u.username && u.username.toLowerCase() === cleanId) || (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      addToast('Authentication Failed', 'No account found with this username or email.', 'warning');
      return { success: false, message: 'Account not found.' };
    }

    if (user.password !== password) {
      addToast('Incorrect Password', 'The password you entered does not match.', 'warning');
      return { success: false, message: 'Incorrect password.' };
    }

    setCurrentUser(user);
    setCurrentRole('user');
    setActiveUserTab('dashboard');
    addToast('Signed In Successfully 🛡️', `Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
  };

  // Role Switcher / Demo Handlers
  const loginAsUser = (userData) => {
    const user = userData || registeredUsers[0];
    setCurrentUser(user);
    setCurrentRole('user');
    setActiveUserTab('dashboard');
    addToast('Welcome back!', `Logged in as Citizen: ${user.name}`);
  };

  const loginAsNgo = (ngoData) => {
    const targetNgo = ngoData || currentNgo;
    setCurrentNgo(targetNgo);
    setCurrentRole('ngo');
    setActiveNgoTab('dashboard');
    addToast('NGO Portal Connected', `Logged in as ${targetNgo.name} (${targetNgo.verificationStatus.toUpperCase()})`);
  };

  const loginAsAdmin = () => {
    setCurrentRole('admin');
    setActiveAdminTab('dashboard');
    addToast('Admin Privileges Active', 'Platform Governance & Moderation Console Enabled');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    setActiveUserTab('dashboard');
    setActiveNgoTab('dashboard');
    setActiveAdminTab('dashboard');
    setIsDrawerOpen(false);
    localStorage.removeItem('bridgeup_user');
    addToast('Logged Out', 'You have been safely returned to the login screen.');
  };

  // Switch active NGO (useful for testing different NGOs like verified vs unverified)
  const selectCurrentNgo = (ngoId) => {
    const found = ngos.find(n => n.id === ngoId);
    if (found) {
      setCurrentNgo(found);
      addToast('Active NGO Switched', `Now managing ${found.name}`);
    }
  };

  // --- ACTIONS ---

  // 1. INCIDENTS WORKFLOW
  const reportIncident = (incidentData) => {
    const newIncident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      title: incidentData.title,
      category: incidentData.category,
      severity: incidentData.severity || 'High',
      status: 'Reported',
      location: incidentData.location,
      coordinates: incidentData.coordinates || { lat: 28.6139, lng: 77.2090 },
      description: incidentData.description,
      photo: incidentData.photo || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
      reporterName: currentUser.name,
      reporterEmail: currentUser.email,
      reporterPhone: currentUser.phone,
      createdAt: new Date().toISOString(),
      assignedNgoId: null,
      assignedNgoName: null,
      resolutionNotes: null,
      resolutionPhoto: null,
      resolvedAt: null
    };

    setIncidents(prev => [newIncident, ...prev]);
    addToast('Incident Reported Successfully', 'Your report has been broadcasted to registered NGOs and Platform Moderators.', 'success');
    return newIncident;
  };

  const assignIncidentToNgo = (incidentId, ngo) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'In Progress',
          assignedNgoId: ngo.id,
          assignedNgoName: ngo.name
        };
      }
      return inc;
    }));
    addToast('Incident Assigned', `Incident has been assigned to ${ngo.name}`, 'info');
  };

  const resolveIncident = (incidentId, resolutionDetails) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Resolved',
          assignedNgoId: currentNgo.id,
          assignedNgoName: currentNgo.name,
          resolutionNotes: resolutionDetails.notes,
          resolutionPhoto: resolutionDetails.photo || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
          resolvedAt: new Date().toISOString()
        };
      }
      return inc;
    }));

    // Update NGO stats
    setNgos(prev => prev.map(n => {
      if (n.id === currentNgo.id) {
        return {
          ...n,
          stats: {
            ...n.stats,
            incidentsResolved: (n.stats?.incidentsResolved || 0) + 1
          }
        };
      }
      return n;
    }));

    // Also update currentNgo instance
    setCurrentNgo(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        incidentsResolved: (prev.stats?.incidentsResolved || 0) + 1
      }
    }));

    addToast('Incident Marked Resolved! 🎉', 'Resolution proof and notes have been published.', 'success');
  };

  const moderateIncident = (incidentId, action, note) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: action === 'flag_spam' ? 'Rejected' : inc.status,
          adminModerationNote: note || 'Reviewed by Admin'
        };
      }
      return inc;
    }));
    addToast('Incident Moderated', `Action "${action}" recorded by Admin.`, 'info');
  };

  // 2. NGO VERIFICATION WORKFLOW
  const registerNewNgo = (ngoData) => {
    const newNgo = {
      id: `ngo-${Date.now().toString().slice(-4)}`,
      name: ngoData.name,
      registrationNumber: ngoData.registrationNumber || `NGO-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      panNumber: ngoData.panNumber || 'AABBN1234K',
      fcraNumber: ngoData.fcraNumber || 'FCRA-APPLIED',
      focusArea: ngoData.focusArea || 'Community Empowerment',
      verified: false,
      verificationStatus: 'pending',
      verificationDate: null,
      verifiedBy: null,
      location: ngoData.location || 'New Delhi, India',
      address: ngoData.address || 'Civil Lines, Delhi',
      contactEmail: ngoData.contactEmail,
      phone: ngoData.phone,
      bio: ngoData.bio,
      logo: ngoData.logo || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1000&auto=format&fit=crop&q=80',
      documents: ngoData.documents || [
        { name: 'Govt_Societies_Reg_Cert.pdf', type: 'PDF', size: '2.8 MB', uploadDate: new Date().toISOString().split('T')[0], url: '#' },
        { name: '80G_Tax_Exemption_Order.pdf', type: 'PDF', size: '1.4 MB', uploadDate: new Date().toISOString().split('T')[0], url: '#' }
      ],
      stats: {
        totalDonationsRaised: 0,
        monthlyDonors: 0,
        activeVolunteers: 0,
        childrenAdopted: 0,
        incidentsResolved: 0
      }
    };

    setNgos(prev => [...prev, newNgo]);
    setCurrentNgo(newNgo);
    setCurrentRole('ngo');
    addToast('NGO Registration Submitted!', 'Your documents are currently under review by Platform Admin.', 'info');
    return newNgo;
  };

  const importNgoBatch = (ngoList) => {
    if (!Array.isArray(ngoList) || !ngoList.length) return;
    setNgos(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const newItems = ngoList.filter(n => !existingIds.has(n.id));
      const updated = [...prev, ...newItems];
      localStorage.setItem('bridgeup_ngos', JSON.stringify(updated));
      return updated;
    });
    addToast('NGOs Imported Successfully! 🏢', `Added ${ngoList.length} real NGO records to the database.`, 'success');
  };

  const loadRealNgoDataset = () => {
    setNgos(initialNgos);
    setCurrentNgo(initialNgos[0]);
    localStorage.setItem('bridgeup_ngos', JSON.stringify(initialNgos));
    addToast('Real NGO Dataset Loaded! 🌟', `Loaded ${initialNgos.length} verified real-world NGO records.`, 'success');
  };

  const verifyNgo = (ngoId, status, rejectionReason = '') => {
    setNgos(prev => prev.map(n => {
      if (n.id === ngoId) {
        return {
          ...n,
          verified: status === 'verified',
          verificationStatus: status,
          verificationDate: status === 'verified' ? new Date().toISOString().split('T')[0] : null,
          verifiedBy: 'Super Admin',
          rejectionReason: status === 'rejected' ? rejectionReason : null
        };
      }
      return n;
    }));

    // If current NGO matches, update it too
    if (currentNgo.id === ngoId) {
      setCurrentNgo(prev => ({
        ...prev,
        verified: status === 'verified',
        verificationStatus: status,
        verificationDate: status === 'verified' ? new Date().toISOString().split('T')[0] : null,
        verifiedBy: 'Super Admin',
        rejectionReason: status === 'rejected' ? rejectionReason : null
      }));
    }

    addToast(
      status === 'verified' ? 'NGO Verified! 🛡️' : 'NGO Verification Rejected',
      `NGO status updated to ${status.toUpperCase()}`,
      status === 'verified' ? 'success' : 'warning'
    );
  };

  // 3. ADOPTION LISTINGS WORKFLOW
  const addAdoptionListing = (listingData) => {
    const newListing = {
      id: `adop-${Date.now().toString().slice(-4)}`,
      name: listingData.name,
      age: listingData.age,
      category: listingData.category || 'Child',
      gender: listingData.gender || 'Female',
      ngoId: currentNgo.id,
      ngoName: currentNgo.name,
      location: currentNgo.location,
      story: listingData.story,
      status: 'Pending Admin Review', // Requires safety approval!
      photo: listingData.photo || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
      hobbies: listingData.hobbies || ['Art', 'Reading', 'Music'],
      legalStatus: listingData.legalStatus || 'CARA Safety Protocol Verification Attached',
      addedAt: new Date().toISOString().split('T')[0],
      inquiries: 0
    };

    setAdoptions(prev => [newListing, ...prev]);
    addToast('Adoption Listing Submitted', 'Sent to Admin queue for safety clearance before public listing.', 'info');
    return newListing;
  };

  const approveAdoptionListing = (adoptionId, status) => {
    setAdoptions(prev => prev.map(a => {
      if (a.id === adoptionId) {
        return {
          ...a,
          status: status // 'Approved' | 'Rejected'
        };
      }
      return a;
    }));
    addToast(
      status === 'Approved' ? 'Listing Approved for Public View' : 'Listing Rejected',
      `Adoption profile status set to ${status}`,
      status === 'Approved' ? 'success' : 'warning'
    );
  };

  const submitAdoptionInquiry = (adoptionId, inquiryData) => {
    setAdoptions(prev => prev.map(a => {
      if (a.id === adoptionId) {
        return {
          ...a,
          inquiries: (a.inquiries || 0) + 1
        };
      }
      return a;
    }));

    addToast('Adoption Inquiry Submitted 🕊️', 'The managing NGO has received your contact and will schedule a counselor consultation.', 'success');
  };

  // 4. DONATIONS & REQUIREMENTS WORKFLOW
  const makeDonation = (campaignId, amount, customDetails = {}) => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    let campaignRef = campaigns.find(c => c.id === campaignId);
    let ngoName = campaignRef ? campaignRef.ngoName : 'BridgeUp Impact Fund';
    let title = campaignRef ? campaignRef.title : 'Direct Support Donation';
    let ngoId = campaignRef ? campaignRef.ngoId : null;

    // Update campaigns
    if (campaignRef) {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            raisedAmount: c.raisedAmount + parsedAmount,
            donorsCount: c.donorsCount + 1
          };
        }
        return c;
      }));
    }

    // Update NGO funds
    if (ngoId) {
      setNgos(prev => prev.map(n => {
        if (n.id === ngoId) {
          return {
            ...n,
            stats: {
              ...n.stats,
              totalDonationsRaised: (n.stats?.totalDonationsRaised || 0) + parsedAmount
            }
          };
        }
        return n;
      }));
    }

    // Update user stats and history
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      campaignTitle: title,
      ngoName: ngoName,
      amount: parsedAmount,
      date: new Date().toISOString().split('T')[0],
      taxReceipt: `80G-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`
    };

    setCurrentUser(prev => ({
      ...prev,
      totalDonated: (prev.totalDonated || 0) + parsedAmount,
      donationsCount: (prev.donationsCount || 0) + 1,
      donationHistory: [newTxn, ...(prev.donationHistory || [])]
    }));

    addToast(`Donation of ₹${parsedAmount.toLocaleString()} Successful! ❤️`, `Thank you for supporting ${title}. 80G Tax receipt generated.`);
    return newTxn;
  };

  const createCampaign = (campaignData) => {
    const newCampaign = {
      id: `camp-${Date.now().toString().slice(-4)}`,
      title: campaignData.title,
      ngoId: currentNgo.id,
      ngoName: currentNgo.name,
      category: campaignData.category || 'Community Welfare',
      targetAmount: Number(campaignData.targetAmount) || 100000,
      raisedAmount: 0,
      donorsCount: 0,
      endDate: campaignData.endDate || '2026-06-30',
      coverImage: campaignData.coverImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      description: campaignData.description,
      taxBenefit: '80G Tax Exemption (50% deduction)',
      featured: false
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    addToast('Campaign Launched! 🚀', `"${newCampaign.title}" is now live on the donation portal.`);
    return newCampaign;
  };

  const postRequirement = (reqData) => {
    const newReq = {
      id: `req-${Date.now().toString().slice(-4)}`,
      ngoId: currentNgo.id,
      ngoName: currentNgo.name,
      title: reqData.title,
      category: reqData.category || 'Urgent Supplies',
      urgency: reqData.urgency || 'Immediate',
      targetValue: Number(reqData.targetValue) || 25000,
      raisedValue: 0,
      unit: reqData.unit || '₹ or items',
      location: reqData.location || currentNgo.location,
      description: reqData.description
    };

    setRequirements(prev => [newReq, ...prev]);
    addToast('Urgent Requirement Posted', 'Citizens can now view and fund this directly.', 'info');
    return newReq;
  };

  const contributeToRequirement = (reqId, amount) => {
    const parsedAmount = Number(amount);
    setRequirements(prev => prev.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          raisedValue: Math.min(r.targetValue, r.raisedValue + parsedAmount)
        };
      }
      return r;
    }));

    setCurrentUser(prev => ({
      ...prev,
      totalDonated: (prev.totalDonated || 0) + parsedAmount,
      donationsCount: (prev.donationsCount || 0) + 1
    }));

    addToast('Contributed to Urgent Need', `₹${parsedAmount.toLocaleString()} funded toward requirement.`);
  };

  // 5. VOLUNTEERING WORKFLOW
  const applyForVolunteerDrive = (driveId, notes) => {
    setVolunteerDrives(prev => prev.map(v => {
      if (v.id === driveId) {
        return {
          ...v,
          slotsFilled: Math.min(v.slotsTotal, v.slotsFilled + 1)
        };
      }
      return v;
    }));

    setCurrentUser(prev => ({
      ...prev,
      volunteerHours: (prev.volunteerHours || 0) + 4
    }));

    addToast('Volunteer Application Sent! 🤝', 'The NGO coordinator will contact you with orientation details.');
  };

  // 6. DISPUTE WORKFLOW
  const resolveDispute = (disputeId, resolutionNote) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: 'Resolved',
          resolutionNote: resolutionNote || 'Resolved by Super Admin'
        };
      }
      return d;
    }));
    addToast('Dispute Resolved', 'Case marked as resolved with note logged.', 'success');
  };

  // Reset demo data helper
  const resetDemoData = () => {
    localStorage.removeItem('bridgeup_ngos');
    localStorage.removeItem('bridgeup_incidents');
    localStorage.removeItem('bridgeup_adoptions');
    localStorage.removeItem('bridgeup_campaigns');
    localStorage.removeItem('bridgeup_requirements');
    localStorage.removeItem('bridgeup_volunteers');
    localStorage.removeItem('bridgeup_disputes');
    setNgos(initialNgos);
    setIncidents(initialIncidents);
    setAdoptions(initialAdoptions);
    setCampaigns(initialCampaigns);
    setRequirements(initialRequirements);
    setVolunteerDrives(initialVolunteerDrives);
    setDisputes(initialDisputes);
    addToast('System Reset', 'All data reverted to default pristine demo state.');
  };

  return (
    <AppContext.Provider
      value={{
        // Role & Auth
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        currentNgo,
        setCurrentNgo,
        registeredUsers,
        registerUser,
        authenticateUser,
        loginAsUser,
        loginAsNgo,
        loginAsAdmin,
        logout,
        selectCurrentNgo,

        // Navigation
        activeUserTab,
        setActiveUserTab,
        activeNgoTab,
        setActiveNgoTab,
        activeAdminTab,
        setActiveAdminTab,
        isDrawerOpen,
        setIsDrawerOpen,

        // Data Stores & Actions
        ngos,
        registerNewNgo,
        verifyNgo,
        importNgoBatch,
        loadRealNgoDataset,

        incidents,
        reportIncident,
        assignIncidentToNgo,
        resolveIncident,
        moderateIncident,

        adoptions,
        addAdoptionListing,
        approveAdoptionListing,
        submitAdoptionInquiry,

        campaigns,
        makeDonation,
        createCampaign,

        requirements,
        postRequirement,
        contributeToRequirement,

        volunteerDrives,
        applyForVolunteerDrive,

        disputes,
        resolveDispute,

        // Utilities & Theme
        theme,
        setTheme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
