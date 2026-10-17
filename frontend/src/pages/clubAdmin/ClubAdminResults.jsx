import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Trophy, Plus } from 'lucide-react';

export const ClubAdminResults = () => {
  const { results, addResult, events } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    eventId: events[0]?.id || '',
    eventName: events[0]?.name || 'Nite Hunt',
    place: 1,
    participant: 'John Walker',
    dog: 'Ranger (Walker)',
    score: '375 Pts'
  });

  const handlePublish = (e) => {
    e.preventDefault();
    addResult(formData);
    setModalOpen(false);
  };

  const columns = [
    { header: 'Place', accessor: 'place', render: (r) => <span className="font-extrabold text-forest-800">#{r.place} Place</span> },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Participant', accessor: 'participant', render: (r) => <span className="font-extrabold">{r.participant}</span> },
    { header: 'Dog', accessor: 'dog', render: (r) => <span className="font-semibold text-tan-800">{r.dog}</span> },
    { header: 'Score', accessor: 'score', render: (r) => <span className="font-black">{r.score}</span> },
    { header: 'Status', accessor: 'status', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Club Competition Results</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Enter and publish official trial placements and scores</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Enter & Publish Result
        </button>
      </div>

      <DataTable
        columns={columns}
        data={results}
        searchPlaceholder="Search results..."
        filterField="status"
        filterOptions={['Published']}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Publish Official Trial Result">
        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Select Event</label>
            <select
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              className="w-full p-2 bg-surface-low border rounded font-medium"
            >
              {events.map((e) => (
                <option key={e.id} value={e.name}>{e.name} ({e.date})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold mb-1">Placement Rank</label>
              <input type="number" min="1" max="10" required value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
            </div>
            <div>
              <label className="block font-bold mb-1">Score / Points</label>
              <input type="text" required placeholder="e.g. 375 Pts" value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Participant / Handler Name</label>
            <input type="text" required value={formData.participant} onChange={(e) => setFormData({ ...formData, participant: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div>
            <label className="block font-bold mb-1">Dog Name & Breed</label>
            <input type="text" required value={formData.dog} onChange={(e) => setFormData({ ...formData, dog: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-forest-800 text-white font-bold rounded">Publish Result</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
