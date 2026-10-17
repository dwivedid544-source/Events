import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { MapPin, Building2, Users, Calendar, DollarSign, ExternalLink, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NationalAdminStates = () => {
  const { states = [] } = useApp();

  // Normalize state data with default status and clean fields
  const formattedStates = states.map((s) => ({
    ...s,
    status: s.status || 'Active',
    revenueFormatted: `$${Number(s.revenue || 0).toLocaleString()}`,
  }));

  // Aggregate National KPIs
  const totalStates = formattedStates.length;
  const totalClubs = formattedStates.reduce((acc, s) => acc + (Number(s.clubsCount) || 0), 0);
  const totalMembers = formattedStates.reduce((acc, s) => acc + (Number(s.membersCount) || 0), 0);
  const totalRevenue = formattedStates.reduce((acc, s) => acc + (Number(s.revenue) || 0), 0);

  const columns = [
    {
      header: 'State Association',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 font-black text-xs flex items-center justify-center border border-surface-border shrink-0 shadow-xs">
            {r.code}
          </div>
          <div>
            <span className="font-extrabold text-forest-900 block leading-tight">{r.name}</span>
            <span className="text-[11px] text-charcoal-muted font-medium">State Code: {r.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Sanctioning Bodies',
      accessor: 'organizations',
      render: (r) => {
        const orgs = Array.isArray(r.organizations)
          ? r.organizations
          : r.organizations
          ? [r.organizations]
          : ['UKC'];
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {orgs.map((org) => (
              <span
                key={org}
                className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-forest-950/10 text-forest-950 border border-forest-900/20"
              >
                {org}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: 'State Director',
      accessor: 'adminName',
      render: (r) => <span className="font-semibold text-charcoal">{r.adminName || 'Assigned Director'}</span>,
    },
    {
      header: 'Chartered Clubs',
      accessor: 'clubsCount',
      render: (r) => <span className="font-extrabold text-forest-900">{r.clubsCount || 0}</span>,
    },
    {
      header: 'Active Members',
      accessor: 'membersCount',
      render: (r) => <span className="font-semibold">{Number(r.membersCount || 0).toLocaleString()}</span>,
    },
    {
      header: 'Annual Events',
      accessor: 'eventsCount',
      render: (r) => <span>{r.eventsCount || 0}</span>,
    },
    {
      header: 'State Revenue',
      accessor: 'revenue',
      render: (r) => (
        <span className="font-extrabold text-emerald-800">
          ${Number(r.revenue || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      isStatus: true,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (r) => (
        <Link
          to={`/states/${r.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-forest-900 bg-forest-900/10 hover:bg-forest-900 hover:text-white transition-all"
          title={`View ${r.name} Portal`}
        >
          <span>Portal</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500/20 text-tan-900 border border-tan-500/40">
              National Management
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">
            National Charter States Directory
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Assigned Scope: Nationwide UHC Network ({totalStates} State Associations)
          </p>
        </div>

        <Link
          to="/states"
          className="inline-flex items-center gap-2 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Globe className="w-4 h-4 text-tan-400" />
          <span>Public Directory View</span>
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-800 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total States</span>
            <strong className="text-lg font-black text-forest-950">{totalStates}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-900 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Chartered Clubs</span>
            <strong className="text-lg font-black text-forest-950">{totalClubs}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Members</span>
            <strong className="text-lg font-black text-forest-950">{totalMembers.toLocaleString()}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Revenue</span>
            <strong className="text-lg font-black text-forest-950">${totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* States Table */}
      <DataTable
        columns={columns}
        data={formattedStates}
        searchPlaceholder="Search states by name, code, or director..."
        filterField="status"
        filterOptions={['Active']}
      />
    </div>
  );
};
