import React, { useState, useMemo } from 'react';
import { useApp , API_BASE_URL} from '../../context/AppContext';
import {
  Users,
  Search,
  Mail,
  Phone,
  Building2,
  Dog,
  ShieldCheck,
  Download,
  Filter,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Calendar,
  Award
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';

export const EventAdminParticipants = () => {
  const { members = [], dogs = [], entries = [], showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, CHECKED_IN, CONFIRMED
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Dedicated Flow-Wise API Call on Page Mount
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/members`)
      .then((res) => res.json())
      .then((data) => {
        console.log('📡 [Event Admin Participants Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching participants API:', err.message));
  }, []);

  // Map participants roster dynamically combining base handlers with trial entries
  const participantsList = useMemo(() => {
    const baseList = [
      {
        id: 'part-1',
        name: 'Lalit Panchole',
        membershipId: 'TN-ORHC-2026-94812',
        email: 'demo@example.com',
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

    // Merge in any dynamic entries from AppContext (e.g., Travis Kelce, James Wadley, or walk-ups)
    const combined = [...baseList];
    const existingEmails = new Set(combined.map((p) => p.email.toLowerCase()));

    entries.forEach((e, idx) => {
      const email = (e.participantEmail || `${e.participant?.toLowerCase().replace(/\s+/g, '') || 'hunter'}@nationalhound.org`).toLowerCase();
      const existing = combined.find((p) => p.email.toLowerCase() === email || p.name.toLowerCase() === (e.participant || '').toLowerCase());
      
      if (existing) {
        // Keep registration status in sync with trial entries check-in
        if (e.checkInStatus === 'Checked In') {
          existing.registrationStatus = 'Checked In';
        }
      } else {
        combined.push({
          id: `entry-part-${e.id || idx}`,
          name: e.participant || 'Registered Competitor',
          membershipId: `TN-UHC-2026-${10000 + idx * 77}`,
          email: email,
          phone: e.participantPhone || '(865) 555-0192',
          club: e.club || 'Oak Ridge Hunting Club',
          state: 'Tennessee',
          dogName: e.dog || 'Trial Hound',
          breed: e.breed || 'Treeing Walker Coonhound',
          registrationStatus: e.checkInStatus === 'Checked In' ? 'Checked In' : 'Confirmed',
          handlerLicense: 'Sanctioned Field Handler',
          joinedDate: 'Sep 01, 2026'
        });
        existingEmails.add(email);
      }
    });

    return combined;
  }, [entries]);

  const filteredParticipants = participantsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.membershipId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CHECKED_IN' && p.registrationStatus === 'Checked In') ||
      (statusFilter === 'CONFIRMED' && p.registrationStatus === 'Confirmed');

    return matchesSearch && matchesStatus;
  });

  // Real, Cross-Browser Working CSV Download Handler using Blob
  const handleExportCSV = () => {
    if (!filteredParticipants || filteredParticipants.length === 0) {
      if (showToast) showToast('No participants available to export', 'info');
      return;
    }

    const headers = [
      'Participant / Handler',
      'Handler License',
      'Membership ID',
      'Email',
      'Phone',
      'Registered Hound',
      'Hound Breed',
      'Home Club',
      'State Association',
      'Registration Status',
      'Joined Date'
    ];

    const rows = filteredParticipants.map((p) => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.handlerLicense || '').replace(/"/g, '""')}"`,
      `"${(p.membershipId || '').replace(/"/g, '""')}"`,
      `"${(p.email || '').replace(/"/g, '""')}"`,
      `"${(p.phone || '').replace(/"/g, '""')}"`,
      `"${(p.dogName || '').replace(/"/g, '""')}"`,
      `"${(p.breed || '').replace(/"/g, '""')}"`,
      `"${(p.club || '').replace(/"/g, '""')}"`,
      `"${(p.state || '').replace(/"/g, '""')}"`,
      `"${(p.registrationStatus || '').replace(/"/g, '""')}"`,
      `"${(p.joinedDate || '').replace(/"/g, '""')}"`
    ]);

    // Construct valid UTF-8 CSV with CRLF line endings
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `event_participants_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) {
      showToast(`Exported ${filteredParticipants.length} participants to CSV successfully!`, 'success');
    }
  };

  const checkedInCount = participantsList.filter((p) => p.registrationStatus === 'Checked In').length;

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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            id="export-participants-csv-btn"
            title="Download CSV roster of all filtered participants"
            className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 text-tan-300 hover:text-white border border-forest-700 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-tan-400" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Handlers"
          value={participantsList.length.toString()}
          subtext="Verified Participants"
          icon={Users}
        />
        <StatCard
          title="Checked-In Participants"
          value={checkedInCount.toString()}
          subtext="On-Site Hunter Grounds"
          icon={ShieldCheck}
        />
        <StatCard
          title="Registered Hounds"
          value={participantsList.length.toString()}
          subtext="Sanctioned Trial Dogs"
          icon={Dog}
        />
        <StatCard
          title="Home Clubs Represented"
          value="2"
          subtext="Tennessee Local Clubs"
          icon={Building2}
        />
      </div>

      {/* Roster Controls & Filters */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base sm:text-lg text-forest-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-tan-600 shrink-0" />
              <span>Sanctioned Event Participants Directory ({filteredParticipants.length})</span>
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-surface-low p-1 rounded-xl border border-surface-border">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-charcoal hover:text-forest-900'
                }`}
              >
                All ({participantsList.length})
              </button>
              <button
                onClick={() => setStatusFilter('CHECKED_IN')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === 'CHECKED_IN'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-charcoal hover:text-emerald-800'
                }`}
              >
                Checked In ({checkedInCount})
              </button>
              <button
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === 'CONFIRMED'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-charcoal hover:text-amber-800'
                }`}
              >
                Confirmed ({participantsList.length - checkedInCount})
              </button>
            </div>

            {/* Search Input */}
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
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-charcoal-muted">
                    No participants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p) => (
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
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedParticipant(p)}
                        className="p-1.5 text-charcoal-muted hover:text-forest-900 hover:bg-forest-50 rounded-lg transition-colors cursor-pointer"
                        title="View Handler Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handler Dossier Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-tan-700 tracking-wider">
                  Participant Dossier
                </span>
                <h3 className="text-xl font-black text-forest-950">{selectedParticipant.name}</h3>
                <p className="text-xs text-charcoal-muted font-mono">{selectedParticipant.membershipId}</p>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-1.5 rounded-lg hover:bg-surface-low text-charcoal-muted hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-low rounded-xl border border-surface-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted">Handler License</span>
                <p className="font-extrabold text-forest-900">{selectedParticipant.handlerLicense}</p>
              </div>
              <div className="p-3 bg-surface-low rounded-xl border border-surface-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted">Registration Status</span>
                <p className="font-extrabold text-emerald-800">{selectedParticipant.registrationStatus}</p>
              </div>
              <div className="p-3 bg-surface-low rounded-xl border border-surface-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted">Registered Hound</span>
                <p className="font-extrabold text-forest-950">{selectedParticipant.dogName}</p>
                <p className="text-[10px] text-charcoal-muted">{selectedParticipant.breed}</p>
              </div>
              <div className="p-3 bg-surface-low rounded-xl border border-surface-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted">Home Club</span>
                <p className="font-extrabold text-forest-950">{selectedParticipant.club}</p>
                <p className="text-[10px] text-charcoal-muted">{selectedParticipant.state}</p>
              </div>
            </div>

            <div className="p-3.5 bg-forest-900/5 rounded-xl border border-forest-900/10 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted">Direct Contact</span>
              <div className="flex items-center gap-2 text-forest-950 font-medium">
                <Mail className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                <span>{selectedParticipant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal font-medium">
                <Phone className="w-3.5 h-3.5 text-charcoal-light shrink-0" />
                <span>{selectedParticipant.phone}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="px-4 py-2 bg-surface-low hover:bg-surface-border text-charcoal font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

