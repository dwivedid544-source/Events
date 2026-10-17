import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Trophy, Save, Clock, Users, ShieldAlert } from 'lucide-react';

export const EventDetailsConfigPage = () => {
  const { events = [], updateEvent, showToast } = useApp();
  const currentEvt = events[0] || {
    id: 'evt-1',
    name: 'Nite Hunt & Treeing Contest',
    type: 'Nite Hunt',
    club: 'Oak Ridge Hunting Club',
    state: 'Tennessee',
    city: 'Knoxville',
    date: 'September 19, 2026',
    startTime: '7:00 PM',
    deadline: 'Sep 18, 2026',
    fee: 30,
    maxCapacity: 50,
    address: '1420 Hunting Ridge Rd, Knoxville, TN 37901',
    description: 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds.'
  };

  const [formData, setFormData] = useState(currentEvt);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateEvent) {
      updateEvent(formData.id || 'evt-1', formData);
    } else {
      showToast(`Updated configuration for event: "${formData.name}"`, 'success');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Event Configuration & Details</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Manage trial rules, location address, check-in deadlines, and capacity limits</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-tan-600" /> Trial Overview & Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Event Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-bold text-forest-900"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Competition Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              >
                <option value="Nite Hunt">Nite Hunt</option>
                <option value="Championship Hunt">Championship Hunt</option>
                <option value="Water Race">Water Race</option>
                <option value="Bench Show">Bench Show</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-tan-600" /> Date, Deadlines & Capacity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Event Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Bench Deadline</label>
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Max Dog Capacity</label>
              <input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-tan-600" /> Grounds & Clubhouse Address
          </h3>
          <div>
            <label className="block font-bold text-charcoal mb-1">Full Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-charcoal mb-1">Official Contest Description & Special Rules</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Event Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
