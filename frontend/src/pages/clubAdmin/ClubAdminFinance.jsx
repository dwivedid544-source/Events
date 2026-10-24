import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  Save,
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

  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 9 = October (0-indexed)
  const currentMonthName = MONTHS[currentMonthIndex] || 'October';

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState(`${currentMonthName} 2026`);
  const [periodType, setPeriodType] = useState('month'); // 'month' | 'quarter' | 'year' | 'custom'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Local Club Bank Account State
  const [clubBankInfo, setClubBankInfo] = useState(() => {
    const saved = localStorage.getItem('nh_bank_local_club');
    return saved ? JSON.parse(saved) : {
      bankName: 'Wells Fargo / Local Community Bank',
      accountHolder: 'Honolulu Hound & Hunting Club Treasury',
      routingNumber: '121000248',
      accountNumber: '••••••••7712',
      accountType: 'Commercial Checking',
      status: 'Active for Direct Deposits'
    };
  });
  const [isEditingClubBank, setIsEditingClubBank] = useState(false);

  const handleSaveClubBank = (e) => {
    e.preventDefault();
    localStorage.setItem('nh_bank_local_club', JSON.stringify(clubBankInfo));
    setIsEditingClubBank(false);
    showToast(`Bank account successfully updated for ${stateOrClubName} Treasury!`, 'success');
  };

  const [customRange, setCustomRange] = useState({
    startDate: '2026-10-01',
    endDate: '2026-10-31'
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

  // Month-by-month financial data map (Benchmark values in August, current month active, future months $0.00)
  const monthlyDataMap = {
    January: {
      memberships: 320.00,
      merchandise: 540.00,
      eventIncome: 750.00,
      fundraisers: 200.00,
      uhcMarketplaceCommissions: 180.00,
      signupsCount: 12,
      ordersCount: 20,
      huntEntriesCount: 30
    },
    February: {
      memberships: 350.00,
      merchandise: 610.00,
      eventIncome: 850.00,
      fundraisers: 250.00,
      uhcMarketplaceCommissions: 210.00,
      signupsCount: 14,
      ordersCount: 22,
      huntEntriesCount: 34
    },
    March: {
      memberships: 410.00,
      merchandise: 690.00,
      eventIncome: 980.00,
      fundraisers: 300.00,
      uhcMarketplaceCommissions: 240.00,
      signupsCount: 17,
      ordersCount: 26,
      huntEntriesCount: 40
    },
    April: {
      memberships: 450.00,
      merchandise: 760.00,
      eventIncome: 1200.00,
      fundraisers: 380.00,
      uhcMarketplaceCommissions: 275.00,
      signupsCount: 18,
      ordersCount: 29,
      huntEntriesCount: 48
    },
    May: {
      memberships: 480.00,
      merchandise: 810.00,
      eventIncome: 1350.00,
      fundraisers: 400.00,
      uhcMarketplaceCommissions: 290.00,
      signupsCount: 20,
      ordersCount: 31,
      huntEntriesCount: 52
    },
    June: {
      memberships: 380.00,
      merchandise: 680.00,
      eventIncome: 950.00,
      fundraisers: 310.00,
      uhcMarketplaceCommissions: 230.00,
      signupsCount: 15,
      ordersCount: 25,
      huntEntriesCount: 38
    },
    July: {
      memberships: 390.00,
      merchandise: 710.00,
      eventIncome: 1020.00,
      fundraisers: 330.00,
      uhcMarketplaceCommissions: 245.00,
      signupsCount: 15,
      ordersCount: 27,
      huntEntriesCount: 41
    },
    August: {
      // Benchmark values specified by client
      memberships: 400.00,
      merchandise: 725.00,
      eventIncome: 1100.00,
      fundraisers: 350.00,
      uhcMarketplaceCommissions: 260.00,
      signupsCount: 16,
      ordersCount: 28,
      huntEntriesCount: 44
    },
    September: {
      memberships: 520.00,
      merchandise: 890.00,
      eventIncome: 1450.00,
      fundraisers: 420.00,
      uhcMarketplaceCommissions: 310.00,
      signupsCount: 21,
      ordersCount: 34,
      huntEntriesCount: 58
    },
    October: {
      // Current running month (Month-To-Date)
      memberships: 425.00,
      merchandise: 680.00,
      eventIncome: 1250.00,
      fundraisers: 350.00,
      uhcMarketplaceCommissions: 240.00,
      signupsCount: 17,
      ordersCount: 27,
      huntEntriesCount: 50,
      isCurrent: true
    },
    November: {
      // Future month — No transactions occurred yet ($0.00)
      memberships: 0.00,
      merchandise: 0.00,
      eventIncome: 0.00,
      fundraisers: 0.00,
      uhcMarketplaceCommissions: 0.00,
      signupsCount: 0,
      ordersCount: 0,
      huntEntriesCount: 0,
      isFuture: true
    },
    December: {
      // Future month — No transactions occurred yet ($0.00)
      memberships: 0.00,
      merchandise: 0.00,
      eventIncome: 0.00,
      fundraisers: 0.00,
      uhcMarketplaceCommissions: 0.00,
      signupsCount: 0,
      ordersCount: 0,
      huntEntriesCount: 0,
      isFuture: true
    }
  };

  const getFinancialData = () => {
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
        huntEntriesCount: 520,
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
        huntEntriesCount: 135,
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
        huntEntriesCount: 56,
        entriesCount: 56
      };
    }

    // Default: month
    const base = monthlyDataMap[selectedMonth] || monthlyDataMap[currentMonthName];
    const totalClubIncome =
      base.memberships +
      base.merchandise +
      base.eventIncome +
      base.fundraisers +
      base.uhcMarketplaceCommissions;

    return {
      ...base,
      totalClubIncome,
      entriesCount: base.huntEntriesCount
    };
  };

  const financialData = getFinancialData();

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setPeriodType('month');
    setSelectedPeriodLabel(`${month} ${selectedYear}`);
    setIsDropdownOpen(false);
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
    setIsDropdownOpen(false);
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
    setIsDropdownOpen(false);
    if (showToast) showToast(`Custom period applied: ${label}`, 'success');
  };

  const isSelectedFuture = periodType === 'month' && MONTHS.indexOf(selectedMonth) > currentMonthIndex;
  const isSelectedCurrent = periodType === 'month' && MONTHS.indexOf(selectedMonth) === currentMonthIndex;

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

          {/* Interactive Month Selector / Calendar Dropdown */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-forest-900/90 hover:bg-forest-800 border-2 border-tan-500/60 hover:border-tan-400 p-1.5 rounded-2xl cursor-pointer transition-all shadow-md active:scale-95 group"
              title="Click to select reporting month"
              aria-label="Select Reporting Month"
            >
              <CalendarRange className="w-4 h-4 text-tan-400 ml-2 group-hover:rotate-6 transition-transform" />
              <span className="text-xs font-black text-tan-200">Reporting Period:</span>
              <span className="px-3 py-1 bg-tan-500 group-hover:bg-tan-400 text-forest-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm transition-colors">
                <span>{selectedPeriodLabel}</span>
                {isSelectedCurrent && (
                  <span className="text-[9px] font-black bg-forest-950 text-tan-300 px-1.5 py-0.2 rounded-full uppercase">
                    Current
                  </span>
                )}
                {isSelectedFuture && (
                  <span className="text-[9px] font-black bg-amber-900 text-amber-200 px-1.5 py-0.2 rounded-full uppercase">
                    Upcoming
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Dropdown Month Picker Grid */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-surface-lowest text-charcoal rounded-2xl border-2 border-tan-500/60 shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-tan-700" />
                    <span className="text-xs font-black text-forest-950">Select Reporting Month</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-tan-100 text-tan-900 border border-tan-300">
                    2026 Season
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {MONTHS.map((m, idx) => {
                    const isSelected = selectedMonth === m && periodType === 'month';
                    const isFuture = idx > currentMonthIndex;
                    const isCurrent = idx === currentMonthIndex;

                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMonth(m)}
                        className={`relative py-2.5 px-2 rounded-xl transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-tan-500 text-forest-950 font-black shadow-md scale-[1.02]'
                            : isFuture
                            ? 'bg-surface-low/50 text-charcoal-muted hover:bg-surface-low border border-dashed border-surface-border'
                            : 'bg-surface-low text-charcoal hover:bg-tan-50 hover:text-forest-900 border border-surface-border'
                        }`}
                      >
                        <span className="text-xs font-bold">{m}</span>
                        {isCurrent && (
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-forest-950 text-tan-300' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Current
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-[8px] font-bold uppercase text-charcoal-light">
                            Upcoming
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] text-charcoal-muted">
                  <span>Current: <strong>{currentMonthName} 2026</strong></span>
                  <button
                    type="button"
                    onClick={() => handleSelectMonth(currentMonthName)}
                    className="text-xs text-tan-800 hover:text-tan-900 font-extrabold hover:underline cursor-pointer"
                  >
                    Jump to Current ({currentMonthName.slice(0, 3)})
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-surface-border text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsCalendarOpen(true);
                    }}
                    className="text-xs font-bold text-forest-900 hover:text-forest-950 hover:underline flex items-center justify-center gap-1 w-full py-1"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Quarterly, Annual & Custom Presets</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
                className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-surface-low transition-colors cursor-pointer"
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
                  onClick={() => handleSelectPreset('month', `${currentMonthName} 2026`)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                    selectedPeriodLabel === `${currentMonthName} 2026`
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                  }`}
                >
                  <div className="font-black">{currentMonthName} 2026</div>
                  <div className="text-[10px] opacity-75">Current Month</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedMonth('August'); handleSelectPreset('month', 'August 2026'); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                    selectedPeriodLabel === 'August 2026'
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                  }`}
                >
                  <div className="font-black">August 2026</div>
                  <div className="text-[10px] opacity-75">Benchmark Month</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedMonth('September'); handleSelectPreset('month', 'September 2026'); }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                    selectedPeriodLabel === 'September 2026'
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-surface-low text-charcoal border-surface-border hover:border-tan-500'
                  }`}
                >
                  <div className="font-black">September 2026</div>
                  <div className="text-[10px] opacity-75">Previous Month</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('quarter', 'Q3 2026 (Jul - Sep)')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left col-span-2 sm:col-span-1 cursor-pointer ${
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
                    className="p-1 rounded bg-surface-low border text-charcoal hover:bg-surface-border transition-colors text-xs cursor-pointer"
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
                    className="p-1 rounded bg-surface-low border text-charcoal hover:bg-surface-border transition-colors text-xs cursor-pointer"
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
                      className={`py-2 px-3 rounded-xl text-xs font-black transition-all text-center cursor-pointer ${
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

      {/* Upcoming Period Informational Banner */}
      {isSelectedFuture && (
        <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl p-4 flex items-center gap-3 shadow-xs animate-fade-in">
          <CalendarRange className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold">Upcoming Reporting Period ({selectedPeriodLabel}): </span>
            This is a future period. No financial transactions or dues have taken place yet, so revenue is currently recorded as <strong>$0.00</strong>. Income will automatically record once {selectedMonth} {selectedYear} begins.
          </div>
        </div>
      )}

      {/* 🏛️ Direct Deposit & Banking Configuration Card for Local Club */}
      <div className="bg-surface-lowest p-6 rounded-3xl border-2 border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-forest-950">
                  {stateOrClubName} Treasury & Direct Deposit
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {clubBankInfo.status}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Attached bank account #2 for local club dues deposits and 100% merchandise profit margins.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingClubBank(!isEditingClubBank)}
            className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow cursor-pointer transition-all self-start sm:self-center"
          >
            {isEditingClubBank ? 'Cancel' : 'Edit Club Bank Account'}
          </button>
        </div>

        {isEditingClubBank ? (
          <form onSubmit={handleSaveClubBank} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-charcoal mb-1">Financial Institution</label>
              <input
                type="text"
                required
                value={clubBankInfo.bankName}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, bankName: e.target.value })}
                placeholder="e.g. Bank of Hawaii / Wells Fargo"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Holder Legal Name</label>
              <input
                type="text"
                required
                value={clubBankInfo.accountHolder}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, accountHolder: e.target.value })}
                placeholder="e.g. Honolulu Hound & Hunting Club Treasury"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Routing Number (ACH 9-digit)</label>
              <input
                type="text"
                required
                maxLength={9}
                value={clubBankInfo.routingNumber}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, routingNumber: e.target.value })}
                placeholder="121000248"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Number</label>
              <input
                type="text"
                required
                value={clubBankInfo.accountNumber}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, accountNumber: e.target.value })}
                placeholder="••••••••7712"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingClubBank(false)}
                className="px-4 py-2 border border-surface-border text-charcoal font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Bank Information</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Bank Name</span>
              <strong className="text-xs font-black text-forest-950 mt-0.5 block">{clubBankInfo.bankName}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Account Holder</span>
              <strong className="text-xs font-black text-forest-950 mt-0.5 block truncate">{clubBankInfo.accountHolder}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Routing Number</span>
              <strong className="text-xs font-mono font-black text-forest-950 mt-0.5 block">{clubBankInfo.routingNumber}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Account Number</span>
              <strong className="text-xs font-mono font-black text-forest-950 mt-0.5 block">{clubBankInfo.accountNumber}</strong>
            </div>
          </div>
        )}
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
            <span className="text-emerald-800 font-black">{financialData.signupsCount ?? 16} Active Sign-Ups</span>
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
            <span className="text-emerald-800 font-black">{financialData.ordersCount ?? 28} Store Orders</span>
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
            <span className="text-emerald-800 font-black">{financialData.huntEntriesCount ?? financialData.entriesCount ?? 44} Hunt Entries</span>
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

      {/* Local Club Direct Deposit & Banking Setup Card */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-forest-950 flex items-center justify-center border border-tan-500/40">
              <Landmark className="w-5 h-5 text-forest-900" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                <span>{stateOrClubName} — Club Treasury & Direct Deposit Account</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {clubBankInfo.status}
                </span>
              </h3>
              <p className="text-xs text-charcoal-muted">Attached bank account for receiving 100% merchandise profit margins and local club membership dues.</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingClubBank(!isEditingClubBank)}
            className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all self-start sm:self-center"
          >
            {isEditingClubBank ? 'Cancel' : 'Edit Club Bank Info'}
          </button>
        </div>

        {isEditingClubBank ? (
          <form onSubmit={handleSaveClubBank} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-charcoal mb-1">Bank Name</label>
              <input
                type="text"
                required
                value={clubBankInfo.bankName}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, bankName: e.target.value })}
                placeholder="e.g. Bank of Hawaii / Wells Fargo"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Holder Legal Name</label>
              <input
                type="text"
                required
                value={clubBankInfo.accountHolder}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, accountHolder: e.target.value })}
                placeholder="e.g. Honolulu Hound Club LLC"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">ACH Routing Number (9-digit)</label>
              <input
                type="text"
                required
                maxLength={9}
                value={clubBankInfo.routingNumber}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, routingNumber: e.target.value })}
                placeholder="121000248"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Number</label>
              <input
                type="text"
                required
                value={clubBankInfo.accountNumber}
                onChange={(e) => setClubBankInfo({ ...clubBankInfo, accountNumber: e.target.value })}
                placeholder="7712904812"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Club Bank Account
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Bank Name</span>
              <strong className="text-sm font-extrabold text-forest-950">{clubBankInfo.bankName}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Account Holder</span>
              <strong className="text-sm font-extrabold text-forest-950">{clubBankInfo.accountHolder}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Routing Number</span>
              <strong className="text-sm font-mono font-black text-forest-950">{clubBankInfo.routingNumber}</strong>
            </div>
            <div className="p-3.5 bg-surface-low rounded-2xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Direct Deposit Account</span>
              <strong className="text-sm font-mono font-black text-emerald-800">{clubBankInfo.accountNumber}</strong>
            </div>
          </div>
        )}
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
                  {financialData.totalClubIncome > 0
                    ? ((financialData.memberships / financialData.totalClubIncome) * 100).toFixed(1)
                    : '0.0'}%
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
                  {financialData.totalClubIncome > 0
                    ? ((financialData.merchandise / financialData.totalClubIncome) * 100).toFixed(1)
                    : '0.0'}%
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
                  {financialData.totalClubIncome > 0
                    ? ((financialData.eventIncome / financialData.totalClubIncome) * 100).toFixed(1)
                    : '0.0'}%
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
                  {financialData.totalClubIncome > 0
                    ? ((financialData.fundraisers / financialData.totalClubIncome) * 100).toFixed(1)
                    : '0.0'}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">UHC Marketplace Commissions</td>
                <td className="p-3.5 text-charcoal">Automatic revenue split shares from UHC marketplace</td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.uhcMarketplaceCommissions.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {financialData.totalClubIncome > 0
                    ? ((financialData.uhcMarketplaceCommissions / financialData.totalClubIncome) * 100).toFixed(1)
                    : '0.0'}%
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
                <td className="p-4 text-right text-tan-300 font-mono">
                  {financialData.totalClubIncome > 0 ? '100.0%' : '0.0%'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
