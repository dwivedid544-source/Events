import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Users,
  ShoppingBag,
  Calendar,
  HeartHandshake,
  Globe,
  Receipt,
  CheckCircle2,
  CalendarRange,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Check,
  Filter
} from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ClubAdminFinance = () => {
  const { currentUser, showToast } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState('August 2026');
  const [periodType, setPeriodType] = useState('month'); // 'month' | 'quarter' | 'year' | 'custom'
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [customRange, setCustomRange] = useState({
    startDate: '2026-08-01',
    endDate: '2026-08-31'
  });

  const isStateAdmin = currentUser?.role === 'STATE_ADMIN';
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isNationalAdmin = currentUser?.role === 'NATIONAL_ADMIN';

  const stateOrClubName = isStateAdmin
    ? (currentUser?.scope || 'Tennessee')
    : isSuperAdmin
    ? 'Platform National'
    : isNationalAdmin
    ? 'National Charter Network'
    : (currentUser?.scope?.split('(')[0]?.trim() || 'Houston County Coon Hunters Association');

  // Dynamic Financial Data calculation based on selected period
  const getFinancialData = () => {
    // Base benchmark for August: Memberships: 400, Merchandise: 725, Event Income: 1100, Fundraisers: 350, UHC: 260
    if (periodType === 'year') {
      return {
        memberships: 4600.00,
        merchandise: 8450.00,
        eventIncome: 12800.00,
        fundraisers: 4100.00,
        uhcMarketplaceCommissions: 3150.00,
        totalClubIncome: 33100.00,
        signupsCount: 184,
        ordersCount: 312,
        entriesCount: 520
      };
    }

    if (periodType === 'quarter') {
      return {
        memberships: 1230.00,
        merchandise: 2225.00,
        eventIncome: 3300.00,
        fundraisers: 1070.00,
        uhcMarketplaceCommissions: 790.00,
        totalClubIncome: 8615.00,
        signupsCount: 48,
        ordersCount: 82,
        entriesCount: 135
      };
    }

    if (periodType === 'custom') {
      return {
        memberships: 520.00,
        merchandise: 890.00,
        eventIncome: 1350.00,
        fundraisers: 420.00,
        uhcMarketplaceCommissions: 310.00,
        totalClubIncome: 3490.00,
        signupsCount: 21,
        ordersCount: 34,
        entriesCount: 56
      };
    }

    // Monthly variations
    const monthIndex = MONTHS.indexOf(selectedMonth);
    const monthMultipliers = [
      0.75, // Jan
      0.80, // Feb
      0.90, // Mar
      0.95, // Apr
      1.05, // May
      1.10, // Jun
      0.92, // Jul ($2,580)
      1.00, // Aug ($2,835 - exact specification)
      1.15, // Sep ($3,200 - fall trials)
      1.25, // Oct ($3,540 - peak coonhound trials)
      1.10, // Nov
      0.85  // Dec
    ];

    const factor = monthMultipliers[monthIndex !== -1 ? monthIndex : 7];
    const memberships = Number((400.00 * factor).toFixed(2));
    const merchandise = Number((725.00 * factor).toFixed(2));
    const eventIncome = Number((1100.00 * factor).toFixed(2));
    const fundraisers = Number((350.00 * factor).toFixed(2));
    const uhcMarketplaceCommissions = Number((260.00 * factor).toFixed(2));
    const totalClubIncome = Number((memberships + merchandise + eventIncome + fundraisers + uhcMarketplaceCommissions).toFixed(2));

    return {
      memberships,
      merchandise,
      eventIncome,
      fundraisers,
      uhcMarketplaceCommissions,
      totalClubIncome,
      signupsCount: Math.round(16 * factor),
      ordersCount: Math.round(28 * factor),
      entriesCount: Math.round(44 * factor)
    };
  };

  const financialData = getFinancialData();

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setPeriodType('month');
    setSelectedPeriodLabel(`${month} ${selectedYear}`);
    setIsCalendarOpen(false);
    if (showToast) showToast(`Reporting period set to: ${month} ${selectedYear}`, 'success');
  };

  const handleSelectPreset = (type, label) => {
    setPeriodType(type);
    setSelectedPeriodLabel(label);
    if (type === 'year') {
      setSelectedMonth('All 12 Months');
    }
    setIsCalendarOpen(false);
    if (showToast) showToast(`Reporting period set to: ${label}`, 'success');
  };

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    if (!customRange.startDate || !customRange.endDate) {
      if (showToast) showToast('Please select both start and end dates', 'error');
      return;
    }
    setPeriodType('custom');
    const label = `${customRange.startDate} to ${customRange.endDate}`;
    setSelectedPeriodLabel(label);
    setIsCalendarOpen(false);
    if (showToast) showToast(`Custom period applied: ${label}`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              {isStateAdmin
                ? 'State Association Revenue Dashboard'
                : isSuperAdmin
                ? 'Platform Master Financial Dashboard'
                : isNationalAdmin
                ? 'National Headquarters Financial Dashboard'
                : 'Local Club Financial Dashboard'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {stateOrClubName} Financial Overview
            </h1>
            <p className="text-xs text-tan-200 font-medium max-w-2xl">
              {isStateAdmin
                ? 'Official state officer financial dashboard tracking 7% state shares, membership splits, and revenue.'
                : 'Official officer financial dashboard tracking income by category, memberships, merchandise, and total revenue.'}
            </p>
          </div>

          {/* Interactive Calendar / Reporting Period Selector */}
          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-forest-900/90 hover:bg-forest-800 border-2 border-tan-500/60 hover:border-tan-400 p-1.5 rounded-2xl cursor-pointer transition-all shadow-md active:scale-95 group"
            >
              <CalendarRange className="w-4 h-4 text-tan-400 ml-2 group-hover:rotate-6 transition-transform" />
              <span className="text-xs font-black text-tan-200">Reporting Period:</span>
              <span className="px-3 py-1 bg-tan-500 group-hover:bg-tan-400 text-forest-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm transition-colors">
                <span>{selectedPeriodLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Dropdown Calendar / Period Modal */}
            {isCalendarOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                onClick={() => setIsCalendarOpen(false)}
              >
                <div
                  className="bg-surface-lowest text-forest-950 rounded-3xl border-2 border-tan-500/60 p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-tan-500/20 text-tan-700 flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-forest-950">
                          Select Reporting Period
                        </h3>
                        <p className="text-[11px] text-charcoal-muted">
                          Choose month, quarter, or custom date range to filter financial metrics
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-surface-low transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-charcoal-muted block mb-2">
                      Quick Fiscal Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedMonth('August'); handleSelectPreset('month', 'August 2026'); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          selectedPeriodLabel === 'August 2026'
                            ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                            : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                        }`}
                      >
                        <div className="font-black">August 2026</div>
                        <div className="text-[10px] opacity-75">Current Month</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setSelectedMonth('July'); handleSelectPreset('month', 'July 2026'); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          selectedPeriodLabel === 'July 2026'
                            ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                            : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                        }`}
                      >
                        <div className="font-black">July 2026</div>
                        <div className="text-[10px] opacity-75">Previous Month</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setSelectedMonth('September'); handleSelectPreset('month', 'September 2026'); }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          selectedPeriodLabel === 'September 2026'
                            ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                            : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                        }`}
                      >
                        <div className="font-black">September 2026</div>
                        <div className="text-[10px] opacity-75">Upcoming Month</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPreset('quarter', 'Q3 2026 (Jul - Sep)')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          selectedPeriodLabel.includes('Q3')
                            ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                            : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                        }`}
                      >
                        <div className="font-black">Q3 2026</div>
                        <div className="text-[10px] opacity-75">Jul - Sep 2026</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPreset('year', 'Full Year 2026 (YTD)')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left col-span-2 sm:col-span-1 ${
                          selectedPeriodLabel.includes('Full Year')
                            ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                            : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                        }`}
                      >
                        <div className="font-black">Full Year 2026</div>
                        <div className="text-[10px] opacity-75">YTD Reconciled</div>
                      </button>
                    </div>
                  </div>

                  {/* 12-Month Calendar Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-charcoal-muted">
                        Select Fiscal Month
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedYear(selectedYear - 1)}
                          className="p-1 rounded bg-surface-low border text-charcoal hover:bg-surface-border transition-colors text-xs"
                          title="Previous Year"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-xs text-forest-950 font-mono px-1">
                          {selectedYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedYear(selectedYear + 1)}
                          className="p-1 rounded bg-surface-low border text-charcoal hover:bg-surface-border transition-colors text-xs"
                          title="Next Year"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {MONTHS.map((month) => {
                        const isCurrent = selectedMonth === month && periodType === 'month';
                        return (
                          <button
                            key={month}
                            type="button"
                            onClick={() => handleSelectMonth(month)}
                            className={`py-2 px-3 rounded-xl text-xs font-black transition-all text-center ${
                              isCurrent
                                ? 'bg-tan-500 text-forest-950 border-2 border-forest-900 shadow-md scale-102'
                                : 'bg-surface-low hover:bg-surface-border text-charcoal border border-surface-border'
                            }`}
                          >
                            {month.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Date Range Picker */}
                  <form onSubmit={handleApplyCustomRange} className="pt-3 border-t border-surface-border space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-charcoal-muted block">
                      Custom Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-charcoal-muted block mb-0.5">Start Date</span>
                        <input
                          type="date"
                          value={customRange.startDate}
                          onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-surface border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-charcoal-muted block mb-0.5">End Date</span>
                        <input
                          type="date"
                          value={customRange.endDate}
                          onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-surface border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(false)}
                        className="px-3 py-1.5 rounded-xl border border-surface-border text-xs font-bold text-charcoal hover:bg-surface-low cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-black shadow cursor-pointer transition-colors"
                      >
                        Apply Range
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5 CATEGORY CARDS + TOTAL INCOME CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Memberships */}
        <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-forest-950 uppercase tracking-wider">
              1. Memberships
            </span>
            <div className="w-9 h-9 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-forest-950">
              ${financialData.memberships.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-charcoal-muted font-medium mt-1">
              {isStateAdmin
                ? 'State association annual membership dues and charter splits.'
                : 'Local club annual membership dues and renewals collected.'}
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-emerald-800 font-black">{financialData.signupsCount} Active Sign-Ups</span>
          </div>
        </div>

        {/* 2. Merchandise */}
        <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-forest-950 uppercase tracking-wider">
              2. Merchandise
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-900/10 text-amber-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-forest-950">
              ${financialData.merchandise.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-charcoal-muted font-medium mt-1">
              {isStateAdmin
                ? 'State store merchandise, patches, and 7% margin commissions.'
                : 'Club caps, chapter shirts, and local store apparel profit margin.'}
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-emerald-800 font-black">{financialData.ordersCount} Store Orders</span>
          </div>
        </div>

        {/* 3. Event Income */}
        <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-forest-950 uppercase tracking-wider">
              3. Event Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-900/10 text-blue-800 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-forest-950">
              ${financialData.eventIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-charcoal-muted font-medium mt-1">
              {isStateAdmin
                ? 'State sanctioned championship trials, water races, and bench show sanction fees.'
                : 'Sanctioned night hunts, treeing trials, and bench show entry fees.'}
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-emerald-800 font-black">{financialData.entriesCount} Hunt Entries</span>
          </div>
        </div>

        {/* 4. Fundraisers */}
        <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-forest-950 uppercase tracking-wider">
              4. Fundraisers
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-900/10 text-purple-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-forest-950">
              ${financialData.fundraisers.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-charcoal-muted font-medium mt-1">
              {isStateAdmin
                ? 'State youth scholarship auctions and conservation habitat drives.'
                : 'Clubhouse benefit auctions and grounds maintenance drives.'}
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-emerald-800 font-black">Special Programs</span>
          </div>
        </div>

        {/* 5. UHC Marketplace Commissions */}
        <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-forest-950 uppercase tracking-wider">
              5. UHC Marketplace Commissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-900/10 text-teal-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-forest-950">
              ${financialData.uhcMarketplaceCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-charcoal-muted font-medium mt-1">
              Automatic revenue split shares earned from UHC national drop-ship sales.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-emerald-800 font-black">Affiliate Payouts</span>
          </div>
        </div>

        {/* 6. TOTAL INCOME CARD */}
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-6 rounded-3xl border-2 border-tan-500/50 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-tan-300 uppercase tracking-wider">
              {isStateAdmin ? 'TOTAL STATE REVENUE' : 'TOTAL CLUB INCOME'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-tan-500 text-forest-950 flex items-center justify-center shadow">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-4xl font-black text-emerald-400">
              ${financialData.totalClubIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-tan-200 font-medium mt-1">
              Cumulative gross revenue earned across all 5 financial categories.
            </p>
          </div>

          <div className="pt-3 border-t border-forest-800 flex items-center justify-between text-xs text-tan-300 font-bold">
            <span>Period: {selectedPeriodLabel}</span>
            <span className="text-tan-400 font-black">100% Fully Reconciled</span>
          </div>
        </div>
      </div>

      {/* Financial Category Breakdown Table */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-tan-600" />
            <span>Category Breakdown & Revenue Share Table ({selectedPeriodLabel})</span>
          </h3>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="text-xs font-bold text-tan-700 hover:text-tan-800 flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Change Reporting Period</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-low text-charcoal-muted uppercase text-[10px] font-black tracking-wider border-b border-surface-border">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Category Description</th>
                <th className="p-3.5 text-right">Income Earned</th>
                <th className="p-3.5 text-right">% of Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Memberships</td>
                <td className="p-3.5 text-charcoal">
                  {isStateAdmin ? 'State annual dues and charter revenue splits' : 'Local club annual dues and renewals'}
                </td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.memberships.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.memberships / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Merchandise</td>
                <td className="p-3.5 text-charcoal">
                  {isStateAdmin ? 'Official state merchandise and 7% margin commission' : 'Club caps, shirts, and store apparel profits'}
                </td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.merchandise.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.merchandise / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Event Income</td>
                <td className="p-3.5 text-charcoal">
                  {isStateAdmin ? 'State sanctioned championship trials and event fees' : 'Sanctioned trials and bench show entry fees'}
                </td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.eventIncome.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.eventIncome / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Fundraisers</td>
                <td className="p-3.5 text-charcoal">
                  {isStateAdmin ? 'State benefit auctions and conservation drives' : 'Clubhouse drives and special fundraising events'}
                </td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.fundraisers.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.fundraisers / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">UHC Marketplace Commissions</td>
                <td className="p-3.5 text-charcoal">Automatic revenue split shares from UHC marketplace</td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.uhcMarketplaceCommissions.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.uhcMarketplaceCommissions / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              {/* TOTAL ROW */}
              <tr className="bg-forest-950 text-white font-black text-sm">
                <td className="p-4 uppercase tracking-wider text-tan-300">
                  {isStateAdmin ? 'TOTAL STATE REVENUE' : 'TOTAL CLUB INCOME'}
                </td>
                <td className="p-4 text-xs font-normal text-tan-200">Reconciled cumulative total for {selectedPeriodLabel}</td>
                <td className="p-4 text-right text-emerald-400 text-base">
                  ${financialData.totalClubIncome.toFixed(2)}
                </td>
                <td className="p-4 text-right text-tan-300 font-mono">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
