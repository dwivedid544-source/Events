import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, trendType = 'up' }) => {
  return (
    <div className="group bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient flex flex-col justify-between hover:shadow-ambient-lg hover:border-forest-800/40 transition-all duration-300 relative overflow-hidden">
      {/* Top Subtle Brand Gradient Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-800 via-tan-500 to-forest-800 opacity-60 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-black text-charcoal-muted uppercase tracking-wider leading-snug">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-surface-low text-forest-800 flex items-center justify-center border border-surface-border group-hover:bg-forest-800 group-hover:text-tan-400 group-hover:border-forest-900 transition-all shadow-xs shrink-0">
            <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl lg:text-3xl font-black text-forest-900 tracking-tight leading-none">{value}</div>
        {(subtext || trend) && (
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-black px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide border ${
                  trendType === 'up'
                    ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100/80 text-amber-900 border-amber-300'
                }`}
              >
                {trend}
              </span>
            )}
            {subtext && <span className="text-charcoal-light font-medium text-[11px] truncate">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
