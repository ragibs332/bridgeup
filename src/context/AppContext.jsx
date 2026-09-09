import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  initRealtimeWebSocket,
  fetchCatchUpEvents,
  broadcastCloudEvent,
  subscribeToCloudSync,
  subscribeToSyncStatus,
  broadcastSyncRequest,
  broadcastSyncResponse,
  mergeEntities,
  MY_DEVICE_ID
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

  // Keep latest snapshot ref for instant peer sync replies without recreating callbacks
  const stateRef = React.useRef({ incidents, registeredUsers, ngos, campaigns, requirements });
  useEffect(() => {
    stateRef.current = { incidents, registeredUsers, ngos, campaigns, requirements };
  }, [incidents, registeredUsers, ngos, campaigns, requirements]);

  // Apply a remote cloud event to local state
  const handleCloudEvent = useCallback((event) => {
    if (!event || !event.type) return;

    setIsCloudSynced(true);
    setLastSyncedAt(new Date());

    switch (event.type) {
      case 'SYNC_REQUEST':
        if (event.senderId && event.senderId !== MY_DEVICE_ID) {
          broadcastSyncResponse(event.senderId, stateRef.current);
        }
        break;

      case 'SYNC_SNAPSHOT':
        if (event.payload) {
          const { targetId, snapshot } = event.payload;
          if (!targetId || targetId === MY_DEVICE_ID) {
            const data = snapshot || event.payload;
            if (data) {
              if (Array.isArray(data.incidents) && data.incidents.length) {
                setIncidents(prev => mergeEntities(prev, data.incidents));
              }
              if (Array.isArray(data.registeredUsers) && data.registeredUsers.length) {
                setRegisteredUsers(prev => mergeEntities(prev, data.registeredUsers));
              }
              if (Array.isArray(data.ngos) && data.ngos.length) {
                setNgos(prev => mergeEntities(prev, data.ngos));
              }
            }
          }
        }
        break;

      case 'INCIDENT_REPORTED':
        if (event.payload && event.payload.id) {
          setIncidents(prev => {
            const exists = prev.some(i => i.id === event.payload.id);
            if (exists) return prev;
            addToast('Live Incident Received 🚨', `"${event.payload.title}" reported by ${event.payload.reporterName || 'Citizen'}`, 'info');
            return [event.payload, ...prev];
          });
        }
        break;

      case 'INCIDENT_ASSIGNED':
      case 'INCIDENT_MODERATED':
        if (event.payload && event.payload.id) {
          setIncidents(prev => prev.map(inc => (inc.id === event.payload.id ? { ...inc, ...event.payload } : inc)));
        }
        break;

      case 'INCIDENT_RESOLVED':
        if (event.payload && event.payload.id) {
          setIncidents(prev => prev.map(inc => (inc.id === event.payload.id ? { ...inc, ...event.payload } : inc)));
          if (event.payload.assignedNgoId) {
            setNgos(prev => prev.map(n => {
              if (n.id === event.payload.assignedNgoId) {
                return {
                  ...n,
                  stats: { ...n.stats, incidentsResolved: (n.stats?.incidentsResolved || 0) + 1 }
                };
              }
              return n;
            }));
          }
          addToast('Incident Resolved ✅', `Case marked resolved by ${event.payload.assignedNgoName || 'NGO'}`, 'success');
        }
        break;

      case 'USER_REGISTERED':
        if (event.payload && event.payload.id) {
          setRegisteredUsers(prev => {
            const exists = prev.some(u => u.id === event.payload.id || u.username === event.payload.username);
            if (exists) return prev;
            return [event.payload, ...prev];
          });
        }
        break;

      case 'NGO_REGISTERED':
        if (event.payload && event.payload.id) {
          setNgos(prev => {
            const exists = prev.some(n => n.id === event.payload.id);
            if (exists) return prev;
            return [...prev, event.payload];
          });
        }
        break;

      case 'NGO_VERIFIED':
        if (event.payload && event.payload.ngoId) {
          setNgos(prev => prev.map(n => {
            if (n.id === event.payload.ngoId) {
              return { ...n, ...event.payload };
            }
            return n;
          }));
        }
        break;

      case 'ADOPTION_ADDED':
        if (event.payload && event.payload.id) {
          setAdoptions(prev => {
            const exists = prev.some(a => a.id === event.payload.id);
            if (exists) return prev;
            return [event.payload, ...prev];
          });
        }
        break;

      case 'DONATION_MADE':
        if (event.payload) {
          if (event.payload.campaignId) {
            setCampaigns(prev => prev.map(c => {
              if (c.id === event.payload.campaignId) {
                return {
                  ...c,
                  raisedAmount: c.raisedAmount + event.payload.amount,
                  donorsCount: c.donorsCount + 1
                };
              }
              return c;
            }));
          }
        }
        break;

      case 'REQUIREMENT_POSTED':
        if (event.payload && event.payload.id) {
          setRequirements(prev => {
            const exists = prev.some(r => r.id === event.payload.id);
            if (exists) return prev;
            return [event.payload, ...prev];
          });
        }
        break;

      case 'REQUIREMENT_CONTRIBUTED':
        if (event.payload && event.payload.reqId) {
          setRequirements(prev => prev.map(r => {
            if (r.id === event.payload.reqId) {
              return {
                ...r,
                raisedValue: Math.min(r.targetValue, r.raisedValue + event.payload.amount)
              };
            }
            return r;
          }));
        }
        break;

      default:
        break;
    }
  }, [addToast]);

  // Manual Sync trigger to fetch catch-up events
  const triggerManualSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const pastEvents = await fetchCatchUpEvents();
      if (Array.isArray(pastEvents) && pastEvents.length > 0) {
        pastEvents.forEach(handleCloudEvent);
      }
      setIsCloudSynced(true);
      setLastSyncedAt(new Date());
    } catch (e) {
      console.warn('Sync note:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [handleCloudEvent]);

  // Connect WebSocket & subscribe to real-time events + peer sync handshake
  useEffect(() => {
    initRealtimeWebSocket();
    triggerManualSync();

    // Broadcast a peer sync request so any active device shares its state
    broadcastSyncRequest();

    const unsubscribe = subscribeToCloudSync((event) => {
      handleCloudEvent(event);
    });

    const unsubscribeStatus = subscribeToSyncStatus((connected) => {
      setIsCloudSynced(connected);
    });

    const onVisibilityChange = () => {
      if (!document.hidden) {
        triggerManualSync();
        broadcastSyncRequest();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    // Periodic heartbeat poll every 25 seconds as backup
    const heartbeatInterval = setInterval(() => {
      triggerManualSync();
    }, 25000);

    return () => {
      unsubscribe();
      unsubscribeStatus();
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
    };
  }, [handleCloudEvent, triggerManualSync]);

  // Real Authentication Engine
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
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('user');
    setActiveUserTab('dashboard');

    // Broadcast globally via real-time cloud WebSocket
    broadcastCloudEvent('USER_REGISTERED', newUser);

    addToast('Account Created! 🎉', `Welcome to BridgeUp, ${newUser.name}! Your account is now synchronized across all devices.`, 'success');
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

  // --- ACTIONS (Real-Time Cloud Synced via WebSocket) ---

  // 1. INCIDENTS WORKFLOW
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
      assignedNgoId: null,
      assignedNgoName: null,
      resolutionNotes: null,
      resolutionPhoto: null,
      resolvedAt: null
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Instant Global Push to ALL connected devices worldwide
    broadcastCloudEvent('INCIDENT_REPORTED', newIncident);

    addToast('Incident Reported & Cloud Synced! 🚀', 'Your report has been broadcasted in real time to all phones and PC browsers.', 'success');
    return newIncident;
  };

  const assignIncidentToNgo = (incidentId, ngo) => {
    const updateData = {
      id: incidentId,
      status: 'In Progress',
      assignedNgoId: ngo.id,
      assignedNgoName: ngo.name
    };

    setIncidents(prev => prev.map(inc => (inc.id === incidentId ? { ...inc, ...updateData } : inc)));
    broadcastCloudEvent('INCIDENT_ASSIGNED', updateData);
    addToast('Incident Assigned', `Incident has been assigned to ${ngo.name}`, 'info');
  };

  const resolveIncident = (incidentId, resolutionDetails) => {
    const updateData = {
      id: incidentId,
      status: 'Resolved',
      assignedNgoId: currentNgo.id,
      assignedNgoName: currentNgo.name,
      resolutionNotes: resolutionDetails.notes,
      resolutionPhoto: resolutionDetails.photo || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
      resolvedAt: new Date().toISOString()
    };

    setIncidents(prev => prev.map(inc => (inc.id === incidentId ? { ...inc, ...updateData } : inc)));

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

    setCurrentNgo(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        incidentsResolved: (prev.stats?.incidentsResolved || 0) + 1
      }
    }));

    // Broadcast resolution globally
    broadcastCloudEvent('INCIDENT_RESOLVED', updateData);

    addToast('Incident Marked Resolved! 🎉', 'Resolution proof and notes have been synced across all devices.', 'success');
  };

  const moderateIncident = (incidentId, action, note) => {
    const updateData = {
      id: incidentId,
      status: action === 'flag_spam' ? 'Rejected' : 'Reported',
      adminModerationNote: note || 'Reviewed by Admin'
    };

    setIncidents(prev => prev.map(inc => (inc.id === incidentId ? { ...inc, ...updateData } : inc)));
    broadcastCloudEvent('INCIDENT_MODERATED', updateData);
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

    broadcastCloudEvent('NGO_REGISTERED', newNgo);

    addToast('NGO Registration Submitted!', 'Your documents are currently under review by Platform Admin.', 'info');
    return newNgo;
  };

  const importNgoBatch = (ngoList) => {
    if (!Array.isArray(ngoList) || !ngoList.length) return;
    setNgos(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const newItems = ngoList.filter(n => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });
    addToast('NGOs Imported Successfully! 🏢', `Added ${ngoList.length} real NGO records to the database.`, 'success');
  };

  const loadRealNgoDataset = () => {
    setNgos(initialNgos);
    setCurrentNgo(initialNgos[0]);
    safeSetItem('bridgeup_ngos', initialNgos);
    addToast('Real NGO Dataset Loaded! 🌟', `Loaded ${initialNgos.length} verified real-world NGO records.`, 'success');
  };

  const verifyNgo = (ngoId, status, rejectionReason = '') => {
    const updateData = {
      ngoId,
      verified: status === 'verified',
      verificationStatus: status,
      verificationDate: status === 'verified' ? new Date().toISOString().split('T')[0] : null,
      verifiedBy: 'Super Admin',
      rejectionReason: status === 'rejected' ? rejectionReason : null
    };

    setNgos(prev => prev.map(n => {
      if (n.id === ngoId) {
        return { ...n, ...updateData };
      }
      return n;
    }));

    if (currentNgo.id === ngoId) {
      setCurrentNgo(prev => ({
        ...prev,
        ...updateData
      }));
    }

    broadcastCloudEvent('NGO_VERIFIED', updateData);

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
      inquiries: 0
    };

    setAdoptions(prev => [newListing, ...prev]);
    broadcastCloudEvent('ADOPTION_ADDED', newListing);
    addToast('Adoption Listing Submitted', 'Sent to Admin queue for safety clearance before public listing.', 'info');
    return newListing;
  };

  const approveAdoptionListing = (adoptionId, status) => {
    setAdoptions(prev => prev.map(a => {
      if (a.id === adoptionId) {
        return { ...a, status };
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
        return { ...a, inquiries: (a.inquiries || 0) + 1 };
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

    broadcastCloudEvent('DONATION_MADE', { campaignId, amount: parsedAmount });

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
    broadcastCloudEvent('REQUIREMENT_POSTED', newReq);
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
      totalDonated: (prev?.totalDonated || 0) + parsedAmount,
      donationsCount: (prev?.donationsCount || 0) + 1
    }));

    broadcastCloudEvent('REQUIREMENT_CONTRIBUTED', { reqId, amount: parsedAmount });
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
