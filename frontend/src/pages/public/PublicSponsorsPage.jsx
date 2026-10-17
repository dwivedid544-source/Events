import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Award } from 'lucide-react';

export const PublicSponsorsPage = () => {
  const { sponsors } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div className="bg-forest-800 text-white rounded-xl p-6 lg:p-8 shadow-ambient">
        <span className="px-2.5 py-0.5 rounded bg-tan-500 text-forest-900 text-xs font-black uppercase">Corporate Partners</span>
        <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight mt-2">Official Network Sponsors</h1>
        <p className="text-xs lg:text-sm text-tan-200 mt-1">Industry leaders supporting conservation, canine nutrition, tracking gear, and field trial purses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sponsors.map((sp) => (
          <div key={sp.id} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4 text-center">
            <img src={sp.logo} alt={sp.name} className="h-16 mx-auto object-contain" />
            <h3 className="font-extrabold text-lg text-forest-800">{sp.name}</h3>
            <div className="inline-block px-3 py-1 bg-tan-100 text-tan-900 text-xs font-extrabold rounded uppercase">
              {sp.tier}
            </div>
            <div className="text-xs text-charcoal-light">Scope: {sp.scope}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
