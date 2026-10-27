import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Download,
  Filter,
  X,
  ChevronRight,
  Dog,
  Trophy,
  ShieldCheck,
  Search,
  Sparkles,
  Award
} from 'lucide-react';

export const ClubAdminEvents = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isStateAdmin = location.pathname.includes('/state-admin');
  const isNationalAdmin = location.pathname.includes('/national-admin');
  const isSuperAdmin = location.pathname.includes('/super-admin');

  const {
    events = [],
    entries = [],
    clubs = [],
    createEvent,
    updateEvent,
    deleteEvent,
    showToast,
    currentUser
  } = useApp();

  const rawState = currentUser?.state || 'Tennessee';
  const stateName = rawState.replace(/\s+State\s+Association$/i, '');
  const stateAssocTitle = `${stateName} State Association`;

  // Scoped Titles
  const pageTitle = isStateAdmin
    ? 'State Sanctioned Events Management'
    : isNationalAdmin
    ? 'National Sanctioned Events Management'
    : isSuperAdmin
    ? 'Global Events & Trials Directory'
    : 'Club Events Management';

  const pageSubtitle = isStateAdmin
    ? `Oversee sanctioned field trials, coordinate club schedules, inspect roster capacity, and manage registrations across ${stateAssocTitle}.`
    : 'Manage sanctioned trials, schedule hunts, verify roster capacities, and handle trial publications.';

  // State Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [federationFilter, setFederationFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);

  // Form State for Create
  const [createForm, setCreateForm] = useState({
    name: '',
    federation: 'UKC (United Kennel Club)',
    sport: 'Coonhounds',
    type: 'Nite Hunt',
    club: 'Oak Ridge Hunting Club',
    clubId: 'club-1',
    state: stateName,
    stateCode: stateName === 'Tennessee' ? 'TN' : 'US',
    city: '',
    date: '',
    startTime: '',
    fee: '',
    maxCapacity: '',
    status: 'Registration Open',
    address: '',
    description: ''
  });

  // Helper to calculate entries count for an event
  const getEventEntriesCount = (evt) => {
    if (evt.entriesCount !== undefined && evt.entriesCount !== null) return Number(evt.entriesCount);
    if (evt.entries !== undefined && evt.entries !== null && typeof evt.entries === 'number') return Number(evt.entries);
    // Dynamic matching from entries state
    const matched = entries.filter((e) => e.eventId === evt.id || e.event === evt.name);
    return matched.length;
  };

  // KPI Metrics Calculations
  const totalEventsCount = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.maxCapacity) || 50), 0);
  const totalRegisteredEntries = events.reduce((sum, e) => sum + getEventEntriesCount(e), 0);
  const openEventsCount = events.filter((e) => e.status === 'Registration Open').length;
  const totalRevenue = events.reduce(
    (sum, e) => sum + (Number(e.fee) || 30) * getEventEntriesCount(e),
    0
  );
  const capacityPercent = totalCapacity > 0 ? Math.round((totalRegisteredEntries / totalCapacity) * 100) : 0;

  // Filtered Events
  const filteredEvents = events.filter((item) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchClub = item.club?.toLowerCase().includes(q);
      const matchCity = item.city?.toLowerCase().includes(q);
      const matchType = item.type?.toLowerCase().includes(q);
      const matchFed = item.federation?.toLowerCase().includes(q);
      if (!matchName && !matchClub && !matchCity && !matchType && !matchFed) return false;
    }

    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (federationFilter !== 'ALL' && item.federation !== federationFilter) return false;

    return true;
  });

  // Handle Event Creation
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      showToast('Please provide an event title', 'warning');
      return;
    }

    await createEvent({
      ...createForm,
      fee: Number(createForm.fee) || 30,
      maxCapacity: Number(createForm.maxCapacity) || 50,
      entries: 0,
      entriesCount: 0
    });

    setIsCreateModalOpen(false);
    setCreateForm({
      name: '',
      federation: 'UKC (United Kennel Club)',
      sport: 'Coonhounds',
      type: 'Nite Hunt',
      club: 'Oak Ridge Hunting Club',
      clubId: 'club-1',
      state: stateName,
      stateCode: stateName === 'Tennessee' ? 'TN' : 'US',
      city: 'Knoxville',
      date: 'October 24, 2026',
      startTime: '7:00 PM',
      fee: 35,
      maxCapacity: 50,
      status: 'Registration Open',
      address: '1420 Hunting Ridge Rd, Knoxville, TN',
      description: 'Official sanctioned hound trial featuring night tracking and treeing accuracy.'
    });
  };

  // Handle Event Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    await updateEvent(editingEvent.id, {
      ...editingEvent,
      fee: Number(editingEvent.fee) || 30,
      maxCapacity: Number(editingEvent.maxCapacity) || 50
    });

    setEditingEvent(null);
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (event, newStatus) => {
    await updateEvent(event.id, { status: newStatus });
    setOpenStatusMenuId(null);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete.id);
    setEventToDelete(null);
    if (selectedEventForDetails?.id === eventToDelete.id) {
      setSelectedEventForDetails(null);
    }
  };

  // Export Events CSV
  const handleExportCSV = () => {
    if (filteredEvents.length === 0) {
      showToast('No events available to export', 'info');
      return;
    }

    const headers = ['Event ID', 'Event Name', 'Federation', 'Sport', 'Type', 'Club', 'City', 'State', 'Date', 'Start Time', 'Fee ($)', 'Entries Registered', 'Max Capacity', 'Status'];
    const rows = filteredEvents.map((e) => [
      e.id,
      `"${e.name || ''}"`,
      `"${e.federation || 'UKC'}"`,
      `"${e.sport || 'Coonhounds'}"`,
      `"${e.type || 'Nite Hunt'}"`,
      `"${e.club || ''}"`,
      `"${e.city || ''}"`,
      `"${e.state || stateName}"`,
      `"${e.date || ''}"`,
      `"${e.startTime || ''}"`,
      e.fee || 30,
      getEventEntriesCount(e),
      e.maxCapacity || 50,
      `"${e.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sanctioned_Events_Schedule_${stateName}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported sanctioned events roster to CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-forest-900 tracking-tight">{pageTitle}</h1>
            {isStateAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-800 text-tan-400 font-extrabold text-[11px] rounded-full shadow-xs border border-forest-900">
                <ShieldCheck className="w-3.5 h-3.5 text-tan-400" />
                {stateName} Sanctioned
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface-lowest hover:bg-surface-low text-forest-800 border border-surface-border font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Download CSV of filtered events"
          >
            <Download className="w-4 h-4 text-forest-700" /> Export Schedule (CSV)
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-tan-500 hover:bg-tan-600 active:scale-95 text-forest-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Create New Event
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Sanctioned Events"
          value={totalEventsCount}
          subtext={`${openEventsCount} accepting entries`}
          icon={Calendar}
          trend={`${totalEventsCount} Active`}
          trendType="up"
        />
        <StatCard
          title="Registered Entries"
          value={`${totalRegisteredEntries} / ${totalCapacity}`}
          subtext={`${capacityPercent}% capacity filled`}
          icon={Users}
          trend={`${totalCapacity - totalRegisteredEntries} spots open`}
          trendType={capacityPercent > 80 ? 'up' : 'down'}
        />
        <StatCard
          title="Open Registrations"
          value={openEventsCount}
          subtext="Active trial entry windows"
          icon={CheckCircle2}
          trend="Sanctioned"
          trendType="up"
        />
        <StatCard
          title="Estimated Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          subtext="Entry fee collections"
          icon={DollarSign}
          trend="Gross"
          trendType="up"
        />
      </div>

      {/* 3. Multi-Filter Toolbar */}
      <div className="bg-surface-lowest rounded-2xl p-4 border border-surface-border shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search events by title, club, city, type, federation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-surface-low border border-surface-border rounded-xl text-xs font-medium text-forest-900 placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-forest-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {['ALL', 'Registration Open', 'Upcoming', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-forest-800 text-tan-400 shadow-xs'
                    : 'bg-surface-low hover:bg-surface-border text-charcoal-muted hover:text-forest-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Type & Federation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-charcoal-muted">Event Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-1 px-2.5 bg-surface-low border border-surface-border rounded-lg text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-800"
              >
                <option value="ALL">All Types</option>
                <option value="Nite Hunt">Nite Hunt</option>
                <option value="Championship Hunt">Championship Hunt</option>
                <option value="Water Race">Water Race</option>
                <option value="Field Trial">Field Trial</option>
                <option value="Treeing Contest">Treeing Contest</option>
                <option value="Youth Hunt">Youth Hunt</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-charcoal-muted">Federation:</span>
              <select
                value={federationFilter}
                onChange={(e) => setFederationFilter(e.target.value)}
                className="py-1 px-2.5 bg-surface-low border border-surface-border rounded-lg text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-800"
              >
                <option value="ALL">All Federations</option>
                <option value="UKC (United Kennel Club)">UKC (United Kennel Club)</option>
                <option value="PKC (Professional Kennel Club)">PKC (Professional Kennel Club)</option>
                <option value="AKC (American Kennel Club)">AKC (American Kennel Club)</option>
                <option value="UHC (Ultimate Hound Club)">UHC (Ultimate Hound Club)</option>
              </select>
            </div>

            {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' || federationFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setFederationFilter('ALL');
                }}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="text-[11px] text-charcoal-muted font-medium">
            Showing <strong className="text-forest-900 font-extrabold">{filteredEvents.length}</strong> of{' '}
            {events.length} events
          </div>
        </div>
      </div>

      {/* 4. Events Data Table */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-low/80 border-b border-surface-border text-charcoal-muted uppercase text-[10px] font-black tracking-wider">
                <th className="py-3 px-4">Event Name & Division</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date & Schedule</th>
                <th className="py-3 px-4">Location & Club</th>
                <th className="py-3 px-4 text-center">Fee</th>
                <th className="py-3 px-4 text-center">Entries / Capacity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    <Calendar className="w-10 h-10 mx-auto text-charcoal-muted/40 mb-2" />
                    <p className="font-bold text-sm text-forest-900">No sanctioned events found</p>
                    <p className="text-xs mt-1">Try adjusting your search criteria or create a new event.</p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const entriesCount = getEventEntriesCount(evt);
                  const maxCap = Number(evt.maxCapacity) || 50;
                  const percent = Math.min(100, Math.round((entriesCount / maxCap) * 100));

                  // Progress Bar Colors
                  const progressColor =
                    percent >= 90
                      ? 'bg-rose-500'
                      : percent >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-600';

                  const isMenuOpen = openStatusMenuId === evt.id;

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-surface-low/40 transition-colors group"
                    >
                      {/* Event Name */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedEventForDetails(evt)}
                            className="font-extrabold text-sm text-forest-900 hover:text-tan-600 transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>{evt.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-forest-800/10 text-forest-900 text-[10px] font-black rounded border border-forest-800/20">
                              {evt.federation?.split(' ')[0] || 'UKC'}
                            </span>
                            <span className="text-[10px] text-charcoal-muted font-bold">
                              {evt.sport || 'Coonhounds'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-tan-100 text-forest-900 border border-tan-300">
                          <Award className="w-3 h-3 text-tan-600" />
                          {evt.type}
                        </span>
                      </td>

                      {/* Date & Schedule */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-forest-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="text-[11px] text-charcoal-muted flex items-center gap-1.5 font-medium pl-5">
                            <Clock className="w-3 h-3 text-charcoal-muted shrink-0" />
                            <span>{evt.startTime || '7:00 PM'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location & Club */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[200px]">
                          <div className="font-bold text-forest-900 flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>
                              {evt.city || 'Knoxville'}, {evt.stateCode || (evt.state === 'Tennessee' ? 'TN' : evt.state || 'TN')}
                            </span>
                          </div>
                          <div className="text-[11px] text-charcoal-muted flex items-center gap-1.5 truncate pl-5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{evt.club || 'Oak Ridge Hunting Club'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-extrabold text-forest-900 text-sm">
                          ${Number(evt.fee || 30).toFixed(2)}
                        </span>
                      </td>

                      {/* Entries / Capacity */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center gap-1 min-w-[100px]">
                          <div className="text-xs font-black text-forest-900">
                            <span>{entriesCount}</span>{' '}
                            <span className="text-charcoal-muted font-bold text-[11px]">/ {maxCap}</span>
                            <span className="ml-1 text-[10px] text-charcoal-muted font-semibold">({percent}%)</span>
                          </div>
                          <div className="w-20 bg-surface-border rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setOpenStatusMenuId(isMenuOpen ? null : evt.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 transition-all shadow-xs ${
                              evt.status === 'Registration Open'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : evt.status === 'Upcoming'
                                ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                                : evt.status === 'Completed'
                                ? 'bg-charcoal-light/10 text-charcoal-dark border-charcoal-muted/30 hover:bg-charcoal-light/20'
                                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            }`}
                            title="Click to change status"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {evt.status}
                          </button>

                          {/* Status Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg z-30 p-1 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-2 py-1 text-[10px] font-black text-charcoal-muted uppercase">Set Event Status</div>
                              {['Registration Open', 'Upcoming', 'Completed', 'Cancelled'].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleQuickStatusChange(evt, st)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                                    evt.status === st
                                      ? 'bg-forest-800 text-tan-400'
                                      : 'hover:bg-surface-low text-forest-900'
                                  }`}
                                >
                                  <span>{st}</span>
                                  {evt.status === st && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedEventForDetails(evt)}
                            className="p-1.5 text-charcoal-muted hover:text-forest-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="View Event Details & Roster"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Event */}
                          <button
                            onClick={() => setEditingEvent({ ...evt })}
                            className="p-1.5 text-charcoal-muted hover:text-amber-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="Edit Event Configuration"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Quick Roster Jump */}
                          <button
                            onClick={() => {
                              navigate(isStateAdmin ? `/state-admin/entries` : `/club-admin/entries`);
                            }}
                            className="p-1.5 text-charcoal-muted hover:text-blue-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="Open Entries Table"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setEventToDelete(evt)}
                            className="p-1.5 text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-surface-low/50 border-t border-surface-border text-xs text-charcoal-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Total Sanctioned Roster Capacity: <strong className="text-forest-900 font-black">{totalCapacity} dogs</strong> across{' '}
            <strong className="text-forest-900 font-black">{events.length} sanctioned events</strong>
          </span>
          <span className="font-semibold text-[11px]">
            Official Sanction Authority: {stateAssocTitle}
          </span>
        </div>
      </div>

      {/* 5. Create New Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-tan-500/20 text-forest-900 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-forest-900">Create New Sanctioned Event</h2>
                  <p className="text-xs text-charcoal-muted">Publish a new sanctioned field trial or competition</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Event Title */}
              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cumberland River Winter Nite Hunt"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Federation & Sport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Sanctioning Body</label>
                  <select
                    value={createForm.federation}
                    onChange={(e) => setCreateForm({ ...createForm, federation: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="UKC (United Kennel Club)">UKC (United Kennel Club)</option>
                    <option value="PKC (Professional Kennel Club)">PKC (Professional Kennel Club)</option>
                    <option value="AKC (American Kennel Club)">AKC (American Kennel Club)</option>
                    <option value="UHC (Ultimate Hound Club)">UHC (Ultimate Hound Club)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Hound Sport / Division</label>
                  <select
                    value={createForm.sport}
                    onChange={(e) => setCreateForm({ ...createForm, sport: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Coonhounds">Coonhounds</option>
                    <option value="Beagles">Beagles</option>
                    <option value="Bird Dogs">Bird Dogs</option>
                    <option value="Big Game Hounds">Big Game Hounds</option>
                  </select>
                </div>
              </div>

              {/* Type & Host Club */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Event Type</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Nite Hunt">Nite Hunt</option>
                    <option value="Championship Hunt">Championship Hunt</option>
                    <option value="Water Race">Water Race</option>
                    <option value="Field Trial">Field Trial</option>
                    <option value="Treeing Contest">Treeing Contest</option>
                    <option value="Youth Hunt">Youth Hunt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Host Club</label>
                  <input
                    type="text"
                    required
                    value={createForm.club}
                    onChange={(e) => setCreateForm({ ...createForm, club: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              {/* Date & Start Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Event Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 24, 2026"
                    value={createForm.date}
                    onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Check-in / Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7:00 PM"
                    value={createForm.startTime}
                    onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              {/* Fee & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    required
                    value={createForm.fee}
                    onChange={(e) => setCreateForm({ ...createForm, fee: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Max Dog Capacity</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={createForm.maxCapacity}
                    onChange={(e) => setCreateForm({ ...createForm, maxCapacity: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Registration Open">Registration Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Grounds / Venue Address</label>
                <input
                  type="text"
                  placeholder="e.g. 1420 Hunting Ridge Rd, Knoxville, TN"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Event Description & Rules</label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-tan-400 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-tan-400" /> Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-forest-900 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-forest-900">Edit Sanctioned Event</h2>
                  <p className="text-xs text-charcoal-muted">Modify trial schedule, fees, and capacity</p>
                </div>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Event Type</label>
                  <select
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Nite Hunt">Nite Hunt</option>
                    <option value="Championship Hunt">Championship Hunt</option>
                    <option value="Water Race">Water Race</option>
                    <option value="Field Trial">Field Trial</option>
                    <option value="Treeing Contest">Treeing Contest</option>
                    <option value="Youth Hunt">Youth Hunt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Registration Open">Registration Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.startTime || '7:00 PM'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    required
                    value={editingEvent.fee}
                    onChange={(e) => setEditingEvent({ ...editingEvent, fee: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={editingEvent.maxCapacity}
                    onChange={(e) => setEditingEvent({ ...editingEvent, maxCapacity: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Host Club</label>
                  <input
                    type="text"
                    value={editingEvent.club || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, club: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">City</label>
                  <input
                    type="text"
                    value={editingEvent.city || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Address</label>
                <input
                  type="text"
                  value={editingEvent.address || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-tan-400 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-tan-400" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Event Details & Registered Entries Roster Modal */}
      {selectedEventForDetails && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-forest-800 text-tan-400">
                    {selectedEventForDetails.federation?.split(' ')[0] || 'UKC'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tan-100 text-forest-900 border border-tan-300">
                    {selectedEventForDetails.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-low text-charcoal-muted">
                    {selectedEventForDetails.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-forest-900 mt-2">{selectedEventForDetails.name}</h2>
                <p className="text-xs text-charcoal-muted mt-0.5 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>{selectedEventForDetails.club || 'Oak Ridge Hunting Club'}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{selectedEventForDetails.city}, {selectedEventForDetails.state || stateName}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Key Stats Banner */}
            {(() => {
              const entriesCount = getEventEntriesCount(selectedEventForDetails);
              const maxCap = Number(selectedEventForDetails.maxCapacity) || 50;
              const spotsLeft = Math.max(0, maxCap - entriesCount);
              const fee = Number(selectedEventForDetails.fee) || 30;
              const estPurse = entriesCount * fee;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-low p-3.5 rounded-xl border border-surface-border">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-charcoal-muted">Registered</div>
                    <div className="text-lg font-black text-forest-900 mt-0.5">
                      {entriesCount} <span className="text-xs text-charcoal-muted font-bold">/ {maxCap}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-charcoal-muted">Spots Open</div>
                    <div className="text-lg font-black text-forest-800 mt-0.5">{spotsLeft}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-charcoal-muted">Entry Fee</div>
                    <div className="text-lg font-black text-forest-900 mt-0.5">${fee.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-charcoal-muted">Est. Purse/Fees</div>
                    <div className="text-lg font-black text-forest-900 mt-0.5">${estPurse.toLocaleString()}</div>
                  </div>
                </div>
              );
            })()}

            {/* Logistics & Description */}
            <div className="space-y-3 text-xs">
              <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-forest-800" /> Event Logistics & Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-surface-lowest p-3 border border-surface-border rounded-xl">
                <div>
                  <span className="font-bold text-charcoal-muted block text-[11px]">Trial Date:</span>
                  <span className="font-extrabold text-forest-900">{selectedEventForDetails.date}</span>
                </div>
                <div>
                  <span className="font-bold text-charcoal-muted block text-[11px]">Check-In / Start:</span>
                  <span className="font-extrabold text-forest-900">{selectedEventForDetails.startTime || '7:00 PM'}</span>
                </div>
                <div>
                  <span className="font-bold text-charcoal-muted block text-[11px]">Venue Address:</span>
                  <span className="font-bold text-forest-900">{selectedEventForDetails.address || '1420 Hunting Ridge Rd, Knoxville, TN'}</span>
                </div>
                <div>
                  <span className="font-bold text-charcoal-muted block text-[11px]">Division:</span>
                  <span className="font-bold text-forest-900">{selectedEventForDetails.sport || 'Coonhounds'}</span>
                </div>
              </div>

              {selectedEventForDetails.description && (
                <div className="bg-surface-low p-3 rounded-xl border border-surface-border text-charcoal-dark font-medium leading-relaxed">
                  {selectedEventForDetails.description}
                </div>
              )}
            </div>

            {/* Registered Entries Roster */}
            {(() => {
              const matchedEntries = entries.filter(
                (e) => e.eventId === selectedEventForDetails.id || e.event === selectedEventForDetails.name
              );

              return (
                <div className="space-y-2.5 text-xs pt-2 border-t border-surface-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-forest-800" /> Registered Participants & Dogs ({matchedEntries.length})
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedEventForDetails(null);
                        navigate(isStateAdmin ? '/state-admin/entries' : '/club-admin/entries');
                      }}
                      className="text-tan-600 hover:text-tan-700 font-extrabold text-xs flex items-center gap-1"
                    >
                      Manage in Entries Console <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {matchedEntries.length === 0 ? (
                    <div className="p-6 text-center bg-surface-low rounded-xl border border-surface-border text-charcoal-muted">
                      <Dog className="w-8 h-8 mx-auto text-charcoal-muted/40 mb-1" />
                      <p className="font-bold text-xs">No entries registered for this specific event yet</p>
                      <p className="text-[11px] mt-0.5">Members can register online or through state admin entries.</p>
                    </div>
                  ) : (
                    <div className="border border-surface-border rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-surface-low border-b border-surface-border text-[10px] font-black text-charcoal-muted uppercase">
                            <th className="py-2 px-3">Entry #</th>
                            <th className="py-2 px-3">Handler</th>
                            <th className="py-2 px-3">Dog Name</th>
                            <th className="py-2 px-3 text-center">Payment</th>
                            <th className="py-2 px-3 text-center">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/60">
                          {matchedEntries.map((ent) => (
                            <tr key={ent.id} className="hover:bg-surface-low/30">
                              <td className="py-2 px-3 font-mono font-bold text-forest-900">
                                {ent.id?.startsWith('#') ? ent.id : `#${ent.id}`}
                              </td>
                              <td className="py-2 px-3 font-bold text-forest-900">
                                {ent.participant}
                              </td>
                              <td className="py-2 px-3 font-semibold text-charcoal-dark">
                                {ent.dog}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  ent.paymentStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {ent.paymentStatus}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  ent.checkInStatus === 'Checked In'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {ent.checkInStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <button
                onClick={() => {
                  setEditingEvent({ ...selectedEventForDetails });
                  setSelectedEventForDetails(null);
                }}
                className="px-4 py-2 border border-surface-border rounded-xl font-bold text-forest-900 hover:bg-surface-low transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Event
              </button>

              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="px-5 py-2 bg-forest-800 text-tan-400 font-extrabold rounded-xl shadow-xs hover:bg-forest-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-forest-900">Remove Sanctioned Event</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-forest-900 font-black">"{eventToDelete.name}"</strong>? This will remove the event from the state schedule.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md transition-colors text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
