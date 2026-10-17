import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserCheck, CheckCircle2, XCircle, SlidersHorizontal } from 'lucide-react';

export const EventAdminAttendance = () => {
  const { entries, toggleCheckIn } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('ALL');

  const filtered = entries.filter((item) => {
    if (filterMode === 'CHECKED_IN' && item.checkInStatus !== 'Checked In') return false;
    if (filterMode === 'NOT_ARRIVED' && item.checkInStatus === 'Checked In') return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.participant.toLowerCase().includes(q) ||
      item.dog.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
    );
  });

  const checkedInCount = entries.filter((e) => e.checkInStatus === 'Checked In').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mobile Optimized Header */}
      <div className="bg-forest-800 text-white rounded-xl p-5 shadow-ambient flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-tan-400">Mobile Event Operations</span>
          <h1 className="text-xl lg:text-2xl font-extrabold">Trial Attendance & Check-In</h1>
          <p className="text-xs text-tan-200 mt-0.5">Nite Hunt & Treeing Contest • Sep 19, 2026</p>
        </div>
        <div className="bg-forest-900 px-4 py-2 rounded-xl text-center border border-forest-700">
          <span className="block text-xl font-black text-tan-400">{checkedInCount}/{entries.length}</span>
          <span className="text-[9px] uppercase font-bold text-white/80">Checked In</span>
        </div>
      </div>

      {/* Touch-Friendly Search & Filter */}
      <div className="bg-surface-lowest p-3 rounded-xl border shadow-ambient space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by participant name, dog, or entry #..."
            className="w-full pl-10 pr-3 py-3 text-sm bg-surface-low border rounded-lg focus:border-forest-800 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`flex-1 py-2 text-xs font-bold rounded-md ${
              filterMode === 'ALL' ? 'bg-forest-800 text-white' : 'bg-surface-low text-charcoal'
            }`}
          >
            All ({entries.length})
          </button>
          <button
            onClick={() => setFilterMode('NOT_ARRIVED')}
            className={`flex-1 py-2 text-xs font-bold rounded-md ${
              filterMode === 'NOT_ARRIVED' ? 'bg-forest-800 text-white' : 'bg-surface-low text-charcoal'
            }`}
          >
            Not Arrived ({entries.length - checkedInCount})
          </button>
          <button
            onClick={() => setFilterMode('CHECKED_IN')}
            className={`flex-1 py-2 text-xs font-bold rounded-md ${
              filterMode === 'CHECKED_IN' ? 'bg-forest-800 text-white' : 'bg-surface-low text-charcoal'
            }`}
          >
            Checked In ({checkedInCount})
          </button>
        </div>
      </div>

      {/* Participant Check-In Cards (Touch Target Optimized) */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border shadow-ambient transition-all flex items-center justify-between gap-4 ${
              item.checkInStatus === 'Checked In'
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-surface-lowest border-surface-border'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-forest-800">#{item.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tan-100 text-tan-900 border">
                  {item.paymentStatus}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-charcoal">{item.participant}</h3>
              <div className="text-xs text-tan-800 font-bold">Dog: {item.dog}</div>
            </div>

            <button
              onClick={() => toggleCheckIn(item.id)}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                item.checkInStatus === 'Checked In'
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-tan-500 text-forest-950 hover:bg-tan-600'
              }`}
            >
              {item.checkInStatus === 'Checked In' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Checked In</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  <span>Check In</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
