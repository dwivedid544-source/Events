import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UserCheck,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Clock,
  Phone,
  Mail,
  Dog,
  Download,
  RotateCcw,
  CheckCheck,
  AlertCircle,
  Sparkles,
  Calendar,
  ShieldCheck,
  X
} from 'lucide-react';

export const EventAdminAttendance = () => {
  const { entries = [], events = [], toggleCheckIn, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // ALL, NOT_ARRIVED, CHECKED_IN
  const [selectedEventId, setSelectedEventId] = useState('ALL');

  // Filtered attendance list
  const filtered = useMemo(() => {
    return entries.filter((item) => {
      // Event scope filter
      if (selectedEventId !== 'ALL' && item.eventId && item.eventId !== selectedEventId) {
        return false;
      }

      // Check-in status filter
      if (filterMode === 'CHECKED_IN' && item.checkInStatus !== 'Checked In') return false;
      if (filterMode === 'NOT_ARRIVED' && item.checkInStatus === 'Checked In') return false;

      // Search term matching
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        (item.participant || '').toLowerCase().includes(q) ||
        (item.dog || '').toLowerCase().includes(q) ||
        (item.breed || '').toLowerCase().includes(q) ||
        String(item.id || '').toLowerCase().includes(q) ||
        (item.participantPhone || '').toLowerCase().includes(q)
      );
    });
  }, [entries, selectedEventId, filterMode, searchTerm]);

  // Relevant counts based on selected event
  const scopedEntries = useMemo(() => {
    return selectedEventId === 'ALL'
      ? entries
      : entries.filter((e) => !e.eventId || e.eventId === selectedEventId);
  }, [entries, selectedEventId]);

  const totalCount = scopedEntries.length;
  const checkedInCount = scopedEntries.filter((e) => e.checkInStatus === 'Checked In').length;
  const notArrivedCount = totalCount - checkedInCount;
  const readyPercent = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Export Attendance Roster as CSV using Blob
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      if (showToast) showToast('No attendance records to export', 'info');
      return;
    }

    const headers = [
      'Entry ID',
      'Participant Handler',
      'Contact Phone',
      'Dog Name',
      'Dog Breed',
      'Attendance Status',
      'Payment Status',
      'Event'
    ];

    const rows = filtered.map((e) => [
      `"${(e.id || '').replace(/"/g, '""')}"`,
      `"${(e.participant || '').replace(/"/g, '""')}"`,
      `"${(e.participantPhone || '(865) 555-0192').replace(/"/g, '""')}"`,
      `"${(e.dog || '').replace(/"/g, '""')}"`,
      `"${(e.breed || 'Coonhound').replace(/"/g, '""')}"`,
      `"${(e.checkInStatus || 'Not Arrived').replace(/"/g, '""')}"`,
      `"${(e.paymentStatus || 'Paid').replace(/"/g, '""')}"`,
      `"${(e.eventName || 'Nite Hunt').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `trial_attendance_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) {
      showToast('Trial attendance roster CSV downloaded successfully!', 'success');
    }
  };

  // Batch Check-in all not arrived entries
  const handleCheckInAll = () => {
    const pending = scopedEntries.filter((e) => e.checkInStatus !== 'Checked In');
    if (pending.length === 0) {
      if (showToast) showToast('All participants are already checked in!', 'info');
      return;
    }

    pending.forEach((e) => {
      toggleCheckIn(e.id);
    });

    if (showToast) {
      showToast(`Checked in all ${pending.length} remaining handlers!`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-2xl p-4 sm:p-6 lg:p-7 border border-forest-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-tan-500 text-forest-950">
              Mobile Event Operations
            </span>
            <span className="text-[10px] text-tan-300 font-extrabold uppercase tracking-widest">
              Sanctioned Gate Check-In & Roll Call
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
            Live Trial Attendance & Gate Check-In
          </h1>
          <p className="text-xs text-tan-200 opacity-90 max-w-2xl font-medium leading-relaxed">
            Record onsite handler arrivals, verify hound bench readiness, and finalize casts before the trial deadline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 bg-forest-900 border border-forest-700 text-tan-200 text-xs font-bold rounded-xl focus:outline-none focus:border-tan-500 cursor-pointer"
            >
              <option value="ALL">All Sanctioned Events</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name || evt.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleExportCSV}
            title="Download CSV attendance sheet"
            className="px-3.5 py-2 bg-forest-900 hover:bg-forest-850 text-tan-300 hover:text-white border border-forest-700 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-tan-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {notArrivedCount > 0 && (
            <button
              onClick={handleCheckInAll}
              title="Quickly mark all arrived"
              className="px-3.5 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Check In All</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards & Readiness Meter */}
      <div className="bg-surface-lowest p-5 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-charcoal-muted">
              Roll Call Readiness
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-forest-950">
                {checkedInCount} / {totalCount}
              </span>
              <span className="text-xs font-extrabold text-emerald-800">
                ({readyPercent}% Present Onsite)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-charcoal">{checkedInCount} Checked In</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-charcoal">{notArrivedCount} Awaiting Arrival</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-low rounded-full h-3 overflow-hidden border border-surface-border">
          <div
            className="bg-linear-to-r from-emerald-600 to-tan-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${readyPercent}%` }}
          />
        </div>
      </div>

      {/* Touch-Friendly Search & Filter Tabs */}
      <div className="bg-surface-lowest p-3.5 rounded-2xl border border-surface-border shadow-ambient space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by participant name, dog, breed, phone, or #entry..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:border-forest-800 font-medium focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              filterMode === 'ALL'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'bg-surface-low text-charcoal hover:bg-surface-border'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterMode('NOT_ARRIVED')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              filterMode === 'NOT_ARRIVED'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-surface-low text-charcoal hover:bg-surface-border'
            }`}
          >
            Awaiting Arrival ({notArrivedCount})
          </button>
          <button
            onClick={() => setFilterMode('CHECKED_IN')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              filterMode === 'CHECKED_IN'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-surface-low text-charcoal hover:bg-surface-border'
            }`}
          >
            Checked In ({checkedInCount})
          </button>
        </div>
      </div>

      {/* Participant Check-In Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-surface-lowest p-8 rounded-2xl border border-surface-border text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-charcoal-muted mx-auto" />
            <p className="text-sm font-bold text-charcoal">No handlers found matching your search</p>
            <p className="text-xs text-charcoal-muted">Try resetting search keywords or changing filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMode('ALL');
              }}
              className="px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const isCheckedIn = item.checkInStatus === 'Checked In';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCheckedIn
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : 'bg-surface-lowest border-surface-border shadow-ambient hover:border-tan-400'
                }`}
              >
                {/* Competitor / Hound Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-forest-900 bg-surface-low px-2 py-0.5 rounded border border-surface-border">
                      #{item.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        item.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}
                    >
                      {item.paymentStatus || 'Paid'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        isCheckedIn
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-amber-500/20 text-amber-950 border-amber-400'
                      }`}
                    >
                      {isCheckedIn ? '• Onsite Present' : '• Awaiting Arrival'}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-forest-950 truncate">
                    {item.participant}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal font-medium">
                    <div className="flex items-center gap-1 font-bold text-forest-900">
                      <Dog className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                      <span>{item.dog}</span>
                      <span className="text-[10px] font-normal text-charcoal-muted">
                        ({item.breed || 'Treeing Walker Coonhound'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-charcoal-muted text-[11px]">
                      <Phone className="w-3 h-3 text-tan-700 shrink-0" />
                      <span>{item.participantPhone || '(865) 555-0192'}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isCheckedIn ? (
                    <button
                      onClick={() => toggleCheckIn(item.id)}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs border border-emerald-700/40 bg-white hover:bg-emerald-100/60 text-emerald-900 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      title="Undo check-in and mark as not arrived"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Undo Check-In</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleCheckIn(item.id)}
                      className="px-5 py-2.5 rounded-xl font-black text-xs shadow-md bg-tan-500 hover:bg-tan-600 text-forest-950 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      title="Confirm handler arrival"
                    >
                      <UserCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Check In Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

