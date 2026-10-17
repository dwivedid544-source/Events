import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Calendar, ClipboardList, CheckCircle, DollarSign, UserCheck, Plus, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventAdminDashboard = () => {
  const { events, entries } = useApp();
  const myEvent = events[0] || {}; // Nite Hunt

  const checkedInCount = entries.filter((e) => e.checkInStatus === 'Checked In').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-forest-800 text-white rounded-xl p-6 lg:p-8 shadow-ambient flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-400">Assigned Scope: Event Operation</span>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">{myEvent.name}</h1>
          <p className="text-xs text-tan-200 mt-1">{myEvent.date} @ {myEvent.startTime} • {myEvent.club} ({myEvent.city}, {myEvent.state})</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/event-admin/attendance" className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Mobile Check-In
          </Link>
          <Link to="/event-admin/results" className="px-3.5 py-2 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-lg border border-forest-700">
            Post Results
          </Link>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Entries" value={myEvent.entries ? myEvent.entries.toString() : '43'} subtext="Capacity 50" icon={ClipboardList} />
        <StatCard title="Paid Entries" value={myEvent.paidEntries ? myEvent.paidEntries.toString() : '39'} subtext="4 Pending Payment" icon={DollarSign} />
        <StatCard title="Pending Entries" value={myEvent.pendingEntries ? myEvent.pendingEntries.toString() : '4'} subtext="Unconfirmed" icon={Calendar} />
        <StatCard title="Checked-In" value={checkedInCount.toString()} subtext="Event-Day Attendees" icon={CheckCircle} trend="Live Status" />
      </div>

      {/* Attendance Quick Mobile Card Preview */}
      <div className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-forest-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-tan-500" /> Event-Day Attendance Quick Check-In
          </h3>
          <Link to="/event-admin/attendance" className="text-xs font-bold text-forest-800 hover:underline">
            Open Full Mobile Screen
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entries.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 rounded-xl border bg-surface-low space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-charcoal">{item.participant}</span>
                <span className="font-mono text-[10px] text-charcoal-light">#{item.id}</span>
              </div>
              <div className="text-tan-800 font-semibold">Dog: {item.dog}</div>
              <div className="pt-2 border-t flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${item.checkInStatus === 'Checked In' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {item.checkInStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
