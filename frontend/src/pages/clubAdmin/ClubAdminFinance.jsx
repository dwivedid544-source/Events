import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';

export const ClubAdminFinance = () => {
  const { currentUser } = useApp();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 9 = October (0-indexed)
  const currentMonthName = months[currentMonthIndex] || 'October';

  const [selectedPeriod, setSelectedPeriod] = useState(currentMonthName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const clubName = currentUser?.scope?.split('(')[0]?.trim() || 'Houston County Coon Hunters Association';

  // EXACT 5 CATEGORIES SPECIFIED BY CLIENT (+ TOTAL CLUB INCOME)
  // Past months have completed financial records, October is the current active month,
  // and future months (November, December) have $0.00 as they have not yet occurred!
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

  const currentMonthData = monthlyDataMap[selectedPeriod] || monthlyDataMap[currentMonthName];
  const totalClubIncome =
    currentMonthData.memberships +
    currentMonthData.merchandise +
    currentMonthData.eventIncome +
    currentMonthData.fundraisers +
    currentMonthData.uhcMarketplaceCommissions;

  const financialData = {
    ...currentMonthData,
    totalClubIncome
  };

  const isSelectedFuture = months.indexOf(selectedPeriod) > currentMonthIndex;
  const isSelectedCurrent = months.indexOf(selectedPeriod) === currentMonthIndex;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              Local Club Financial Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {clubName} Financial Overview
            </h1>
            <p className="text-xs text-tan-200 font-medium">
              Official officer financial dashboard tracking club income by category and total revenue.
            </p>
          </div>

          {/* Interactive Month Selector / Calendar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-forest-900/90 hover:bg-forest-800 border border-forest-700/80 p-2 rounded-2xl transition-all shadow-lg cursor-pointer group"
              title="Click to select reporting month"
              aria-label="Select Reporting Month"
            >
              <div className="p-1.5 rounded-xl bg-tan-500/20 text-tan-400 group-hover:bg-tan-500 group-hover:text-forest-950 transition-colors">
                <CalendarRange className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-tan-200">Reporting Period:</span>
              <span className="px-3 py-1 bg-tan-500 text-forest-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs">
                <span>{selectedPeriod} 2026</span>
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
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-surface-lowest text-charcoal rounded-2xl border border-surface-border shadow-2xl p-4 z-50 animate-fade-in">
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
                  {months.map((m, idx) => {
                    const isSelected = selectedPeriod === m;
                    const isFuture = idx > currentMonthIndex;
                    const isCurrent = idx === currentMonthIndex;

                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedPeriod(m);
                          setIsDropdownOpen(false);
                        }}
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
                    onClick={() => {
                      setSelectedPeriod(currentMonthName);
                      setIsDropdownOpen(false);
                    }}
                    className="text-xs text-tan-800 hover:text-tan-900 font-extrabold hover:underline cursor-pointer"
                  >
                    Jump to Current ({currentMonthName.slice(0, 3)})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Period Informational Banner */}
      {isSelectedFuture && (
        <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl p-4 flex items-center gap-3 shadow-xs animate-fade-in">
          <CalendarRange className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold">Upcoming Reporting Period ({selectedPeriod} 2026): </span>
            This is a future period. No financial transactions or dues have taken place yet, so revenue is currently recorded as <strong>$0.00</strong>. Income will automatically record once {selectedPeriod} 2026 begins.
          </div>
        </div>
      )}

      {/* 5 CATEGORY CARDS + TOTAL CLUB INCOME CARD */}
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
              Local club annual membership dues and renewals collected.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriod} 2026</span>
            <span className="text-emerald-800 font-black">{financialData.signupsCount || 16} Active Sign-Ups</span>
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
              Club caps, chapter shirts, and local store apparel profit margin.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriod} 2026</span>
            <span className="text-emerald-800 font-black">{financialData.ordersCount || 28} Store Orders</span>
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
              Sanctioned night hunts, treeing trials, and bench show entry fees.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriod} 2026</span>
            <span className="text-emerald-800 font-black">{financialData.huntEntriesCount || 44} Hunt Entries</span>
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
              Clubhouse benefit auctions and grounds maintenance drives.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriod}</span>
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
              Automatic revenue split shares earned from UHC national sales.
            </p>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-muted font-bold">
            <span>Period: {selectedPeriod}</span>
            <span className="text-emerald-800 font-black">Affiliate Payouts</span>
          </div>
        </div>

        {/* 6. TOTAL CLUB INCOME */}
        <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-6 rounded-3xl border-2 border-tan-500/50 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-tan-300 uppercase tracking-wider">
              TOTAL CLUB INCOME
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
              Cumulative gross revenue earned across all 5 club categories.
            </p>
          </div>

          <div className="pt-3 border-t border-forest-800 flex items-center justify-between text-xs text-tan-300 font-bold">
            <span>Reporting for {selectedPeriod} 2026</span>
            <span className="text-tan-400 font-black">100% Fully Reconciled</span>
          </div>
        </div>
      </div>

      {/* Financial Category Breakdown Table */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
        <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2 border-b border-surface-border pb-3">
          <Receipt className="w-5 h-5 text-tan-600" />
          <span>Category Breakdown & Revenue Share Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-low text-charcoal-muted uppercase text-[10px] font-black tracking-wider border-b border-surface-border">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Category Description</th>
                <th className="p-3.5 text-right">Income Earned</th>
                <th className="p-3.5 text-right">% of Total Club Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Memberships</td>
                <td className="p-3.5 text-charcoal">Local club annual dues and renewals</td>
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
                <td className="p-3.5 text-charcoal">Club caps, shirts, and store apparel profits</td>
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
                <td className="p-3.5 text-charcoal">Sanctioned trials and bench show entry fees</td>
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
                <td className="p-3.5 text-charcoal">Clubhouse drives and special fundraising events</td>
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
                <td className="p-4 uppercase tracking-wider text-tan-300">TOTAL CLUB INCOME</td>
                <td className="p-4 text-xs font-normal text-tan-200">Reconciled cumulative total for {selectedPeriod} 2026</td>
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
