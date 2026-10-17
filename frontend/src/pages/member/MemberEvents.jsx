import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Trophy, Plus } from 'lucide-react';

export const MemberEvents = () => {
  const { events, enterEvent, dogs } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Events Directory</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Browse and enter sanctioned trials and competition hunts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div key={evt.id} className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-tan-100 text-tan-800 border border-tan-300">
                  {evt.type}
                </span>
                <span className="text-xs font-bold text-forest-800">{evt.distance}</span>
              </div>
              <h3 className="font-extrabold text-lg text-charcoal">{evt.name}</h3>
              <div className="text-xs text-charcoal-muted space-y-1">
                <div>📅 Date: {evt.date} @ {evt.startTime}</div>
                <div>📍 Location: {evt.club} ({evt.city}, {evt.state})</div>
                <div>🏆 Fee: <strong>${evt.fee}</strong> • Entries: {Number(evt.entries) || 0}/{evt.maxCapacity || 50}</div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => enterEvent(evt.id, dogs[0]?.id)}
                className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded shadow"
              >
                Register & Enter Event ($ {evt.fee})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
