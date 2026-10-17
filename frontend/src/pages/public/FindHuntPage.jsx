import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PreSignUpModal } from '../../components/events/PreSignUpModal';
import { EventMapView } from '../../components/events/EventMapView';
import { Search, MapPin, Calendar, Filter, List, Grid, Map as MapIcon, Trophy, Award, CheckCircle, ChevronRight, ChevronDown, Check } from 'lucide-react';

export const FindHuntPage = () => {
  const { events, states, enterEvent, dogs } = useApp();
  const [searchParams] = useSearchParams();

  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'ALL');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'ALL');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'ALL');
  const [selectedFederation, setSelectedFederation] = useState('ALL');
  const [selectedEventForPreSignUp, setSelectedEventForPreSignUp] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list | calendar | map

  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const urlSport = searchParams.get('sport');
    const urlQuery = searchParams.get('query');
    const urlState = searchParams.get('state');
    const urlType = searchParams.get('type');

    if (urlSport) setSelectedSport(urlSport);
    if (urlQuery) setSearchTerm(urlQuery);
    if (urlState) setSelectedState(urlState);
    if (urlType) setSelectedType(urlType);
  }, [searchParams]);

  const sportsOptions = [
    { key: 'ALL', label: 'All Sports', icon: '🐾', desc: 'Show events across all sporting categories' },
    { key: 'Coonhounds', label: 'Coonhounds', icon: '🐕', desc: 'Nite Hunts, Treeing Contests & Water Races' },
    { key: 'Beagles', label: 'Beagles', icon: '🐶', desc: 'Rabbit Pack Trials & Field Contests' },
    { key: 'Squirrel Dogs', label: 'Squirrel Dogs', icon: '🐿️', desc: 'Timber Squirrel Hunts & Treeing Contests' },
    { key: 'Hog Dogs', label: 'Hog Dogs', icon: '🐗', desc: 'Wild Hog Bay & Catch Contests' }
  ];

  const currentSport = sportsOptions.find((s) => s.key === selectedSport) || sportsOptions[0];

  const filteredEvents = events.filter((evt) => {
    const evtSport = evt.sport || 'Coonhounds';
    if (selectedSport !== 'ALL' && evtSport.toLowerCase() !== selectedSport.toLowerCase()) return false;
    if (selectedState !== 'ALL' && evt.state !== selectedState && evt.stateCode !== selectedState) return false;
    if (selectedType !== 'ALL' && evt.type !== selectedType) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      evt.name.toLowerCase().includes(q) ||
      evt.club.toLowerCase().includes(q) ||
      evt.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-forest-900 text-white rounded-2xl p-8 shadow-ambient flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-forest-800">
        <div>
          <span className="px-3 py-1 rounded-full bg-tan-500/20 text-tan-300 border border-tan-500/40 text-xs font-black uppercase tracking-wider">
            Sanctioned Event Directory
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">Find Hunt & Event Discovery</h1>
          <p className="text-xs lg:text-sm text-tan-200 mt-1">Official trials, night hunts, water races, and youth championships nationwide.</p>
        </div>
        <div className="flex items-center bg-forest-950 p-1.5 rounded-xl border border-forest-800">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-tan-500 text-forest-950 shadow' : 'text-tan-200 hover:text-white'}`}
          >
            <List className="w-4 h-4" /> List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${viewMode === 'calendar' ? 'bg-tan-500 text-forest-950 shadow' : 'text-tan-200 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-tan-500 text-forest-950 shadow' : 'text-tan-200 hover:text-white'}`}
          >
            <MapIcon className="w-4 h-4" /> USA Map
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border p-4 shadow-ambient grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, club, or city..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
          />
        </div>

        {/* Custom Modern Sport Popover Selector */}
        <div className="relative text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
            className="w-full px-3 py-2.5 text-xs bg-forest-900 hover:bg-forest-950 text-tan-300 border border-forest-800 rounded-xl font-extrabold flex items-center justify-between shadow-md cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm">{currentSport.icon}</span>
              <span className="truncate">{currentSport.label}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-tan-400 transition-transform duration-200 shrink-0 ${isSportDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSportDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-forest-950/95 backdrop-blur-2xl border border-forest-700/80 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-tan-400 border-b border-forest-800/80 mb-1">
                Filter By Sport
              </div>
              {sportsOptions.map((s) => {
                const isSelected = selectedSport === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setSelectedSport(s.key);
                      setIsSportDropdownOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-tan-500/20 text-white font-extrabold border border-tan-400/50'
                        : 'text-tan-100/90 hover:bg-forest-900/90 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-xs">{s.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-tan-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-bold"
          >
            <option value="ALL">All 50 States</option>
            {states.map((s) => (
              <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-bold"
          >
            <option value="ALL">All Event Types</option>
            <option value="Nite Hunt">Nite Hunt</option>
            <option value="Championship Hunt">Championship Hunt</option>
            <option value="Water Race">Water Race</option>
            <option value="Youth Hunt">Youth Hunt</option>
          </select>
        </div>
      </div>

      {/* View Modes */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-muted">
            <span>Showing {filteredEvents.length} Events</span>
            <span>Sorted by Date</span>
          </div>

          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-surface-lowest rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-ambient">
                <div className="w-16 h-16 rounded-2xl bg-tan-100 text-tan-800 mx-auto flex items-center justify-center font-black text-2xl shadow-inner">
                  🐕
                </div>
                <h3 className="text-xl font-black text-forest-900">No Events Found</h3>
                <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                  There are currently no events matching your selected sport filter (<strong>{selectedSport}</strong>). Try selecting another sport or click below to view all.
                </p>
                <button
                  onClick={() => {
                    setSelectedSport('ALL');
                    setSearchTerm('');
                    setSelectedState('ALL');
                    setSelectedType('ALL');
                  }}
                  className="px-4 py-2.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow"
                >
                  Clear Filters & Show All Events
                </button>
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div key={evt.id} className="bg-surface-lowest rounded-2xl border border-surface-border p-6 shadow-ambient flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl hover:border-forest-800/40 transition-all">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-forest-900 text-tan-300 border border-forest-800 flex items-center gap-1">
                        <span>{evt.sport === 'Beagles' ? '🐶' : evt.sport === 'Squirrel Dogs' ? '🐿️' : evt.sport === 'Hog Dogs' ? '🐗' : '🐕'}</span>
                        <span>{evt.sport || 'Coonhounds'}</span>
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300">
                        {evt.type}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {evt.status}
                      </span>
                      <span className="text-xs font-semibold text-charcoal-light">Deadline: {evt.deadline}</span>
                    </div>

                    <h3 className="text-xl font-black text-charcoal">{evt.name}</h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-charcoal-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-tan-600" />
                        <span>{evt.date} @ {evt.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-tan-600" />
                        <span>{evt.club} • {evt.city}, {evt.state} ({evt.distance})</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-forest-900">
                        <Trophy className="w-4 h-4 text-tan-600" />
                        <span>${evt.fee} Fee • {evt.entries}/{evt.maxCapacity} Registered</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-surface-border pt-4 md:pt-0">
                    <button
                      onClick={() => setSelectedEventForPreSignUp(evt)}
                      className="px-5 py-2.5 rounded-xl bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Pre-Sign Up (${evt.fee})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="bg-surface-lowest rounded-2xl border border-surface-border p-8 shadow-ambient text-center space-y-6">
          <h3 className="text-xl font-black text-forest-800">September - November 2026 Event Calendar</h3>
          <div className="grid grid-cols-7 gap-2 text-xs font-black text-charcoal-muted border-b pb-3 uppercase tracking-wider">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs h-72">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="p-2 border border-surface-border rounded-xl bg-surface-low/50 flex flex-col justify-between text-left">
                <span className="font-extrabold text-charcoal">{i + 1}</span>
                {i === 18 && <span className="bg-tan-500 text-forest-950 text-[9px] font-black p-1 rounded-md">Nite Hunt</span>}
                {i === 23 && <span className="bg-forest-800 text-white text-[9px] font-black p-1 rounded-md">Fall Champ</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'map' && (
        <EventMapView
          events={filteredEvents}
          selectedState={selectedState}
          onPreSignUp={(evt) => setSelectedEventForPreSignUp(evt)}
        />
      )}

      {selectedEventForPreSignUp && (
        <PreSignUpModal
          event={selectedEventForPreSignUp}
          onClose={() => setSelectedEventForPreSignUp(null)}
        />
      )}
    </div>
  );
};
