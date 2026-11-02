import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { MapPin, Building2, Users, Calendar, DollarSign, ExternalLink, Globe, Plus, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NationalAdminStates = () => {
  const { states = [], addState } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    adminName: '',
    organizations: 'UKC,PKC',
    clubsCount: '0',
    membersCount: '0',
    revenue: '0'
  });
  const [formError, setFormError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleCreateState = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('Please enter both State Name and 2-Letter State Code.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (addState) {
        await addState({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          adminName: formData.adminName.trim() || 'Assigned State Director',
          organizations: formData.organizations.split(',').map((o) => o.trim()).filter(Boolean),
          clubsCount: Number(formData.clubsCount) || 0,
          membersCount: Number(formData.membersCount) || 0,
          revenue: Number(formData.revenue) || 0,
        });
      }
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        adminName: '',
        organizations: 'UKC,PKC',
        clubsCount: '0',
        membersCount: '0',
        revenue: '0'
      });
    } catch (err) {
      setFormError(err.message || 'Failed to save state. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Add New State Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-tan-600 hover:bg-tan-700 text-forest-950 font-black text-xs rounded-xl shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add New State</span>
          </button>

          <Link
            to="/states"
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Globe className="w-4 h-4 text-tan-400" />
            <span>Public Directory View</span>
          </Link>
        </div>
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

      {/* Add New State Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-forest-950 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-tan-400" />
                <h3 className="font-extrabold text-base text-white">Add New State Association</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateState} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    State Association Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ohio State Association"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    maxLength={2}
                    placeholder="e.g. OH"
                    required
                    className="w-full px-3 py-2 text-xs uppercase font-extrabold rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 block">
                  State Director / Assigned Administrator
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder="e.g. Mark Jenkins"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 block">
                  Sanctioning Bodies (Comma-separated)
                </label>
                <input
                  type="text"
                  name="organizations"
                  value={formData.organizations}
                  onChange={handleInputChange}
                  placeholder="e.g. UKC, PKC, AKC"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Chartered Clubs
                  </label>
                  <input
                    type="number"
                    name="clubsCount"
                    value={formData.clubsCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Active Members
                  </label>
                  <input
                    type="number"
                    name="membersCount"
                    value={formData.membersCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Revenue ($)
                  </label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-charcoal hover:bg-surface-elevated rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-forest-800 hover:bg-forest-900 rounded-xl shadow-xs transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving State...</span>
                    </>
                  ) : (
                    <span>Save State to Database</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
