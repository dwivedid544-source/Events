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
  ArrowUpRight
} from 'lucide-react';

export const ClubAdminFinance = () => {
  const { currentUser } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('August');

  const clubName = currentUser?.scope?.split('(')[0]?.trim() || 'Houston County Coon Hunters Association';

  // EXACT 5 CATEGORIES SPECIFIED BY CLIENT (+ TOTAL CLUB INCOME)
  // Benchmark values for August matching client specification:
  // Memberships: $400, Merchandise: $725, Event Income: $1,100, Fundraisers: $350, UHC Marketplace Commissions: $260, TOTAL: $2,835
  const financialData = {
    memberships: 400.00,
    merchandise: 725.00,
    eventIncome: 1100.00,
    fundraisers: 350.00,
    uhcMarketplaceCommissions: 260.00,
    totalClubIncome: 2835.00
  };

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

          <div className="flex items-center gap-2 bg-forest-900/90 border border-forest-800 p-1.5 rounded-2xl">
            <CalendarRange className="w-4 h-4 text-tan-400 ml-2" />
            <span className="text-xs font-black text-tan-200">Reporting Period:</span>
            <span className="px-3 py-1 bg-tan-500 text-forest-950 text-xs font-black rounded-xl">
              {selectedPeriod} 2026
            </span>
          </div>
        </div>
      </div>

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
            <span>Period: {selectedPeriod}</span>
            <span className="text-emerald-800 font-black">16 Active Sign-Ups</span>
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
            <span>Period: {selectedPeriod}</span>
            <span className="text-emerald-800 font-black">28 Store Orders</span>
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
            <span>Period: {selectedPeriod}</span>
            <span className="text-emerald-800 font-black">44 Hunt Entries</span>
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
            <span>Example for {selectedPeriod}</span>
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
                  {((financialData.memberships / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Merchandise</td>
                <td className="p-3.5 text-charcoal">Club caps, shirts, and store apparel profits</td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.merchandise.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.merchandise / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Event Income</td>
                <td className="p-3.5 text-charcoal">Sanctioned trials and bench show entry fees</td>
                <td className="p-3.5 text-right font-extrabold text-forest-950">
                  ${financialData.eventIncome.toFixed(2)}
                </td>
                <td className="p-3.5 text-right text-charcoal-muted font-mono font-bold">
                  {((financialData.eventIncome / financialData.totalClubIncome) * 100).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-surface-low/60 transition-colors">
                <td className="p-3.5 font-bold text-forest-950">Fundraisers</td>
                <td className="p-3.5 text-charcoal">Clubhouse drives and special fundraising events</td>
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
                <td className="p-4 uppercase tracking-wider text-tan-300">TOTAL CLUB INCOME</td>
                <td className="p-4 text-xs font-normal text-tan-200">Reconciled cumulative total for {selectedPeriod}</td>
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
