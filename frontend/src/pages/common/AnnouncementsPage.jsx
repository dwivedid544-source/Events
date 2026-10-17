import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Megaphone, Plus, Bell, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AnnouncementsPage = ({ defaultScope = 'Club' }) => {
  const { announcements = [], addAnnouncement, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'High',
    scope: defaultScope,
    club: currentUser?.club || 'Oak Ridge Hunting Club'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addAnnouncement(formData);
    setModalOpen(false);
    setFormData({ title: '', message: '', priority: 'High', scope: defaultScope, club: currentUser?.club || 'Oak Ridge Hunting Club' });
  };

  const getPriorityBadge = (p) => {
    switch (p?.toUpperCase()) {
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-900 border border-red-300">Urgent</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">Important</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">Notice</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Official Bulletins & Announcements</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Broadcast urgent notices, schedule updates, and alerts to members</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Post New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((anc) => (
          <div key={anc.id} className="bg-surface-lowest p-6 rounded-xl border border-surface-border shadow-ambient space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-tan-600" />
                <h3 className="font-extrabold text-base text-forest-800">{anc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(anc.priority)}
                <span className="text-[11px] text-charcoal-muted font-semibold">{anc.date}</span>
              </div>
            </div>

            <p className="text-xs text-charcoal font-medium leading-relaxed">{anc.message}</p>

            <div className="pt-2 border-t flex justify-between items-center text-[11px] text-charcoal-light">
              <span>Scope: <strong className="font-semibold text-forest-800">{anc.scope || 'Club'} Level</strong></span>
              <span>Issued By: <strong className="font-semibold text-charcoal">{anc.club}</strong></span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Broadcast Announcement">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal mb-1">Announcement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Weather Alert & Hunt Delay Notice"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            >
              <option value="High">Urgent (Red Badge)</option>
              <option value="Medium">Important (Amber Badge)</option>
              <option value="Normal">Normal Notice (Blue Badge)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Announcement Message</label>
            <textarea
              rows={4}
              required
              placeholder="Write complete notice instructions..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-charcoal font-bold hover:bg-surface-low rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
