import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, ShieldCheck, RefreshCw } from 'lucide-react';

export const MemberMemberships = () => {
  const { members = [], renewMembership, showToast } = useApp();

  const handleRenew = (mem) => {
    if (renewMembership) {
      renewMembership(mem.id, mem);
    } else {
      showToast(`Membership ${mem.membershipId} renewed for 1 year!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">My Memberships</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Active club and state association memberships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((mem) => (
          <div key={mem.id} className="bg-surface-lowest p-6 rounded-xl border border-surface-border shadow-ambient space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-tan-700 uppercase">{mem.state} Association</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {mem.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-lg text-forest-800">{mem.club}</h3>
              <div className="text-charcoal-muted">Membership Type: <strong>{mem.type}</strong></div>
              <div className="font-mono text-sm font-bold text-charcoal">ID: {mem.membershipId}</div>
              <div className="text-charcoal-light">Joined: {mem.joined} • Expiration: <strong>{mem.expires}</strong></div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => handleRenew(mem)}
                className="px-3.5 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded shadow flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Renew Membership ($45)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
