import React, { useState } from 'react';
import { ChevronRight, Search, Star, Trophy, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SPORTS_OPTIONS = [
  { key: 'Coonhounds',         label: 'Coonhounds',         icon: '🐕', status: 'Active Primary',  color: 'emerald', desc: 'Nite Hunts, Treeing Contests & Water Races',                  detail: 'Coonhounds are the backbone of UHC competition. Compete in Nite Hunts where dogs are scored on tracking, treeing ability, and accuracy. Water Races and Bench Shows round out the discipline.' },
  { key: 'Beagles',            label: 'Beagles',            icon: '🐶', status: 'Pack Trials',     color: 'amber',   desc: 'Rabbit Pack Trials & Field Contests',                        detail: 'Beagle trials test scenting ability and pack cooperation over rabbit courses. Both AKC-sanctioned and UHC field formats are supported across all 50 states.' },
  { key: 'Squirrel Dogs',      label: 'Squirrel Dogs',      icon: '🐿️', status: 'Timber Trials',   color: 'blue',    desc: 'Timber Squirrel Hunts & Treeing Contests',                   detail: 'Squirrel dog events evaluate a dog\'s ability to locate, track, and tree squirrels in natural timber settings. Judged on locating, treeing, and handle.' },
  { key: 'Hog Dogs',           label: 'Hog Dogs',           icon: '🐗', status: 'Bay Contests',    color: 'purple',  desc: 'Wild Hog Bay & Catch Contests',                              detail: 'Hog dog events feature bay and catch contests where dogs must locate and bay wild hogs. Events are closely regulated for both dog and animal safety.' },
  { key: 'Bear Dogs',          label: 'Bear Dogs',          icon: '🐻', status: 'Big Game',        color: 'stone',   desc: 'Mountain Bear Tracking & Big Game Hunts',                    detail: 'Bear dog events take place in mountainous terrain where dogs track and tree black bears. These big-game hunts require exceptional stamina and nose.' },
  { key: 'Rabbit Dogs',        label: 'Rabbit Dogs',        icon: '🐇', status: 'Rabbit Trials',   color: 'orange',  desc: 'Rabbit Chasing, Pack & Solo Trials',                         detail: 'Rabbit dog trials feature solo and pack formats across fields and brush. Dogs are judged on driving ability, recovery, and clean line work.' },
  { key: 'Retrievers',         label: 'Retrievers',         icon: '🦆', status: 'Water Trials',    color: 'cyan',    desc: 'Water Retrieves, Hunt Tests & Field Trials',                 detail: 'Retriever events include hunt tests, field trials, and water retrieves. Labs, Goldens, and all retriever breeds compete for UHC points and titles.' },
  { key: 'Cur & Feist',        label: 'Cur & Feist',        icon: '🌲', status: 'Squirrel/Hog',   color: 'lime',    desc: 'Multi-purpose Cur & Feist Squirrel/Hog Trials',              detail: 'Cur and Feist breeds are versatile hunting dogs used on squirrels, hogs, and mountain lions. UHC sanctions multiple breed-specific and open formats.' },
  { key: 'Competition Hunts',  label: 'Competition Hunts',  icon: '🏆', status: 'Championship',   color: 'yellow',  desc: 'Competitive Night Hunts & Championship Events',              detail: 'UHC Championship hunts are the premier competitive events in the hound world. Points accumulate toward national titles in each breed discipline.' },
  { key: 'Bench Shows',        label: 'Bench Shows',        icon: '🎖️', status: 'Conformation',   color: 'rose',    desc: 'Breed Conformation & Bench Show Competitions',               detail: 'Bench shows evaluate hounds against their breed standard. Dogs are judged on structure, coat, and breed type by certified UHC bench show judges.' },
  { key: 'Field Trials',       label: 'Field Trials',       icon: '🌾', status: 'Field Events',   color: 'teal',    desc: 'All-breed Field & Pack Trials',                              detail: 'Field trials span multiple breeds and formats, from beagle packs to pointing breed braces. UHC sanctions events nationwide with qualifying points.' },
  { key: 'Water Races',        label: 'Water Races',        icon: '💧', status: 'Water Events',   color: 'sky',     desc: 'Coonhound Water Race Speed & Line Trials',                   detail: 'Water races are high-energy speed and line events where Coonhounds compete on water. Events include drag races, free-for-all, and youth divisions.' },
  { key: 'Other Hound Events', label: 'Other Hound Events', icon: '🎯', status: 'All Breeds',     color: 'neutral', desc: 'All Other UHC Sanctioned Hound Events',                      detail: 'UHC sanctions a wide variety of hound events not captured in a single category. Check local clubs and state associations for specialty events in your area.' },
];

export const HoundSportsPage = () => {
  const { setSelectedCategory, events, clubs } = useApp();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = SPORTS_OPTIONS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const activeSport = SPORTS_OPTIONS.find((s) => s.key === activeKey);

  const handleSelect = (key) => {
    setActiveKey(key);
    setSelectedCategory(key);
  };

  const goToEvents = () => {
    if (activeKey) setSelectedCategory(activeKey);
    navigate('/find-hunt');
  };

  const goToClubs = () => {
    if (activeKey) setSelectedCategory(activeKey);
    navigate('/clubs');
  };

  return (
    <div className="min-h-screen bg-surface-low">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-400">UHC Sanctioned Disciplines</span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Hound Sport Categories
          </h1>
          <p className="text-tan-100/80 text-lg max-w-2xl mx-auto font-medium">
            Enter the UHC platform based on the type of dog or event you're interested in.
            Select a discipline to explore hunts, clubs, and events near you.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tan-400" />
            <input
              type="text"
              placeholder="Search disciplines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm font-medium focus:outline-none focus:border-tan-400 transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-10">
        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((sport) => {
            const isActive = activeKey === sport.key;
            return (
              <div
                key={sport.key}
                onClick={() => handleSelect(sport.key)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 ${
                  isActive
                    ? 'bg-forest-950 text-white border-tan-500 shadow-xl scale-[1.03]'
                    : 'bg-white hover:bg-surface-lowest text-forest-950 border-surface-border hover:border-tan-500/50 hover:scale-[1.02] hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{sport.icon}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    isActive ? 'bg-tan-500/30 text-tan-300 border border-tan-500/40' : 'bg-forest-950/10 text-forest-800 border border-forest-950/20'
                  }`}>
                    {sport.status}
                  </span>
                </div>
                <div>
                  <h3 className={`font-black text-sm leading-tight ${isActive ? 'text-tan-300' : 'text-forest-950'}`}>
                    {sport.label}
                  </h3>
                  <p className={`text-[11px] mt-1 leading-relaxed font-medium ${isActive ? 'text-tan-100/80' : 'text-charcoal-muted'}`}>
                    {sport.desc}
                  </p>
                </div>
                <div className={`flex items-center text-[10px] font-black uppercase tracking-wider gap-1 ${isActive ? 'text-tan-400' : 'text-forest-700'}`}>
                  <span>{isActive ? '✓ Selected' : 'Select'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {activeSport && (
          <div className="bg-white border border-surface-border rounded-3xl p-8 lg:p-10 shadow-ambient space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <span className="text-5xl">{activeSport.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Selected Discipline</span>
                  <h2 className="text-2xl font-black text-forest-950 mt-1">{activeSport.label}</h2>
                  <p className="text-sm font-bold text-charcoal-muted mt-0.5">{activeSport.desc}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={goToEvents}
                  className="px-5 py-2.5 rounded-xl bg-forest-950 text-tan-300 text-sm font-black hover:bg-forest-900 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  Find Events
                </button>
                <button
                  onClick={goToClubs}
                  className="px-5 py-2.5 rounded-xl border border-forest-950 text-forest-950 text-sm font-black hover:bg-forest-950 hover:text-tan-300 transition-colors flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Find Clubs
                </button>
              </div>
            </div>

            <p className="text-charcoal-muted leading-relaxed font-medium border-t border-surface-border pt-6">
              {activeSport.detail}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-surface-border pt-6">
              <div className="bg-surface-low rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-forest-950">
                  {events.filter((e) => (e.sport || '').toLowerCase().includes(activeSport.key.toLowerCase())).length || '50+'}
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-charcoal-muted mt-1">Events Available</div>
              </div>
              <div className="bg-surface-low rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-forest-950">
                  {clubs.filter((c) => (c.sport || c.type || '').toLowerCase().includes(activeSport.key.toLowerCase())).length || '100+'}
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-charcoal-muted mt-1">Local Clubs</div>
              </div>
              <div className="bg-surface-low rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-black text-forest-950 flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 text-tan-500 fill-tan-500" /> UHC
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-charcoal-muted mt-1">Sanctioned</div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder when nothing is selected */}
        {!activeSport && filtered.length > 0 && (
          <div className="text-center py-12 bg-white border border-dashed border-surface-border rounded-3xl">
            <p className="text-4xl mb-3">☝️</p>
            <p className="text-forest-950 font-black text-lg">Select a Discipline Above</p>
            <p className="text-charcoal-muted font-medium text-sm mt-1">Click any category card to see details, events, and clubs.</p>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-forest-950 font-black text-lg">No results for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-sm text-tan-700 font-bold hover:underline">Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
};
