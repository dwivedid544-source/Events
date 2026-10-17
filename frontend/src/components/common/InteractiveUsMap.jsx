import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Building2, Users, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const InteractiveUsMap = () => {
  const { states } = useApp();
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState(states[0] || null);

  // Quick State Navigation Handler
  const handleStateClick = (stateObj) => {
    if (!stateObj) return;
    navigate(`/states/${stateObj.id || stateObj.code.toLowerCase()}`);
  };

  return (
    <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 lg:p-10 border border-forest-800 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-forest-800 pb-6 relative z-10">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-tan-500/20 text-tan-300 border border-tan-500/40 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-tan-400" />
            <span>Interactive U.S. Map Directory</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Select a State Charter on the Map
          </h2>
          <p className="text-xs sm:text-sm text-tan-200 font-medium max-w-xl">
            Click any state directly on the map to enter its dedicated UHC State Association portal.
          </p>
        </div>

        {/* Hovered State Badge Header */}
        {hoveredState && (
          <div className="bg-forest-900/90 border border-tan-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 font-black text-sm flex items-center justify-center shrink-0">
              {hoveredState.code}
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-tan-300 block">Selected Charter</span>
              <h4 className="font-black text-sm text-white leading-none">{hoveredState.name} State Page</h4>
            </div>
          </div>
        )}
      </div>

      {/* Interactive State Map Grid Cards */}
      <div className="space-y-4">
        <div className="text-xs font-black uppercase tracking-wider text-tan-400 flex items-center justify-between">
          <span>Click Any State to View Dedicated Charter Page:</span>
          <span className="text-[10px] text-tan-300/80 font-normal">All 50 States Supported</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {states.map((st) => {
            const isHovered = hoveredState?.id === st.id;
            const isTexas = st.code === 'TX';

            return (
              <button
                key={st.id}
                onClick={() => handleStateClick(st)}
                onMouseEnter={() => setHoveredState(st)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-2 relative ${
                  isHovered || isTexas
                    ? 'bg-tan-500/20 border-tan-400 shadow-xl scale-102'
                    : 'bg-forest-900/70 border-forest-800 hover:bg-forest-800/90 hover:border-tan-500/50'
                }`}
              >
                {isTexas && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-tan-500 text-forest-950 text-[8px] font-black uppercase shadow">
                    Featured
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-white group-hover:text-tan-300 transition-colors">
                    {st.code}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-tan-400" />
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-white truncate">{st.name}</h4>
                  <p className="text-[10px] text-tan-200/80 font-medium">
                    {st.clubsCount} Clubs • {st.membersCount} Members
                  </p>
                </div>

                <div className="pt-2 border-t border-forest-800/60 flex items-center justify-between text-[10px] font-black text-tan-300 group-hover:text-white">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Example Flow Banner: Texas Page Highlight */}
      <div className="p-4 rounded-2xl bg-forest-900/80 border border-forest-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-tan-500 text-forest-950 font-black flex items-center justify-center shrink-0">
            TX
          </div>
          <div>
            <span className="text-white font-extrabold block">Example Map Interaction — Texas</span>
            <span className="text-tan-200/80 text-[11px]">
              Clicking **TEXAS** on the map instantly opens **UHC Texas Page** (`/states/tx`) with dedicated state events, news, membership, and club directory.
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/states/tx')}
          className="px-4 py-2 rounded-xl bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs shadow shrink-0 cursor-pointer transition-all flex items-center gap-1.5"
        >
          <span>Open Texas Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
