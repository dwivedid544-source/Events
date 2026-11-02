import React, { useState, useEffect } from 'react';
import {
  X,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Save,
  HelpCircle
} from 'lucide-react';

export const DigitalScorecardModal = ({ isOpen, onClose, castTitle = 'Cast #4 - National Nite Hunt Final Cast' }) => {
  if (!isOpen) return null;

  // Hunt Timer State (Default 60 minutes = 3600 seconds)
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('scorecard'); // 'scorecard' | 'rules'

  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 4 Dogs in Cast with Real Handlers
  const [dogs, setDogs] = useState([
    {
      id: 'd1',
      dogName: 'Boggy Creek Kobe',
      breed: 'Treeing Walker',
      handler: 'James Wadley',
      strike: 100,
      tree: 100,
      plus: 150,
      minus: 0,
      circle: 75
    },
    {
      id: 'd2',
      dogName: 'Cumberland Rebel Yell',
      breed: 'Treeing Walker',
      handler: 'Marcus Vance',
      strike: 75,
      tree: 75,
      plus: 100,
      minus: 50,
      circle: 50
    },
    {
      id: 'd3',
      dogName: 'Kentucky Blue Striker',
      breed: 'Bluetick',
      handler: 'Travis Calhoun',
      strike: 50,
      tree: 50,
      plus: 50,
      minus: 0,
      circle: 0
    },
    {
      id: 'd4',
      dogName: 'Buckeye Timber Ghost',
      breed: 'English Coonhound',
      handler: 'Dustin Holbrook',
      strike: 25,
      tree: 0,
      plus: 0,
      minus: 75,
      circle: 0
    }
  ]);

  const updateDogScore = (index, field, delta) => {
    setDogs((prev) => {
      const copy = [...prev];
      const currentVal = copy[index][field];
      copy[index] = { ...copy[index], [field]: Math.max(0, currentVal + delta) };
      return copy;
    });
  };

  const getNetScore = (dog) => {
    return dog.strike + dog.tree + dog.plus - dog.minus;
  };

  // Determine Leader
  const sortedDogs = [...dogs].sort((a, b) => getNetScore(b) - getNetScore(a));
  const castWinner = sortedDogs[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-surface-lowest rounded-3xl border-2 border-tan-500/50 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white p-5 border-b border-forest-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 flex items-center justify-center font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-tan-300">
                Official UHC Digital Scorecard (Houndsman Advantage System)
              </span>
              <h2 className="text-lg sm:text-xl font-black">{castTitle}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-tan-200 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer & Tabs Ribbon */}
        <div className="bg-surface-low p-4 border-b border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Cast Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-forest-950 text-white rounded-2xl border border-forest-800 font-mono shadow-inner">
              <Timer className="w-4 h-4 text-tan-400" />
              <span className="text-xl font-black text-tan-300 tracking-wider">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[10px] text-charcoal-muted uppercase font-bold ml-1">Remaining</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  timerRunning
                    ? 'bg-amber-500 text-forest-950 hover:bg-amber-400'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
                title={timerRunning ? 'Pause Hunt Timer' : 'Start Hunt Timer'}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Pause' : 'Start Cast'}</span>
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(3600);
                }}
                className="p-2 rounded-xl bg-surface-border hover:bg-charcoal-muted/20 text-charcoal text-xs font-bold transition-all cursor-pointer"
                title="Reset to 60 Minutes"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'scorecard'
                  ? 'bg-forest-950 text-white shadow-md'
                  : 'bg-surface-lowest text-charcoal hover:bg-surface-border'
              }`}
            >
              Live Scorecard
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-forest-950 text-white shadow-md'
                  : 'bg-surface-lowest text-charcoal hover:bg-surface-border'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Cast Rules</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'scorecard' ? (
            <div className="space-y-6">
              {/* Leader Announcement Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-forest-950 border border-emerald-600/40 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 uppercase font-black tracking-wider block">
                      Current Cast Leader
                    </span>
                    <strong className="text-base font-black">
                      {castWinner.dogName} ({castWinner.handler})
                    </strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Current Net</span>
                  <span className="text-2xl font-black text-tan-300">
                    +{getNetScore(castWinner)} Pts
                  </span>
                </div>
              </div>

              {/* 4 Hounds Scoring Table */}
              <div className="border border-surface-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-forest-950 text-tan-200 uppercase text-[10px] font-black tracking-wider">
                      <tr>
                        <th className="p-3">Hound & Handler</th>
                        <th className="p-3 text-center">Strike Pts</th>
                        <th className="p-3 text-center">Tree Pts</th>
                        <th className="p-3 text-center text-emerald-300">Plus (+)</th>
                        <th className="p-3 text-center text-rose-300">Minus (-)</th>
                        <th className="p-3 text-center text-charcoal-muted">Circle (O)</th>
                        <th className="p-3 text-right">Net Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border font-semibold">
                      {dogs.map((dog, idx) => {
                        const net = getNetScore(dog);
                        const isLeader = dog.id === castWinner.id;
                        return (
                          <tr
                            key={dog.id}
                            className={`transition-colors ${
                              isLeader ? 'bg-emerald-50/60' : idx % 2 === 0 ? 'bg-surface-lowest' : 'bg-surface-low'
                            }`}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-forest-900 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-black text-forest-950 text-sm flex items-center gap-1.5">
                                    <span>{dog.dogName}</span>
                                    {isLeader && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-600 text-white font-black uppercase">
                                        Leader
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-charcoal-muted font-normal">
                                    Handler: <strong>{dog.handler}</strong> • {dog.breed}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Strike Points */}
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => updateDogScore(idx, 'strike', -25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-black text-forest-950">
                                  {dog.strike}
                                </span>
                                <button
                                  onClick={() => updateDogScore(idx, 'strike', 25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Tree Points */}
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => updateDogScore(idx, 'tree', -25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-black text-forest-950">
                                  {dog.tree}
                                </span>
                                <button
                                  onClick={() => updateDogScore(idx, 'tree', 25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Plus Points */}
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => updateDogScore(idx, 'plus', -25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-black text-emerald-700">
                                  +{dog.plus}
                                </span>
                                <button
                                  onClick={() => updateDogScore(idx, 'plus', 25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Minus Points */}
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => updateDogScore(idx, 'minus', -25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-10 text-center font-black text-rose-700">
                                  -{dog.minus}
                                </span>
                                <button
                                  onClick={() => updateDogScore(idx, 'minus', 25)}
                                  className="w-6 h-6 rounded bg-surface-border hover:bg-charcoal-muted/30 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Circle Points */}
                            <td className="p-3 text-center">
                              <span className="font-mono text-charcoal-muted font-bold">
                                {dog.circle} O
                              </span>
                            </td>

                            {/* Net Score */}
                            <td className="p-3 text-right">
                              <span
                                className={`text-base font-black ${
                                  net > 0 ? 'text-emerald-700' : net < 0 ? 'text-rose-700' : 'text-charcoal'
                                }`}
                              >
                                {net > 0 ? `+${net}` : net} Pts
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-border">
                <div className="text-xs text-charcoal-muted">
                  Cast Judge: <strong>Master of Hounds Certified</strong> • Live Sync Active
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      alert(`Cast Result Certified! Winner: ${castWinner.dogName} (+${getNetScore(castWinner)} Pts). Cast result logged to official tournament bracket.`);
                      onClose();
                    }}
                    className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4 text-tan-400" />
                    <span>Sign & Certify Cast Score</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Official Cast Rules Tab */
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-surface-low rounded-2xl border border-surface-border space-y-1">
                <h3 className="font-black text-forest-950 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-tan-600" />
                  <span>UHC Sanctioned Cast Direction & Judging Rules</span>
                </h3>
                <p className="text-charcoal-muted text-xs">
                  Standard rules governing treeing coonhounds, strike positions, and scoring penalties.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-surface-lowest rounded-2xl border border-surface-border space-y-1">
                  <h4 className="font-black text-forest-950">Rule 1. Strike Points</h4>
                  <p className="text-charcoal leading-relaxed">
                    Strike points are awarded to hounds barking open on trail: 1st strike (100), 2nd strike (75), 3rd strike (50), 4th strike (25). A dog must bark open to be struck.
                  </p>
                </div>

                <div className="p-4 bg-surface-lowest rounded-2xl border border-surface-border space-y-1">
                  <h4 className="font-black text-forest-950">Rule 2. Tree Points & 5-Minute Rule</h4>
                  <p className="text-charcoal leading-relaxed">
                    Tree points awarded: 1st tree (100), 2nd tree (75), 3rd tree (50), 4th tree (25). Once a tree is declared, the 5-minute tree clock begins. All hounds must hold tree until inspected by the cast judge.
                  </p>
                </div>

                <div className="p-4 bg-surface-lowest rounded-2xl border border-surface-border space-y-1">
                  <h4 className="font-black text-forest-950">Rule 3. Plus & Minus Scoring Conditions</h4>
                  <p className="text-charcoal leading-relaxed">
                    Full plus points are awarded if raccoon or verified game is seen in tree. Minus points (-strike & -tree) are assessed if tree is definitively slick/empty or if hound leaves tree before judge arrives.
                  </p>
                </div>

                <div className="p-4 bg-surface-lowest rounded-2xl border border-surface-border space-y-1">
                  <h4 className="font-black text-forest-950">Rule 4. Scratch Penalties</h4>
                  <p className="text-charcoal leading-relaxed">
                    Hounds will be scratched for aggressive behavior/fighting, tampering with other competitors, running off-game after two warnings, or accumulating -300 net minus points in a single cast round.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

