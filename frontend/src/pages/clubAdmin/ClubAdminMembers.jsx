import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Plus } from 'lucide-react';

export const ClubAdminMembers = () => {
  const { members, registerMembership, updateMemberStatus, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'NATIONAL_ADMIN';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipType: 'Individual Membership'
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    registerMembership(formData);
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Member Name',
      accessor: 'name',
      render: (r) => (
        <div>
          <span className="font-extrabold text-forest-800 text-sm">{r.name}</span>
          {r.email && <div className="text-[10px] text-charcoal-muted font-mono">{r.email}</div>}
        </div>
      )
    },
    {
      header: 'Membership ID',
      accessor: 'membershipId',
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-charcoal">{r.membershipId}</span>
          {r.club && <div className="text-[10px] text-charcoal-light">{r.club}</div>}
        </div>
      )
    },
    { header: 'Membership Type', accessor: 'type' },
    { header: 'Joined', accessor: 'joined' },
    { header: 'Expires', accessor: 'expires' },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => {
        const currentStatus = r.status || 'Active';
        const isActive = currentStatus.toLowerCase() === 'active';
        return (
          <select
            value={currentStatus}
            onChange={(e) => updateMemberStatus(r.id, e.target.value)}
            className={`px-2.5 py-1 text-xs font-black rounded-lg border cursor-pointer transition-colors outline-none ${
              isActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
            }`}
          >
            <option value="Active">🟢 Active</option>
            <option value="Inactive">🔴 Inactive</option>
            <option value="Expired">⚪ Expired</option>
          </select>
        );
      }
    },
    {
      header: 'Quick Action',
      accessor: 'id',
      render: (r) => {
        const isActive = (r.status || 'Active').toLowerCase() === 'active';
        return (
          <button
            onClick={() => updateMemberStatus(r.id, isActive ? 'Inactive' : 'Active')}
            title={isActive ? 'Deactivate this member' : 'Activate this member'}
            className={`px-3 py-1 rounded-md text-xs font-black transition-all shadow-sm ${
              isActive
                ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
        );
      }
    }
  ];

  const activeCount = members.filter((m) => (m.status || 'Active').toLowerCase() === 'active').length;
  const inactiveCount = members.length - activeCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">
              {isSuperAdmin ? 'Platform Members Directory' : 'Club Members Directory'}
            </h1>
            {isSuperAdmin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200">
                Super Admin Control
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isSuperAdmin
              ? 'Super Admin Platform Scope: Manage active/inactive status and credentials for all members across the network'
              : `Assigned Scope: ${currentUser?.scope || 'Oak Ridge Hunting Club'}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-2 mr-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-lg font-bold">
              Active: {activeCount}
            </span>
            <span className="px-2.5 py-1 bg-red-100/80 text-red-900 border border-red-300 rounded-lg font-bold">
              Inactive/Expired: {inactiveCount}
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Member
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={members}
        searchPlaceholder="Search members by name, email, ID, or club..."
        filterField="status"
        filterOptions={['Active', 'Inactive', 'Expired']}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Club Member">
        <form onSubmit={handleAddMember} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1">First Name</label>
              <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Last Name</label>
              <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div>
            <label className="block font-bold mb-1">Membership Type</label>
            <select value={formData.membershipType} onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })} className="w-full p-2 bg-surface-low border rounded font-medium">
              <option value="Individual Membership">Individual Membership ($45)</option>
              <option value="Family Membership">Family Membership ($70)</option>
              <option value="Youth Membership">Youth Membership ($25)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-forest-800 text-white font-bold rounded">Save Member</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
