import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Plus } from 'lucide-react';

export const ClubAdminMembers = () => {
  const { members, registerMembership } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

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
    { header: 'Member Name', accessor: 'name', render: (r) => <span className="font-extrabold text-forest-800">{r.name}</span> },
    { header: 'Membership ID', accessor: 'membershipId', render: (r) => <span className="font-mono text-xs">{r.membershipId}</span> },
    { header: 'Membership Type', accessor: 'type' },
    { header: 'Joined', accessor: 'joined' },
    { header: 'Expires', accessor: 'expires' },
    { header: 'Status', accessor: 'status', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Club Members Directory</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Assigned Scope: Oak Ridge Hunting Club (84 Members)</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Member
        </button>
      </div>

      <DataTable
        columns={columns}
        data={members}
        searchPlaceholder="Search club members by name or ID..."
        filterField="status"
        filterOptions={['Active', 'Expired']}
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
