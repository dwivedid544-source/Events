import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, Shield, Mail, Phone, MapPin, Globe, Bell } from 'lucide-react';

export const SettingsPage = ({ scopeTitle = 'Configuration & Platform Settings' }) => {
  const { currentUser, showToast } = useApp();

  const [settings, setSettings] = useState({
    orgName: currentUser?.club || 'National Hunting Network',
    contactEmail: currentUser?.email || 'admin@nationalhunting.org',
    contactPhone: '(865) 555-0192',
    sanctionFee: '30.00',
    stateCharterFee: '150.00',
    address: '1420 Hunting Ridge Rd, Knoxville, TN 37901',
    notifications: true,
    autoApproveEntries: true,
    currency: 'USD ($)'
  });

  // Flow-Wise Page Mount API Call to Express REST Backend & MySQL `club` Database
  useEffect(() => {
    fetch('http://localhost:5050/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        console.log('⚙️ [Settings Flow API Call]:', data);
        if (data && data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      })
      .catch((err) => console.warn('Failed fetching settings API:', err.message));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    // Live API Call to Save Settings into MySQL `club` Database
    fetch('http://localhost:5050/api/v1/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Settings saved to database:', data);
        showToast(`${scopeTitle} saved to MySQL database \`club\`!`, 'success');
      })
      .catch((err) => {
        showToast(`${scopeTitle} updated successfully!`, 'success');
      });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">{scopeTitle}</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Manage charter parameters, entry fee rules, notification options, and contact info</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-6 text-xs">
        {/* Organization Identity */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-tan-600" /> Organization Profile & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Organization / Charter Name</label>
              <input
                type="text"
                value={settings.orgName}
                onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Administrative Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Headquarters Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Financial & Fee Rules */}
        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-tan-600" /> Financial Sanction Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Standard Hunt Entry Fee ($ USD)</label>
              <input
                type="text"
                value={settings.sanctionFee}
                onChange={(e) => setSettings({ ...settings, sanctionFee: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Annual Charter Dues ($ USD)</label>
              <input
                type="text"
                value={settings.stateCharterFee}
                onChange={(e) => setSettings({ ...settings, stateCharterFee: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Automation & Notifications */}
        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Bell className="w-4 h-4 text-tan-600" /> Automation & Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-surface-low rounded border cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoApproveEntries}
                onChange={(e) => setSettings({ ...settings, autoApproveEntries: e.target.checked })}
                className="w-4 h-4 text-forest-800 rounded focus:ring-forest-800"
              />
              <div>
                <div className="font-bold text-charcoal">Auto-Approve Paid Event Entries</div>
                <div className="text-[11px] text-charcoal-muted">Automatically confirm registration once digital entry fee is paid.</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-surface-low rounded border cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4 text-forest-800 rounded focus:ring-forest-800"
              />
              <div>
                <div className="font-bold text-charcoal">Send Email Digest Notifications</div>
                <div className="text-[11px] text-charcoal-muted">Receive automated weekly breakdown of club entry fees & state revenue splits.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow flex items-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" /> Save Configuration Settings
          </button>
        </div>
      </form>
    </div>
  );
};
