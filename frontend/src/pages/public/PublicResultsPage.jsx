import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Search, Calendar, Building2, MapPin, Award } from 'lucide-react';

export const PublicResultsPage = () => {
  const { results, states } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  const selectedStateObj = states.find(
    (s) => s.code?.toUpperCase() === selectedStateFilter.toUpperCase() || s.name === selectedStateFilter || s.id === selectedStateFilter
  );

  const filteredResults = results.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (r.eventName && r.eventName.toLowerCase().includes(q)) ||
      (r.owner && r.owner.toLowerCase().includes(q)) ||
      (r.participant && r.participant.toLowerCase().includes(q)) ||
      (r.winnerDog && r.winnerDog.toLowerCase().includes(q)) ||
      (r.dog && r.dog.toLowerCase().includes(q)) ||
      (r.club && r.club.toLowerCase().includes(q));

    if (selectedStateFilter === 'ALL') return matchesSearch;

    const rState = (r.state || '').toLowerCase();
    const rCode = (r.stateCode || '').toUpperCase();
    const filterCode = selectedStateFilter.toUpperCase();
    const rawFilterName = (selectedStateObj?.name || selectedStateFilter).toLowerCase();
    const filterNameClean = rawFilterName.replace('state association', '').replace('hound association', '').trim();

    const matchesState =
      rCode === filterCode ||
      rState === rawFilterName ||
      rState === filterCode.toLowerCase() ||
      (filterNameClean.length > 2 && (rState.includes(filterNameClean) || filterNameClean.includes(rState)));

    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-3xl p-8 lg:p-12 border border-forest-800 shadow-2xl space-y-6">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
          Verified National Standings
        </span>
        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
          Hunt Results & Leaderboards
        </h1>
        <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium leading-relaxed">
          Official competition results, winner dog registries, placements, and scores connected to National, State, and Local Club events.
        </p>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-forest-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by winner dog, owner, event title, or club..."
              className="w-full pl-10 pr-4 py-3 text-xs bg-surface-lowest text-charcoal border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-tan-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full px-3.5 py-3 text-xs bg-surface-lowest border border-surface-border rounded-xl font-bold text-charcoal focus:border-tan-500 cursor-pointer shadow-sm"
            >
              <option value="ALL">All 50 States ({states.length} Active Charters)</option>
              {states
                .slice()
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                .map((s) => (
                  <option key={s.id || s.code} value={s.code}>
                    {s.name.includes('Association') ? s.name : `${s.name} State Association`} ({s.code})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between text-xs font-bold text-charcoal-muted">
          <span>
            Showing {filteredResults.length} Competition Record{filteredResults.length !== 1 ? 's' : ''}
            {selectedStateFilter !== 'ALL' && ` in ${selectedStateObj?.name || selectedStateFilter}`}
          </span>
          <span>Official UHC Registry Verified</span>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-tan-600" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-extrabold text-sm text-forest-950">No Competition Records Found</h3>
              <p className="text-xs text-charcoal-muted">
                No official trial standings currently recorded for the selected filter criteria.
              </p>
            </div>
            {(selectedStateFilter !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedStateFilter('ALL');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl hover:bg-forest-950 transition-colors cursor-pointer"
              >
                Reset Filters to All 50 States
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-low text-charcoal-muted uppercase text-[10px] font-extrabold border-b border-surface-border">
                <tr>
                  <th className="p-4">Placement</th>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Host Club & State</th>
                  <th className="p-4">Winner Dog</th>
                  <th className="p-4">Owner / Handler</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredResults.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-surface-low/80 transition-colors">
                    <td className="p-4 font-black text-forest-800 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-tan-500 shrink-0" />
                      <span>{r.placement || r.place || '#1 Place'}</span>
                    </td>
                    <td className="p-4 font-black text-forest-950">{r.eventName}</td>
                    <td className="p-4 text-charcoal font-medium">
                      <div>{r.club}</div>
                      <div className="text-[10px] text-charcoal-muted font-bold">{r.state}</div>
                    </td>
                    <td className="p-4 font-black text-tan-800">
                      <div>{r.winnerDog || r.dog}</div>
                      {r.winnerDogReg && <div className="text-[9px] text-charcoal-light font-semibold">{r.winnerDogReg}</div>}
                    </td>
                    <td className="p-4 font-bold text-charcoal">{r.owner || r.participant}</td>
                    <td className="p-4 font-black text-forest-950">{r.score}</td>
                    <td className="p-4 text-charcoal-muted font-medium">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
