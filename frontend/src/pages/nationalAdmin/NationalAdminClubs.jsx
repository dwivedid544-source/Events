import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Building2, Users, Calendar, Trophy, MapPin } from 'lucide-react';

export const NationalAdminClubs = () => {
  const { clubs = [] } = useApp();

  const formattedClubs = clubs.map((c) => ({
    ...c,
    status: c.status || 'Active',
  }));

  // Aggregate National Club KPIs
  const totalClubs = formattedClubs.length;
  const totalMembers = formattedClubs.reduce((acc, c) => acc + (Number(c.membersCount) || 0), 0);
  const totalEvents = formattedClubs.reduce((acc, c) => acc + (Number(c.eventsCount) || 0), 0);
  const totalEntries = formattedClubs.reduce((acc, c) => acc + (Number(c.entriesCount) || 0), 0);

  const columns = [
    {
      header: 'Club Name',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tan-500/15 text-forest-900 font-black text-xs flex items-center justify-center border border-tan-500/30 shrink-0">
            <Building2 className="w-4 h-4 text-forest-800" />
          </div>
          <div>
            <span className="font-extrabold text-forest-900 block leading-tight">{r.name}</span>
            <span className="text-[11px] text-charcoal-muted font-medium">
              {r.federation || 'UHC Chartered'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'City',
      accessor: 'city',
      render: (r) => <span className="font-medium text-charcoal">{r.city}</span>,
    },
    {
      header: 'State',
      accessor: 'state',
      render: (r) => (
        <span className="inline-flex items-center gap-1 font-semibold text-forest-900">
          <MapPin className="w-3 h-3 text-tan-600" />
          <span>{r.state}</span>
        </span>
      ),
    },
    {
      header: 'Active Members',
      accessor: 'membersCount',
      render: (r) => <span className="font-bold text-forest-950">{r.membersCount}</span>,
    },
    {
      header: 'Annual Events',
      accessor: 'eventsCount',
      render: (r) => <span>{r.eventsCount}</span>,
    },
    {
      header: 'Club Administrator',
      accessor: 'adminName',
      render: (r) => <span className="font-medium text-charcoal">{r.adminName || 'Not Assigned'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      isStatus: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500/20 text-tan-900 border border-tan-500/40">
            National Directory
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">
          National Chartered Clubs Directory
        </h1>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Assigned Scope: Nationwide UHC Network ({totalClubs} Affiliated Clubs)
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-800 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Clubs</span>
            <strong className="text-lg font-black text-forest-950">{totalClubs}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-900 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Active Members</span>
            <strong className="text-lg font-black text-forest-950">{totalMembers}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Annual Events</span>
            <strong className="text-lg font-black text-forest-950">{totalEvents}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Entries</span>
            <strong className="text-lg font-black text-forest-950">{totalEntries}</strong>
          </div>
        </div>
      </div>

      {/* Clubs Table */}
      <DataTable
        columns={columns}
        data={formattedClubs}
        searchPlaceholder="Search nationwide clubs by name, city, state..."
        filterField="status"
        filterOptions={['Active']}
      />
    </div>
  );
};
