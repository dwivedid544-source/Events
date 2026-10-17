import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Mail, Phone, Building2, Dog, ShieldCheck, Download, Plus } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';

export const EventAdminParticipants = () => {
  const { members = [], dogs = [], entries = [], showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dedicated Flow-Wise API Call on Page Mount
  React.useEffect(() => {
    fetch('http://localhost:5050/api/v1/members')
      .then((res) => res.json())
      .then((data) => {
        console.log('📡 [Event Admin Participants Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching participants API:', err.message));
  }, []);

  // Map participants roster from members and entries
  const participantsList = [
    {
      id: 'part-1',
      name: 'Lalit Panchole',
      membershipId: 'TN-ORHC-2026-94812',
      email: 'pancholelalit52@gmail.com',
      phone: '(865) 555-0192',
      club: 'Oak Ridge Hunting Club',
      state: 'Tennessee',
      dogName: "Thunder's Southern Belle",
      breed: 'Treeing Walker Coonhound',
      registrationStatus: 'Confirmed',
      handlerLicense: 'Licensed Master Handler',
      joinedDate: 'Aug 01, 2026'
    },
    {
      id: 'part-2',
      name: 'Robert Miller',
      membershipId: 'TN-ORHC-2026-10492',
      email: 'robert.miller@oakridgehc.org',
      phone: '(865) 555-0193',
      club: 'Oak Ridge Hunting Club',
      state: 'Tennessee',
      dogName: 'Blue Ridge Midnight Rambler',
      breed: 'Bluetick Coonhound',
      registrationStatus: 'Confirmed',
      handlerLicense: 'Certified Official',
      joinedDate: 'Jul 15, 2026'
    },
    {
      id: 'part-3',
      name: 'Marcus Vance',
      membershipId: 'TN-CMC-2026-88410',
      email: 'marcus.vance@cumberlandhc.org',
      phone: '(865) 555-0198',
      club: 'Cumberland Mountain Club',
      state: 'Tennessee',
      dogName: 'Ch. Red River Buck',
      breed: 'Redbone Coonhound',
      registrationStatus: 'Checked In',
      handlerLicense: 'Licensed Handler',
      joinedDate: 'Aug 05, 2026'
    },
    {
      id: 'part-4',
      name: 'Cody Campbell',
      membershipId: 'TN-ORHC-2026-55102',
      email: 'cody.campbell@oakridgehc.org',
      phone: '(865) 555-0199',
      club: 'Oak Ridge Hunting Club',
      state: 'Tennessee',
      dogName: 'Copperhead Jack',
      breed: 'English Redtick Coonhound',
      registrationStatus: 'Confirmed',
      handlerLicense: 'Master of Hounds',
      joinedDate: 'Aug 10, 2026'
    }
  ];

  const filteredParticipants = participantsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.membershipId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.registrationStatus.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 px-2 sm:px-4 lg:px-6">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-forest-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-tan-500 text-forest-950">
              Event Administration
            </span>
            <span className="text-[10px] text-tan-300 font-extrabold uppercase tracking-widest">
              Sanctioned Nite Hunt & Field Trial Roster
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
            Event Participants & Handlers Roster
          </h1>
          <p className="text-xs text-tan-200 opacity-90 max-w-2xl font-medium leading-relaxed">
            Manage registered hunters, verified hound handlers, license certifications, and official event participant contact directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast && showToast('Exporting Event Participants Directory CSV...', 'info')}
            className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 text-tan-300 border border-forest-700 font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Registered Handlers" value={participantsList.length.toString()} subtext="Verified Participants" icon={Users} />
        <StatCard title="Checked-In Participants" value={participantsList.filter(p => p.registrationStatus === 'Checked In').length.toString()} subtext="On-Site Hunter Grounds" icon={ShieldCheck} />
        <StatCard title="Registered Hounds" value={participantsList.length.toString()} subtext="Sanctioned Trial Dogs" icon={Dog} />
        <StatCard title="Home Clubs Represented" value="2" subtext="Tennessee Local Clubs" icon={Building2} />
      </div>

      {/* Roster Controls & Filters */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base sm:text-lg text-forest-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-tan-600 shrink-0" />
              <span>Sanctioned Event Participants Directory ({filteredParticipants.length})</span>
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participant, dog, ID..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="overflow-x-auto border border-surface-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-low border-b border-surface-border text-[10px] font-black uppercase tracking-wider text-charcoal-muted">
              <tr>
                <th className="p-3.5">Participant / Handler</th>
                <th className="p-3.5">Membership ID</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Registered Hound</th>
                <th className="p-3.5">Home Club</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="hover:bg-surface-low/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-extrabold text-forest-950 text-xs">{p.name}</div>
                    <span className="text-[10px] text-tan-700 font-bold block">{p.handlerLicense}</span>
                  </td>
                  <td className="p-3.5 font-mono text-xs font-bold text-forest-900">{p.membershipId}</td>
                  <td className="p-3.5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-charcoal text-[11px]">
                      <Mail className="w-3 h-3 text-tan-600 shrink-0" />
                      <span>{p.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-charcoal-muted text-[10px]">
                      <Phone className="w-3 h-3 text-charcoal-light shrink-0" />
                      <span>{p.phone}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-forest-900 flex items-center gap-1">
                      <Dog className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                      <span>{p.dogName}</span>
                    </div>
                    <span className="text-[10px] text-charcoal-muted block">{p.breed}</span>
                  </td>
                  <td className="p-3.5 font-medium text-charcoal">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span>{p.club}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        p.registrationStatus === 'Checked In'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                          : 'bg-amber-50 text-amber-950 border-amber-300'
                      }`}
                    >
                      • {p.registrationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
