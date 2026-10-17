import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Globe,
  MapPin,
  Percent,
  Receipt,
  Search,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  ArrowDownUp,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const RevenueTrackingPage = () => {
  const {
    transactions,
    revenuePercentages,
    setRevenuePercentages,
    calculateRevenueSplits,
    recordTransactionWithAutomaticSplits,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [percentageSettings, setPercentageSettings] = useState({ ...revenuePercentages });

  // Handle revenue percentage updates (Requirement 4: exact percentages determined later)
  const handleSavePercentages = (e) => {
    e.preventDefault();
    const sum =
      Number(percentageSettings.nationalPct) +
      Number(percentageSettings.statePct) +
      Number(percentageSettings.clubPct);

    if (sum !== 100) {
      showToast('Revenue percentage shares must total exactly 100%.', 'error');
      return;
    }

    setRevenuePercentages(percentageSettings);
    localStorage.setItem('nh_revenue_percentages', JSON.stringify(percentageSettings));
    showToast('Updated Automatic Revenue Split Percentages!', 'success');
    setShowConfigModal(false);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.description?.toLowerCase().includes(q) ||
      t.id?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.club?.toLowerCase().includes(q)
    );
  });

  // Calculate Cumulative Metrics across all tracked transactions
  const totals = transactions.reduce(
    (acc, t) => {
      const splits = t.vendorCost !== undefined ? t : calculateRevenueSplits(t.grossAmount || t.amount, t.vendorCost || 0);
      acc.gross += splits.grossAmount || t.amount || 0;
      acc.vendorCost += splits.vendorCost || 0;
      acc.nationalUhcShare += splits.nationalUhcShare || 0;
      acc.stateAssociationShare += splits.stateAssociationShare || 0;
      acc.localClubShare += splits.localClubShare || 0;
      acc.paymentProcessing += splits.paymentProcessing || 0;
      acc.netProfit += splits.netProfit || 0;
      return acc;
    },
    {
      gross: 0,
      vendorCost: 0,
      nationalUhcShare: 0,
      stateAssociationShare: 0,
      localClubShare: 0,
      paymentProcessing: 0,
      netProfit: 0
    }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Top Title & Revenue Splitting Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              Automatic Revenue Tracking & Accounting
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Automated Revenue Splitting System
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Every platform transaction is automatically tracked and calculated across: <strong>Vendor Cost</strong>, <strong>National UHC Share</strong>, <strong>State Association Share</strong>, <strong>Local Club Share</strong>, <strong>Payment Processing</strong>, and <strong>Net Profit</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-4 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Configure Revenue Split %</span>
            </button>
          </div>
        </div>

        {/* Current Active Revenue Splitting Rules Banner */}
        <div className="pt-4 border-t border-forest-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-tan-300">
            <span className="font-bold">Active Automated Split Rules:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-forest-900 border border-forest-700 text-white font-mono font-black">
              National UHC: {revenuePercentages.nationalPct}%
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-forest-900 border border-forest-700 text-white font-mono font-black">
              State Assoc: {revenuePercentages.statePct}%
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-forest-900 border border-forest-700 text-white font-mono font-black">
              Local Club: {revenuePercentages.clubPct}%
            </span>
          </div>
          <span className="text-[11px] text-tan-400 italic">
            *Exact revenue percentages will be determined later by governing boards.
          </span>
        </div>
      </div>

      {/* 6 AUTOMATICALLY CALCULATED CUMULATIVE REVENUE SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Vendor Cost */}
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">1. Vendor Cost</span>
          <span className="text-xl font-black text-charcoal">${totals.vendorCost.toFixed(2)}</span>
          <span className="text-[10px] text-charcoal-light block">Wholesale fulfillment</span>
        </div>

        {/* 2. National UHC Share */}
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-forest-900 block">2. National UHC Share</span>
          <span className="text-xl font-black text-forest-950">${totals.nationalUhcShare.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">{revenuePercentages.nationalPct}% of Net Profit</span>
        </div>

        {/* 3. State Association Share */}
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-900 block">3. State Share</span>
          <span className="text-xl font-black text-amber-950">${totals.stateAssociationShare.toFixed(2)}</span>
          <span className="text-[10px] text-amber-700 font-bold block">{revenuePercentages.statePct}% of Net Profit</span>
        </div>

        {/* 4. Local Club Share */}
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-900 block">4. Local Club Share</span>
          <span className="text-xl font-black text-emerald-950">${totals.localClubShare.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">{revenuePercentages.clubPct}% of Net Profit</span>
        </div>

        {/* 5. Payment Processing */}
        <div className="p-4 rounded-2xl bg-surface-lowest border border-surface-border shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-muted block">5. Processing Fee</span>
          <span className="text-xl font-black text-rose-900">${totals.paymentProcessing.toFixed(2)}</span>
          <span className="text-[10px] text-rose-700 font-bold block">Gateway fees (2.9%+$0.30)</span>
        </div>

        {/* 6. Net Profit */}
        <div className="p-4 rounded-2xl bg-surface-lowest border-2 border-emerald-500/40 shadow-ambient space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-900 block">6. Net Profit</span>
          <span className="text-xl font-black text-emerald-800">${totals.netProfit.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Gross - Vendor - Fees</span>
        </div>
      </div>

      {/* TRANSACTION TRACKING TABLE */}
      <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-ambient overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-lg font-black text-forest-950 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-tan-600" />
              <span>Tracked Transactions Ledger</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Live automated accounting ledger calculating all 6 revenue elements for every transaction.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transaction ID, club, state..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-[10px] font-black uppercase text-charcoal-muted bg-surface-low">
                <th className="py-3 px-3">Transaction</th>
                <th className="py-3 px-3">Gross</th>
                <th className="py-3 px-3">1. Vendor Cost</th>
                <th className="py-3 px-3">2. National UHC</th>
                <th className="py-3 px-3">3. State Share</th>
                <th className="py-3 px-3">4. Local Club</th>
                <th className="py-3 px-3">5. Processing</th>
                <th className="py-3 px-3">6. Net Profit</th>
                <th className="py-3 px-3">Date & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredTransactions.map((t) => {
                const splits =
                  t.vendorCost !== undefined
                    ? t
                    : calculateRevenueSplits(t.grossAmount || t.amount, t.vendorCost || 0);

                return (
                  <tr key={t.id} className="hover:bg-surface-low/60 transition-colors font-medium">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-forest-950">{t.description}</div>
                      <div className="text-[10px] text-charcoal-muted font-mono">{t.id} • {t.club || 'National'}</div>
                    </td>

                    <td className="py-3 px-3 font-black text-forest-950">
                      ${(splits.grossAmount || t.amount).toFixed(2)}
                    </td>

                    {/* 1. Vendor Cost */}
                    <td className="py-3 px-3 text-charcoal font-mono">
                      ${splits.vendorCost.toFixed(2)}
                    </td>

                    {/* 2. National UHC Share */}
                    <td className="py-3 px-3 font-bold text-forest-900 font-mono">
                      ${splits.nationalUhcShare.toFixed(2)}
                    </td>

                    {/* 3. State Association Share */}
                    <td className="py-3 px-3 font-bold text-amber-900 font-mono">
                      ${splits.stateAssociationShare.toFixed(2)}
                    </td>

                    {/* 4. Local Club Share */}
                    <td className="py-3 px-3 font-bold text-emerald-900 font-mono">
                      ${splits.localClubShare.toFixed(2)}
                    </td>

                    {/* 5. Payment Processing */}
                    <td className="py-3 px-3 text-rose-900 font-mono">
                      ${splits.paymentProcessing.toFixed(2)}
                    </td>

                    {/* 6. Net Profit */}
                    <td className="py-3 px-3 font-black text-emerald-800 font-mono">
                      ${splits.netProfit.toFixed(2)}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {t.status || 'Completed'}
                      </span>
                      <div className="text-[10px] text-charcoal-muted mt-0.5">{t.date}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVENUE SPLIT PERCENTAGES CONFIGURATION MODAL (Requirement 4) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-tan-600" />
                <span>Configure Revenue Split %</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-charcoal-light hover:text-charcoal cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-charcoal-muted">
              Configure the automated profit margin distribution percentages. The exact percentages can be calibrated whenever determined by the board.
            </p>

            <form onSubmit={handleSavePercentages} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-forest-950 mb-1">
                  2. National UHC Share (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={percentageSettings.nationalPct}
                  onChange={(e) =>
                    setPercentageSettings({ ...percentageSettings, nationalPct: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-amber-950 mb-1">
                  3. State Association Share (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={percentageSettings.statePct}
                  onChange={(e) =>
                    setPercentageSettings({ ...percentageSettings, statePct: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-emerald-950 mb-1">
                  4. Local Club Share (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={percentageSettings.clubPct}
                  onChange={(e) =>
                    setPercentageSettings({ ...percentageSettings, clubPct: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-low border border-surface-border flex justify-between font-black text-xs">
                <span>Total Allocation:</span>
                <span
                  className={
                    Number(percentageSettings.nationalPct) +
                      Number(percentageSettings.statePct) +
                      Number(percentageSettings.clubPct) ===
                    100
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }
                >
                  {Number(percentageSettings.nationalPct) +
                    Number(percentageSettings.statePct) +
                    Number(percentageSettings.clubPct)}
                  % (Must equal 100%)
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-surface-low hover:bg-surface-border font-bold rounded-xl text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tan-500 hover:bg-tan-400 font-black rounded-xl text-forest-950 shadow-md cursor-pointer"
                >
                  Save Split Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
