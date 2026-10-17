import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const InformationFlowPage = () => {
  const { events, createEvent, clubs, showToast } = useApp();

  const [eventName, setEventName] = useState('Piney Woods Autumn Championship Nite Hunt');
  const [selectedClub, setSelectedClub] = useState('Houston County Coon Hunters Association');
  const [selectedState, setSelectedState] = useState('Texas');
  const [eventDate, setEventDate] = useState('October 24, 2026');
  const [eventFee, setEventFee] = useState(35);
  const [eventType, setEventType] = useState('Nite Hunt');
  const [eventCity, setEventCity] = useState('Crockett');

  const [lastCreatedEvent, setLastCreatedEvent] = useState(null);

  const handlePostEvent = (e) => {
    e.preventDefault();

    const newEvt = {
      name: eventName,
      club: selectedClub,
      state: selectedState,
      city: eventCity,
      date: eventDate,
      fee: Number(eventFee),
      type: eventType,
      sport: 'Coonhounds',
      startTime: '7:00 PM',
      deadline: 'Oct 23, 2026',
      maxCapacity: 50,
      description: `Official ${eventType} sanctioned trial posted once by ${selectedClub}. Automatically synchronized upward across Local, State, and National calendars.`
    };

    createEvent(newEvt);
    setLastCreatedEvent(newEvt);
    showToast(`Event "${eventName}" posted! Automatically synchronized to Local, State & National calendars.`, 'success');
  };

  // Scoped lists for live 3-tier view
  const localClubEvents = events.filter((e) => e.club === selectedClub);
  const stateEvents = events.filter((e) => e.state === selectedState);
  const nationalEvents = events;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            28. Upward Information Flow Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Single-Entry Upward Information Flow
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            The platform is engineered so information moves upward through the system. When a Local Club posts an event once, it automatically populates the <strong>Local Club Calendar</strong>, the <strong>State Calendar</strong>, and the <strong>National UHC Calendar</strong> without duplicate entry.
          </p>
        </div>
      </div>

      {/* ARCHITECTURAL UPWARD FLOW DIAGRAM */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-forest-950 flex items-center gap-2">
              <Zap className="w-5 h-5 text-tan-600" />
              <span>Hierarchical Upward Propagation Workflow</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              The Local Club does not enter the same event three times.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px] rounded-full uppercase">
            1 Entry ➔ 3 Simultaneous Calendars
          </span>
        </div>

        {/* 3-Tier Flow Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Step 1: Local Club */}
          <div className="p-6 rounded-2xl bg-emerald-950/10 border-2 border-emerald-600/40 space-y-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white mx-auto flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white">
                Step 1: Single Entry
              </span>
              <h3 className="text-base font-black text-forest-950 mt-1">Local Club Posts Event</h3>
              <p className="text-xs text-charcoal-muted font-medium mt-1">
                Officer creates event once under their local chartered club chapter.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-600/20 text-xs font-black text-emerald-800 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Live on Local Club Calendar</span>
            </div>
          </div>

          {/* Step 2: State Calendar */}
          <div className="p-6 rounded-2xl bg-amber-950/10 border-2 border-amber-600/40 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white mx-auto flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-600 text-white">
                Step 2: Upward Flow
              </span>
              <h3 className="text-base font-black text-amber-950 mt-1">State Association Calendar</h3>
              <p className="text-xs text-charcoal-muted font-medium mt-1">
                Automatically indexed onto the parent State Association schedule.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-600/20 text-xs font-black text-amber-800 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Live on State Calendar</span>
            </div>
          </div>

          {/* Step 3: National UHC Calendar */}
          <div className="p-6 rounded-2xl bg-forest-950 text-white border-2 border-tan-500 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-tan-500 text-forest-950 mx-auto flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
                Step 3: National Aggregation
              </span>
              <h3 className="text-base font-black text-white mt-1">National UHC Calendar</h3>
              <p className="text-xs text-tan-200 font-medium mt-1">
                Instantly published across the nationwide public directory for all handlers.
              </p>
            </div>
            <div className="pt-2 border-t border-forest-800 text-xs font-black text-tan-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Live on National Calendar</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE EVENT CREATION & PROPAGATION SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form: Single Entry Event Creator */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-5">
          <div className="border-b border-surface-border pb-3">
            <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
              <Plus className="w-5 h-5 text-tan-600" />
              <span>Post Event (Single Entry)</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Enter event details once below to test upward synchronization.
            </p>
          </div>

          <form onSubmit={handlePostEvent} className="space-y-4 text-xs">
            <div>
              <label className="block font-black text-forest-950 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-black text-forest-950 mb-1">Local Club Chapter *</label>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              >
                <option value="Houston County Coon Hunters Association">Houston County Coon Hunters Association (TX)</option>
                <option value="Oak Ridge Hunting Club">Oak Ridge Hunting Club (TN)</option>
                <option value="Lone Star Hound Club">Lone Star Hound Club (TX)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-black text-forest-950 mb-1">State Association *</label>
                <input
                  type="text"
                  disabled
                  value={selectedState}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-black text-forest-900"
                />
              </div>

              <div>
                <label className="block font-black text-forest-950 mb-1">City / Location</label>
                <input
                  type="text"
                  value={eventCity}
                  onChange={(e) => setEventCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-black text-forest-950 mb-1">Event Date</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-forest-950 mb-1">Entry Fee ($)</label>
                <input
                  type="number"
                  value={eventFee}
                  onChange={(e) => setEventFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-black text-forest-950 mb-1">Event Competition Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              >
                <option value="Nite Hunt">Nite Hunt (Coonhounds)</option>
                <option value="Field Trial">Field Trial (Beagles)</option>
                <option value="Water Race">Speed Water Race</option>
                <option value="Bench Show">Conformation Bench Show</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Post Event (Auto-Propagate to 3 Tiers)</span>
            </button>
          </form>
        </div>

        {/* Real-time 3-Tier Upward Calendars Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-surface-border pb-2 flex items-center justify-between">
            <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-tan-600" />
              <span>Simultaneous Live Calendars Propagation (No Duplicate Entry)</span>
            </h3>
            <span className="text-xs text-emerald-800 font-black">All 3 Live</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Calendar 1: Local Club Calendar */}
            <div className="p-4 rounded-2xl bg-surface-lowest border border-emerald-500/40 shadow-ambient space-y-2">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-black text-forest-950 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>1. Local Club Calendar: {selectedClub}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {localClubEvents.length} Local Events
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {localClubEvents.slice(0, 3).map((evt, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-surface-low flex items-center justify-between">
                    <span className="font-bold text-forest-950">{evt.name}</span>
                    <span className="text-charcoal-muted font-mono">{evt.date} • ${evt.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar 2: State Calendar */}
            <div className="p-4 rounded-2xl bg-surface-lowest border border-amber-500/40 shadow-ambient space-y-2">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-black text-amber-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>2. State Calendar: {selectedState} Hound Association</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  {stateEvents.length} State Events
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {stateEvents.slice(0, 3).map((evt, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-surface-low flex items-center justify-between">
                    <span className="font-bold text-forest-950">{evt.name} ({evt.club})</span>
                    <span className="text-charcoal-muted font-mono">{evt.date} • {evt.city}, {evt.state}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar 3: National UHC Calendar */}
            <div className="p-4 rounded-2xl bg-surface-lowest border-2 border-forest-900 shadow-ambient space-y-2">
              <div className="flex items-center justify-between border-b border-surface-border pb-2">
                <span className="font-black text-forest-950 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-forest-800" />
                  <span>3. National UHC Calendar (All US States Directory)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-950 text-tan-300">
                  {nationalEvents.length} Total Nationwide Events
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {nationalEvents.slice(0, 3).map((evt, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-surface-low flex items-center justify-between">
                    <span className="font-bold text-forest-950">{evt.name}</span>
                    <span className="text-charcoal-muted font-mono">{evt.date} • {evt.state}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
