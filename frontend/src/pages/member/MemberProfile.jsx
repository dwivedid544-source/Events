import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';

export const MemberProfile = () => {
  const { currentUser = {}, updateUserProfile, showToast } = useApp();
  const [profile, setProfile] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    city: currentUser.city || '',
    state: currentUser.state || '',
    zip: currentUser.zip || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile(currentUser.id || 'usr-1', profile);
    } else {
      showToast('Profile updated successfully!', 'success');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Account Profile & Settings</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Manage personal information and notification preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-6">
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Street Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button type="submit" className="px-5 py-2 bg-forest-800 text-white font-extrabold text-xs rounded shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
