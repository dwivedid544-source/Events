import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
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
  Building2,
  ShieldCheck,
  X,
  Dog,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';

export const ClubAdminEntries = () => {
  const location = useLocation();
  const isStateAdmin = location.pathname.includes('/state-admin');

  const {
    entries = [],
    events = [],
    updateEntry,
    toggleCheckIn,
    deleteEntry,
    addManualEntry,
    showToast,
    currentUser
  } = useApp();

  const stateName = currentUser?.state || 'Tennessee';
  const pageTitle = isStateAdmin
    ? 'State Association Entries Management'
    : 'Club Entries Management';
  const pageSubtitle = isStateAdmin
    ? `Review member registrations, hunt entries, payment verifications, and roll-call check-ins across ${stateName} sanctioned events.`
    : 'Review member registrations, entry payments, and attendance check-in across club events.';

  // State Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [checkInFilter, setCheckInFilter] = useState('ALL');

  // Modals
  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Entry Form State
  const [newEntryForm, setNewEntryForm] = useState({
    participant: '',
    participantEmail: '',
    dog: '',
    dogBreed: 'Treeing Walker Coonhound',
    eventId: events[0]?.id || 'evt-1',
    fee: 35,
    paymentStatus: 'Paid',
    checkInStatus: 'Not Arrived'
  });

  // Calculate Metrics
  const totalEntriesCount = entries.length;
  const paidEntries = entries.filter((e) => e.paymentStatus === 'Paid');
  const paidCount = paidEntries.length;
  const totalCollectedFees = entries.reduce(
    (sum, e) => (e.paymentStatus === 'Paid' ? sum + (Number(e.fee) || 35) : sum),
    0
  );
  const checkedInCount = entries.filter((e) => e.checkInStatus === 'Checked In').length;
  const notArrivedCount = totalEntriesCount - checkedInCount;
  const attendanceRate = totalEntriesCount > 0 ? Math.round((checkedInCount / totalEntriesCount) * 100) : 0;

  // Filtered Entries List
  const filteredEntries = entries.filter((item) => {
    // 1. Search Query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        item.id?.toLowerCase().includes(q) ||
        item.participant?.toLowerCase().includes(q) ||
        item.participantEmail?.toLowerCase().includes(q) ||
        item.dog?.toLowerCase().includes(q) ||
        item.eventName?.toLowerCase().includes(q) ||
        item.club?.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Event Filter
    if (eventFilter !== 'ALL' && item.eventName !== eventFilter && item.eventId !== eventFilter) {
      return false;
    }

    // 3. Payment Filter
    if (paymentFilter !== 'ALL' && item.paymentStatus !== paymentFilter) {
      return false;
    }

    // 4. Check-in Filter
    if (checkInFilter !== 'ALL' && item.checkInStatus !== checkInFilter) {
      return false;
    }

    return true;
  });

  // Handle Manual Add Entry Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEntryForm.participant.trim() || !newEntryForm.dog.trim()) {
      showToast('Please enter both participant name and dog call-name.', 'error');
      return;
    }

    const selectedEvt = events.find((evt) => evt.id === newEntryForm.eventId) || events[0] || {};

    addManualEntry({
      participant: newEntryForm.participant.trim(),
      participantEmail: newEntryForm.participantEmail.trim() || `${newEntryForm.participant.toLowerCase().replace(/\s+/g, '.')}@hunting.org`,
      dog: newEntryForm.dog.trim(),
      eventId: selectedEvt.id || 'evt-1',
      eventName: selectedEvt.name || 'Nite Hunt & Treeing Contest',
      club: selectedEvt.club || 'Oak Ridge Hunting Club',
      fee: Number(newEntryForm.fee) || 35,
      paymentStatus: newEntryForm.paymentStatus,
      checkInStatus: newEntryForm.checkInStatus,
      date: selectedEvt.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });

    setIsAddModalOpen(false);
    setNewEntryForm({
      participant: '',
      participantEmail: '',
      dog: '',
      dogBreed: 'Treeing Walker Coonhound',
      eventId: events[0]?.id || 'evt-1',
      fee: 35,
      paymentStatus: 'Paid',
      checkInStatus: 'Not Arrived'
    });
  };

  // Export Filtered Entries as CSV
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) {
      showToast('No entries to export.', 'info');
      return;
    }

    const headers = ['Entry ID', 'Participant', 'Email', 'Dog', 'Event', 'Host Club', 'Fee', 'Payment Status', 'Attendance Check-in', 'Date'];
    const rows = filteredEntries.map((e) => [
      `"${e.id}"`,
      `"${e.participant}"`,
      `"${e.participantEmail || ''}"`,
      `"${e.dog}"`,
      `"${e.eventName}"`,
      `"${e.club || ''}"`,
      `"$${e.fee || 35}"`,
      `"${e.paymentStatus}"`,
      `"${e.checkInStatus}"`,
      `"${e.date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${isStateAdmin ? 'State' : 'Club'}_Hunt_Entries_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported entries roster to CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">{pageTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-forest-900/10 text-forest-900 border border-forest-800/20">
              {isStateAdmin ? `${stateName} State Scope` : 'Club Operations'}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface-lowest border border-surface-border hover:bg-surface-low text-charcoal font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-forest-800" />
            <span>Export Roster (CSV)</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-tan-400" />
            <span>New Hunt Entry</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Event Entries"
          value={totalEntriesCount.toString()}
          subtext={`${events.length} Sanctioned Events`}
          icon={ClipboardList}
        />
        <StatCard
          title="Paid Registrations"
          value={paidCount.toString()}
          subtext={`$${totalCollectedFees.toLocaleString('en-US', { minimumFractionDigits: 2 })} Total Revenue`}
          icon={DollarSign}
        />
        <StatCard
          title="Checked-In Participants"
          value={checkedInCount.toString()}
          subtext={`${attendanceRate}% Roll-Call Attendance`}
          icon={UserCheck}
        />
        <StatCard
          title="Awaiting Arrival"
          value={notArrivedCount.toString()}
          subtext="Pending Gate Arrival"
          icon={Clock}
        />
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by participant name, dog, event, or entry ID (#E1045)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface-low text-charcoal border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Event Filter Select */}
          <div className="w-full md:w-56">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Events ({events.length})</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.name}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills: Payment & Check-in */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-charcoal-muted flex items-center gap-1">
              <Filter className="w-3 h-3 text-tan-600" /> Payment:
            </span>
            <div className="flex items-center bg-surface-low p-1 rounded-xl border border-surface-border gap-1">
              {['ALL', 'Paid', 'Pending'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPaymentFilter(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    paymentFilter === p
                      ? 'bg-forest-900 text-white shadow-xs'
                      : 'text-charcoal hover:bg-surface-border/50'
                  }`}
                >
                  {p === 'ALL' ? 'All' : p}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-bold text-charcoal-muted ml-2">Attendance:</span>
            <div className="flex items-center bg-surface-low p-1 rounded-xl border border-surface-border gap-1">
              {['ALL', 'Checked In', 'Not Arrived'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCheckInFilter(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    checkInFilter === c
                      ? 'bg-forest-900 text-white shadow-xs'
                      : 'text-charcoal hover:bg-surface-border/50'
                  }`}
                >
                  {c === 'ALL' ? 'All Status' : c}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-charcoal-muted font-bold">
            Showing {filteredEntries.length} of {entries.length} records
          </div>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6 text-tan-600" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-extrabold text-sm text-forest-950">No Entries Match Your Search</h3>
              <p className="text-xs text-charcoal-muted">
                Try adjusting your search query, clearing event filters, or registering a new hunt entry.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setEventFilter('ALL');
                setPaymentFilter('ALL');
                setCheckInFilter('ALL');
              }}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl hover:bg-forest-950 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-low text-charcoal-muted uppercase text-[10px] font-extrabold border-b border-surface-border">
                <tr>
                  <th className="p-4">Entry ID</th>
                  <th className="p-4">Member / Participant</th>
                  <th className="p-4">Dog Registered</th>
                  <th className="p-4">Event & Club</th>
                  <th className="p-4 text-center">Payment Status</th>
                  <th className="p-4 text-center">Attendance Check-In</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-low/80 transition-colors">
                    {/* Entry ID */}
                    <td className="p-4 font-mono font-bold text-forest-900">
                      <button
                        onClick={() => setSelectedEntryForDetails(item)}
                        className="hover:underline hover:text-tan-700 cursor-pointer text-left"
                      >
                        #{item.id}
                      </button>
                    </td>

                    {/* Participant */}
                    <td className="p-4">
                      <div className="font-extrabold text-forest-950 text-sm">{item.participant}</div>
                      <div className="text-[11px] text-charcoal-muted font-medium">{item.participantEmail || 'No email on file'}</div>
                    </td>

                    {/* Dog */}
                    <td className="p-4">
                      <div className="font-bold text-tan-800 text-sm flex items-center gap-1.5">
                        <Dog className="w-3.5 h-3.5 text-tan-600" />
                        <span>{item.dog}</span>
                      </div>
                      <div className="text-[10px] text-charcoal-muted">Treeing Coonhound</div>
                    </td>

                    {/* Event */}
                    <td className="p-4">
                      <div className="font-bold text-forest-900">{item.eventName}</div>
                      <div className="text-[10px] text-charcoal-muted font-medium flex items-center gap-1 mt-0.5">
                        <span>{item.date || 'Upcoming'}</span>
                        <span>•</span>
                        <span>{item.club || 'Oak Ridge Hunting Club'}</span>
                      </div>
                    </td>

                    {/* Interactive Payment Status */}
                    <td className="p-4 text-center">
                      <select
                        value={item.paymentStatus}
                        onChange={(e) => updateEntry(item.id, { paymentStatus: e.target.value })}
                        className={`text-[11px] font-black rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          item.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Paid">● Paid (${item.fee || 35})</option>
                        <option value="Pending">● Pending</option>
                        <option value="Refunded">● Refunded</option>
                      </select>
                    </td>

                    {/* Interactive Attendance Check-in Button */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleCheckIn(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-2xs border transition-all cursor-pointer ${
                          item.checkInStatus === 'Checked In'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                            : 'bg-amber-500 hover:bg-amber-600 text-forest-950 border-amber-600'
                        }`}
                        title="Click to toggle check-in status"
                      >
                        {item.checkInStatus === 'Checked In' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Checked In</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-forest-900" />
                            <span>Not Arrived</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEntryForDetails(item)}
                          title="View Full Entry Details"
                          className="p-1.5 rounded-lg bg-surface-low hover:bg-surface-border text-charcoal hover:text-forest-900 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete entry #${item.id} for ${item.participant}?`)) {
                              deleteEntry(item.id);
                            }
                          }}
                          title="Delete Entry"
                          className="p-1.5 rounded-lg bg-surface-low hover:bg-red-50 text-charcoal hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. ENTRY DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedEntryForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-tan-500 text-forest-950 flex items-center justify-center font-black">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Hunt Registration Details</h3>
                  <p className="text-[10px] text-tan-300 font-mono">Entry #{selectedEntryForDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntryForDetails(null)}
                className="p-1 text-tan-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Event Card */}
              <div className="p-3.5 bg-surface-low rounded-xl border border-surface-border space-y-1">
                <span className="text-[10px] font-black uppercase text-tan-700">Sanctioned Event</span>
                <div className="font-extrabold text-forest-950 text-sm">{selectedEntryForDetails.eventName}</div>
                <div className="text-charcoal-muted text-[11px] flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selectedEntryForDetails.date || 'Upcoming'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {selectedEntryForDetails.club || 'Oak Ridge Hunting Club'}</span>
                </div>
              </div>

              {/* Participant & Dog Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-surface-low rounded-xl border border-surface-border space-y-1">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted">Participant</span>
                  <div className="font-bold text-forest-950">{selectedEntryForDetails.participant}</div>
                  <div className="text-[10px] text-charcoal-muted truncate">{selectedEntryForDetails.participantEmail || 'No email provided'}</div>
                </div>

                <div className="p-3.5 bg-surface-low rounded-xl border border-surface-border space-y-1">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted">Registered Hound</span>
                  <div className="font-bold text-tan-800 flex items-center gap-1">
                    <Dog className="w-3.5 h-3.5 text-tan-600" />
                    <span>{selectedEntryForDetails.dog}</span>
                  </div>
                  <div className="text-[10px] text-charcoal-muted">Treeing Walker Coonhound</div>
                </div>
              </div>

              {/* Payment & Attendance Status Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-surface-low rounded-xl border border-surface-border space-y-2">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted">Payment Status</span>
                  <div>
                    <select
                      value={selectedEntryForDetails.paymentStatus}
                      onChange={(e) => {
                        const newStat = e.target.value;
                        updateEntry(selectedEntryForDetails.id, { paymentStatus: newStat });
                        setSelectedEntryForDetails({ ...selectedEntryForDetails, paymentStatus: newStat });
                      }}
                      className="w-full text-xs font-black rounded-lg px-2.5 py-1.5 bg-surface-lowest border border-surface-border text-forest-950 focus:outline-none"
                    >
                      <option value="Paid">Paid (${selectedEntryForDetails.fee || 35})</option>
                      <option value="Pending">Pending Payment</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-low rounded-xl border border-surface-border space-y-2">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted">Gate Check-in</span>
                  <button
                    onClick={() => {
                      toggleCheckIn(selectedEntryForDetails.id);
                      setSelectedEntryForDetails({
                        ...selectedEntryForDetails,
                        checkInStatus: selectedEntryForDetails.checkInStatus === 'Checked In' ? 'Not Arrived' : 'Checked In'
                      });
                    }}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1.5 ${
                      selectedEntryForDetails.checkInStatus === 'Checked In'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 text-forest-950 hover:bg-amber-600'
                    }`}
                  >
                    {selectedEntryForDetails.checkInStatus === 'Checked In' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Mark Checked In
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="p-3 rounded-xl bg-forest-950 text-white flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tan-400" />
                  <span className="font-bold">Official UHC Sanctioned Entry</span>
                </div>
                <span className="text-tan-400 font-mono text-[10px]">Valid for Hunt Trials</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-low border-t border-surface-border flex justify-end">
              <button
                onClick={() => setSelectedEntryForDetails(null)}
                className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl hover:bg-forest-950 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. REGISTER NEW ENTRY MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-lowest w-full max-w-md rounded-3xl shadow-2xl border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-tan-500 text-forest-950 flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Register New Hunt Entry</h3>
                  <p className="text-[10px] text-tan-300">Add participant to official event roster</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-tan-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              {/* Event Selection */}
              <div>
                <label className="block font-bold text-forest-950 mb-1">Select Sanctioned Event *</label>
                <select
                  value={newEntryForm.eventId}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, eventId: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} ({evt.date || 'Upcoming'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Participant Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Participant Name *</label>
                  <input
                    type="text"
                    required
                    value={newEntryForm.participant}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, participant: e.target.value })}
                    placeholder="e.g. John Hunter"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-950 focus:border-forest-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Participant Email</label>
                  <input
                    type="email"
                    value={newEntryForm.participantEmail}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, participantEmail: e.target.value })}
                    placeholder="john@hunting.org"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-950 focus:border-forest-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dog Call-Name & Breed */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Registered Dog *</label>
                  <input
                    type="text"
                    required
                    value={newEntryForm.dog}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, dog: e.target.value })}
                    placeholder="e.g. Ranger"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-tan-800 focus:border-forest-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Hound Breed</label>
                  <select
                    value={newEntryForm.dogBreed}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, dogBreed: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-950 focus:border-forest-800 focus:outline-none"
                  >
                    <option value="Treeing Walker Coonhound">Treeing Walker Coonhound</option>
                    <option value="English Redtick Coonhound">English Redtick Coonhound</option>
                    <option value="Bluetick Coonhound">Bluetick Coonhound</option>
                    <option value="Black & Tan Coonhound">Black & Tan Coonhound</option>
                    <option value="Plott Hound">Plott Hound</option>
                  </select>
                </div>
              </div>

              {/* Entry Fee & Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newEntryForm.fee}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, fee: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Payment Status</label>
                  <select
                    value={newEntryForm.paymentStatus}
                    onChange={(e) => setNewEntryForm({ ...newEntryForm, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              {/* Check-In Status */}
              <div>
                <label className="block font-bold text-forest-950 mb-1">Initial Check-In Status</label>
                <select
                  value={newEntryForm.checkInStatus}
                  onChange={(e) => setNewEntryForm({ ...newEntryForm, checkInStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:border-forest-800 focus:outline-none"
                >
                  <option value="Not Arrived">Not Arrived</option>
                  <option value="Checked In">Checked In</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-surface-low text-charcoal font-bold text-xs rounded-xl hover:bg-surface-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-900 text-white font-extrabold text-xs rounded-xl hover:bg-forest-950 transition-colors shadow cursor-pointer"
                >
                  Confirm & Register Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
