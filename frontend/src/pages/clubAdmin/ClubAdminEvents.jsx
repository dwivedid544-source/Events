import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Plus } from 'lucide-react';

export const ClubAdminEvents = () => {
  const { events, createEvent } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Nite Hunt',
    date: 'October 15, 2026',
    startTime: '7:00 PM',
    fee: 30,
    maxCapacity: 50,
    address: '1420 Hunting Ridge Rd, Knoxville, TN'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createEvent(formData);
    setModalOpen(false);
  };

  const columns = [
    { header: 'Event Name', accessor: 'name', render: (r) => <span className="font-extrabold text-forest-800">{r.name}</span> },
    { header: 'Type', accessor: 'type' },
    { header: 'Date', accessor: 'date' },
    { header: 'Location', accessor: 'city' },
    { header: 'Entries', accessor: 'entries', render: (r) => <span>{r.entries} / {r.maxCapacity}</span> },
    { header: 'Status', accessor: 'status', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Club Events Management</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Manage sanctioned trials, registrations, and publication</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        searchPlaceholder="Search events..."
        filterField="status"
        filterOptions={['Registration Open', 'Upcoming', 'Completed']}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Sanctioned Event">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Event Title</label>
            <input type="text" required placeholder="e.g. Fall Championship Hunt" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1">Event Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full p-2 bg-surface-low border rounded font-medium">
                <option value="Nite Hunt">Nite Hunt</option>
                <option value="Championship Hunt">Championship Hunt</option>
                <option value="Water Race">Water Race</option>
                <option value="Youth Hunt">Youth Hunt</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Entry Fee ($)</label>
              <input type="number" required value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-forest-800 text-white font-bold rounded">Publish Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
