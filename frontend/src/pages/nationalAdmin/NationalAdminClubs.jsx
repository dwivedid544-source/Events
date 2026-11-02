import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Building2, Users, Calendar, Trophy, MapPin, Plus, X, ShieldCheck } from 'lucide-react';

export const NationalAdminClubs = () => {
  const { clubs = [], states = [], addClub } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: states[0]?.name || 'Tennessee',
    stateCode: states[0]?.code || 'TN',
    county: '',
    zip: '',
    dogType: 'Coonhounds',
    federation: 'UKC',
    eventType: 'Nite Hunt',
    adminName: '',
    membersCount: '15',
    eventsCount: '2'
  });
  const [formError, setFormError] = useState('');

  const formattedClubs = clubs.map((c) => ({
    ...c,
    status: c.status || 'Active',
  }));

  // Aggregate National Club KPIs
  const totalClubs = formattedClubs.length;
  const totalMembers = formattedClubs.reduce((acc, c) => acc + (Number(c.membersCount) || 0), 0);
  const totalEvents = formattedClubs.reduce((acc, c) => acc + (Number(c.eventsCount) || 0), 0);
  const totalEntries = formattedClubs.reduce((acc, c) => acc + (Number(c.entriesCount) || 0), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      const selected = states.find((s) => s.name === value || s.code === value);
      setFormData((prev) => ({
        ...prev,
        state: selected ? selected.name : value,
        stateCode: selected ? selected.code : 'TN'
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormError('');
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.state.trim()) {
      setFormError('Please enter Club Name, City, and State.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (addClub) {
        await addClub({
          name: formData.name.trim(),
          city: formData.city.trim(),
          county: formData.county.trim() || `${formData.city.trim()} County`,
          state: formData.state.trim(),
          stateCode: formData.stateCode.trim().toUpperCase(),
          zip: formData.zip.trim() || '37701',
          dogType: formData.dogType,
          federation: formData.federation,
          eventType: formData.eventType,
          adminName: formData.adminName.trim() || 'Assigned Club Administrator',
          membersCount: Number(formData.membersCount) || 15,
          eventsCount: Number(formData.eventsCount) || 2,
        });
      }
      setIsModalOpen(false);
      setFormData({
        name: '',
        city: '',
        state: states[0]?.name || 'Tennessee',
        stateCode: states[0]?.code || 'TN',
        county: '',
        zip: '',
        dogType: 'Coonhounds',
        federation: 'UKC',
        eventType: 'Nite Hunt',
        adminName: '',
        membersCount: '15',
        eventsCount: '2'
      });
    } catch (err) {
      setFormError(err.message || 'Failed to save club. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        {/* Add New Club Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-tan-600 hover:bg-tan-700 text-forest-950 font-black text-xs rounded-xl shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add New Club</span>
        </button>
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
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Members</span>
            <strong className="text-lg font-black text-forest-950">{totalMembers.toLocaleString()}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Events</span>
            <strong className="text-lg font-black text-forest-950">{totalEvents}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-charcoal-muted uppercase block leading-tight">Total Entries</span>
            <strong className="text-lg font-black text-forest-950">{totalEntries.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Clubs Table */}
      <DataTable
        columns={columns}
        data={formattedClubs}
        searchPlaceholder="Search clubs by name, city, or state..."
        filterField="status"
        filterOptions={['Active']}
      />

      {/* Add New Club Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-forest-950 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-tan-400" />
                <h3 className="font-extrabold text-base text-white">Add New Chartered Club</h3>
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
            <form onSubmit={handleCreateClub} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 block">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Oak Ridge Hunting Club"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Knoxville"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    State Association <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  >
                    {states.map((s) => (
                      <option key={s.id || s.code} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    County
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    placeholder="e.g. Anderson County"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="e.g. 37701"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Hound Sport / Breed
                  </label>
                  <select
                    name="dogType"
                    value={formData.dogType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  >
                    <option value="Coonhounds">Coonhounds</option>
                    <option value="Beagles">Beagles</option>
                    <option value="Foxhounds">Foxhounds</option>
                    <option value="Bird Dogs">Bird Dogs</option>
                    <option value="All Breeds">All Breeds</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Federation
                  </label>
                  <select
                    name="federation"
                    value={formData.federation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  >
                    <option value="UKC">UKC</option>
                    <option value="PKC">PKC</option>
                    <option value="AKC">AKC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                  >
                    <option value="Nite Hunt">Nite Hunt</option>
                    <option value="Treeing Contest">Treeing Contest</option>
                    <option value="Bench Show">Bench Show</option>
                    <option value="Field Trial">Field Trial</option>
                    <option value="Water Race">Water Race</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-forest-900 block">
                  Club Administrator / Contact Person
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder="e.g. Robert Miller"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-surface-border bg-white focus:outline-hidden focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-forest-900 block">
                    Initial Member Count
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
                    Annual Events
                  </label>
                  <input
                    type="number"
                    name="eventsCount"
                    value={formData.eventsCount}
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
                      <span>Saving Club...</span>
                    </>
                  ) : (
                    <span>Save Club to Database</span>
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
