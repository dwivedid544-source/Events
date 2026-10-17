import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Save } from 'lucide-react';

export const ClubAdminClubPage = () => {
  const { clubs, showToast } = useApp();
  const myClub = clubs[0] || {};

  const [clubInfo, setClubInfo] = useState({
    name: myClub.name || 'Oak Ridge Hunting Club',
    city: myClub.city || 'Knoxville',
    state: myClub.state || 'Tennessee',
    zip: myClub.zip || '37901',
    estYear: myClub.estYear || 1978,
    description: 'Premier hunting club dedicated to competitive trials, sporting dogs, and youth mentorship.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Public Club Page updated!', 'success');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Public Club Page CMS</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Manage the public-facing content for {myClub.name}</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4 text-xs">
        <div>
          <label className="block font-bold mb-1">Club Title</label>
          <input type="text" value={clubInfo.name} onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-bold mb-1">City</label>
            <input type="text" value={clubInfo.city} onChange={(e) => setClubInfo({ ...clubInfo, city: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div>
            <label className="block font-bold mb-1">State</label>
            <input type="text" value={clubInfo.state} onChange={(e) => setClubInfo({ ...clubInfo, state: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
          <div>
            <label className="block font-bold mb-1">ZIP Code</label>
            <input type="text" value={clubInfo.zip} onChange={(e) => setClubInfo({ ...clubInfo, zip: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">About / Description</label>
          <textarea rows={4} value={clubInfo.description} onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })} className="w-full p-2 bg-surface-low border rounded" />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-4 py-2 bg-forest-800 text-white font-bold text-xs rounded flex items-center gap-1">
            <Save className="w-4 h-4" /> Update Public Page
          </button>
        </div>
      </form>
    </div>
  );
};
