import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Save, ShieldCheck, AlertCircle, Database, Server } from 'lucide-react';

export const NationalHeadquartersSettings = () => {
  const { showToast } = useApp();

  const [hqConfig, setHqConfig] = useState({
    hqName: 'National Hunting Network Headquarters',
    ukcAffiliationNo: 'UKC-NAT-9901',
    primaryDomain: 'nationalhunting.org',
    maintenanceMode: false,
    strictSanctionCheck: true,
    maxDogsPerMember: 10,
    systemEmail: 'hq@nationalhunting.org'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Saved National Headquarters system configuration!', 'success');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">National Headquarters Global Parameters</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Platform infrastructure settings, sanction body affiliation, and registry defaults</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-tan-600" /> National Registry & Affiliation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">National HQ Legal Title</label>
              <input
                type="text"
                value={hqConfig.hqName}
                onChange={(e) => setHqConfig({ ...hqConfig, hqName: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-bold text-forest-900"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">UKC Sanction Charter ID</label>
              <input
                type="text"
                value={hqConfig.ukcAffiliationNo}
                onChange={(e) => setHqConfig({ ...hqConfig, ukcAffiliationNo: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t">
          <h3 className="font-extrabold text-base text-forest-800 border-b pb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-tan-600" /> Global Platform Limits & Controls
          </h3>

          <div className="flex items-center justify-between p-3 bg-surface-low rounded-lg border">
            <div>
              <div className="font-extrabold text-charcoal">Enforce UKC Registration Number Validation</div>
              <div className="text-[11px] text-charcoal-light">Require valid UKC reg format before dog entry into sanctioned events.</div>
            </div>
            <input
              type="checkbox"
              checked={hqConfig.strictSanctionCheck}
              onChange={(e) => setHqConfig({ ...hqConfig, strictSanctionCheck: e.target.checked })}
              className="w-4 h-4 accent-forest-800"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-low rounded-lg border">
            <div>
              <div className="font-extrabold text-charcoal">Platform Maintenance Mode</div>
              <div className="text-[11px] text-charcoal-light">Restrict public trial entries during scheduled database maintenance.</div>
            </div>
            <input
              type="checkbox"
              checked={hqConfig.maintenanceMode}
              onChange={(e) => setHqConfig({ ...hqConfig, maintenanceMode: e.target.checked })}
              className="w-4 h-4 accent-forest-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save HQ Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
