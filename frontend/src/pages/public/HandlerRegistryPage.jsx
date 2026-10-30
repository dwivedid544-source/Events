import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Award,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User,
  Star,
  MapPin,
  Calendar,
  Flame,
  X,
  Plus
} from 'lucide-react';

export const HandlerRegistryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedHandler, setSelectedHandler] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // PRE-CONFIGURED HANDLERS WITH JAMES WADLEY AT THE TOP
  const handlersData = [
    {
      id: 'hnd-00127',
      uhcId: 'UHC HANDLER #00127',
      name: 'James Wadley',
      state: 'HI',
      stateFullName: 'Hawaii / Texas Division',
      club: 'Honolulu Hound & Hunting Club',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      title: 'Master Hound Handler & Judge',
      casts: 184,
      castWins: 121,
      finalCasts: 28,
      eventWins: 14,
      winRate: '65.8%',
      lifetimeEarnings: '$48,250',
      stateRanking: '#4',
      nationalRanking: '#31',
      status: 'Active Competitor',
      verified: true,
      bio: 'Lifelong competition hound handler specializing in treeing coonhounds, hound athletic conditioning, and sanctioned cast direction. Active administrator for UHC charter chapters.',
      dogsHandled: [
        {
          id: 'dog-kobe',
          name: 'Boggy Creek Kobe',
          breed: 'Treeing Walker Coonhound',
          titles: 'GRNITECH CH',
          wins: 34,
          link: '/hound-finder'
        },
        {
          id: 'dog-timber',
          name: 'Timber River Hawk',
          breed: 'English Coonhound',
          titles: 'NITECH',
          wins: 19,
          link: '/hound-finder'
        },
        {
          id: 'dog-sally',
          name: 'Blue Creek Sally',
          breed: 'Bluetick Coonhound',
          titles: 'CH',
          wins: 11,
          link: '/hound-finder'
        }
      ],
      competitionHistory: [
        {
          date: 'Oct 24, 2026',
          event: 'UHC National Autumn Classic',
          club: 'Honolulu Hound & Hunting Club',
          dog: 'Boggy Creek Kobe',
          castRound: 'Final Championship Cast',
          score: '+375 Strike / +250 Tree',
          placement: '1st Place Cast Winner',
          earnings: '$1,200'
        },
        {
          date: 'Sep 18, 2026',
          event: 'Pacific Pro Invitational Nite Hunt',
          club: 'Diamond Head Sporting Club',
          dog: 'Boggy Creek Kobe',
          castRound: 'Semi-Final Cast',
          score: '+325 Plus',
          placement: 'Cast Winner',
          earnings: '$650'
        },
        {
          date: 'Aug 12, 2026',
          event: 'Piney Woods Grand Slam 100-Dog',
          club: 'East Texas Coon Hunters',
          dog: 'Timber River Hawk',
          castRound: 'Round 1 (64-Dog Cast #8)',
          score: '+400 Plus',
          placement: 'Cast Winner',
          earnings: '$450'
        },
        {
          date: 'Jun 20, 2026',
          event: 'Lone Star State Championship',
          club: 'Texas State Association',
          dog: 'Boggy Creek Kobe',
          castRound: 'Final Four Cast',
          score: '+275 Plus',
          placement: '2nd Place Overall',
          earnings: '$850'
        }
      ]
    },
    {
      id: 'hnd-00042',
      uhcId: 'UHC HANDLER #00042',
      name: 'Marcus Vance',
      state: 'TN',
      stateFullName: 'Tennessee',
      club: 'Oak Ridge Hunting Club',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      title: 'Pro Staff Handler',
      casts: 215,
      castWins: 142,
      finalCasts: 34,
      eventWins: 19,
      winRate: '66.0%',
      lifetimeEarnings: '$62,400',
      stateRanking: '#2',
      nationalRanking: '#14',
      status: 'Active Competitor',
      verified: true,
      bio: 'Champion night hunter and professional trainer with over 15 years experience directing national hunt casts.',
      dogsHandled: [
        {
          id: 'dog-rebel',
          name: 'Cumberland Rebel Yell',
          breed: 'Treeing Walker Coonhound',
          titles: 'GRNITECH',
          wins: 41,
          link: '/hound-finder'
        }
      ],
      competitionHistory: [
        {
          date: 'Sep 29, 2026',
          event: 'Smoky Mountain Nite Hunt',
          club: 'Oak Ridge Hunting Club',
          dog: 'Cumberland Rebel Yell',
          castRound: 'Championship Cast',
          score: '+425 Plus',
          placement: '1st Place Champion',
          earnings: '$1,500'
        }
      ]
    },
    {
      id: 'hnd-00088',
      uhcId: 'UHC HANDLER #00088',
      name: 'Travis Calhoun',
      state: 'KY',
      stateFullName: 'Kentucky',
      club: 'Cumberland Mountain Club',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
      title: 'Senior Master Handler',
      casts: 168,
      castWins: 98,
      finalCasts: 21,
      eventWins: 9,
      winRate: '58.3%',
      lifetimeEarnings: '$31,800',
      stateRanking: '#6',
      nationalRanking: '#44',
      status: 'Active Competitor',
      verified: true,
      dogsHandled: [
        {
          id: 'dog-blue',
          name: 'Kentucky Blue Striker',
          breed: 'Bluetick Coonhound',
          titles: 'NITECH',
          wins: 22,
          link: '/hound-finder'
        }
      ],
      competitionHistory: [
        {
          date: 'Sep 05, 2026',
          event: 'Bluegrass Labor Day Hunt',
          club: 'Cumberland Mountain Club',
          dog: 'Kentucky Blue Striker',
          castRound: 'Final Cast',
          score: '+300 Plus',
          placement: 'Cast Winner',
          earnings: '$700'
        }
      ]
    },
    {
      id: 'hnd-00104',
      uhcId: 'UHC HANDLER #00104',
      name: 'Dustin Holbrook',
      state: 'OH',
      stateFullName: 'Ohio',
      club: 'Buckeye State Houndsmen',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      title: 'Field Champion Handler',
      casts: 145,
      castWins: 89,
      finalCasts: 18,
      eventWins: 8,
      winRate: '61.4%',
      lifetimeEarnings: '$29,400',
      stateRanking: '#3',
      nationalRanking: '#52',
      status: 'Active Competitor',
      verified: true,
      dogsHandled: [],
      competitionHistory: []
    }
  ];

  const filteredHandlers = handlersData.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.uhcId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All' || h.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              UHC Competitive Sports Database
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              UHC Handler Registry & FightFinder
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Permanent competitive records for sanctioned competition hound handlers. Verified cast statistics, win rates, earnings, state and national rankings, and linked hounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-5 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Handler Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Summary Bar */}
        <div className="pt-4 border-t border-forest-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-[10px] text-tan-300 uppercase font-black block">Registered Handlers</span>
            <span className="text-xl font-black text-white">450+ Competitors</span>
          </div>
          <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-[10px] text-tan-300 uppercase font-black block">Sanctioned Casts</span>
            <span className="text-xl font-black text-white">1,840 Directed</span>
          </div>
          <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-[10px] text-tan-300 uppercase font-black block">National Purse Paid</span>
            <span className="text-xl font-black text-white">$142,500+</span>
          </div>
          <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-800">
            <span className="text-[10px] text-tan-300 uppercase font-black block">Verification Engine</span>
            <span className="text-xl font-black text-emerald-400">Sherdog-Standard ✓</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search handler name, UHC ID, or club..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-black text-charcoal-muted uppercase">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800"
          >
            <option value="All">All States</option>
            <option value="HI">Hawaii (HI)</option>
            <option value="TN">Tennessee (TN)</option>
            <option value="KY">Kentucky (KY)</option>
            <option value="OH">Ohio (OH)</option>
            <option value="TX">Texas (TX)</option>
          </select>
        </div>
      </div>

      {/* Handler Registry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHandlers.map((handler) => (
          <div
            key={handler.id}
            className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-6 flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all group"
          >
            <div className="space-y-4">
              {/* Header with Avatar and ID */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={handler.avatar}
                    alt={handler.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-forest-900 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-base text-forest-950 group-hover:text-tan-700 transition-colors">
                        {handler.name}
                      </h3>
                      {handler.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified UHC Handler" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-black text-tan-700 block">
                      {handler.uhcId}
                    </span>
                    <span className="text-[10px] text-charcoal-muted font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-forest-800" />
                      <span>{handler.stateFullName}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-900 text-tan-300 border border-forest-700">
                    Nat. Rank {handler.nationalRanking}
                  </span>
                  <span className="text-[9px] font-bold text-charcoal-muted block mt-1">
                    State: {handler.stateRanking}
                  </span>
                </div>
              </div>

              {/* Stats Box (Sherdog Style) */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-surface-low rounded-xl border border-surface-border text-center">
                <div>
                  <span className="text-[9px] text-charcoal-muted uppercase font-black block">Casts</span>
                  <span className="text-sm font-black text-forest-950">{handler.casts}</span>
                </div>
                <div>
                  <span className="text-[9px] text-charcoal-muted uppercase font-black block">Wins</span>
                  <span className="text-sm font-black text-forest-950">{handler.castWins}</span>
                </div>
                <div>
                  <span className="text-[9px] text-charcoal-muted uppercase font-black block">Win %</span>
                  <span className="text-sm font-black text-emerald-700">{handler.winRate}</span>
                </div>
                <div>
                  <span className="text-[9px] text-charcoal-muted uppercase font-black block">Earnings</span>
                  <span className="text-xs font-black text-forest-900">{handler.lifetimeEarnings}</span>
                </div>
              </div>

              {/* Hounds preview */}
              {handler.dogsHandled.length > 0 && (
                <div className="pt-2 border-t border-surface-border">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                    Primary Hounds Handled:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {handler.dogsHandled.map((d) => (
                      <Link
                        key={d.id}
                        to="/hound-finder"
                        className="px-2 py-0.5 rounded-md bg-forest-950 text-tan-300 text-[10px] font-extrabold hover:bg-forest-800 transition-colors"
                      >
                        {d.name} ({d.titles})
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-[10px] text-charcoal-muted font-bold">
                Club: {handler.club}
              </span>
              <button
                onClick={() => setSelectedHandler(handler)}
                className="px-3.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Full Record</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SHERDOG-STYLE PROFILE MODAL */}
      {selectedHandler && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedHandler.avatar}
                  alt={selectedHandler.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-forest-900 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-forest-950">{selectedHandler.name}</h2>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-mono font-black text-tan-700 block">
                    {selectedHandler.uhcId}
                  </span>
                  <p className="text-xs text-charcoal-muted font-bold mt-0.5">
                    {selectedHandler.title} • {selectedHandler.club} ({selectedHandler.state})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHandler(null)}
                className="p-2 rounded-xl bg-surface-low hover:bg-surface-border text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Career Record Grid */}
            <div>
              <h3 className="text-xs font-black uppercase text-charcoal-muted tracking-wider mb-2">
                Official Career Record
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Sanctioned Casts</span>
                  <span className="text-lg font-black text-forest-950">{selectedHandler.casts}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Cast Wins</span>
                  <span className="text-lg font-black text-forest-950">{selectedHandler.castWins}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Final Casts</span>
                  <span className="text-lg font-black text-forest-950">{selectedHandler.finalCasts}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Event Wins</span>
                  <span className="text-lg font-black text-forest-950">{selectedHandler.eventWins}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Win Percentage</span>
                  <span className="text-lg font-black text-emerald-700">{selectedHandler.winRate}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">Lifetime Earnings</span>
                  <span className="text-lg font-black text-forest-900">{selectedHandler.lifetimeEarnings}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">State Ranking</span>
                  <span className="text-lg font-black text-tan-700">{selectedHandler.stateRanking}</span>
                </div>
                <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-black block">National Ranking</span>
                  <span className="text-lg font-black text-forest-950">{selectedHandler.nationalRanking}</span>
                </div>
              </div>
            </div>

            {/* Dogs Handled */}
            <div>
              <h3 className="text-xs font-black uppercase text-charcoal-muted tracking-wider mb-2">
                Sanctioned Hounds Handled
              </h3>
              <div className="space-y-2">
                {selectedHandler.dogsHandled.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-surface-low rounded-xl border border-surface-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-extrabold text-forest-950">{d.name}</h4>
                      <span className="text-[10px] text-charcoal-muted font-bold">
                        {d.breed} • {d.titles} • {d.wins} Career Wins
                      </span>
                    </div>
                    <Link
                      to="/hound-finder"
                      className="px-3 py-1 bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-black rounded-lg transition-all"
                    >
                      View Hound Profile →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Competition History */}
            {selectedHandler.competitionHistory.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase text-charcoal-muted tracking-wider mb-2">
                  Sanctioned Competition Log
                </h3>
                <div className="border border-surface-border rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-surface-low text-charcoal-muted uppercase text-[9px] font-black">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Event & Cast</th>
                        <th className="p-2.5">Dog</th>
                        <th className="p-2.5">Placement</th>
                        <th className="p-2.5 text-right">Purse</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {selectedHandler.competitionHistory.map((c, i) => (
                        <tr key={i} className="hover:bg-surface-low/50">
                          <td className="p-2.5 text-[10px] font-bold text-charcoal-muted whitespace-nowrap">{c.date}</td>
                          <td className="p-2.5 font-bold text-forest-950">
                            <div>{c.event}</div>
                            <div className="text-[10px] text-charcoal-muted font-normal">{c.castRound}</div>
                          </td>
                          <td className="p-2.5 font-bold text-tan-800">{c.dog}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                              {c.placement}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-black text-forest-950">{c.earnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register Handler Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-black text-lg text-forest-950">Register Handler Competitor Profile</h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 rounded-lg hover:bg-surface-low">
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>
            <p className="text-xs text-charcoal-muted">
              Register as an official UHC handler to receive your permanent UHC Handler ID, track cast records, and compete in sanctioned virtual and live hunts.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Handler profile submitted successfully! Your UHC Handler ID will be issued upon registry review.');
                setShowRegisterModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-charcoal mb-1">Full Legal Name</label>
                <input type="text" required placeholder="e.g. John Doe" className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">State Association</label>
                  <select className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold">
                    <option>Hawaii (HI)</option>
                    <option>Texas (TX)</option>
                    <option>Tennessee (TN)</option>
                    <option>Kentucky (KY)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Affiliated Local Club</label>
                  <input type="text" placeholder="e.g. Honolulu Hound & Hunting Club" className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-charcoal mb-1">Primary Hounds Registered</label>
                <input type="text" placeholder="e.g. Boggy Creek Kobe (UHC-DOG-881)" className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-low text-charcoal font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-900 text-white font-black"
                >
                  Submit Handler Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

