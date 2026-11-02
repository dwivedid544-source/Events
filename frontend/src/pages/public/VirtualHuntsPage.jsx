import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Layers,
  Users,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Activity,
  PlayCircle
} from 'lucide-react';

export const VirtualHuntsPage = () => {
  const [selectedBracket, setSelectedBracket] = useState('64'); // 12, 16, 64, 100
  const [activeTab, setActiveTab] = useState('upcoming');

  const bracketSizes = [
    { size: '12', label: '12-Dog Hunt Off', casts: 3, rounds: 2, prizePool: '$1,200', desc: 'Fast-paced regional shootout with 4 dogs per cast' },
    { size: '16', label: '16-Dog Invitational', casts: 4, rounds: 2, prizePool: '$1,800', desc: 'Single elimination bracket for qualified cast winners' },
    { size: '64', label: '64-Dog Major Championship', casts: 16, rounds: 4, prizePool: '$8,500', desc: 'Premier statewide championship tournament' },
    { size: '100', label: '100-Dog National Bracket', casts: 25, rounds: 5, prizePool: '$15,000', desc: 'National UHC marquee event with live leaderboard updates' }
  ];

  const currentHunts = [
    {
      id: 'vh-1',
      title: '2026 UHC National Virtual Nite Hunt Championship',
      bracketSize: '64 Dogs',
      status: 'In Progress (Round 2)',
      entryFee: '$75',
      prizePool: '$8,500',
      date: 'Oct 30 - Nov 01, 2026',
      totalRegistered: 64,
      currentRound: 'Sweet 16 (Quarter-Final Casts)',
      leadingDog: 'BOGGY CREEK KOBE (450+ Pts)'
    },
    {
      id: 'vh-2',
      title: 'Smoky Mountain 16-Dog Rapid Shootout',
      bracketSize: '16 Dogs',
      status: 'Entries Open',
      entryFee: '$45',
      prizePool: '$1,800',
      date: 'Nov 07, 2026',
      totalRegistered: 11,
      currentRound: 'Qualifying Stage',
      leadingDog: 'Entries Pending Cutoff'
    },
    {
      id: 'vh-3',
      title: 'Texas Piney Woods 12-Dog Hunt Off',
      bracketSize: '12 Dogs',
      status: 'Entries Open',
      entryFee: '$35',
      prizePool: '$1,200',
      date: 'Nov 14, 2026',
      totalRegistered: 8,
      currentRound: 'Pre-Draw Seedings',
      leadingDog: 'Entries Pending Cutoff'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              UHC Digital Competition Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Virtual Hunts Control Center
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Real-time bracket management and cast score tracking for virtual hunts. Configure custom brackets for 12, 16, 64, or 100 dogs with automated payouts and leaderboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => alert('New Virtual Hunt bracket setup form opened. Select your bracket capacity (12, 16, 64, 100 dogs).')}
              className="px-5 py-3 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Virtual Hunt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bracket Capacity Selection Cards (James's Request: 12, 16, 64, 100) */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-forest-950 tracking-tight">
          Configurable Bracket Capacities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bracketSizes.map((b) => (
            <div
              key={b.size}
              onClick={() => setSelectedBracket(b.size)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedBracket === b.size
                  ? 'bg-forest-950 text-white border-tan-500 shadow-md scale-102'
                  : 'bg-surface-lowest text-charcoal border-surface-border hover:border-forest-700/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedBracket === b.size ? 'bg-tan-500 text-forest-950' : 'bg-surface-low text-forest-900'
                  }`}>
                    {b.size} Dog Field
                  </span>
                  <span className="text-xs font-black">{b.prizePool}</span>
                </div>
                <h3 className="text-base font-black">{b.label}</h3>
                <p className={`text-[11px] leading-snug ${selectedBracket === b.size ? 'text-tan-200' : 'text-charcoal-muted'}`}>
                  {b.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border/50 text-[11px] flex items-center justify-between font-semibold mt-4">
                <span>{b.casts} Casts</span>
                <span>{b.rounds} Elimination Rounds</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active & Upcoming Virtual Hunts */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-forest-950 tracking-tight">
          Current Virtual Hunts in Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentHunts.map((hunt) => (
            <div
              key={hunt.id}
              className="bg-surface-lowest rounded-2xl border border-surface-border shadow-sm p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    {hunt.status}
                  </span>
                  <span className="text-xs font-mono font-black text-forest-900">
                    Prize: {hunt.prizePool}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-forest-950 leading-snug">{hunt.title}</h3>
                  <div className="text-xs text-charcoal-muted mt-1">{hunt.date}</div>
                </div>

                <div className="p-3 rounded-xl bg-surface-low border border-surface-border space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Bracket Size:</span>
                    <strong className="text-forest-950">{hunt.bracketSize}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Stage:</span>
                    <strong className="text-forest-900">{hunt.currentRound}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Current Leader:</span>
                    <strong className="text-tan-700 truncate max-w-[140px]">{hunt.leadingDog}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Opening live bracket viewer for ${hunt.title}`)}
                className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trophy className="w-4 h-4 text-tan-400" />
                <span>View Live Bracket & Payouts</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualHuntsPage;

