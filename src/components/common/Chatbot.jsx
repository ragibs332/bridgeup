import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateGeminiResponse } from '../../services/geminiAi';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Sparkles,
  AlertCircle,
  Heart,
  FileCheck,
  HelpCircle,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Filter,
  CheckCircle2,
  KeyRound,
  Settings
} from 'lucide-react';

export default function Chatbot() {
  const {
    currentRole,
    ngos,
    requirements,
    setActiveUserTab,
    setActiveNgoTab,
    setActiveAdminTab,
    loginAsUser,
    loginAsNgo,
    loginAsAdmin
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('bridgeup_gemini_key') || '');
  const [keyTestState, setKeyTestState] = useState({ testing: false, status: null, message: '' });
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello! I am BridgeUp AI 🌉. I have real-time access to our verified NGO directory across **Mumbai, Navi Mumbai, Delhi, Bengaluru, and Kolkata**. Tell me what you need or where you want to help!",
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    { label: "🏙️ NGOs in Navi Mumbai", query: "Show all NGOs in Navi Mumbai" },
    { label: "🍱 Hunger & Food Relief in Mumbai", query: "Find food and hunger relief NGOs in Mumbai" },
    { label: "🎗️ Cancer Patient Support in Mumbai", query: "Show cancer care support NGOs in Mumbai" },
    { label: "🐕 Animal Rescue in Navi Mumbai", query: "Find animal rescue NGOs in Navi Mumbai" },
    { label: "👶 Child Orphanages in Mumbai", query: "Show child welfare NGOs in Mumbai" },
    { label: "👵 Elder Care Shelters in Panvel", query: "Find elder care shelters in Navi Mumbai or Panvel" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowGreetingBubble(false);
    }
  }, [messages, isOpen]);

  // Haversine distance calculator
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Comprehensive Semantic Search & NGO Filtering Engine
  const searchNgosByRequirement = (userQuery) => {
    const raw = userQuery.toLowerCase();
    // Clean query words
    const tokens = raw.replace(/[^\w\s]/gi, ' ').split(/\s+/).filter(w => w.length > 2);

    // 1. Detect User Target City & Reference Coordinates
    let refCity = 'Delhi';
    let refCoords = { lat: 28.6139, lng: 77.2090 }; // Default New Delhi

    const isNaviMumbai = raw.includes('navi mumbai') || raw.includes('nerul') || raw.includes('vashi') || raw.includes('turbhe') || raw.includes('kharghar') || raw.includes('belapur') || raw.includes('panvel') || raw.includes('koparkhairane') || raw.includes('nere');
    const isMumbai = !isNaviMumbai && (raw.includes('mumbai') || raw.includes('bombay') || raw.includes('bandra') || raw.includes('parel') || raw.includes('andheri') || raw.includes('worli') || raw.includes('dadar') || raw.includes('mahim') || raw.includes('chinchpokli') || raw.includes('dharavi'));
    const isDelhi = raw.includes('delhi') || raw.includes('noida') || raw.includes('ncr') || raw.includes('faridabad') || raw.includes('sarita vihar') || raw.includes('vasant kunj') || raw.includes('hauz khas');
    const isBengaluru = raw.includes('bangalore') || raw.includes('bengaluru') || raw.includes('rajajinagar') || raw.includes('indiranagar');
    const isKolkata = raw.includes('kolkata') || raw.includes('calcutta') || raw.includes('park street');

    if (isNaviMumbai) {
      refCity = 'Navi Mumbai';
      refCoords = { lat: 19.0330, lng: 73.0297 };
    } else if (isMumbai) {
      refCity = 'Mumbai';
      refCoords = { lat: 19.0760, lng: 72.8777 };
    } else if (isBengaluru) {
      refCity = 'Bengaluru';
      refCoords = { lat: 12.9716, lng: 77.5946 };
    } else if (isKolkata) {
      refCity = 'Kolkata';
      refCoords = { lat: 22.5726, lng: 88.3639 };
    }

    // 2. Score every NGO in real-time
    const scoredList = ngos.map(ngo => {
      let score = 0;
      const matchReasons = [];

      const name = (ngo.name || '').toLowerCase();
      const city = (ngo.city || '').toLowerCase();
      const location = (ngo.location || '').toLowerCase();
      const address = (ngo.address || '').toLowerCase();
      const category = (ngo.category || '').toLowerCase();
      const focus = (ngo.focusArea || '').toLowerCase();
      const bio = (ngo.bio || '').toLowerCase();
      const fullText = `${name} ${city} ${location} ${address} ${category} ${focus} ${bio}`;

      // A. Exact Name / Brand Matching
      if (name.includes('roti bank') && (raw.includes('roti') || raw.includes('food bank') || raw.includes('rotibank'))) {
        score += 35;
        matchReasons.push('Roti Bank Food Rescue');
      }
      if (name.includes('cry') && raw.includes('cry')) {
        score += 35;
        matchReasons.push('CRY Child Rights');
      }
      if (name.includes('bspca') && (raw.includes('bspca') || raw.includes('spca'))) {
        score += 35;
        matchReasons.push('BSPCA Animal Hospital');
      }
      if (name.includes('pratham') && raw.includes('pratham')) {
        score += 35;
        matchReasons.push('Pratham Education');
      }
      if (name.includes('st. jude') && (raw.includes('jude') || raw.includes('cancer child'))) {
        score += 35;
        matchReasons.push('St. Jude Cancer Shelter');
      }
      if (name.includes('v care') && (raw.includes('v care') || raw.includes('vcare'))) {
        score += 35;
        matchReasons.push('V Care Cancer Foundation');
      }
      if (name.includes('shantivan') && (raw.includes('shantivan') || raw.includes('panvel') || raw.includes('leprosy'))) {
        score += 35;
        matchReasons.push('Shantivan Elder & Leprosy Care');
      }
      if (name.includes('aarambh') && raw.includes('aarambh')) {
        score += 35;
        matchReasons.push('Aarambh Navi Mumbai');
      }
      if (name.includes('goonj') && raw.includes('goonj')) {
        score += 35;
        matchReasons.push('Goonj Disaster Relief');
      }
      if (name.includes('akshaya patra') && (raw.includes('akshaya') || raw.includes('patra'))) {
        score += 35;
        matchReasons.push('Akshaya Patra Meals');
      }
      if (name.includes('helpage') && raw.includes('helpage')) {
        score += 35;
        matchReasons.push('HelpAge India');
      }
      if (name.includes('friendicoes') && raw.includes('friendicoes')) {
        score += 35;
        matchReasons.push('Friendicoes Animal Clinic');
      }

      // B. City / Location Matching
      if (isNaviMumbai) {
        if (city.includes('navi mumbai') || location.includes('navi mumbai') || address.includes('navi mumbai') || location.includes('turbhe') || location.includes('nerul') || location.includes('kharghar') || location.includes('panvel') || location.includes('vashi') || location.includes('koparkhairane')) {
          score += 25;
          matchReasons.push('Navi Mumbai Location');
        }
      } else if (isMumbai) {
        if (city === 'mumbai' || (city.includes('mumbai') && !city.includes('navi')) || location.includes('mumbai') || location.includes('parel') || location.includes('andheri') || location.includes('worli') || location.includes('bandra') || location.includes('dadar') || location.includes('mahim')) {
          score += 25;
          matchReasons.push('Mumbai Location');
        }
      } else if (isDelhi) {
        if (city.includes('delhi') || location.includes('delhi') || location.includes('noida') || location.includes('faridabad')) {
          score += 25;
          matchReasons.push('Delhi NCR Location');
        }
      } else if (isBengaluru) {
        if (city.includes('bengaluru') || city.includes('bangalore') || location.includes('bengaluru')) {
          score += 25;
          matchReasons.push('Bengaluru Location');
        }
      } else if (isKolkata) {
        if (city.includes('kolkata') || location.includes('kolkata')) {
          score += 25;
          matchReasons.push('Kolkata Location');
        }
      }

      // C. Cause & Domain Matching
      // Food / Hunger
      if (raw.includes('food') || raw.includes('hunger') || raw.includes('meal') || raw.includes('ration') || raw.includes('rice') || raw.includes('dal') || raw.includes('feed') || raw.includes('pantry') || raw.includes('roti') || raw.includes('banquet')) {
        if (category.includes('hunger') || focus.includes('food') || bio.includes('meal') || bio.includes('food') || name.includes('food') || name.includes('roti')) {
          score += 20;
          matchReasons.push('Hunger & Food Relief');
        }
      }

      // Child / Education / Orphanage
      if (raw.includes('child') || raw.includes('orphan') || raw.includes('adopt') || raw.includes('education') || raw.includes('school') || raw.includes('kid') || raw.includes('literacy') || raw.includes('backpack') || raw.includes('student') || raw.includes('foster')) {
        if (category.includes('child') || category.includes('education') || focus.includes('child') || focus.includes('education') || bio.includes('children') || bio.includes('school')) {
          score += 20;
          matchReasons.push('Child Welfare & Education');
        }
      }

      // Animal Rescue & Hospital
      if (raw.includes('animal') || raw.includes('dog') || raw.includes('puppy') || raw.includes('cat') || raw.includes('pet') || raw.includes('stray') || raw.includes('vet') || raw.includes('ambulance') || raw.includes('rabies') || raw.includes('sterilization')) {
        if (category.includes('animal') || focus.includes('animal') || bio.includes('stray') || bio.includes('animal') || name.includes('animal') || name.includes('spca')) {
          score += 22;
          matchReasons.push('Animal Welfare & Clinic');
        }
      }

      // Elder Care / Old Age Shelter
      if (raw.includes('elder') || raw.includes('old') || raw.includes('senior') || raw.includes('grandparent') || raw.includes('agecare') || raw.includes('geriatric') || raw.includes('hospice') || raw.includes('leprosy') || raw.includes('wheelchair')) {
        if (category.includes('elder') || focus.includes('elder') || bio.includes('elder') || bio.includes('leprosy') || name.includes('elder') || name.includes('helpage')) {
          score += 20;
          matchReasons.push('Elder Care & Hospice');
        }
      }

      // Cancer & Critical Healthcare
      if (raw.includes('cancer') || raw.includes('chemo') || raw.includes('tumor') || raw.includes('hospital') || raw.includes('patient') || raw.includes('medical') || raw.includes('clinic') || raw.includes('health') || raw.includes('tata memorial') || raw.includes('actrec')) {
        if (category.includes('healthcare') || category.includes('cancer') || focus.includes('cancer') || bio.includes('cancer') || bio.includes('medical') || bio.includes('hospital')) {
          score += 24;
          matchReasons.push('Cancer & Healthcare Support');
        }
      }

      // Blind & Disability
      if (raw.includes('blind') || raw.includes('braille') || raw.includes('visual') || raw.includes('disability') || raw.includes('handicap')) {
        if (category.includes('disability') || focus.includes('braille') || bio.includes('visually impaired') || name.includes('blind')) {
          score += 25;
          matchReasons.push('Disability & Braille Support');
        }
      }

      // Disaster Relief & Blankets / Clothes
      if (raw.includes('disaster') || raw.includes('blanket') || raw.includes('cloth') || raw.includes('flood') || raw.includes('warmth') || raw.includes('rural')) {
        if (category.includes('disaster') || focus.includes('disaster') || bio.includes('disaster') || focus.includes('clothing')) {
          score += 20;
          matchReasons.push('Disaster Relief & Supplies');
        }
      }

      // D. Token Keyword Matches across fullText
      tokens.forEach(tok => {
        if (fullText.includes(tok)) {
          score += 3;
        }
      });

      // E. Check Urgent Needs Matches
      if (ngo.urgentNeeds && ngo.urgentNeeds.length > 0) {
        ngo.urgentNeeds.forEach(un => {
          const itemText = (un.item || '').toLowerCase();
          tokens.forEach(tok => {
            if (itemText.includes(tok)) {
              score += 8;
              matchReasons.push(`Needs: ${un.item}`);
            }
          });
        });
      }

      // Distance calculation from reference city
      const dist = ngo.coordinates
        ? calculateDistance(refCoords.lat, refCoords.lng, ngo.coordinates.lat, ngo.coordinates.lng)
        : null;

      // Link live active requirements from AppContext
      const ngoReqs = requirements.filter(r => r.ngoId === ngo.id || r.ngoName === ngo.name);

      return {
        ...ngo,
        distanceKm: dist,
        matchScore: score,
        matchReasons: Array.from(new Set(matchReasons)),
        liveRequirements: ngoReqs
      };
    });

    // Filter positive matches
    let results = scoredList.filter(n => n.matchScore > 0);

    // Sort by highest match score, then closest distance
    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      const distA = parseFloat(a.distanceKm || '999');
      const distB = parseFloat(b.distanceKm || '999');
      return distA - distB;
    });

    if (results.length > 0) {
      return {
        cityFound: refCity,
        items: results.slice(0, 4)
      };
    }

    // Fallback: If no strict match, show the closest NGOs in that target city or top verified NGOs
    const fallbackCityNgos = scoredList.filter(n => (n.city || '').toLowerCase().includes(refCity.toLowerCase()));
    if (fallbackCityNgos.length > 0) {
      return {
        cityFound: refCity,
        items: fallbackCityNgos.slice(0, 3)
      };
    }

    return {
      cityFound: 'India',
      items: scoredList.slice(0, 3)
    };
  };

  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. Check if user is asking for general platform workflows
    if (q.includes('how to report') || q.includes('report incident') || q.includes('distress ticket')) {
      return {
        text: "🚨 **Reporting an Emergency Incident on BridgeUp:**\n\n1. Open the **Three-Pin Drawer (☰)** in the top-left and select **'Incident Reporting'**.\n2. Select category (*Child Distress, Elder Neglect, Food Rescue, Animal Rescue, Disaster*).\n3. Use **1-click GPS auto-location**, attach a photo, and set severity level.\n4. **Real-Time Dispatch:** Your ticket appears instantly on local NGO and Admin feeds. When the NGO resolves it, their evidence photo and notes will show directly in your tracker!",
        action: () => {
          if (currentRole === 'user') setActiveUserTab('incident-report');
          else if (currentRole === 'ngo') setActiveNgoTab('incident-solver');
          else if (currentRole === 'admin') setActiveAdminTab('incident-moderation');
          else loginAsUser();
        }
      };
    }

    if (q.includes('how to adopt') || (q.includes('adopt') && q.includes('process'))) {
      return {
        text: "🕊️ **Adoption & Companionship Safety Protocols:**\n\n- All child listings are CARA-compliant and undergo mandatory **Admin Safety Review** before appearing publicly.\n- We also offer **Elder Foster Companionship** for senior citizens.\n- You can browse verified profiles, read their stories, and submit an inquiry for counseling.",
        action: () => {
          if (currentRole === 'user') setActiveUserTab('adoptions');
          else if (currentRole === 'ngo') setActiveNgoTab('adoptions');
          else if (currentRole === 'admin') setActiveAdminTab('adoption-approvals');
          else loginAsUser();
        }
      };
    }

    if (q.includes('80g') || q.includes('tax receipt') || (q.includes('how') && q.includes('donat'))) {
      return {
        text: "💳 **Transparent Donations & 80G Tax Benefits:**\n\n- 100% of contributions go directly to verified NGOs.\n- Official **Section 80G Tax Exemption Receipts** are generated instantly for each transaction and stored permanently in your Profile.\n- You can fund verified campaigns or support urgent food rations and medical supplies!",
        action: () => {
          if (currentRole === 'user') setActiveUserTab('donations');
          else if (currentRole === 'ngo') setActiveNgoTab('campaigns');
          else loginAsUser();
        }
      };
    }

    if (q.includes('verify ngo') || (q.includes('admin') && q.includes('verify'))) {
      return {
        text: "🛡️ **Multi-Tier NGO Verification Workflow:**\n\n1. **NGO Registration:** NGOs upload their Government Societies Registration, 80G/12A Tax Orders, and FCRA clearances.\n2. **Admin Verification:** Platform Admins review uploaded PDFs and complete the statutory checklist.\n3. **Public Trust Seal:** Approved NGOs receive the green **'Verified NGO'** shield across all public listings.",
        action: () => {
          if (currentRole === 'admin') setActiveAdminTab('ngo-verification');
          else if (currentRole === 'ngo') setActiveNgoTab('profile');
          else loginAsAdmin();
        }
      };
    }

    // 2. Perform Dynamic Semantic NGO Search for Any Other Query
    const searchResult = searchNgosByRequirement(userQuery);
    const { cityFound, items } = searchResult;

    if (items && items.length > 0) {
      return {
        text: `🔍 **Found ${items.length} verified NGOs matching your prompt in ${cityFound}:**\nHere are their active urgent needs, verified credentials, and direct contact options:`,
        ngoCards: items,
        action: null
      };
    }

    return {
      text: `I searched our database for "${userQuery}". You can ask me to find NGOs in **Mumbai, Navi Mumbai, Delhi, Bengaluru, or Kolkata** for **Food Relief, Animal Rescue, Child Welfare, Elder Shelters, or Cancer Support**.`,
      action: null
    };
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // 1. Calculate local matching NGO cards & instant classification
    const response = generateBotReply(text);

    // 2. Attempt live Gemini AI enhancement if API key or network is active
    let geminiEnhancedText = null;
    try {
      geminiEnhancedText = await generateGeminiResponse(text, ngos);
    } catch (e) {
      console.warn('Gemini stream fallback:', e);
    }

    const botMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: geminiEnhancedText || response.text,
      ngoCards: response.ngoCards || null,
      action: response.action,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-50">
      {/* Floating Trigger & Greeting Bubble */}
      {!isOpen && (
        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-teal-800 text-white shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-brand-mint-400 hover:shadow-glow-mint"
            aria-label="Open BridgeUp AI Assistant"
            title="BridgeUp AI Chatbot Assistant (Bottom-Left)"
          >
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-amber-500"></span>
            </span>

            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-brand-mint-300 group-hover:rotate-12 transition-transform duration-300" />
          </button>

          {/* Floating Welcoming Badge */}
          {showGreetingBubble && (
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl border border-brand-teal-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce hover:scale-105 transition-transform max-w-[200px] sm:max-w-none"
            >
              <Sparkles className="w-4 h-4 text-brand-amber-500 flex-shrink-0" />
              <span className="truncate">BridgeUp AI • Search NGOs</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreetingBubble(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[420px] h-[520px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-teal-900 via-brand-teal-800 to-brand-teal-700 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-teal-700/80 border border-brand-mint-400/50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-mint-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide">BridgeUp AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-brand-mint-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-brand-mint-200">Real NGO Search & Need Filter</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                className={`p-1.5 rounded-full transition-colors ${
                  geminiApiKey ? 'text-brand-mint-300 bg-white/10 hover:bg-white/20' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={geminiApiKey ? 'Gemini AI API Key Configured' : 'Configure Gemini API Key'}
              >
                <KeyRound className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gemini API Key Configuration Banner */}
          {showKeyModal && (
            <div className="p-3.5 bg-brand-teal-950 text-white border-b border-brand-teal-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-mint-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-amber-400" />
                  Google Gemini API Key Setup
                </span>
                <span className="text-[9px] bg-brand-mint-500/20 text-brand-mint-300 px-2 py-0.5 rounded-full font-bold">
                  Gemini 2.5 Flash / 1.5
                </span>
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Paste your Gemini API key here"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-brand-teal-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-mint-400"
                />
                <button
                  type="button"
                  disabled={keyTestState.testing}
                  onClick={async () => {
                    const trimmed = geminiApiKey.trim();
                    localStorage.setItem('bridgeup_gemini_key', trimmed);
                    if (!trimmed) {
                      setKeyTestState({ testing: false, status: 'error', message: 'Please enter an API key.' });
                      return;
                    }

                    setKeyTestState({ testing: true, status: 'testing', message: 'Contacting Google Gemini API...' });
                    try {
                      const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-goog-api-key': trimmed
                        },
                        body: JSON.stringify({
                          contents: [{ parts: [{ text: 'Respond with: "BridgeUp Connected"' }] }]
                        })
                      });
                      const testData = await testRes.json();
                      if (testRes.ok && testData.candidates?.[0]?.content?.parts?.[0]?.text) {
                        const reply = testData.candidates[0].content.parts[0].text.trim();
                        setKeyTestState({ testing: false, status: 'success', message: `Connected! AI Reply: "${reply}"` });
                      } else {
                        const errMsg = testData.error?.message || JSON.stringify(testData);
                        setKeyTestState({ testing: false, status: 'error', message: errMsg });
                      }
                    } catch (err) {
                      setKeyTestState({ testing: false, status: 'error', message: `Network request error: ${err.message}` });
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-brand-mint-500 hover:bg-brand-mint-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors flex items-center gap-1"
                >
                  {keyTestState.testing ? 'Testing...' : 'Test & Save'}
                </button>
              </div>

              {/* In-UI Status Box */}
              {keyTestState.status && (
                <div className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                  keyTestState.status === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                    : keyTestState.status === 'testing'
                    ? 'bg-blue-950/80 border border-blue-500/60 text-blue-200'
                    : 'bg-red-950/80 border border-red-500/60 text-red-200'
                }`}>
                  <span className="text-sm flex-shrink-0">
                    {keyTestState.status === 'success' ? '✅' : keyTestState.status === 'testing' ? '⏳' : '❌'}
                  </span>
                  <p className="text-[11px] leading-relaxed break-words font-medium">
                    {keyTestState.message}
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-tight">
                Stored in your browser local storage. Click <strong>Test & Save</strong> to run a live test.
              </p>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1`}
              >
                <div className={`flex gap-2.5 max-w-[95%] ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-brand-teal-800 text-brand-mint-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-teal-800 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-none w-full'
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs font-normal">
                      {msg.text}
                    </p>

                    {/* Interactive Real NGO Cards inside Chatbot Message */}
                    {msg.ngoCards && msg.ngoCards.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {msg.ngoCards.map((ngo, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left"
                          >
                            <div className="flex items-start gap-2.5 justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={ngo.logo || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80'}
                                  alt={ngo.name}
                                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
                                />
                                <div className="truncate">
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {ngo.name}
                                  </h4>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                    {ngo.focusArea}
                                  </span>
                                </div>
                              </div>

                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                ngo.verificationStatus === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {ngo.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Review'}
                              </span>
                            </div>

                            {/* Location & Match Reasons */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-brand-teal-600 flex-shrink-0" />
                                <span className="truncate">{ngo.location || ngo.city}</span>
                                {ngo.distanceKm && (
                                  <span className="font-bold text-brand-teal-700 dark:text-brand-mint-400 bg-brand-teal-50 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                                    {ngo.distanceKm} km away
                                  </span>
                                )}
                              </div>

                              {/* Match Tags */}
                              {ngo.matchReasons && ngo.matchReasons.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {ngo.matchReasons.slice(0, 2).map((r, ri) => (
                                    <span key={ri} className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Active Urgent Need Alert */}
                            {ngo.urgentNeeds && ngo.urgentNeeds.length > 0 && (
                              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                                <ShoppingBag className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="font-bold truncate">🚨 Need: {ngo.urgentNeeds[0].item}</span>
                              </div>
                            )}

                            {/* Quick Action Buttons */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <a
                                href={`tel:${ngo.phone || '+919800000000'}`}
                                className="flex-1 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-brand-teal-600" />
                                <span>Call NGO</span>
                              </a>

                              <button
                                onClick={() => {
                                  if (currentRole === 'guest') loginAsUser();
                                  setActiveUserTab('donations');
                                  setIsOpen(false);
                                }}
                                className="flex-1 py-1.5 rounded-lg bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-colors"
                              >
                                <Heart className="w-3 h-3 text-brand-mint-300" />
                                <span>Donate 80G</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Optional Quick Action Button inside message */}
                    {msg.action && (
                      <button
                        onClick={() => {
                          msg.action();
                          setIsOpen(false);
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-mint-100 dark:bg-brand-mint-950 text-brand-teal-900 dark:text-brand-mint-300 hover:bg-brand-mint-200 font-bold text-[11px] transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-brand-teal-700" />
                        <span>Take me there &rarr;</span>
                      </button>
                    )}

                    <span className={`block text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-brand-mint-200' : 'text-slate-400 dark:text-slate-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Bot className="w-4 h-4 text-brand-teal-700 animate-spin" />
                <span>BridgeUp AI is finding matching NGOs...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-brand-teal-900 dark:hover:text-brand-mint-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g. Find NGOs in Navi Mumbai or cancer support in Mumbai..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal-600 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
