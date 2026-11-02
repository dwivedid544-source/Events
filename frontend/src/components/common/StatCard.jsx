import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, trendType = 'up' }) => {
  return (
    <div className="group bg-surface-lowest rounded-2xl p-3.5 sm:p-4 xl:p-5 border border-surface-border shadow-ambient flex flex-col justify-between hover:shadow-ambient-lg hover:border-forest-800/40 transition-all duration-300 relative overflow-hidden min-w-0 w-full">
      {/* Top Subtle Brand Gradient Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-800 via-tan-500 to-forest-800 opacity-60 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between gap-2 min-w-0">
        <span
          className="text-[10px] sm:text-[11px] font-black text-charcoal-muted uppercase tracking-wider leading-snug truncate"
          title={title}
        >
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-surface-low text-forest-800 flex items-center justify-center border border-surface-border group-hover:bg-forest-800 group-hover:text-tan-400 group-hover:border-forest-900 transition-all shadow-xs shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 min-w-0">
        <div
          className="text-lg sm:text-2xl xl:text-3xl font-black text-forest-900 tracking-tight leading-tight truncate"
          title={String(value)}
        >
          {value}
        </div>
        {(subtext || trend) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs min-w-0">
            {trend && (
              <span
                className={`font-black px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wide border shrink-0 ${
                  trendType === 'up'
                    ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100/80 text-amber-900 border-amber-300'
                }`}
              >
                {trend}
              </span>
            )}
            {subtext && (
              <span
                className="text-charcoal-light font-medium text-[10px] sm:text-[11px] truncate max-w-full"
                title={subtext}
              >
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
