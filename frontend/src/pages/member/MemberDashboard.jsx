import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  User,
  MapPin,
  Building2,
  Award,
  Dog,
  Calendar,
  ClipboardList,
  ShoppingBag,
  Trophy,
  Heart,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberDashboard = () => {
  const { currentUser, userMemberships = [], events = [], entries = [], orders = [], dogs = [], results = [], clubs = [], showToast } = useApp();

  // Dedicated Flow-Wise Page Load API Call to Express Backend & MySQL `club` Database
  useEffect(() => {
    fetch('http://localhost:5050/api/v1/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        console.log('📡 [Member Portal Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching member profile API:', err.message));
  }, []);

  // Active Tab state for the 12 required sections
  const [activeTab, setActiveTab] = useState('MY_UHC');

  // Member Data Filtering
  const myMemberships = userMemberships.length > 0 ? userMemberships : [
    { id: 'm1', scopeName: 'Ultimate Hound Championships (UHC)', tier: 'National', membershipId: 'UHC-2026-9901', status: 'Active', expiryDate: 'Oct 15, 2027' },
    { id: 'm2', scopeName: 'Texas State Association', tier: 'State Association', membershipId: 'TX-HOUND-8821', status: 'Active', expiryDate: 'Sep 20, 2027' },
    { id: 'm3', scopeName: 'Houston County Coon Hunters Association', tier: 'Local Club', membershipId: 'CLUB-4412', status: 'Active', expiryDate: 'Aug 12, 2027' }
  ];

  const myDogs = dogs.length > 0 ? dogs : [
    { id: 'd1', callName: 'Lone Star Rebel', registeredName: 'GRCH PR Lone Star Rebel', breed: 'Treeing Walker Coonhound', regNo: 'UKC-889124', winsCount: 7 },
    { id: 'd2', callName: 'Timberline Bell', registeredName: 'CH PR Timberline Acoustic Bell', breed: 'English Redtick Coonhound', regNo: 'UKC-772109', winsCount: 4 }
  ];

  const myEntries = entries.length > 0 ? entries : [
    { id: 'E901', eventName: 'Houston County Autumn Championship Nite Hunt', date: 'Aug 24, 2026', fee: 35.00, paymentStatus: 'Paid', checkInStatus: 'Confirmed' }
  ];

  const myOrders = orders.length > 0 ? orders : [
    { id: 'ORD-9081', product: 'Garmin Alpha GPS Tracking Collar Bundle', total: 799.00, date: 'Aug 10, 2026', status: 'Delivered' }
  ];

  const myResults = results.length > 0 ? results : [
    { id: 'r1', eventName: 'Houston County Speed Water Race', date: 'Jul 22, 2026', winnerDog: 'Lone Star Rebel', score: '375+ Circle', placement: '1st Place Winner' }
  ];

  const myFavoriteClubs = clubs.slice(0, 3);

  const handleRenew = (orgName) => {
    showToast(`Renewed membership for ${orgName}! Extended for 1 year under your single login.`, 'success');
  };

  // EXACTLY 12 CLIENT-SPECIFIED DASHBOARD SECTIONS
  const dashboardSections = [
    { id: 'MY_UHC', label: '1. My UHC', icon: Globe },
    { id: 'MY_PROFILE', label: '2. My Profile', icon: User },
    { id: 'MY_STATE', label: '3. My State', icon: MapPin },
    { id: 'MY_CLUBS', label: '4. My Clubs', icon: Building2 },
    { id: 'MY_MEMBERSHIPS', label: '5. My Memberships', icon: Award },
    { id: 'MY_DOGS', label: '6. My Dogs', icon: Dog },
    { id: 'MY_EVENTS', label: '7. My Events', icon: Calendar },
    { id: 'MY_ENTRIES', label: '8. My Entries', icon: ClipboardList },
    { id: 'MY_PURCHASES', label: '9. My Purchases', icon: ShoppingBag },
    { id: 'MY_RESULTS', label: '10. My Results', icon: Trophy },
    { id: 'MY_FAVORITES', label: '11. My Favorite Clubs', icon: Heart },
    { id: 'MEMBERSHIP_RENEWALS', label: '12. Membership Renewals', icon: RefreshCw }
  ];

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* ONE MEMBER LOGIN HEADER BANNER */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              One Member Login System
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Welcome Back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium">
              Single Login Account: <strong className="text-white">{currentUser.email}</strong> • Member ID: <strong className="text-tan-300 font-mono">UHC-2026-9901</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-forest-900/90 border border-forest-800 p-2 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black text-tan-200">Logged In Once</span>
          </div>
        </div>
      </div>

      {/* 12 EXACT DASHBOARD NAVIGATION TABS */}
      <div className="bg-surface-lowest p-3 rounded-2xl border border-surface-border shadow-ambient">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {dashboardSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`py-2.5 px-4 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
                    : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-tan-400' : 'text-charcoal-muted'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA FOR THE 12 SECTIONS */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        {/* 1. MY UHC */}
        {activeTab === 'MY_UHC' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Globe className="w-5 h-5 text-tan-600" />
                <span>1. My UHC (National HQ Summary)</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Your national organization standing, national member status, and championship announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-forest-950 text-white border border-tan-500 space-y-2">
                <span className="text-[10px] font-black uppercase text-tan-300">National Member Status</span>
                <div className="text-2xl font-black text-emerald-400">Good Standing</div>
                <div className="text-xs text-tan-200">UHC Lifetime Member ID: UHC-2026-9901</div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-low border border-surface-border space-y-2">
                <span className="text-[10px] font-black uppercase text-charcoal-muted">National Championship Points</span>
                <div className="text-2xl font-black text-forest-950">1,420 Pts</div>
                <div className="text-xs text-emerald-700 font-bold">Ranked #14 Nationally</div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-low border border-surface-border space-y-2">
                <span className="text-[10px] font-black uppercase text-charcoal-muted">Registered Canines</span>
                <div className="text-2xl font-black text-forest-950">{myDogs.length} Hounds</div>
                <div className="text-xs text-charcoal-muted">All pedigrees verified</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MY PROFILE */}
        {activeTab === 'MY_PROFILE' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <User className="w-5 h-5 text-tan-600" />
                <span>2. My Profile</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Personal handler information and single account login settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-4 bg-surface-low rounded-2xl border space-y-2">
                <span className="text-charcoal-muted block">Full Name:</span>
                <strong className="text-sm font-black text-forest-950">{currentUser.name}</strong>
              </div>
              <div className="p-4 bg-surface-low rounded-2xl border space-y-2">
                <span className="text-charcoal-muted block">Login Email Account:</span>
                <strong className="text-sm font-black text-forest-950">{currentUser.email}</strong>
              </div>
              <div className="p-4 bg-surface-low rounded-2xl border space-y-2">
                <span className="text-charcoal-muted block">Contact Phone:</span>
                <strong className="text-sm font-black text-forest-950">(936) 555-0182</strong>
              </div>
              <div className="p-4 bg-surface-low rounded-2xl border space-y-2">
                <span className="text-charcoal-muted block">Home State & Region:</span>
                <strong className="text-sm font-black text-forest-950">Texas (Southern Region)</strong>
              </div>
            </div>
          </div>
        )}

        {/* 3. MY STATE */}
        {activeTab === 'MY_STATE' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-tan-600" />
                <span>3. My State (Texas State Association)</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Your State Association affiliation and state championship standings.</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900">Affiliated State Association</span>
                <h3 className="text-lg font-black text-amber-950">Texas State Association</h3>
                <p className="text-xs text-amber-800">State Member ID: TX-HOUND-8821 • Status: Active</p>
              </div>
              <Link to="/states/texas" className="px-4 py-2 bg-amber-700 text-white font-black text-xs rounded-xl shadow">
                View Texas State Portal
              </Link>
            </div>
          </div>
        )}

        {/* 4. MY CLUBS */}
        {activeTab === 'MY_CLUBS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-tan-600" />
                <span>4. My Clubs</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Local chartered clubs you belong to under your single account.</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-900">Chartered Local Club Chapter</span>
                <h3 className="text-lg font-black text-emerald-950">Houston County Coon Hunters Association</h3>
                <p className="text-xs text-emerald-800">Club Member ID: CLUB-4412 • Status: Active</p>
              </div>
              <Link to="/clubs/club-tx-houston" className="px-4 py-2 bg-emerald-700 text-white font-black text-xs rounded-xl shadow">
                Visit Club Website
              </Link>
            </div>
          </div>
        )}

        {/* 5. MY MEMBERSHIPS */}
        {activeTab === 'MY_MEMBERSHIPS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-tan-600" />
                <span>5. My Memberships</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Digital membership cards across National, State, and Local levels.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {myMemberships.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-surface-low border border-surface-border space-y-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-forest-950 text-tan-300">
                    {m.tier}
                  </span>
                  <h4 className="font-extrabold text-sm text-forest-950">{m.scopeName}</h4>
                  <p className="text-charcoal-muted font-mono">ID: {m.membershipId}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MY DOGS */}
        {activeTab === 'MY_DOGS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Dog className="w-5 h-5 text-tan-600" />
                <span>6. My Dogs</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Registered hunting canines and UKC pedigree records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {myDogs.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-surface-low border border-surface-border space-y-2">
                  <h4 className="font-extrabold text-sm text-forest-950">{d.callName} ({d.registeredName})</h4>
                  <p className="text-charcoal-muted">{d.breed} • Reg #: <strong className="font-mono">{d.regNo}</strong></p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tan-100 text-tan-900">
                    {d.winsCount} Competition Wins
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MY EVENTS */}
        {activeTab === 'MY_EVENTS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-tan-600" />
                <span>7. My Events</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Upcoming sanctioned trials and competition schedule.</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-low border text-xs text-forest-950 font-bold">
              Upcoming: Houston County Autumn Championship Nite Hunt (Aug 24, 2026)
            </div>
          </div>
        )}

        {/* 8. MY ENTRIES */}
        {activeTab === 'MY_ENTRIES' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-tan-600" />
                <span>8. My Entries</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Active event registrations and confirmed cast entry receipts.</p>
            </div>

            <div className="space-y-2 text-xs">
              {myEntries.map((e) => (
                <div key={e.id} className="p-4 rounded-2xl bg-surface-low border flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-forest-950">{e.eventName}</strong>
                    <div className="text-[11px] text-charcoal-muted">Entry ID: {e.id} • Date: {e.date}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                    {e.checkInStatus} (${e.fee.toFixed(2)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. MY PURCHASES */}
        {activeTab === 'MY_PURCHASES' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tan-600" />
                <span>9. My Purchases</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Store orders and merchandise purchase history.</p>
            </div>

            <div className="space-y-2 text-xs">
              {myOrders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl bg-surface-low border flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-forest-950">{o.product}</strong>
                    <div className="text-[11px] text-charcoal-muted">Order ID: {o.id} • {o.date}</div>
                  </div>
                  <strong className="text-forest-950 font-black">${o.total.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. MY RESULTS */}
        {activeTab === 'MY_RESULTS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-tan-600" />
                <span>10. My Results</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Recorded competition scores and placement awards.</p>
            </div>

            <div className="space-y-2 text-xs">
              {myResults.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-surface-low border flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-forest-950">{r.eventName}</strong>
                    <div className="text-[11px] text-charcoal-muted">Winner: {r.winnerDog} • Score: {r.score}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-tan-500 text-forest-950 font-black">
                    {r.placement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. MY FAVORITE CLUBS */}
        {activeTab === 'MY_FAVORITES' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>11. My Favorite Clubs</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Saved local hunting clubs and favorite chapters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {myFavoriteClubs.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-surface-low border space-y-2">
                  <h4 className="font-extrabold text-forest-950">{c.name}</h4>
                  <p className="text-charcoal-muted">{c.city}, {c.state}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. MEMBERSHIP RENEWALS */}
        {activeTab === 'MEMBERSHIP_RENEWALS' && (
          <div className="space-y-6">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-tan-600" />
                <span>12. Membership Renewals</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">Upcoming renewal dates and 1-click renewal portal.</p>
            </div>

            <div className="space-y-3 text-xs">
              {myMemberships.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-surface-low border flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-forest-950">{m.scopeName}</strong>
                    <div className="text-[11px] text-charcoal-muted">Expires: {m.expiryDate}</div>
                  </div>
                  <button
                    onClick={() => handleRenew(m.scopeName)}
                    className="px-4 py-2 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black rounded-xl shadow cursor-pointer"
                  >
                    Renew 1 Year
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
