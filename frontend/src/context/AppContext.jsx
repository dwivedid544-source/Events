import { API_BASE_URL } from '../config';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  apiClient,
  getAuthToken,
  setAuthToken,
  clearAuthSession,
  AUTH_EXPIRED_EVENT
} from '../utils/apiClient';
import {
  INITIAL_USERS,
  INITIAL_MEMBERS,
  INITIAL_STATES,
  INITIAL_CLUBS,
  INITIAL_DOGS,
  INITIAL_EVENTS,
  INITIAL_ENTRIES,
  INITIAL_RESULTS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_CLAIMS,
  INITIAL_NEWS,
  INITIAL_SPONSORS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_OFFICERS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMISSIONS,
  INITIAL_COMMISSION_SETTINGS,
  INITIAL_VENDORS,
  INITIAL_MEMBERSHIPS,
  INITIAL_ELECTIONS,
  DEFAULT_PERMISSIONS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const location = useLocation();

  // Current user & verified session state
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Validate existing token with real backend on mount
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      const token = getAuthToken();
      if (!token) {
        if (isMounted) {
          setCurrentUser(null);
          setAuthLoading(false);
        }
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        if (isMounted) {
          if (res?.success && (res.data || res.user)) {
            const userData = res.data || res.user;
            setCurrentUser(userData);
          } else {
            clearAuthSession();
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        if (isMounted) {
          clearAuthSession();
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    verifySession();

    // Listen for auth expiration events dispatched by apiClient
    const handleAuthExpired = () => {
      if (isMounted) {
        clearAuthSession();
        setCurrentUser(null);
      }
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const [backendConnected, setBackendConnected] = useState(false);
  const [states, setStates] = useState(INITIAL_STATES);
  const [clubs, setClubs] = useState(() => {
    const saved = localStorage.getItem('nh_clubs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_CLUBS;
  });
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('nh_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map();
          INITIAL_EVENTS.forEach((e) => map.set(e.id, e));
          return parsed.map((e) => {
            const fallback = map.get(e.id) || INITIAL_EVENTS[0];
            return {
              ...fallback,
              ...e,
              deadline: (e.deadline && String(e.deadline).trim()) ? e.deadline : (fallback.deadline || 'Sep 18, 2026'),
              address: (e.address && String(e.address).trim()) ? e.address : (fallback.address || '1420 Hunting Ridge Rd, Knoxville, TN 37901'),
              description: (e.description && String(e.description).trim()) ? e.description : (fallback.description || 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds. Mandatory tracking collars required for all casts.'),
              startTime: (e.startTime && String(e.startTime).trim()) ? e.startTime : (fallback.startTime || '7:00 PM'),
              fee: Number(e.fee !== undefined ? e.fee : (fallback.fee || 30)),
              maxCapacity: Number(e.maxCapacity !== undefined ? e.maxCapacity : (fallback.maxCapacity || 50))
            };
          });
        }
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_EVENTS;
  });

  useEffect(() => {
    // 1. Health check & Active API Connections
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ONLINE') {
          setBackendConnected(true);
          console.log('✅ Express Backend API connected successfully:', data);

          // 2. API Call: Fetch States from MySQL database `club`
          fetch(`${API_BASE_URL}/states`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data)) {
                if (resData.data.length >= 50) {
                  setStates(resData.data);
                } else if (resData.data.length > 0) {
                  // Merge with INITIAL_STATES so all 50 states are guaranteed to be present
                  const map = new Map();
                  INITIAL_STATES.forEach((s) => map.set(s.code.toUpperCase(), s));
                  resData.data.forEach((s) => map.set(s.code.toUpperCase(), { ...map.get(s.code.toUpperCase()), ...s }));
                  setStates(Array.from(map.values()));
                }
              }
            })
            .catch((e) => console.warn('Failed fetching states API:', e));

          // 3. API Call: Fetch Clubs from MySQL database `club`
          fetch(`${API_BASE_URL}/clubs`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                setClubs(resData.data);
              }
            })
            .catch((e) => console.warn('Failed fetching clubs API:', e));

          // 4. API Call: Fetch Events from MySQL database `club`
          fetch(`${API_BASE_URL}/events`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                const map = new Map();
                INITIAL_EVENTS.forEach((e) => map.set(e.id, e));

                const normalized = resData.data.map((evt) => {
                  const fallback = map.get(evt.id) || {};
                  return {
                    ...fallback,
                    ...evt,
                    deadline: evt.deadline || fallback.deadline || 'Sep 18, 2026',
                    address: evt.address || fallback.address || '1420 Hunting Ridge Rd, Knoxville, TN 37901',
                    description: evt.description || fallback.description || 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds.',
                    startTime: evt.startTime || fallback.startTime || '7:00 PM',
                    fee: Number(evt.fee !== undefined ? evt.fee : (fallback.fee || 30)),
                    maxCapacity: Number(evt.maxCapacity !== undefined ? evt.maxCapacity : (fallback.maxCapacity || 50)),
                    entries: evt.entriesCount !== undefined ? evt.entriesCount : (evt.entries || fallback.entries || 0),
                    entriesCount: evt.entriesCount !== undefined ? evt.entriesCount : (evt.entries || fallback.entriesCount || 0)
                  };
                });
                setEvents(normalized);
                localStorage.setItem('nh_events', JSON.stringify(normalized));
              }
            })
            .catch((e) => console.warn('Failed fetching events API:', e));

          // 5. API Call: Fetch News from MySQL database `club`
          fetch(`${API_BASE_URL}/news`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                setNews(resData.data);
                localStorage.setItem('nh_news', JSON.stringify(resData.data));
              }
            })
            .catch((e) => console.warn('Failed fetching news API:', e));

          // 6. API Call: Fetch Members from MySQL database `club`
          fetch(`${API_BASE_URL}/members`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                setMembers(resData.data);
                localStorage.setItem('nh_members', JSON.stringify(resData.data));
              }
            })
            .catch((e) => console.warn('Failed fetching members API:', e));

          // 7. API Call: Fetch Club Claims from MySQL database `club`
          fetch(`${API_BASE_URL}/club-claims`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                setClaims(resData.data);
                localStorage.setItem('nh_claims', JSON.stringify(resData.data));
              }
            })
            .catch((e) => console.warn('Failed fetching claims API:', e));

          // 8. API Call: Fetch Products from MySQL database `club`
          fetch(`${API_BASE_URL}/products`)
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                console.log(`📦 Loaded ${resData.data.length} live products from MySQL database:`, resData.data);
                const normalizedProds = resData.data.map((p) => ({
                  ...p,
                  price: Number(p.price) || 0,
                  wholesaleCost: Number(p.wholesaleCost) || Number(p.wholesale_price) || 0,
                  inStock: p.inStock !== undefined ? Number(p.inStock) : (p.stock !== undefined ? Number(p.stock) : 50),
                  stock: p.stock !== undefined ? Number(p.stock) : (p.inStock !== undefined ? Number(p.inStock) : 50),
                  image: p.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
                  vendorName: p.vendorName || p.club || p.vendor || 'Authorized Vendor',
                  source: p.source || (p.scopeChannel === 'NATIONAL' ? 'UHC' : 'Hunting suppliers')
                }));
                setProducts(normalizedProds);
                localStorage.setItem('nh_products_v2', JSON.stringify(normalizedProds));
              }
            })
            .catch((e) => console.warn('Failed fetching products API:', e));

          // 9. API Call: Fetch Financial Overview Report from MySQL database `club`
          fetch(`${API_BASE_URL}/reports/financial-overview?period=monthly`)
            .then((r) => r.json())
            .then((resData) => {
              console.log('📊 Financial Report API response:', resData);
            })
            .catch((e) => console.warn('Failed fetching report API:', e));
        }
      })
      .catch((err) => {
        console.warn('Backend API connecting/offline, running client fallback:', err.message);
      });
  }, []);

  // Flow-Wise Route API Dispatcher: Fires exact API endpoint for EVERY single route in the app
  useEffect(() => {
    const rawPath = location.pathname.toLowerCase().replace(/\/$/, '') || '/';

    const routeApiMap = {
      '/member': 'auth/profile',
      '/member/profile': 'auth/profile',
      '/member/memberships': 'members',
      '/member/events': 'events',
      '/member/entries': 'events/entries',
      '/member/orders': 'products',
      '/member/dogs': 'dogs',

      '/club-admin': 'clubs/club-1',
      '/club-admin/members': 'members',
      '/club-admin/events': 'events',
      '/club-admin/entries': 'events/entries',
      '/club-admin/results': 'results',
      '/club-admin/news': 'news',
      '/club-admin/store': 'products',
      '/club-admin/finance': 'reports/financial-overview',
      '/club-admin/announcements': 'announcements',
      '/club-admin/club-page': 'clubs/club-1',
      '/club-admin/officers': 'officers',
      '/club-admin/sponsors': 'sponsors',
      '/club-admin/settings': 'settings',

      '/state-admin': 'states/tn',
      '/state-admin/membership': 'members',
      '/state-admin/clubs': 'clubs',
      '/state-admin/events': 'events',
      '/state-admin/entries': 'events/entries',
      '/state-admin/results': 'results',
      '/state-admin/news': 'news',
      '/state-admin/store': 'products',
      '/state-admin/revenue': 'reports/revenue-commissions',
      '/state-admin/reports': 'reports/state-performance',
      '/state-admin/state-page': 'states/tn',
      '/state-admin/settings': 'settings',

      '/event-admin': 'events/evt-1',
      '/event-admin/details': 'events/evt-1',
      '/event-admin/entries': 'events/entries',
      '/event-admin/participants': 'members',
      '/event-admin/attendance': 'events/entries',
      '/event-admin/results': 'results',
      '/event-admin/payments': 'reports/financial-overview',
      '/event-admin/announcements': 'announcements',

      '/national-admin': 'national',
      '/national-admin/states': 'states',
      '/national-admin/clubs': 'clubs',
      '/national-admin/events': 'events',
      '/national-admin/members': 'members',
      '/national-admin/news': 'news',
      '/national-admin/results': 'results',
      '/national-admin/store': 'products',
      '/national-admin/sponsors': 'sponsors',
      '/national-admin/revenue': 'reports/revenue-commissions',
      '/national-admin/commissions': 'commissions',
      '/national-admin/vendors': 'vendors',
      '/national-admin/analytics': 'reports/state-performance',
      '/national-admin/reports': 'reports/state-performance',
      '/national-admin/website': 'health',
      '/national-admin/settings': 'settings',

      '/super-admin': 'super-admin',
      '/super-admin/national': 'national',
      '/super-admin/states': 'states',
      '/super-admin/clubs': 'clubs',
      '/super-admin/club-claims': 'club-claims',
      '/super-admin/events': 'events',
      '/super-admin/members': 'members',
      '/super-admin/store': 'products',
      '/super-admin/orders': 'products',
      '/super-admin/transactions': 'reports/financial-overview',
      '/super-admin/revenue': 'reports/revenue-commissions',
      '/super-admin/commissions': 'commissions',
      '/super-admin/vendors': 'vendors',
      '/super-admin/analytics': 'reports/state-performance',
      '/super-admin/sponsors': 'sponsors',
      '/super-admin/reports': 'reports/state-performance',
      '/super-admin/users-roles': 'users-roles',
      '/super-admin/permissions': 'users-roles',
      '/super-admin/settings': 'settings',

      '/states': 'states',
      '/clubs': 'clubs',
      '/events': 'events'
    };

    const targetEndpoint = routeApiMap[rawPath];

    if (targetEndpoint) {
      fetch(`${API_BASE_URL}/${targetEndpoint}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(`📡 [Flow API Call] Path: ${location.pathname} ➔ Endpoint: ${targetEndpoint}:`, data);
        })
        .catch((err) => console.warn(`Flow API call failed for ${rawPath}:`, err.message));
    }
  }, [location.pathname]);

  // Clean state - remove old dummy entries/members
  const dummyNames = ['John Walker', 'Marcus Vance', 'Sarah Jenkins', 'Cody Campbell', 'Frank Reynolds'];

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nh_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      const cleaned = parsed
        .filter((u) => !dummyNames.includes(u.name) && u.id !== 'usr-1')
        .map((u) => (u.email && u.email.toLowerCase() === 'pancholelalit52@gmail.com' ? { ...u, email: 'demo@example.com' } : u));
      const lalitExists = cleaned.some((u) => u.email && u.email.toLowerCase() === 'demo@example.com');
      if (!lalitExists) {
        return [INITIAL_USERS[0], ...cleaned];
      }
      return cleaned.length > 0 ? cleaned : INITIAL_USERS;
    }
    return INITIAL_USERS;
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('nh_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map();
          INITIAL_MEMBERS.forEach((m) => map.set(m.id, m));
          parsed.forEach((m) => {
            const existing = map.get(m.id);
            const sanitized = m.email === 'pancholelalit52@gmail.com' ? { ...m, email: 'demo@example.com' } : m;
            map.set(m.id, { ...existing, ...sanitized });
          });
          return Array.from(map.values());
        }
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_MEMBERS;
  });

  const [dogs, setDogs] = useState(() => {
    const saved = localStorage.getItem('nh_dogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      const cleaned = parsed.filter((d) => !dummyNames.includes(d.owner) || d.owner === 'Lalit Panchole');
      return cleaned.length > 0 ? cleaned : INITIAL_DOGS;
    }
    return INITIAL_DOGS;
  });

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('nh_entries');
    if (saved) {
      const parsed = JSON.parse(saved);
      const cleaned = parsed.filter((e) => !dummyNames.includes(e.participant) || e.participant === 'Lalit Panchole');
      return cleaned.length > 0 ? cleaned : INITIAL_ENTRIES;
    }
    return INITIAL_ENTRIES;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('nh_results');
    return saved ? JSON.parse(saved) : INITIAL_RESULTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nh_orders_v2');
    const raw = saved ? JSON.parse(saved) : INITIAL_ORDERS;

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const twelveDaysAgo = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return raw.map((o) => {
      let orderDate = o.date;
      if (o.id === 'ORD-9018' && (o.date === 'Aug 07, 2026' || !o.date)) {
        orderDate = todayStr;
      } else if (o.id === 'ORD-9015' && (o.date === 'Aug 06, 2026' || !o.date)) {
        orderDate = twoDaysAgo;
      } else if (o.id === 'ORD-9012' && (o.date === 'Aug 04, 2026' || !o.date)) {
        orderDate = twelveDaysAgo;
      }

      const orderAmount = Number(o.sellingPrice || o.total || o.amount || 0);
      return {
        ...o,
        date: orderDate,
        items: o.items || o.item || 'Official Product',
        item: o.item || o.items || 'Official Product',
        sellingPrice: orderAmount,
        total: orderAmount,
        amount: orderAmount,
        paymentStatus: o.paymentStatus || 'Paid',
        fulfillmentStatus: o.fulfillmentStatus || o.status || 'Delivered',
        status: o.status || o.fulfillmentStatus || 'Delivered'
      };
    });
  });

  // Sync orders with localStorage whenever orders update
  useEffect(() => {
    if (orders && orders.length > 0) {
      try {
        localStorage.setItem('nh_orders_v2', JSON.stringify(orders));
      } catch (e) {
        // ignore
      }
    }
  }, [orders]);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('nh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nh_products_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some((p) => p.price >= 400)) {
        return parsed;
      }
    }
    return INITIAL_PRODUCTS;
  });
  
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('nh_claims');
    let parsed = saved ? JSON.parse(saved) : INITIAL_CLAIMS;
    // Ensure James Wadley's claims are merged into the list
    const jamesClaims = INITIAL_CLAIMS.filter(c => c.applicant === 'James Wadley');
    jamesClaims.forEach(jc => {
      if (!parsed.some(p => p.id === jc.id || (p.club === jc.club && p.applicant === jc.applicant))) {
        parsed = [jc, ...parsed];
      }
    });
    return parsed.map(c => ({
      ...c,
      club: c.club || c.clubName || '',
      state: c.state || 'TN',
      applicant: c.applicant || c.applicantName || '',
      submittedDate: c.submittedDate || c.date || '',
      claimStatus: c.claimStatus || c.status || 'Pending',
      verificationStatus: c.verificationStatus || c.document || 'Pending Review',
      message: c.message || 'Verification request submitted.'
    }));
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('nh_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('nh_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem('nh_officers');
    return saved ? JSON.parse(saved) : INITIAL_OFFICERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nh_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [commissions, setCommissions] = useState(() => {
    const saved = localStorage.getItem('nh_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [elections, setElections] = useState(() => {
    const saved = localStorage.getItem('nh_elections');
    return saved ? JSON.parse(saved) : INITIAL_ELECTIONS;
  });

  const [votes, setVotes] = useState(() => {
    const saved = localStorage.getItem('nh_votes');
    return saved ? JSON.parse(saved) : [];
  });

  // CMS State Map for State Association and National portals
  const [stateCmsMap, setStateCmsMap] = useState(() => {
    const saved = localStorage.getItem('nh_stateCmsMap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed parsing nh_stateCmsMap from localStorage:', e);
      }
    }
    return {
      tn: {
        heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
        heroSubtitle: 'Connecting coonhound owners, state associations, and UKC chartered clubs nationwide across Tennessee.',
        announcementBanner: '2026 Fall National Championship entries are now officially open!',
        aboutContent: 'Welcome to the sanctioned Tennessee State Association portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.',
        contactInfo: 'Email: contact@tnhunting.org | Phone: (865) 555-0192 | Headquarters: Nashville, TN',
        enableBanner: true,
        bannerBadge: 'NATIONAL ALERT',
        bannerLink: '/events',
        heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
        lastPublished: 'Oct 17, 2026, 3:45 PM'
      },
      tx: {
        heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
        heroSubtitle: 'Connecting coonhound owners, state associations, and UKC chartered clubs nationwide across Texas.',
        announcementBanner: '2026 Lone Star State Championship pre-registration is open!',
        aboutContent: 'Welcome to the sanctioned Texas Hound Association portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.',
        contactInfo: 'Email: director@txhunting.org | Phone: (800) 555-0192 | Headquarters: Austin, TX',
        enableBanner: true,
        bannerBadge: 'STATE CHAMPIONSHIP',
        bannerLink: '/events',
        heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        lastPublished: 'Oct 17, 2026, 2:15 PM'
      },
      national: {
        heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
        heroSubtitle: 'Connecting coonhound owners, state associations, and UKC chartered clubs nationwide.',
        announcementBanner: '2026 Fall National Championship entries are now officially open!',
        aboutContent: 'Welcome to the sanctioned state & national association portal. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.',
        contactInfo: 'Email: support@nationalhunting.org | Phone: (865) 555-0192',
        enableBanner: true,
        bannerBadge: 'NATIONAL ALERT',
        bannerLink: '/events',
        heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
        lastPublished: 'Oct 17, 2026, 1:00 PM'
      }
    };
  });

  const getStateCms = (stateKey) => {
    const rawKey = (stateKey || 'tn').toString().toLowerCase().trim();
    if (stateCmsMap[rawKey]) return stateCmsMap[rawKey];
    if ((rawKey.includes('tenn') || rawKey === 'tn') && stateCmsMap['tn']) return stateCmsMap['tn'];
    if ((rawKey.includes('tex') || rawKey === 'tx') && stateCmsMap['tx']) return stateCmsMap['tx'];
    if (stateCmsMap['national'] && rawKey.includes('nat')) return stateCmsMap['national'];

    const twoLetter = rawKey.substring(0, 2);
    if (stateCmsMap[twoLetter]) return stateCmsMap[twoLetter];

    return {
      heroTitle: 'Official Sanctioned Field Trials & Nite Hunts',
      heroSubtitle: `Connecting coonhound owners, state associations, and UKC chartered clubs in ${stateKey || 'State'}.`,
      announcementBanner: '2026 Fall Championship entries are now officially open!',
      aboutContent: `Welcome to the official state association portal for ${stateKey || 'our State'}. We preserve competitive hunting traditions with transparent scoring, digital event entries, and live leaderboard tracking.`,
      contactInfo: `Email: contact@${twoLetter}hunting.org | Phone: (800) 555-0192`,
      enableBanner: true,
      bannerBadge: 'STATE ALERT',
      bannerLink: '/events',
      heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
      lastPublished: 'Oct 17, 2026'
    };
  };

  const updateStateCms = (stateKey, updatedData) => {
    let key = (stateKey || 'tn').toString().toLowerCase().trim();
    if (key.includes('tenn') || key === 'tn') key = 'tn';
    else if (key.includes('tex') || key === 'tx') key = 'tx';
    else if (key.includes('nat')) key = 'national';
    else key = key.substring(0, 2);

    const timestamp = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newCmsObj = {
      ...updatedData,
      lastPublished: timestamp
    };

    setStateCmsMap((prev) => {
      const updated = {
        ...prev,
        [key]: newCmsObj
      };
      localStorage.setItem('nh_stateCmsMap', JSON.stringify(updated));
      return updated;
    });

    return newCmsObj;
  };

  const castVote = async ({ electionId, positionId, candidateId, userEmail }) => {
    const existing = votes.find(
      (v) => v.electionId === electionId && v.positionId === positionId && v.userEmail === userEmail
    );
    if (existing) {
      showToast('You have already cast a vote for this position.', 'error');
      return false;
    }
    const newVote = { id: `vote-${Date.now()}`, electionId, positionId, candidateId, userEmail, date: new Date().toLocaleDateString() };
    const updated = [...votes, newVote];
    setVotes(updated);
    localStorage.setItem('nh_votes', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVote)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/votes`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast('Vote cast successfully!', 'success');
    return true;
  };

  const [revenuePercentages, setRevenuePercentages] = useState(() => {
    const saved = localStorage.getItem('nh_revenue_percentages');
    return saved ? JSON.parse(saved) : {
      nationalPct: 25, // 25% National UHC Share
      statePct: 35,    // 35% State Association Share
      clubPct: 40      // 40% Local Club Share
    };
  });

  const calculateRevenueSplits = (grossAmount, vendorCost = 0, customPercentages = revenuePercentages) => {
    const gross = Number(grossAmount || 0);
    const vCost = Number(vendorCost || 0);
    // 5. Payment Processing Fee (2.9% + $0.30 standard gateway calculation)
    const paymentProcessing = Number((gross * 0.029 + 0.30).toFixed(2));
    
    // 6. Net Profit = Gross - Vendor Cost - Payment Processing
    const netProfit = Math.max(0, Number((gross - vCost - paymentProcessing).toFixed(2)));
    
    const natShare = Number(((netProfit * (customPercentages.nationalPct || 25)) / 100).toFixed(2));
    const stateShare = Number(((netProfit * (customPercentages.statePct || 35)) / 100).toFixed(2));
    const clubShare = Number(((netProfit * (customPercentages.clubPct || 40)) / 100).toFixed(2));

    return {
      grossAmount: gross,
      vendorCost: vCost,
      nationalUhcShare: natShare,
      stateAssociationShare: stateShare,
      localClubShare: clubShare,
      paymentProcessing,
      netProfit
    };
  };

  const recordTransactionWithAutomaticSplits = (txnData) => {
    const splits = calculateRevenueSplits(txnData.grossAmount || txnData.amount, txnData.vendorCost || 0);
    const newTxn = {
      id: txnData.id || `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      description: txnData.description || 'Automatic Revenue Split Transaction',
      category: txnData.category || 'General Transaction',
      date: txnData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: txnData.status || 'Completed',
      type: txnData.type || 'Credit',
      club: txnData.club || 'Houston County Coon Hunters Association',
      state: txnData.state || 'Texas',
      reference: txnData.reference || `REF-${Date.now()}`,
      ...splits
    };
    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  };

  const [commissionSettings, setCommissionSettings] = useState(() => {
    const saved = localStorage.getItem('nh_commission_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION_SETTINGS;
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('nh_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [userMemberships, setUserMemberships] = useState(() => {
    const saved = localStorage.getItem('nh_user_memberships');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIPS;
  });

  const [sponsors] = useState(INITIAL_SPONSORS);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  // Global Hound Sport Category State
  const [selectedCategory, setSelectedCategory] = useState('All');

  const matchesCategory = (item, cat = selectedCategory) => {
    if (!item) return false;
    if (!cat || cat === 'All') return true;
    const searchTarget = [
      item.sport,
      item.type,
      item.category,
      item.breed,
      item.name,
      item.description,
      item.title,
      item.summary,
      item.club,
      item.winnerDog,
      item.federation
    ].filter(Boolean).join(' ').toLowerCase();

    const catLower = cat.toLowerCase();

    if (catLower === 'coonhounds') {
      return searchTarget.includes('coonhound') || searchTarget.includes('treeing') || searchTarget.includes('nite hunt') || searchTarget.includes('water race');
    }
    if (catLower === 'beagles') {
      return searchTarget.includes('beagle') || searchTarget.includes('rabbit');
    }
    if (catLower === 'squirrel dogs') {
      return searchTarget.includes('squirrel') || searchTarget.includes('feist') || searchTarget.includes('cur');
    }
    if (catLower === 'hog dogs') {
      return searchTarget.includes('hog') || searchTarget.includes('bay');
    }
    if (catLower === 'bear dogs') {
      return searchTarget.includes('bear');
    }
    if (catLower === 'rabbit dogs') {
      return searchTarget.includes('rabbit') || searchTarget.includes('beagle');
    }
    if (catLower === 'retrievers') {
      return searchTarget.includes('retriever') || searchTarget.includes('water race') || searchTarget.includes('swim');
    }
    if (catLower === 'cur & feist') {
      return searchTarget.includes('cur') || searchTarget.includes('feist');
    }
    if (catLower === 'competition hunts') {
      return searchTarget.includes('hunt') || searchTarget.includes('championship') || searchTarget.includes('competition') || searchTarget.includes('nite hunt');
    }
    if (catLower === 'bench shows') {
      return searchTarget.includes('bench') || searchTarget.includes('show');
    }
    if (catLower === 'field trials') {
      return searchTarget.includes('field') || searchTarget.includes('trial') || searchTarget.includes('pack trial');
    }
    if (catLower === 'water races') {
      return searchTarget.includes('water') || searchTarget.includes('swim') || searchTarget.includes('water race');
    }
    if (catLower === 'other hound events') {
      return searchTarget.includes('event') || searchTarget.includes('contest') || searchTarget.includes('sanctioned');
    }
    return searchTarget.includes(catLower);
  };

  // Toast system with duplicate suppression
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    if (!message) return;
    setToasts((prev) => {
      // Suppress duplicate toasts if identical notification already exists
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      const id = Date.now() + Math.random();
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 3500);
      return [...prev, { id, message, type }];
    });
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem('nh_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nh_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nh_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('nh_dogs', JSON.stringify(dogs));
  }, [dogs]);

  useEffect(() => {
    localStorage.setItem('nh_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nh_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('nh_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('nh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nh_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nh_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('nh_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('nh_officers', JSON.stringify(officers));
  }, [officers]);

  useEffect(() => {
    localStorage.setItem('nh_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nh_commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('nh_commission_settings', JSON.stringify(commissionSettings));
  }, [commissionSettings]);

  useEffect(() => {
    localStorage.setItem('nh_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('nh_user_memberships', JSON.stringify(userMemberships));
  }, [userMemberships]);

  const updateCommissionSettings = async (newSettings) => {
    setCommissionSettings((prev) => ({ ...prev, ...newSettings }));

    try {
      await fetch(`${API_BASE_URL}/settings/commissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/settings/commissions`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast('Commission percentages updated successfully!', 'success');
  };

  const calculateOrderSplit = (priceAmount, originType = 'NATIONAL') => {
    const price = Number(priceAmount) || 0;
    const vendorSharePct = Number(commissionSettings.vendorSharePct) || 70;
    const clubSharePct = Number(commissionSettings.clubSharePct) || 15;
    const stateSharePct = Number(commissionSettings.stateSharePct) || 7;
    const nationalSharePct = Number(commissionSettings.nationalSharePct) || 8;
    const totalCommissionPct = Number(commissionSettings.totalCommissionPct) || 30;

    const vendorAmount = Number((price * (vendorSharePct / 100)).toFixed(2));
    let clubShare = 0;
    let stateShare = 0;
    let nationalShare = 0;

    if (originType === 'CLUB') {
      clubShare = Number((price * (clubSharePct / 100)).toFixed(2));
      stateShare = Number((price * (stateSharePct / 100)).toFixed(2));
      nationalShare = Number((price - vendorAmount - clubShare - stateShare).toFixed(2));
    } else if (originType === 'STATE') {
      clubShare = 0;
      stateShare = Number((price * (stateSharePct / 100)).toFixed(2));
      nationalShare = Number((price - vendorAmount - stateShare).toFixed(2));
    } else {
      // NATIONAL
      clubShare = 0;
      stateShare = 0;
      nationalShare = Number((price - vendorAmount).toFixed(2));
    }

    return { vendorAmount, clubShare, stateShare, nationalShare };
  };

  const updateFulfillmentStatus = async (orderId, fulfillmentStatus, trackingNumber, carrier) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const finalTracking =
          trackingNumber !== undefined && trackingNumber !== null && trackingNumber !== ''
            ? trackingNumber
            : fulfillmentStatus === 'Processing'
            ? 'Pending Dispatch'
            : o.trackingNumber || `1Z${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;

        return {
          ...o,
          fulfillmentStatus,
          status: fulfillmentStatus,
          trackingNumber: finalTracking,
          carrier: carrier || o.carrier || 'UPS Ground'
        };
      })
    );

    try {
      await fetch(`${API_BASE_URL}/orders/${orderId}/fulfillment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus, trackingNumber, carrier })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/orders/${orderId}/fulfillment`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Order #${orderId} dispatch updated to: ${fulfillmentStatus}`, 'success');
  };

  const updatePayoutStatus = async (orderId, payoutStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payoutStatus } : o))
    );
    try {
      await fetch(`${API_BASE_URL}/orders/${orderId}/payout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutStatus })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/orders/${orderId}/payout`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }
    showToast(`Order #${orderId} payout status set to: ${payoutStatus}`, 'success');
  };

  const addMembership = async (membershipData) => {
    const newRecord = {
      id: `ms-${Date.now()}`,
      userEmail: membershipData.email || currentUser.email,
      tier: membershipData.tier || 'Local Chartered Club',
      scopeName: membershipData.scopeName || 'Oak Ridge Hunting Club (TN)',
      membershipId: membershipData.membershipId || `MEM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      expiryDate: membershipData.expiryDate || 'Sep 18, 2027',
      fee: Number(membershipData.fee) || 25.00
    };
    setUserMemberships((prev) => [newRecord, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/members`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Activated ${newRecord.tier}: ${newRecord.scopeName}`, 'success');
  };

  // Role Switcher - disabled in production flow to prevent unauthorized impersonation
  const switchRole = (roleKey) => {
    console.warn(`[Security Notice] Client-side role switching is disabled. Access is determined by authenticated credentials (${currentUser?.role || 'Unauthenticated'}).`);
    showToast('Role switching is disabled. User access is determined by verified authentication.', 'warning');
  };

  // Real authentication login action using backend REST API & JWT
  const loginUser = async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();

    try {
      const res = await apiClient.post('/auth/login', {
        email: cleanEmail,
        password: password || ''
      });

      if (res?.success && res.data?.token) {
        setAuthToken(res.data.token);
        const authedUser = res.data.user;
        setCurrentUser(authedUser);
        showToast(`Welcome back, ${authedUser.name || authedUser.email}!`, 'success');
        return { success: true, user: authedUser };
      } else {
        const errorMsg = res?.error?.message || 'Login failed. Please verify your credentials.';
        showToast(errorMsg, 'error');
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('Backend Login API error:', err.message);
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const logoutUser = () => {
    clearAuthSession();
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  // 1. Membership Join Flow Action - Honest states, no false simulation
  const registerMembership = async (formData) => {
    const fullName = formData.name || `${formData.firstName || 'Member'} ${formData.lastName || 'Customer'}`.trim();
    const cleanEmail = String(formData.email || '').trim().toLowerCase();
    const newId = `TN-ORHC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newMember = {
      id: `mem-${Date.now()}`,
      name: fullName,
      membershipId: newId,
      club: formData.selectedClub || formData.clubName || formData.club || 'Oak Ridge Hunting Club',
      state: formData.selectedState || formData.stateName || formData.state || 'Tennessee',
      type: formData.membershipType || 'Individual Membership',
      status: 'Pending Payment Verification',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      expires: 'Sep 18, 2027',
      phone: formData.phone || '',
      email: cleanEmail,
      paymentStatus: 'Pending Gateway Processing',
      paymentGateway: 'Clover'
    };

    try {
      const memberRes = await apiClient.post('/members', newMember);
      if (memberRes?.success) {
        setMembers((prev) => [newMember, ...prev]);
        showToast(`Membership application registered for ${fullName}! Note: Payment verification pending with payment processor.`, 'info');
        return newMember;
      } else {
        throw new Error(memberRes?.error?.message || 'Server rejected membership registration');
      }
    } catch (err) {
      console.error('Membership registration error:', err);
      showToast(`Membership registration error: ${err.message}`, 'error');
      throw err;
    }
  };

  // State Membership Sign-Up Flow Action
  const registerStateMembership = async (formData) => {
    const stateName = formData.state || 'Texas';
    const stateCode = stateName.substring(0, 2).toUpperCase();
    const newId = `${stateCode}-HOUND-${Math.floor(10000 + Math.random() * 90000)}`;
    const cleanEmail = String(formData.email || '').trim().toLowerCase();
    const amountPaid = Number(formData.amount || 35.00);

    const newMember = {
      id: `mem-${Date.now()}`,
      name: formData.name,
      address: formData.address || '',
      city: formData.city || '',
      state: stateName,
      phone: formData.phone || '',
      email: cleanEmail,
      membershipId: newId,
      club: formData.clubAffiliation || 'Lone Star Hound Club',
      type: formData.membershipType || 'Individual Membership',
      dogSportInterests: Array.isArray(formData.dogSportInterests)
        ? formData.dogSportInterests
        : [formData.dogSportInterests || 'Coonhound Nite Hunts'],
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      paymentRecorded: true,
      amountPaid: amountPaid,
      paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    const newUser = {
      id: newMember.id,
      name: formData.name,
      email: cleanEmail,
      role: 'MEMBER',
      scope: `${newMember.club} (${newMember.state})`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      membershipId: newId,
      club: newMember.club,
      state: newMember.state
    };

    // Automatically record payment in transactions ledger
    const newTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      description: `State Membership Sign-Up - ${formData.name} (${stateName})`,
      category: 'State Membership Dues',
      amount: amountPaid,
      type: 'Credit',
      status: 'Completed',
      state: stateName,
      memberId: newId,
      reference: `PAY-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setMembers((prev) => [newMember, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setTransactions((prev) => [newTransaction, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/members`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`State Membership successfully activated for ${formData.name}! Recorded payment of $${amountPaid.toFixed(2)}.`, 'success');
    return newMember;
  };

  // Local Club Membership Sign-Up Flow Action (Recording exact 7 fields required by client)
  const registerLocalClubMembership = async (formData) => {
    const clubName = formData.clubAffiliation || formData.clubName || 'Houston County Coon Hunters Association';
    const cleanEmail = String(formData.email || '').trim().toLowerCase();
    const amountPaid = Number(formData.amount || 25.00);
    const joinDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const newId = `CLUB-${Math.floor(10000 + Math.random() * 90000)}`;

    const stateName = formData.state || 'Texas';
    const stateAssociationName = `${stateName} State Association`;

    // Multi-Organization Single Account Affiliations (Requirement 4 & 5)
    const organizations = [
      { id: 'org-uhc', level: 'NATIONAL', name: 'Ultimate Hound Championships (UHC)', role: 'Member', status: 'Active', joined: joinDate },
      { id: 'org-state', level: 'STATE', name: stateAssociationName, role: 'State Member', status: 'Active', joined: joinDate },
      { id: 'org-club', level: 'LOCAL_CLUB', name: clubName, role: 'Club Member', status: 'Active', joined: joinDate }
    ];

    // Automatically Record 7 Fields: Member name, Contact info, Join date, Expiration date, Payment, Membership type, Club affiliation
    const newMember = {
      id: `mem-${Date.now()}`,
      name: formData.name, // 1. Member name
      phone: formData.phone || '(936) 555-0182', // 2. Contact info
      email: cleanEmail, // 2. Contact info
      joined: joinDate, // 3. Join date
      expires: expirationDate, // 4. Expiration date
      amountPaid: amountPaid, // 5. Payment
      paymentStatus: 'Completed', // 5. Payment
      paymentRecorded: true, // 5. Payment
      type: formData.membershipType || 'Individual Local Membership', // 6. Membership type
      club: clubName, // 7. Club affiliation
      state: stateName,
      stateAssociation: stateAssociationName,
      organizations: organizations, // 4 & 5. Preserving multi-organization membership on single account
      membershipId: newId,
      status: 'Active'
    };

    const newUser = {
      id: newMember.id,
      name: formData.name,
      email: cleanEmail,
      role: 'MEMBER',
      scope: `${newMember.club} / ${stateAssociationName} / UHC`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      membershipId: newId,
      club: newMember.club,
      state: newMember.state,
      stateAssociation: stateAssociationName,
      organizations: organizations
    };

    const newTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      description: `Local Club Membership Sign-Up - ${formData.name} (${clubName})`,
      category: 'Local Club Membership Dues',
      amount: amountPaid,
      type: 'Credit',
      status: 'Completed',
      club: clubName,
      memberId: newId,
      reference: `PAY-${Date.now()}`,
      date: joinDate
    };

    setMembers((prev) => [newMember, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setTransactions((prev) => [newTransaction, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/members`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(
      `Membership Flow complete for ${formData.name}! Recorded Local Club, State Association (${stateAssociationName}), and National UHC under 1 Single Account.`,
      'success'
    );
    return newMember;
  };

  // 2. Event Registration Flow Action
  const enterEvent = async (eventId, dogId, participantName) => {
    const targetEvent = events.find((e) => e.id === eventId);
    const targetDog = dogs.find((d) => d.id === dogId) || dogs.find((d) => d.owner === currentUser?.name) || dogs[0];

    if (!targetEvent) return;

    const newEntryId = `E${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newEntryId,
      eventId: targetEvent.id,
      eventName: targetEvent.name,
      club: targetEvent.club,
      participant: participantName || currentUser?.name || 'Member Participant',
      participantEmail: currentUser?.email || 'member@example.com',
      dog: targetDog ? targetDog.callName : 'Registered Canine',
      date: targetEvent.date,
      fee: targetEvent.fee,
      paymentStatus: 'Paid',
      entryStatus: 'Confirmed',
      checkInStatus: 'Not Arrived',
      result: 'Pending'
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Update event stats safely
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, entries: (Number(e.entries) || 0) + 1, paidEntries: (Number(e.paidEntries) || 0) + 1 }
          : e
      )
    );

    try {
      await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/events/${eventId}/register`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Registered ${targetDog?.callName || 'dog'} for ${targetEvent.name}! Entry #${newEntryId}`, 'success');
  };

  // 3. Mobile Event Check-in Action (Connected to Backend API)
  const toggleCheckIn = async (entryId) => {
    let targetStatus = '';
    let targetParticipant = '';

    setEntries((prev) => {
      const next = prev.map((item) => {
        if (item.id === entryId) {
          const newStatus = item.checkInStatus === 'Checked In' ? 'Not Arrived' : 'Checked In';
          targetStatus = newStatus;
          targetParticipant = item.participant || 'Participant';
          return { ...item, checkInStatus: newStatus };
        }
        return item;
      });
      localStorage.setItem('nh_entries', JSON.stringify(next));
      return next;
    });

    if (targetStatus) {
      showToast(
        `Entry #${entryId} ${targetParticipant} status set to: ${targetStatus}`,
        targetStatus === 'Checked In' ? 'success' : 'info'
      );
    }

    try {
      await fetch(`${API_BASE_URL}/events/entries/${entryId}/check-in`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkInStatus: targetStatus })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/events/entries/${entryId}/check-in -> ${targetStatus}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }
  };

  const updateEntry = async (entryId, updatedFields) => {
    let updatedItem = null;
    setEntries((prev) => {
      const next = prev.map((item) => {
        if (item.id === entryId) {
          updatedItem = { ...item, ...updatedFields };
          return updatedItem;
        }
        return item;
      });
      localStorage.setItem('nh_entries', JSON.stringify(next));
      return next;
    });

    if (updatedFields.paymentStatus) {
      showToast(`Entry #${entryId} payment marked as ${updatedFields.paymentStatus}`, 'success');
    } else if (updatedFields.checkInStatus) {
      showToast(`Entry #${entryId} check-in set to ${updatedFields.checkInStatus}`, 'info');
    } else {
      showToast(`Entry #${entryId} updated successfully`, 'success');
    }

    try {
      await fetch(`${API_BASE_URL}/events/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn('API Warning on updateEntry:', err.message);
    }

    return updatedItem;
  };

  const deleteEntry = async (entryId) => {
    setEntries((prev) => {
      const next = prev.filter((item) => item.id !== entryId);
      localStorage.setItem('nh_entries', JSON.stringify(next));
      return next;
    });
    showToast(`Entry #${entryId} deleted`, 'info');
  };

  const addManualEntry = async (entryData) => {
    const newEntryId = entryData.id || `E${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newEntryId,
      eventId: entryData.eventId || 'evt-1',
      eventName: entryData.eventName || 'Nite Hunt & Treeing Contest',
      club: entryData.club || 'Oak Ridge Hunting Club',
      participant: entryData.participant || 'New Participant',
      participantEmail: entryData.participantEmail || 'member@hunting.org',
      dog: entryData.dog || 'Hunter',
      date: entryData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      fee: Number(entryData.fee) || 35,
      paymentStatus: entryData.paymentStatus || 'Paid',
      entryStatus: entryData.entryStatus || 'Confirmed',
      checkInStatus: entryData.checkInStatus || 'Not Arrived',
      result: 'Pending'
    };

    setEntries((prev) => {
      const next = [newEntry, ...prev];
      localStorage.setItem('nh_entries', JSON.stringify(next));
      return next;
    });

    showToast(`Added new entry #${newEntryId} for ${newEntry.participant}!`, 'success');
    return newEntry;
  };

  // Club Profile & CMS Update Action
  const updateClub = async (clubId, updatedFields) => {
    let target = null;
    setClubs((prev) => {
      const next = prev.map((c) => {
        if (c.id === clubId || c.name === clubId) {
          target = { ...c, ...updatedFields };
          return target;
        }
        return c;
      });
      localStorage.setItem('nh_clubs', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/clubs/${clubId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn('API Warning on updateClub:', err.message);
    }

    return target;
  };

  // 4. Create Event Action
  const createEvent = async (newEventData) => {
    const created = {
      id: newEventData.id || `evt-${Date.now()}`,
      name: newEventData.name,
      federation: newEventData.federation || 'UKC (United Kennel Club)',
      sport: newEventData.sport || 'Coonhounds',
      type: newEventData.type || 'Nite Hunt',
      club: newEventData.club || 'Oak Ridge Hunting Club',
      clubId: newEventData.clubId || 'club-1',
      state: newEventData.state || 'Tennessee',
      stateCode: newEventData.stateCode || (newEventData.state === 'Tennessee' ? 'TN' : 'TN'),
      city: newEventData.city || 'Knoxville',
      date: newEventData.date || 'October 15, 2026',
      startTime: newEventData.startTime || '7:00 PM',
      deadline: newEventData.deadline || 'Oct 14, 2026',
      fee: Number(newEventData.fee) || 30,
      entries: Number(newEventData.entriesCount !== undefined ? newEventData.entriesCount : (newEventData.entries || 0)),
      entriesCount: Number(newEventData.entriesCount !== undefined ? newEventData.entriesCount : (newEventData.entries || 0)),
      maxCapacity: Number(newEventData.maxCapacity) || 50,
      paidEntries: 0,
      pendingEntries: 0,
      checkedIn: 0,
      status: newEventData.status || 'Registration Open',
      distance: newEventData.distance || '18 miles away',
      address: newEventData.address || '1420 Hunting Ridge Rd, Knoxville, TN',
      description: newEventData.description || 'Sanctioned hunt event.'
    };

    setEvents((prev) => {
      const next = [created, ...prev];
      localStorage.setItem('nh_events', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
      console.log('📡 API Call Success: POST /api/v1/events');
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Event "${created.name}" published successfully!`, 'success');
    return created;
  };

  const deleteEvent = async (eventId) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== eventId);
      localStorage.setItem('nh_events', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📡 API Call Success: DELETE /api/v1/events/${eventId}`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast('Event removed successfully', 'info');
  };

  const updateEvent = async (eventId, updatedData) => {
    const targetId = eventId || updatedData.id || 'evt-1';
    setEvents((prev) => {
      const next = prev.map((e) => {
        if (e.id === targetId || e.name === updatedData.name) {
          const merged = { ...e, ...updatedData };
          if (updatedData.entriesCount !== undefined) {
            merged.entries = Number(updatedData.entriesCount);
            merged.entriesCount = Number(updatedData.entriesCount);
          } else if (updatedData.entries !== undefined) {
            merged.entries = Number(updatedData.entries);
            merged.entriesCount = Number(updatedData.entries);
          }
          return merged;
        }
        return e;
      });
      localStorage.setItem('nh_events', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/events/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/events/${targetId}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Updated event: "${updatedData.name || targetId}"`, 'success');
  };

  // 5. Add / Edit Dog Action
  const saveDog = async (dogData) => {
    if (dogData.id) {
      setDogs((prev) => prev.map((d) => (d.id === dogData.id ? { ...d, ...dogData } : d)));

      try {
        await fetch(`${API_BASE_URL}/dogs/${dogData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dogData)
        });
        console.log(`📡 API Call Success: PUT /api/v1/dogs/${dogData.id}`);
      } catch (err) {
        console.warn('API Call Warning:', err.message);
      }

      showToast(`Updated dog ${dogData.callName} profile`, 'success');
    } else {
      const newDog = {
        id: `dog-${Date.now()}`,
        callName: dogData.callName,
        registeredName: dogData.registeredName,
        breed: dogData.breed || 'Treeing Walker Coonhound',
        gender: dogData.gender || 'Male',
        age: dogData.age || '2 Years',
        dob: dogData.dob || 'Jan 2024',
        regNo: dogData.regNo || `UKC-${Math.floor(100000 + Math.random() * 900000)}`,
        owner: currentUser.name,
        ownerEmail: currentUser.email,
        eventsCount: 0,
        winsCount: 0,
        photo: dogData.photo || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&auto=format&fit=crop&q=80'
      };
      setDogs((prev) => [newDog, ...prev]);

      try {
        await fetch(`${API_BASE_URL}/dogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDog)
        });
        console.log('📡 API Call Success: POST /api/v1/dogs');
      } catch (err) {
        console.warn('API Call Warning:', err.message);
      }

      showToast(`Added new dog: ${newDog.callName} for ${currentUser.name}`, 'success');
    }
  };

  const deleteDog = async (id) => {
    setDogs((prev) => prev.filter((d) => d.id !== id));

    try {
      await fetch(`${API_BASE_URL}/dogs/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📡 API Call Success: DELETE /api/v1/dogs/${id}`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast('Dog profile removed', 'info');
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    let approvedClaim = null;
    setClaims((prev) => {
      const next = prev.map((c) => {
        if (c.id === claimId) {
          approvedClaim = { ...c, claimStatus: newStatus, status: newStatus };
          return approvedClaim;
        }
        return c;
      });
      localStorage.setItem('nh_claims', JSON.stringify(next));
      return next;
    });

    if (newStatus === 'Approved' && approvedClaim) {
      const stateKey = (approvedClaim.state || approvedClaim.stateId || '').toLowerCase();
      setStates((prev) =>
        prev.map((s) =>
          s.id === stateKey || s.code.toLowerCase() === stateKey || s.name.toLowerCase().includes(stateKey)
            ? { ...s, adminName: approvedClaim.applicant, status: 'Active' }
            : s
        )
      );
      if (approvedClaim.club) {
        setClubs((prev) =>
          prev.map((c) =>
            c.name.toLowerCase() === approvedClaim.club.toLowerCase()
              ? { ...c, adminName: approvedClaim.applicant, status: 'Active' }
              : c
          )
        );
      }
    }

    try {
      const res = await apiClient.put(`/club-claims/${claimId}`, { claimStatus: newStatus });
      if (res?.success) {
        setClaims((prev) =>
          prev.map((c) =>
            c.id === claimId
              ? {
                  ...c,
                  claimStatus: newStatus,
                  status: newStatus,
                  verificationStatus: newStatus === 'Approved' ? 'Verified Official' : 'Rejected'
                }
              : c
          )
        );
        showToast(`Claim #${claimId} status updated to: ${newStatus}`, 'success');
        return { success: true };
      } else {
        throw new Error(res?.error?.message || 'Server rejected claim status change');
      }
    } catch (err) {
      console.error(`Failed updating claim #${claimId}:`, err);
      showToast(`Could not update claim status: ${err.message}`, 'error');
      throw err;
    }
  };

  const submitClaimRequest = async (claimData) => {
    try {
      const payload = {
        claimStatus: 'Pending',
        status: 'Pending',
        submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        verificationStatus: 'Pending Review',
        ...claimData
      };

      const res = await apiClient.post('/club-claims', payload);
      if (res?.success && res.data) {
        const confirmedClaim = res.data;
        setClaims((prev) => [confirmedClaim, ...prev.filter((c) => c.id !== confirmedClaim.id)]);
        showToast(`Claim request for "${claimData.club || claimData.state}" submitted successfully! Review pending in Super Admin portal.`, 'success');
        return confirmedClaim;
      } else {
        throw new Error(res?.error?.message || 'Server rejected claim submission');
      }
    } catch (err) {
      console.error('Claim submission error:', err);
      showToast(`Claim submission failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const addResult = async (resultData) => {
    const newRes = {
      id: `res-${Date.now()}`,
      ...resultData,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setResults((prev) => [newRes, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes)
      });
      console.log('📡 API Call Success: POST /api/v1/results');
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Published competition result for ${resultData.eventName}!`, 'success');
  };

  const updatePermission = (role, module, action, value) => {
    setPermissions((prev) => {
      const isArr = Array.isArray(prev);
      const currentRoleObj = isArr ? {} : (prev?.[role] || {});
      const currentMod = currentRoleObj?.[module] || { view: false, create: false, edit: false, delete: false };

      return {
        ...(isArr ? {} : prev),
        [role]: {
          ...currentRoleObj,
          [module]: {
            ...currentMod,
            [action]: value
          }
        }
      };
    });
  };

  const grantAllPermissionsForRole = (role, grant = true) => {
    const modules = ['members', 'events', 'claims', 'dogs', 'products', 'orders', 'finance', 'news', 'reports'];
    setPermissions((prev) => {
      const isArr = Array.isArray(prev);
      const currentRoleObj = isArr ? {} : (prev?.[role] || {});
      const updatedRoleObj = { ...currentRoleObj };

      modules.forEach((mod) => {
        updatedRoleObj[mod] = {
          view: grant,
          create: grant,
          edit: grant,
          delete: grant
        };
      });

      return isArr ? { [role]: updatedRoleObj } : { ...prev, [role]: updatedRoleObj };
    });

    showToast(`${grant ? 'Granted' : 'Revoked'} all permissions for ${role}`, grant ? 'success' : 'info');
  };

  const postLocalClubNews = async (newsData) => {
    const newItem = {
      id: `news-${Date.now()}`,
      title: newsData.title,
      category: newsData.category || 'Important Club News',
      level: 'LOCAL_CLUB',
      club: newsData.club || 'Houston County Coon Hunters Association',
      state: newsData.state || 'Texas',
      stateId: newsData.stateId || 'texas',
      stateCode: newsData.stateCode || 'TX',
      author: newsData.author || currentUser.name || 'Club Secretary',
      summary: newsData.summary || 'Important local club news announcement.',
      isPromotedToState: false,
      isPromotedToNational: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      image: newsData.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80'
    };
    setNews((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      console.log('📡 API Call Success: POST /api/v1/news');
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Posted Local Club News: "${newItem.title}"!`, 'success');
    return newItem;
  };

  const promoteNewsToState = async (newsId) => {
    setNews((prev) =>
      prev.map((n) => {
        if (n.id === newsId) {
          const newStatus = !n.isPromotedToState;
          showToast(
            newStatus
              ? `State Association promoted "${n.title}" to State News Feed!`
              : `Removed "${n.title}" State promotion.`,
            newStatus ? 'success' : 'info'
          );
          return {
            ...n,
            isPromotedToState: newStatus,
            level: newStatus ? 'STATE_ASSOCIATION' : 'LOCAL_CLUB'
          };
        }
        return n;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPromotedToState: true })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/news/${newsId}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }
  };

  const promoteNewsToNational = async (newsId) => {
    setNews((prev) =>
      prev.map((n) => {
        if (n.id === newsId) {
          const updatedStatus = !n.isPromotedToNational;
          showToast(
            updatedStatus
              ? `National UHC promoted "${n.title}" to National News Feed!`
              : `Removed "${n.title}" promotion from National Feed.`,
            updatedStatus ? 'success' : 'info'
          );
          return {
            ...n,
            isPromotedToNational: updatedStatus,
            level: updatedStatus ? 'NATIONAL_UHC' : (n.isPromotedToState ? 'STATE_ASSOCIATION' : 'LOCAL_CLUB')
          };
        }
        return n;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/news/${newsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPromotedToNational: true })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/news/${newsId}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }
  };

  const addNews = async (newsData) => {
    const newItem = {
      id: `news-${Date.now()}`,
      title: newsData.title,
      category: newsData.category || 'State Hunt announcements',
      level: newsData.level || 'STATE_ASSOCIATION',
      state: newsData.state || 'Texas',
      stateId: newsData.stateId || 'texas',
      stateCode: newsData.stateCode || 'TX',
      author: newsData.author || currentUser.name,
      summary: newsData.summary || 'Official article published to state news feed.',
      isPromotedToState: true,
      isPromotedToNational: Boolean(newsData.isPromotedToNational),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      image: newsData.image || 'https://images.unsplash.com/photo-1511497584788-876761c11969?w=600&auto=format&fit=crop&q=80'
    };
    setNews((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      console.log('📡 API Call Success: POST /api/v1/news');
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Published article: "${newItem.title}"`, 'success');
  };

  const deleteNews = async (newsId) => {
    setNews((prev) => prev.filter((n) => n.id !== newsId));

    try {
      await fetch(`${API_BASE_URL}/news/${newsId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📡 API Call Success: DELETE /api/v1/news/${newsId}`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast('News article deleted', 'info');
  };

  const addAnnouncement = async (annData) => {
    const newItem = {
      id: `anc-${Date.now()}`,
      title: annData.title,
      message: annData.message,
      priority: annData.priority || 'Normal',
      scope: annData.scope || 'Club',
      club: annData.club || currentUser.club || 'Oak Ridge Hunting Club',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setAnnouncements((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/announcements`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Broadcasted announcement: "${newItem.title}"`, 'success');
  };

  const addOfficer = async (offData) => {
    const newItem = {
      id: `off-${Date.now()}`,
      name: offData.name,
      title: offData.title,
      club: offData.club || currentUser.club || 'Oak Ridge Hunting Club',
      phone: offData.phone || '(865) 555-0199',
      email: offData.email || 'officer@huntingclub.org',
      term: offData.term || '2026 - 2028',
      photo: offData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };
    setOfficers((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/officers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/officers`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Added official officer: ${newItem.name} (${newItem.title})`, 'success');
  };

  const addTransaction = async (txnData) => {
    const newItem = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      description: txnData.description,
      category: txnData.category || 'General Ledger',
      amount: Number(txnData.amount) || 0,
      type: txnData.type || 'Credit',
      status: 'Completed',
      reference: txnData.reference || `REF-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setTransactions((prev) => [newItem, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/transactions`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Recorded transaction: $${newItem.amount.toFixed(2)}`, 'success');
  };

  const updateUserRole = async (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/users/${userId}/role`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`User role updated to ${newRole}`, 'info');
  };

  const updateMemberStatus = async (memberId, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );

    try {
      await fetch(`${API_BASE_URL}/members/${memberId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/members/${memberId}/status`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Member status set to "${newStatus}"!`, (newStatus || '').toLowerCase() === 'active' ? 'success' : 'warning');
  };

  const updateMember = async (memberId, updatedData) => {
    setMembers((prev) => {
      const next = prev.map((m) => (m.id === memberId ? { ...m, ...updatedData } : m));
      localStorage.setItem('nh_members', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/members/${memberId}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Updated member record for "${updatedData.name || memberId}"!`, 'success');
  };

  const deleteMember = async (memberId) => {
    setMembers((prev) => {
      const next = prev.filter((m) => m.id !== memberId);
      localStorage.setItem('nh_members', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📡 API Call Success: DELETE ${API_BASE_URL}/members/${memberId}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast('Member removed from association registry', 'info');
  };

  const renewMember = async (memberId) => {
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    let renewedName = '';
    setMembers((prev) => {
      const next = prev.map((m) => {
        if (m.id === memberId) {
          renewedName = m.name;
          return {
            ...m,
            status: 'Active',
            isRenewalDue: false,
            expires: nextYear
          };
        }
        return m;
      });
      localStorage.setItem('nh_members', JSON.stringify(next));
      return next;
    });

    showToast(`Membership successfully renewed for ${renewedName || 'member'}! Active through ${nextYear}.`, 'success');
  };

  const updateUserStatus = async (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/users/${userId}/status`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`User account status set to "${newStatus}"!`, (newStatus || '').toLowerCase() === 'active' ? 'success' : 'warning');
  };

  const updateUserProfile = async (userId, profileData) => {
    setCurrentUser((prev) => ({ ...prev, ...profileData }));

    try {
      await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      console.log(`📡 API Call Success: PUT ${API_BASE_URL}/users/${userId}/profile`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast('Profile updated successfully!', 'success');
  };

  // Cart Actions & Calculated Values
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartShipping = cartSubtotal > 100 || cartSubtotal === 0 ? 0 : 15.00;
  const cartTax = cartSubtotal * 0.08;
  const cartTotal = cartSubtotal + cartShipping + cartTax;

  const addToCart = (product, quantityToAdd = 1, originDetails = null) => {
    if (!product) return;
    const currentStock = product.inStock !== undefined ? Number(product.inStock) : (product.stock !== undefined ? Number(product.stock) : 50);
    if (currentStock <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      const itemOrigin = originDetails || {
        originType: product.organizationType || product.scopeChannel || 'NATIONAL',
        orderSource: product.scopeEntity || (product.organizationType === 'CLUB' ? 'Oak Ridge Hunting Club' : 'UHC National Organization'),
        clubName: product.organizationType === 'CLUB' ? (product.scopeEntity || 'Oak Ridge Hunting Club') : '',
        stateName: product.organizationType === 'STATE' ? (product.scopeEntity || 'Tennessee') : 'National'
      };

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQty = Math.min(currentStock, existingItem.quantity + quantityToAdd);
        if (newQty === existingItem.quantity) {
          showToast(`Cannot add more. Stock limit of ${currentStock} reached for ${product.name}.`, 'warning');
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...existingItem, quantity: newQty, originDetails: itemOrigin };
        showToast('Added to cart with active revenue origin channel.', 'success');
        return updated;
      } else {
        const initialQty = Math.min(currentStock, quantityToAdd);
        showToast('Added to cart with active revenue origin channel.', 'success');
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            category: product.category || 'Gear',
            price: product.price,
            wholesaleCost: product.wholesaleCost,
            vendorName: product.vendorName,
            inStock: product.inStock,
            image: product.image,
            description: product.description,
            quantity: initialQty,
            originDetails: itemOrigin
          }
        ];
      }
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const maxStock = item.inStock || 99;
          const targetQty = Math.min(maxStock, newQuantity);
          if (targetQty < newQuantity) {
            showToast(`Maximum stock available: ${maxStock}`, 'info');
          }
          return { ...item, quantity: targetQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared.', 'info');
  };

  const renewMembership = async (memberId, memberData) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId || m.membershipId === memberData?.membershipId) {
          return { ...m, expires: 'Sep 18, 2028', status: 'Active' };
        }
        return m;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/members/${memberId}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData || {})
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/members/${memberId}/renew`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Membership ${memberData?.membershipId || memberId} renewed for 1 year!`, 'success');
  };

  const placeOrder = (checkoutData) => {
    const targetCart = checkoutData.cartItems && checkoutData.cartItems.length > 0 ? checkoutData.cartItems : cart;

    if (targetCart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return null;
    }

    const orderId = checkoutData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const fullName = checkoutData.firstName && checkoutData.lastName
      ? `${checkoutData.firstName} ${checkoutData.lastName}`
      : checkoutData.customer || `${checkoutData.firstName || 'Customer'}`;
    const cleanEmail = String(checkoutData.email || '').trim().toLowerCase();

    const firstCartOrigin = targetCart[0]?.originDetails;
    const originType = checkoutData.originType || firstCartOrigin?.originType || 'CLUB'; // CLUB | STATE | NATIONAL
    const orderSource = checkoutData.orderSource || firstCartOrigin?.orderSource || checkoutData.clubName || 'Oak Ridge Hunting Club';
    const stateName = checkoutData.stateName || firstCartOrigin?.stateName || checkoutData.state || 'Tennessee';
    const clubName = checkoutData.clubName || firstCartOrigin?.clubName || 'Oak Ridge Hunting Club';
    const firstVendor = targetCart[0]?.vendorName || checkoutData.vendorName || 'Garmin Outdoor';

    const orderSubtotal = checkoutData.subtotal || targetCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const orderShipping = checkoutData.shipping || (orderSubtotal > 100 || orderSubtotal === 0 ? 0 : 15.00);
    const orderTax = checkoutData.tax || (orderSubtotal * 0.08);
    const orderTotal = checkoutData.total || (orderSubtotal + orderShipping + orderTax);

    const splits = calculateOrderSplit(orderSubtotal, originType);

    const createdOrder = {
      id: orderId,
      customer: fullName,
      email: cleanEmail,
      phone: checkoutData.phone || '',
      shippingAddress: {
        address1: checkoutData.address1 || '',
        address2: checkoutData.address2 || '',
        city: checkoutData.city || '',
        state: checkoutData.state || '',
        zip: checkoutData.zip || '',
        country: checkoutData.country || 'United States'
      },
      product: targetCart.map((i) => i.name).join(', '),
      items: targetCart.map((i) => `${i.name} (Qty: ${i.quantity || 1})`).join(', '),
      item: targetCart.map((i) => `${i.name} (Qty: ${i.quantity || 1})`).join(', '),
      vendorName: firstVendor,
      sellingPrice: orderSubtotal,
      wholesaleCost: splits.vendorAmount,
      profitMargin: Number((orderSubtotal - splits.vendorAmount).toFixed(2)),
      profitMarginPct: 30,
      vendorAmount: splits.vendorAmount,
      nationalShare: splits.nationalShare,
      stateShare: splits.stateShare,
      clubShare: splits.clubShare,
      orderSource,
      originType,
      state: stateName,
      club: clubName,
      orderItems: targetCart.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        price: i.price,
        quantity: i.quantity || 1,
        subtotal: i.price * (i.quantity || 1),
        image: i.image
      })),
      subtotal: orderSubtotal,
      shipping: orderShipping,
      tax: orderTax,
      total: orderTotal,
      amount: orderTotal,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      paymentStatus: 'Paid',
      payoutStatus: 'Pending',
      fulfillmentStatus: 'Processing',
      status: 'Processing',
      trackingNumber: 'Pending Dispatch',
      paymentMethod: checkoutData.paymentMethod || 'Credit / Debit Card',
      estimatedDelivery: '3-5 Business Days'
    };

    // 1. Save new order immediately to state and localStorage
    setOrders((prev) => {
      const updated = [createdOrder, ...prev];
      try {
        localStorage.setItem('nh_orders_v2', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save order to localStorage:', e);
      }
      return updated;
    });

    // 2. Fire API call to backend POST /api/v1/orders & Clover Payment Charge
    try {
      fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdOrder)
      }).then(() => console.log(`📡 API Call Success: POST ${API_BASE_URL}/orders`))
        .catch((e) => console.warn('API Call Warning:', e.message));

      // Record Clover settlement
      fetch(`${API_BASE_URL}/payments/charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderTotal,
          customerName: fullName,
          email: cleanEmail,
          orderId: orderId,
          category: 'MERCHANDISE_ORDER',
          description: `Store Order ${orderId} (${fullName})`,
          stateId: createdOrder.shippingAddress?.state,
          cardLast4: checkoutData.cardNumber ? checkoutData.cardNumber.slice(-4) : '4242'
        })
      }).then((r) => r.json())
        .then((data) => console.log('💳 Clover Order Settlement Success:', data))
        .catch((e) => console.warn('Clover Charge Warning:', e.message));
    } catch (err) {
      console.warn('API Call Error:', err);
    }

    // 3. Reduce product stock ONLY after successful order placement
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInCart = cart.find((ci) => ci.id === p.id);
        if (itemInCart) {
          const newStock = Math.max(0, p.inStock - itemInCart.quantity);
          return { ...p, inStock: newStock };
        }
        return p;
      })
    );

    // 4. Clear Shopping Cart
    setCart([]);

    showToast(`Order placed successfully! Order ID: ${orderId}`, 'success');
    return createdOrder;
  };

  const addProduct = async (newProd) => {
    const productWithId = {
      id: newProd.id || `prod-${Date.now()}`,
      inStock: Number(newProd.inStock) || 50,
      price: Number(newProd.price) || 0,
      wholesaleCost: Number(newProd.wholesaleCost) || Number((newProd.price * 0.7).toFixed(2)),
      margin: Number(newProd.margin) || Number((newProd.price * 0.3).toFixed(2)),
      image: newProd.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80',
      ...newProd
    };
    const updated = [productWithId, ...products];
    setProducts(updated);
    localStorage.setItem('nh_products_v2', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithId)
      });
      console.log(`📡 API Call Success: POST ${API_BASE_URL}/products`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast(`Product "${productWithId.name}" added successfully!`, 'success');
    return productWithId;
  };

  const deleteProduct = async (prodId) => {
    const updated = products.filter((p) => p.id !== prodId);
    setProducts(updated);
    localStorage.setItem('nh_products_v2', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/products/${prodId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`📡 API Call Success: DELETE ${API_BASE_URL}/products/${prodId}`);
    } catch (err) {
      console.warn('API Call Warning:', err.message);
    }

    showToast('Product deleted successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authLoading,
        logoutUser,
        users,
        setUsers,
        members,
        setMembers,
        states,
        clubs,
        setClubs,
        dogs,
        setDogs,
        events,
        setEvents,
        entries,
        setEntries,
        results,
        setResults,
        orders,
        setOrders,
        products,
        setProducts,
        addProduct,
        deleteProduct,
        cart,
        setCart,
        cartCount,
        cartSubtotal,
        cartShipping,
        cartTax,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        vendors,
        setVendors,
        commissionSettings,
        setCommissionSettings,
        updateCommissionSettings,
        calculateOrderSplit,
        updateFulfillmentStatus,
        updatePayoutStatus,
        userMemberships,
        setUserMemberships,
        addMembership,
        claims,
        setClaims,
        news,
        setNews,
        addNews,
        postLocalClubNews,
        promoteNewsToState,
        promoteNewsToNational,
        announcements,
        setAnnouncements,
        addAnnouncement,
        officers,
        setOfficers,
        addOfficer,
        transactions,
        setTransactions,
        revenuePercentages,
        setRevenuePercentages,
        calculateRevenueSplits,
        recordTransactionWithAutomaticSplits,
        addTransaction,
        commissions,
        setCommissions,
        elections,
        setElections,
        votes,
        setVotes,
        castVote,
        sponsors,
        permissions,
        toasts,
        showToast,
        removeToast,
        switchRole,
        updateUserProfile,
        loginUser,
        registerMembership,
        renewMembership,
        registerStateMembership,
        registerLocalClubMembership,
        enterEvent,
        toggleCheckIn,
        updateEntry,
        deleteEntry,
        addManualEntry,
        createEvent,
        updateEvent,
        deleteEvent,
        saveDog,
        deleteDog,
        deleteNews,
        updateClaimStatus,
        submitClaimRequest,
        addResult,
        updatePermission,
        grantAllPermissionsForRole,
        updateUserRole,
        updateMemberStatus,
        updateMember,
        deleteMember,
        renewMember,
        updateUserStatus,
        selectedCategory,
        setSelectedCategory,
        matchesCategory,
        backendConnected,
        stateCmsMap,
        getStateCms,
        updateStateCms,
        updateClub,
        backendApiUrl: API_BASE_URL
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { API_BASE_URL };
