import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  initialNgos,
  initialIncidents,
  initialAdoptions,
  initialCampaigns,
  initialRequirements,
  initialVolunteerDrives,
  initialDisputes
} from '../data/mockData';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';
import {
  pullFromCloud,
  pushFullStateToCloud,
  subscribeToCloudSync,
  mergeEntities
} from '../services/cloudSync';

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

  const [isCloudSynced, setIsCloudSynced] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => new Date());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeSetItem('bridgeup_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Registered Users Database (Persistent Real Auth Store)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = safeGetItem('bridgeup_registered_users');
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : [
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
    safeSetItem('bridgeup_registered_users', registeredUsers);
  }, [registeredUsers]);

  const [currentUser, setCurrentUser] = useState(() => {
    return safeGetItem('bridgeup_user', null);
  });

  const [currentNgo, setCurrentNgo] = useState(() => {
    return safeGetItem('bridgeup_ngo', initialNgos[0]);
  });

  // Navigation State
  const [activeUserTab, setActiveUserTab] = useState('dashboard');
  const [activeNgoTab, setActiveNgoTab] = useState('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Core Synchronized Entities
  const [ngos, setNgos] = useState(() => {
    return safeGetItem('bridgeup_ngos', initialNgos);
  });

  const [incidents, setIncidents] = useState(() => {
    return safeGetItem('bridgeup_incidents', initialIncidents);
  });

  const [adoptions, setAdoptions] = useState(() => {
    return safeGetItem('bridgeup_adoptions', initialAdoptions);
  });

  const [campaigns, setCampaigns] = useState(() => {
    return safeGetItem('bridgeup_campaigns', initialCampaigns);
  });

  const [requirements, setRequirements] = useState(() => {
    return safeGetItem('bridgeup_requirements', initialRequirements);
  });

  const [volunteerDrives, setVolunteerDrives] = useState(() => {
    return safeGetItem('bridgeup_volunteers', initialVolunteerDrives);
  });

  const [disputes, setDisputes] = useState(() => {
    return safeGetItem('bridgeup_disputes', initialDisputes);
  });

  // Notifications / Toast queue
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Safe Persistence
  useEffect(() => {
    safeSetItem('bridgeup_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    safeSetItem('bridgeup_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('bridgeup_ngo', currentNgo);
  }, [currentNgo]);

  useEffect(() => {
    safeSetItem('bridgeup_ngos', ngos);
  }, [ngos]);

  useEffect(() => {
    safeSetItem('bridgeup_incidents', incidents);
  }, [incidents]);

  useEffect(() => {
    safeSetItem('bridgeup_adoptions', adoptions);
  }, [adoptions]);

  useEffect(() => {
    safeSetItem('bridgeup_campaigns', campaigns);
  }, [campaigns]);

  useEffect(() => {
    safeSetItem('bridgeup_requirements', requirements);
  }, [requirements]);

  useEffect(() => {
    safeSetItem('bridgeup_volunteers', volunteerDrives);
  }, [volunteerDrives]);

  useEffect(() => {
    safeSetItem('bridgeup_disputes', disputes);
  }, [disputes]);

  // Keep state ref for background cloud sync pushes
  const stateRef = useRef({ incidents, ngos, registeredUsers, adoptions, campaigns, requirements });
  useEffect(() => {
    stateRef.current = { incidents, ngos, registeredUsers, adoptions, campaigns, requirements };
  }, [incidents, ngos, registeredUsers, adoptions, campaigns, requirements]);

  // Manual Trigger to Pull Cloud Updates
  const triggerManualSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const remoteData = await pullFromCloud();
      if (remoteData) {
        if (remoteData.incidents && Array.isArray(remoteData.incidents) && remoteData.incidents.length > 0) {
          setIncidents(prev => mergeEntities(prev, remoteData.incidents));
        }
        if (remoteData.ngos && Array.isArray(remoteData.ngos) && remoteData.ngos.length > 0) {
          setNgos(prev => mergeEntities(prev, remoteData.ngos));
        }
        if (remoteData.registeredUsers && Array.isArray(remoteData.registeredUsers) && remoteData.registeredUsers.length > 0) {
          setRegisteredUsers(prev => mergeEntities(prev, remoteData.registeredUsers));
        }
        if (remoteData.adoptions && Array.isArray(remoteData.adoptions) && remoteData.adoptions.length > 0) {
          setAdoptions(prev => mergeEntities(prev, remoteData.adoptions));
        }
        if (remoteData.campaigns && Array.isArray(remoteData.campaigns) && remoteData.campaigns.length > 0) {
          setCampaigns(prev => mergeEntities(prev, remoteData.campaigns));
        }
        if (remoteData.requirements && Array.isArray(remoteData.requirements) && remoteData.requirements.length > 0) {
          setRequirements(prev => mergeEntities(prev, remoteData.requirements));
        }
      }
      setIsCloudSynced(true);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.warn('Manual sync note:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Continuous Cross-Device Live Cloud Sync Polling (every 3.5 seconds)
  useEffect(() => {
    // Initial fetch on app start
    triggerManualSync();

    // Auto-poll interval
    const interval = setInterval(() => {
      pullFromCloud().then(remoteData => {
        if (remoteData) {
          if (remoteData.incidents?.length) setIncidents(prev => mergeEntities(prev, remoteData.incidents));
          if (remoteData.ngos?.length) setNgos(prev => mergeEntities(prev, remoteData.ngos));
          if (remoteData.registeredUsers?.length) setRegisteredUsers(prev => mergeEntities(prev, remoteData.registeredUsers));
          if (remoteData.adoptions?.length) setAdoptions(prev => mergeEntities(prev, remoteData.adoptions));
          if (remoteData.campaigns?.length) setCampaigns(prev => mergeEntities(prev, remoteData.campaigns));
          if (remoteData.requirements?.length) setRequirements(prev => mergeEntities(prev, remoteData.requirements));
          setIsCloudSynced(true);
          setLastSyncedAt(new Date());
        }
      }).catch(() => {});
    }, 3500);

    // Sync when tab is active / user returns to browser
    const onVisibilityChange = () => {
      if (!document.hidden) {
        triggerManualSync();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    // Sync listener for local cross-tab updates
    const unsubscribe = subscribeToCloudSync((update) => {
      if (update?.type === 'FULL_SYNC' && update?.payload) {
        const payload = update.payload;
        if (payload.incidents) setIncidents(prev => mergeEntities(prev, payload.incidents));
        if (payload.ngos) setNgos(prev => mergeEntities(prev, payload.ngos));
        if (payload.registeredUsers) setRegisteredUsers(prev => mergeEntities(prev, payload.registeredUsers));
        if (payload.adoptions) setAdoptions(prev => mergeEntities(prev, payload.adoptions));
        if (payload.campaigns) setCampaigns(prev => mergeEntities(prev, payload.campaigns));
        if (payload.requirements) setRequirements(prev => mergeEntities(prev, payload.requirements));
        setIsCloudSynced(true);
        setLastSyncedAt(new Date());
      }
    });

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
      unsubscribe();
    };
  }, [triggerManualSync]);

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
      password: password,
      name: name.trim() || username.trim(),
      phone: phone || '+91 98000 00000',
      location: location || 'Mumbai / Delhi, India',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      totalDonated: 0,
      donationsCount: 0,
      volunteerHours: 0,
      badges: ['New Citizen', 'Verified Explorer'],
      savedAdoptions: [],
      donationHistory: [],
      updatedAt: Date.now()
    };

    const updatedUsers = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedUsers);
    setCurrentUser(newUser);
    setCurrentRole('user');
    setActiveUserTab('dashboard');

    // Push to global cloud
    pushFullStateToCloud({
      ...stateRef.current,
      registeredUsers: updatedUsers
    });

    addToast('Account Created! 🎉', `Welcome to BridgeUp, ${newUser.name}! Your account is now active across all devices.`, 'success');
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
    safeRemoveItem('bridgeup_user');
    addToast('Logged Out', 'You have been safely returned to the login screen.');
  };

  const selectCurrentNgo = (ngoId) => {
    const found = ngos.find(n => n.id === ngoId);
    if (found) {
      setCurrentNgo(found);
      addToast('Active NGO Switched', `Now managing ${found.name}`);
    }
  };

  // --- ACTIONS ---

  // 1. INCIDENTS WORKFLOW (Real-Time Cloud Synced)
  const reportIncident = (incidentData) => {
    const newIncident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      title: incidentData.title || 'Untitled Distress Incident',
      category: incidentData.category || 'Child Distress & Labor',
      severity: incidentData.severity || 'High',
      status: 'Reported',
      location: incidentData.location || 'Pinned Location, India',
      coordinates: incidentData.coordinates || { lat: 28.6139, lng: 77.2090 },
      description: incidentData.description || 'Citizen reported emergency distress incident.',
      photo: incidentData.photo || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
      reporterName: currentUser?.name || incidentData.reporterName || 'Concerned Citizen',
      reporterEmail: currentUser?.email || incidentData.reporterEmail || 'citizen@bridgeup.org',
      reporterPhone: currentUser?.phone || incidentData.reporterPhone || '+91 98000 00000',
      createdAt: new Date().toISOString(),
      updatedAt: Date.now(),
      assignedNgoId: null,
      assignedNgoName: null,
      resolutionNotes: null,
      resolutionPhoto: null,
      resolvedAt: null
    };

    const updatedIncidents = [newIncident, ...incidents];
    setIncidents(updatedIncidents);

    // Broadcast & Push to persistent Global Cloud API immediately
    pushFullStateToCloud({
      ...stateRef.current,
      incidents: updatedIncidents
    });

    addToast('Incident Reported & Cloud Synced! 🚀', 'Your report has been broadcasted in real-time to all phones, PCs, and registered NGOs.', 'success');
    return newIncident;
  };

  const assignIncidentToNgo = (incidentId, ngo) => {
    const updatedIncidents = incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'In Progress',
          assignedNgoId: ngo.id,
          assignedNgoName: ngo.name,
          updatedAt: Date.now()
        };
      }
      return inc;
    });

    setIncidents(updatedIncidents);
    pushFullStateToCloud({
      ...stateRef.current,
      incidents: updatedIncidents
    });
    addToast('Incident Assigned', `Incident has been assigned to ${ngo.name}`, 'info');
  };

  const resolveIncident = (incidentId, resolutionDetails) => {
    const updatedIncidents = incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Resolved',
          assignedNgoId: currentNgo.id,
          assignedNgoName: currentNgo.name,
          resolutionNotes: resolutionDetails.notes,
          resolutionPhoto: resolutionDetails.photo || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
          resolvedAt: new Date().toISOString(),
          updatedAt: Date.now()
        };
      }
      return inc;
    });

    // Update NGO stats
    const updatedNgos = ngos.map(n => {
      if (n.id === currentNgo.id) {
        return {
          ...n,
          stats: {
            ...n.stats,
            incidentsResolved: (n.stats?.incidentsResolved || 0) + 1
          },
          updatedAt: Date.now()
        };
      }
      return n;
    });

    setIncidents(updatedIncidents);
    setNgos(updatedNgos);

    setCurrentNgo(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        incidentsResolved: (prev.stats?.incidentsResolved || 0) + 1
      }
    }));

    // Push to global cloud
    pushFullStateToCloud({
      ...stateRef.current,
      incidents: updatedIncidents,
      ngos: updatedNgos
    });

    addToast('Incident Marked Resolved! 🎉', 'Resolution proof and notes have been published and synced across all devices.', 'success');
  };

  const moderateIncident = (incidentId, action, note) => {
    const updatedIncidents = incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: action === 'flag_spam' ? 'Rejected' : inc.status,
          adminModerationNote: note || 'Reviewed by Admin',
          updatedAt: Date.now()
        };
      }
      return inc;
    });

    setIncidents(updatedIncidents);
    pushFullStateToCloud({
      ...stateRef.current,
      incidents: updatedIncidents
    });
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
      },
      updatedAt: Date.now()
    };

    const updatedNgos = [...ngos, newNgo];
    setNgos(updatedNgos);
    setCurrentNgo(newNgo);
    setCurrentRole('ngo');

    pushFullStateToCloud({
      ...stateRef.current,
      ngos: updatedNgos
    });

    addToast('NGO Registration Submitted!', 'Your documents are currently under review by Platform Admin.', 'info');
    return newNgo;
  };

  const importNgoBatch = (ngoList) => {
    if (!Array.isArray(ngoList) || !ngoList.length) return;
    const existingIds = new Set(ngos.map(n => n.id));
    const newItems = ngoList.filter(n => !existingIds.has(n.id));
    const updated = [...ngos, ...newItems];
    setNgos(updated);
    pushFullStateToCloud({
      ...stateRef.current,
      ngos: updated
    });
    addToast('NGOs Imported Successfully! 🏢', `Added ${ngoList.length} real NGO records to the database.`, 'success');
  };

  const loadRealNgoDataset = () => {
    setNgos(initialNgos);
    setCurrentNgo(initialNgos[0]);
    pushFullStateToCloud({
      ...stateRef.current,
      ngos: initialNgos
    });
    addToast('Real NGO Dataset Loaded! 🌟', `Loaded ${initialNgos.length} verified real-world NGO records.`, 'success');
  };

  const verifyNgo = (ngoId, status, rejectionReason = '') => {
    const updatedNgos = ngos.map(n => {
      if (n.id === ngoId) {
        return {
          ...n,
          verified: status === 'verified',
          verificationStatus: status,
          verificationDate: status === 'verified' ? new Date().toISOString().split('T')[0] : null,
          verifiedBy: 'Super Admin',
          rejectionReason: status === 'rejected' ? rejectionReason : null,
          updatedAt: Date.now()
        };
      }
      return n;
    });

    setNgos(updatedNgos);

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

    pushFullStateToCloud({
      ...stateRef.current,
      ngos: updatedNgos
    });

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
      status: 'Pending Admin Review',
      photo: listingData.photo || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
      hobbies: listingData.hobbies || ['Art', 'Reading', 'Music'],
      legalStatus: listingData.legalStatus || 'CARA Safety Protocol Verification Attached',
      addedAt: new Date().toISOString().split('T')[0],
      inquiries: 0,
      updatedAt: Date.now()
    };

    const updatedAdoptions = [newListing, ...adoptions];
    setAdoptions(updatedAdoptions);
    pushFullStateToCloud({
      ...stateRef.current,
      adoptions: updatedAdoptions
    });

    addToast('Adoption Listing Submitted', 'Sent to Admin queue for safety clearance before public listing.', 'info');
    return newListing;
  };

  const approveAdoptionListing = (adoptionId, status) => {
    const updatedAdoptions = adoptions.map(a => {
      if (a.id === adoptionId) {
        return {
          ...a,
          status: status,
          updatedAt: Date.now()
        };
      }
      return a;
    });

    setAdoptions(updatedAdoptions);
    pushFullStateToCloud({
      ...stateRef.current,
      adoptions: updatedAdoptions
    });

    addToast(
      status === 'Approved' ? 'Listing Approved for Public View' : 'Listing Rejected',
      `Adoption profile status set to ${status}`,
      status === 'Approved' ? 'success' : 'warning'
    );
  };

  const submitAdoptionInquiry = (adoptionId, inquiryData) => {
    const updatedAdoptions = adoptions.map(a => {
      if (a.id === adoptionId) {
        return {
          ...a,
          inquiries: (a.inquiries || 0) + 1,
          updatedAt: Date.now()
        };
      }
      return a;
    });

    setAdoptions(updatedAdoptions);
    pushFullStateToCloud({
      ...stateRef.current,
      adoptions: updatedAdoptions
    });

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

    let updatedCampaigns = campaigns;
    if (campaignRef) {
      updatedCampaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          return {
            ...c,
            raisedAmount: c.raisedAmount + parsedAmount,
            donorsCount: c.donorsCount + 1,
            updatedAt: Date.now()
          };
        }
        return c;
      });
      setCampaigns(updatedCampaigns);
    }

    let updatedNgos = ngos;
    if (ngoId) {
      updatedNgos = ngos.map(n => {
        if (n.id === ngoId) {
          return {
            ...n,
            stats: {
              ...n.stats,
              totalDonationsRaised: (n.stats?.totalDonationsRaised || 0) + parsedAmount
            },
            updatedAt: Date.now()
          };
        }
        return n;
      });
      setNgos(updatedNgos);
    }

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
      totalDonated: (prev?.totalDonated || 0) + parsedAmount,
      donationsCount: (prev?.donationsCount || 0) + 1,
      donationHistory: [newTxn, ...(prev?.donationHistory || [])]
    }));

    pushFullStateToCloud({
      ...stateRef.current,
      campaigns: updatedCampaigns,
      ngos: updatedNgos
    });

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
      featured: false,
      updatedAt: Date.now()
    };

    const updatedCampaigns = [newCampaign, ...campaigns];
    setCampaigns(updatedCampaigns);
    pushFullStateToCloud({
      ...stateRef.current,
      campaigns: updatedCampaigns
    });

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
      description: reqData.description,
      updatedAt: Date.now()
    };

    const updatedRequirements = [newReq, ...requirements];
    setRequirements(updatedRequirements);
    pushFullStateToCloud({
      ...stateRef.current,
      requirements: updatedRequirements
    });

    addToast('Urgent Requirement Posted', 'Citizens can now view and fund this directly.', 'info');
    return newReq;
  };

  const contributeToRequirement = (reqId, amount) => {
    const parsedAmount = Number(amount);
    const updatedRequirements = requirements.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          raisedValue: Math.min(r.targetValue, r.raisedValue + parsedAmount),
          updatedAt: Date.now()
        };
      }
      return r;
    });

    setRequirements(updatedRequirements);

    setCurrentUser(prev => ({
      ...prev,
      totalDonated: (prev?.totalDonated || 0) + parsedAmount,
      donationsCount: (prev?.donationsCount || 0) + 1
    }));

    pushFullStateToCloud({
      ...stateRef.current,
      requirements: updatedRequirements
    });

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
      volunteerHours: (prev?.volunteerHours || 0) + 4
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
    safeRemoveItem('bridgeup_ngos');
    safeRemoveItem('bridgeup_incidents');
    safeRemoveItem('bridgeup_adoptions');
    safeRemoveItem('bridgeup_campaigns');
    safeRemoveItem('bridgeup_requirements');
    safeRemoveItem('bridgeup_volunteers');
    safeRemoveItem('bridgeup_disputes');
    setNgos(initialNgos);
    setIncidents(initialIncidents);
    setAdoptions(initialAdoptions);
    setCampaigns(initialCampaigns);
    setRequirements(initialRequirements);
    setVolunteerDrives(initialVolunteerDrives);
    setDisputes(initialDisputes);

    pushFullStateToCloud({
      incidents: initialIncidents,
      ngos: initialNgos,
      registeredUsers: registeredUsers,
      adoptions: initialAdoptions,
      campaigns: initialCampaigns,
      requirements: initialRequirements
    });

    addToast('System Reset & Synced', 'All data reverted to default pristine demo state across all devices.');
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

        // Utilities, Theme & Real Cross-Device Cloud Sync
        theme,
        setTheme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        isCloudSynced,
        isSyncing,
        lastSyncedAt,
        triggerManualSync
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
