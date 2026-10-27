import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Search,
  UserCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Download,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Dog,
  X,
  AlertCircle,
  ChevronDown,
  Check,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const EventAdminEntries = () => {
  const {
    entries = [],
    events = [],
    toggleCheckIn,
    updateEntry,
    deleteEntry,
    addManualEntry,
    showToast
  } = useApp();

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, CHECKED_IN, NOT_ARRIVED, PAID, UNPAID
  const [selectedEventId, setSelectedEventId] = useState('ALL');

  // Modals State
  const [selectedEntryDetails, setSelectedEntryDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Walk-Up Entry Form State
  const [newEntryForm, setNewEntryForm] = useState({
    participant: '',
    participantEmail: '',
    participantPhone: '',
    dog: '',
    breed: 'Treeing Walker Coonhound',
    fee: 30,
    paymentStatus: 'Paid',
    checkInStatus: 'Checked In',
    eventId: events[0]?.id || 'evt-1'
  });

  // Filtered Entries Logic
  const filteredEntries = entries.filter((item) => {
    // Event scope filter
    if (selectedEventId !== 'ALL' && item.eventId && item.eventId !== selectedEventId) {
      return false;
    }

    // Status filter
    if (statusFilter === 'CHECKED_IN' && item.checkInStatus !== 'Checked In') return false;
    if (statusFilter === 'NOT_ARRIVED' && item.checkInStatus === 'Checked In') return false;
    if (statusFilter === 'PAID' && item.paymentStatus !== 'Paid') return false;
    if (statusFilter === 'UNPAID' && item.paymentStatus === 'Paid') return false;

    // Search query matching
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const entryIdStr = String(item.id || '').toLowerCase();
    const participantStr = String(item.participant || '').toLowerCase();
    const dogStr = String(item.dog || '').toLowerCase();
    const breedStr = String(item.breed || '').toLowerCase();

    return (
      entryIdStr.includes(q) ||
      participantStr.includes(q) ||
      dogStr.includes(q) ||
      breedStr.includes(q)
    );
  });

  // KPI Metrics Calculations
  const relevantEntries = selectedEventId === 'ALL'
    ? entries
    : entries.filter((e) => !e.eventId || e.eventId === selectedEventId);

  const totalCount = relevantEntries.length;
  const checkedInCount = relevantEntries.filter((e) => e.checkInStatus === 'Checked In').length;
  const notArrivedCount = totalCount - checkedInCount;
  const totalFeesCollected = relevantEntries
    .filter((e) => e.paymentStatus === 'Paid')
    .reduce((sum, e) => sum + Number(e.fee || 30), 0);

  // Export Call Sheet as CSV using Blob
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) {
      showToast('No entries to export', 'info');
      return;
    }
    const headers = ['Entry ID', 'Participant', 'Email', 'Dog Name', 'Breed', 'Fee ($)', 'Payment Status', 'Attendance Status', 'Date'];
    const rows = filteredEntries.map((e) => [
      `"${(e.id || '').replace(/"/g, '""')}"`,
      `"${(e.participant || '').replace(/"/g, '""')}"`,
      `"${(e.participantEmail || '').replace(/"/g, '""')}"`,
      `"${(e.dog || '').replace(/"/g, '""')}"`,
      `"${(e.breed || '').replace(/"/g, '""')}"`,
      Number(e.fee || 30),
      `"${(e.paymentStatus || 'Paid').replace(/"/g, '""')}"`,
      `"${(e.checkInStatus || 'Not Arrived').replace(/"/g, '""')}"`,
      `"${(e.date || 'Sep 19, 2026').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trial_entries_call_sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported trial call sheet CSV successfully!', 'success');
  };

  // Submit New Walk-Up Registration
  const handleCreateWalkUpEntry = (e) => {
    e.preventDefault();
    if (!newEntryForm.participant || !newEntryForm.dog) {
      showToast('Please enter both handler name and dog name', 'error');
      return;
    }

    const targetEvt = events.find((evt) => evt.id === newEntryForm.eventId) || events[0] || {
      name: 'Nite Hunt & Treeing Contest',
      club: 'Oak Ridge Hunting Club',
      date: 'September 19, 2026'
    };

    addManualEntry({
      id: `E${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: targetEvt.id,
      eventName: targetEvt.name,
      club: targetEvt.club,
      participant: newEntryForm.participant,
      participantEmail: newEntryForm.participantEmail || `${newEntryForm.participant.toLowerCase().replace(/\s+/g, '.')}@hunting.org`,
      dog: newEntryForm.dog,
      breed: newEntryForm.breed,
      fee: Number(newEntryForm.fee) || 30,
      paymentStatus: newEntryForm.paymentStatus,
      checkInStatus: newEntryForm.checkInStatus,
      date: targetEvt.date || 'September 19, 2026'
    });

    setIsAddModalOpen(false);
    setNewEntryForm({
      participant: '',
      participantEmail: '',
      participantPhone: '(865) 555-0192',
      dog: '',
      breed: 'Treeing Walker Coonhound',
      fee: 30,
      paymentStatus: 'Paid',
      checkInStatus: 'Checked In',
      eventId: events[0]?.id || 'evt-1'
    });
  };

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-lowest p-5 rounded-xl border border-surface-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-tan-100 text-tan-900 border border-tan-300">
              Onsite Trial Operations
            </span>
            <span className="text-xs text-charcoal-muted">
              Scope: {selectedEventId === 'ALL' ? 'All Active Trials' : events.find((e) => e.id === selectedEventId)?.name || 'Nite Hunt'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-forest-800 tracking-tight mt-1">Event Registrations & Entries</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage handler entries, roll-call check-ins, payment confirmations, and cast assignment readiness
          </p>
        </div>

        {/* Top Actions: Event Switcher + Add Walk-Up + Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Event Filter Select */}
          <div className="relative">
            <select
              id="event-entries-scope-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="pl-3 pr-8 py-2 text-xs font-extrabold bg-surface-low border border-surface-border rounded-lg text-forest-900 focus:outline-none focus:border-forest-800 shadow-xs cursor-pointer appearance-none"
            >
              <option value="ALL">All Sanctioned Events</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.date || 'TBD'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-light pointer-events-none" />
          </div>

          <button
            id="export-call-sheet-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface-low hover:bg-forest-50 border border-surface-border text-forest-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download CSV Call Sheet"
          >
            <Download className="w-3.5 h-3.5 text-tan-600" />
            <span>Export Call Sheet</span>
          </button>

          <button
            id="register-walkup-entry-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-tan-300" />
            <span>+ Register Walk-Up</span>
          </button>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Total Registered</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-forest-800">{totalCount}</span>
            <span className="text-xs text-charcoal-muted">Hounds Entered</span>
          </div>
          <div className="text-[10px] text-charcoal-muted mt-1">Official Event Roster</div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Checked-In Onsite</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-700">{checkedInCount}</span>
            <span className="text-xs text-charcoal-muted">/ {totalCount} Ready</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">
            {totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0}% Roll Call Present
          </div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Awaiting Arrival</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-amber-700">{notArrivedCount}</span>
            <span className="text-xs text-charcoal-muted">Pending Handlers</span>
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-1">Bench deadline active</div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Collected Entry Fees</div>
          <div className="text-xl font-black text-forest-800 mt-1">${totalFeesCollected.toFixed(2)}</div>
          <div className="text-[10px] text-charcoal-muted mt-1">Direct trial dues</div>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-surface-lowest p-4 rounded-xl border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            id="search-entries-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by participant name, dog, breed, or entry #..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-black uppercase text-charcoal-light mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All', count: totalCount },
            { id: 'CHECKED_IN', label: 'Checked In', count: checkedInCount },
            { id: 'NOT_ARRIVED', label: 'Not Arrived', count: notArrivedCount },
            { id: 'PAID', label: 'Paid' },
            { id: 'UNPAID', label: 'Unpaid' }
          ].map((pill) => {
            const isActive = statusFilter === pill.id;
            return (
              <button
                key={pill.id}
                id={`filter-pill-${pill.id.toLowerCase()}`}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-surface-low text-charcoal hover:bg-forest-50 hover:text-forest-800 border border-surface-border'
                }`}
              >
                <span>{pill.label}</span>
                {pill.count !== undefined && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${
                    isActive ? 'bg-forest-900 text-tan-300' : 'bg-surface text-charcoal-light'
                  }`}>
                    {pill.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Entries Table */}
      <div className="bg-surface-lowest rounded-xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-low border-b border-surface-border text-charcoal-muted uppercase text-[10px] font-black tracking-wider">
                <th className="py-3 px-4">Entry ID</th>
                <th className="py-3 px-4">Participant / Handler</th>
                <th className="py-3 px-4">Dog Registered</th>
                <th className="py-3 px-4">Entry Fee</th>
                <th className="py-3 px-4 text-center">Payment Status (Click to Toggle)</th>
                <th className="py-3 px-4 text-center">Attendance Status (Click to Check In)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    <AlertCircle className="w-8 h-8 text-charcoal-light mx-auto mb-2 opacity-50" />
                    <div className="font-bold text-sm text-charcoal">No event entries found</div>
                    <div className="text-[11px] mt-0.5">
                      {searchTerm ? 'Try adjusting your search query or status filter.' : 'Click "+ Register Walk-Up" to add an onsite competitor.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isCheckedIn = entry.checkInStatus === 'Checked In';
                  const isPaid = entry.paymentStatus === 'Paid';

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-forest-50/50 transition-colors group"
                    >
                      {/* Entry ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-forest-800">
                        #{entry.id}
                      </td>

                      {/* Participant / Handler */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-forest-900">{entry.participant}</div>
                        <div className="text-[10px] text-charcoal-light truncate max-w-[180px]">
                          {entry.participantEmail || 'Official Handler'}
                        </div>
                      </td>

                      {/* Dog Registered */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-tan-900 flex items-center gap-1.5">
                          <Dog className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                          <span>{entry.dog}</span>
                        </div>
                        <div className="text-[10px] text-charcoal-light">
                          {entry.breed || 'Treeing Walker Coonhound'}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4 font-extrabold text-charcoal">
                        ${Number(entry.fee || 30).toFixed(2)}
                      </td>

                      {/* Payment Status (Clickable Interactive Toggle) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`toggle-payment-${entry.id}`}
                          onClick={() => updateEntry(entry.id, { paymentStatus: isPaid ? 'Unpaid' : 'Paid' })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-800 border border-red-300 hover:bg-red-100'
                          }`}
                          title="Click to toggle payment status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                          <span>{isPaid ? 'Paid' : 'Unpaid'}</span>
                        </button>
                      </td>

                      {/* Attendance Status (Clickable Interactive Toggle for Check-in) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`toggle-checkin-${entry.id}`}
                          onClick={() => toggleCheckIn(entry.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                            isCheckedIn
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                          }`}
                          title="Click to toggle Check-In status"
                        >
                          {isCheckedIn ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Checked In</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Not Arrived</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-details-${entry.id}`}
                            onClick={() => setSelectedEntryDetails(entry)}
                            className="p-1.5 text-charcoal-muted hover:text-forest-800 hover:bg-surface-low rounded transition-colors"
                            title="View Entry Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            id={`delete-entry-${entry.id}`}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove entry #${entry.id} for ${entry.participant}?`)) {
                                deleteEntry(entry.id);
                              }
                            }}
                            className="p-1.5 text-charcoal-muted hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Cancel / Delete Entry"
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

        {/* Table Footer */}
        <div className="p-3.5 bg-surface-low border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted">
          <div>
            Showing <span className="font-bold text-forest-800">{filteredEntries.length}</span> of{' '}
            <span className="font-bold text-forest-800">{relevantEntries.length}</span> records
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span className="px-2 py-0.5 bg-surface-lowest rounded border border-surface-border">Page 1 of 1</span>
          </div>
        </div>
      </div>

      {/* MODAL 1: Walk-Up Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-surface-border bg-forest-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-tan-400" /> Register Walk-Up Competitor
                </h3>
                <p className="text-xs text-tan-200 mt-0.5">Trial roll-call registration for onsite handlers</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkUpEntry} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Sanctioned Event</label>
                <select
                  value={newEntryForm.eventId}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, eventId: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-bold text-forest-900 focus:outline-none focus:border-forest-800"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} ({evt.date || 'TBD'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Handler / Participant Name *</label>
                  <input
                    type="text"
                    required
                    value={newEntryForm.participant}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, participant: e.target.value })}
                    placeholder="e.g. John Hunter"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Handler Phone / Contact</label>
                  <input
                    type="text"
                    value={newEntryForm.participantPhone}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, participantPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Dog Registered Call Name *</label>
                  <input
                    type="text"
                    required
                    value={newEntryForm.dog}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, dog: e.target.value })}
                    placeholder="e.g. Copper or Bandit"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Hound Breed</label>
                  <select
                    value={newEntryForm.breed}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  >
                    <option value="Treeing Walker Coonhound">Treeing Walker Coonhound</option>
                    <option value="English Redtick Coonhound">English Redtick Coonhound</option>
                    <option value="Black & Tan Coonhound">Black & Tan Coonhound</option>
                    <option value="Bluetick Coonhound">Bluetick Coonhound</option>
                    <option value="Beagle Pack">Beagle Pack</option>
                    <option value="Plott Hound">Plott Hound</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newEntryForm.fee}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Payment Status</label>
                  <select
                    value={newEntryForm.paymentStatus}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  >
                    <option value="Paid">Paid (Cash / Card)</option>
                    <option value="Unpaid">Unpaid / Pay on Bench</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Arrival Status</label>
                  <select
                    value={newEntryForm.checkInStatus}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, checkInStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-medium focus:outline-none focus:border-forest-800"
                  >
                    <option value="Checked In">Checked In (Onsite)</option>
                    <option value="Not Arrived">Not Arrived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-surface-border hover:bg-surface-low text-charcoal font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow-sm transition-all"
                >
                  Save & Check In Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Entry Details Viewer Modal */}
      {selectedEntryDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-surface-border bg-forest-800 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-tan-400">Entry Dossier</span>
                <h3 className="font-extrabold text-base">#{selectedEntryDetails.id} Details</h3>
              </div>
              <button
                onClick={() => setSelectedEntryDetails(null)}
                className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-surface-low p-3.5 rounded-xl border border-surface-border space-y-2">
                <div className="flex justify-between items-center border-b border-surface-border/60 pb-2">
                  <span className="text-charcoal-light font-bold">Participant</span>
                  <span className="font-black text-forest-800 text-sm">{selectedEntryDetails.participant}</span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-border/60 pb-2">
                  <span className="text-charcoal-light font-bold">Dog Name</span>
                  <span className="font-extrabold text-tan-800 text-sm flex items-center gap-1">
                    <Dog className="w-3.5 h-3.5 text-tan-600" />
                    {selectedEntryDetails.dog}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-border/60 pb-2">
                  <span className="text-charcoal-light font-bold">Breed</span>
                  <span className="font-semibold text-charcoal">{selectedEntryDetails.breed || 'Treeing Walker Coonhound'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-border/60 pb-2">
                  <span className="text-charcoal-light font-bold">Entry Fee</span>
                  <span className="font-black text-forest-800">${Number(selectedEntryDetails.fee || 30).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-border/60 pb-2">
                  <span className="text-charcoal-light font-bold">Payment</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedEntryDetails.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedEntryDetails.paymentStatus || 'Paid'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-light font-bold">Check-In Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedEntryDetails.checkInStatus === 'Checked In'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedEntryDetails.checkInStatus || 'Not Arrived'}
                  </span>
                </div>
              </div>

              {/* Quick Actions in Modal */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    toggleCheckIn(selectedEntryDetails.id);
                    setSelectedEntryDetails((prev) => ({
                      ...prev,
                      checkInStatus: prev.checkInStatus === 'Checked In' ? 'Not Arrived' : 'Checked In'
                    }));
                  }}
                  className="flex-1 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <UserCheck className="w-4 h-4 text-tan-400" />
                  <span>
                    {selectedEntryDetails.checkInStatus === 'Checked In' ? 'Mark as Not Arrived' : 'Check In Handler'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    const newStatus = selectedEntryDetails.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
                    updateEntry(selectedEntryDetails.id, { paymentStatus: newStatus });
                    setSelectedEntryDetails((prev) => ({ ...prev, paymentStatus: newStatus }));
                  }}
                  className="px-4 py-2.5 bg-surface-low hover:bg-forest-50 border border-surface-border text-forest-800 font-bold rounded-lg text-xs transition-colors"
                >
                  Toggle Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
