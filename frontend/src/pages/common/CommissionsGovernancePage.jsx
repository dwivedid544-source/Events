import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { Tag, DollarSign, Building2, CheckCircle2, ArrowRight, ShieldCheck, Globe, MapPin, Truck, Sliders, Save, Clock } from 'lucide-react';

export const CommissionsGovernancePage = () => {
  const {
    commissionSettings,
    updateCommissionSettings,
    orders = [],
    updatePayoutStatus,
    showToast
  } = useApp();

  const [settingsForm, setSettingsForm] = useState({
    clubSharePct: commissionSettings?.clubSharePct || 15,
    stateSharePct: commissionSettings?.stateSharePct || 7,
    nationalSharePct: commissionSettings?.nationalSharePct || 8
  });

  const [simulatedPrice, setSimulatedPrice] = useState(100);

  const totalPlatformComm = Number(settingsForm.clubSharePct) + Number(settingsForm.stateSharePct) + Number(settingsForm.nationalSharePct);
  const vendorSharePct = 100 - totalPlatformComm;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateCommissionSettings({
      clubSharePct: Number(settingsForm.clubSharePct),
      stateSharePct: Number(settingsForm.stateSharePct),
      nationalSharePct: Number(settingsForm.nationalSharePct),
      totalCommissionPct: totalPlatformComm,
      vendorSharePct: vendorSharePct
    });
    showToast('Commission structure updated successfully!', 'success');
  };

  const simVendor = ((simulatedPrice * vendorSharePct) / 100).toFixed(2);
  const simClub = ((simulatedPrice * settingsForm.clubSharePct) / 100).toFixed(2);
  const simState = ((simulatedPrice * settingsForm.stateSharePct) / 100).toFixed(2);
  const simNational = ((simulatedPrice * settingsForm.nationalSharePct) / 100).toFixed(2);

  // Financial Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.sellingPrice || o.total) || 0), 0);
  const totalClubComms = orders.reduce((acc, o) => acc + (Number(o.clubShare) || 0), 0);
  const totalStateComms = orders.reduce((acc, o) => acc + (Number(o.stateShare) || 0), 0);
  const totalNationalComms = orders.reduce((acc, o) => acc + (Number(o.nationalShare) || 0), 0);

  const pendingPayoutsCount = orders.filter((o) => o.payoutStatus === 'Pending').length;

  const columns = [
    { header: 'Order ID', accessor: 'id', render: (r) => <span className="font-mono font-bold text-forest-800">{r.id}</span> },
    {
      header: 'Customer & Product',
      accessor: 'customer',
      render: (r) => (
        <div>
          <div className="font-extrabold text-charcoal">{r.customer}</div>
          <div className="text-xs text-charcoal-muted truncate max-w-xs">{r.product || r.items}</div>
          <div className="text-[10px] text-tan-800 font-bold mt-0.5">Vendor: {r.vendorName || 'Browning Outdoors'}</div>
        </div>
      )
    },
    {
      header: 'Order Origin',
      accessor: 'orderSource',
      render: (r) => (
        <div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
            r.originType === 'NATIONAL'
              ? 'bg-forest-900/10 text-forest-900 border-forest-800/20'
              : r.originType === 'STATE'
              ? 'bg-amber-500/10 text-amber-800 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
          }`}>
            {r.orderSource || 'Local Club Store'}
          </span>
          <div className="text-[9px] text-charcoal-muted mt-0.5">Scope: {r.originType || 'CLUB'}</div>
        </div>
      )
    },
    { header: 'Selling Price', accessor: 'sellingPrice', render: (r) => <span className="font-bold text-charcoal">${(Number(r.sellingPrice || r.total) || 0).toFixed(2)}</span> },
    {
      header: 'Vendor Share (70%)',
      accessor: 'vendorAmount',
      render: (r) => <span className="font-bold text-amber-800">${(Number(r.vendorAmount) || 0).toFixed(2)}</span>
    },
    {
      header: 'Club Share (15%)',
      accessor: 'clubShare',
      render: (r) => <span className="font-bold text-emerald-800">${(Number(r.clubShare) || 0).toFixed(2)}</span>
    },
    {
      header: 'State Share (7%)',
      accessor: 'stateShare',
      render: (r) => <span className="font-bold text-blue-800">${(Number(r.stateShare) || 0).toFixed(2)}</span>
    },
    {
      header: 'National Share (8%)',
      accessor: 'nationalShare',
      render: (r) => <span className="font-bold text-forest-900">${(Number(r.nationalShare) || 0).toFixed(2)}</span>
    },
    {
      header: 'Payout Status',
      accessor: 'payoutStatus',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
          r.payoutStatus === 'Paid'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : r.payoutStatus === 'Approved'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {r.payoutStatus || 'Pending'}
        </span>
      )
    },
    {
      header: 'Payout Action',
      accessor: 'id',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.payoutStatus === 'Pending' && (
            <button
              onClick={() => updatePayoutStatus(r.id, 'Approved')}
              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-[10px] rounded cursor-pointer shadow-xs"
            >
              Approve
            </button>
          )}
          {r.payoutStatus !== 'Paid' && (
            <button
              onClick={() => updatePayoutStatus(r.id, 'Paid')}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] rounded cursor-pointer shadow-xs"
            >
              Mark Paid
            </button>
          )}
          {r.payoutStatus === 'Paid' && (
            <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Disbursed
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">National Revenue Sharing & Commission Settings</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-900/10 text-emerald-800 border border-emerald-800/20">
            Database-Driven Split Engine
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Configure dynamic commission percentages for Local Clubs (15%), State Associations (7%), National HQ (8%), and Vendor Payouts (70%).
        </p>
      </div>

      {/* Overview Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Merchandise Sales" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext="Gross platform retail sales" icon={DollarSign} />
        <StatCard title="Club Commissions (15%)" value={`$${totalClubComms.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext="Local club treasury payouts" icon={Building2} />
        <StatCard title="State Commissions (7%)" value={`$${totalStateComms.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext="State association shares" icon={MapPin} />
        <StatCard title="National Share (8%)" value={`$${totalNationalComms.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext="National HQ organization" icon={Globe} />
      </div>

      {/* 1. Dynamic Commission Settings Configurator */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-forest-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-tan-600" />
              <span>National Commission Settings Configurator</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Adjust platform commission splits. These values dynamically dictate revenue splits for all future orders.
            </p>
          </div>

          <span className="px-3 py-1 bg-tan-100 text-tan-900 font-black text-xs rounded-lg border border-tan-300">
            Platform Commission: {totalPlatformComm}% | Vendor: {vendorSharePct}%
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Club Percentage Input */}
              <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-2">
                <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Local Club Share %</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settingsForm.clubSharePct}
                    onChange={(e) => setSettingsForm({ ...settingsForm, clubSharePct: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-black bg-surface-lowest border border-surface-border rounded-lg text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                  <span className="font-bold text-xs text-charcoal-muted">%</span>
                </div>
                <p className="text-[10px] text-charcoal-muted">Default: 15% for Local Club Store orders</p>
              </div>

              {/* State Percentage Input */}
              <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-2">
                <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>State Association %</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settingsForm.stateSharePct}
                    onChange={(e) => setSettingsForm({ ...settingsForm, stateSharePct: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-black bg-surface-lowest border border-surface-border rounded-lg text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                  <span className="font-bold text-xs text-charcoal-muted">%</span>
                </div>
                <p className="text-[10px] text-charcoal-muted">Default: 7% for State Association</p>
              </div>

              {/* National Percentage Input */}
              <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-2">
                <label className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-forest-800" />
                  <span>National HQ Share %</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={settingsForm.nationalSharePct}
                    onChange={(e) => setSettingsForm({ ...settingsForm, nationalSharePct: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-black bg-surface-lowest border border-surface-border rounded-lg text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                  <span className="font-bold text-xs text-charcoal-muted">%</span>
                </div>
                <p className="text-[10px] text-charcoal-muted">Default: 8% for National Treasury</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-charcoal font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Changes save directly to database context & dictate all automated order splits.</span>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Commission Rules</span>
              </button>
            </div>
          </div>

          {/* Real-time Simulator Panel */}
          <div className="lg:col-span-4 bg-forest-950 text-white p-5 rounded-2xl border border-forest-800 space-y-3">
            <h4 className="font-black text-sm text-tan-300 flex items-center justify-between">
              <span>Split Simulator</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tan-500/20 text-tan-300">Live Preview</span>
            </h4>

            <div>
              <label className="text-[11px] text-tan-200 block font-semibold mb-1">Test Product Retail Price ($)</label>
              <input
                type="number"
                value={simulatedPrice}
                onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-forest-900 border border-forest-700 rounded-lg text-white font-bold"
              />
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-forest-800">
              <div className="flex justify-between"><span>Vendor Amount ({vendorSharePct}%):</span><strong className="text-amber-400">${simVendor}</strong></div>
              <div className="flex justify-between"><span>Club Share ({settingsForm.clubSharePct}%):</span><strong className="text-emerald-400">${simClub}</strong></div>
              <div className="flex justify-between"><span>State Share ({settingsForm.stateSharePct}%):</span><strong className="text-blue-400">${simState}</strong></div>
              <div className="flex justify-between"><span>National Share ({settingsForm.nationalSharePct}%):</span><strong className="text-tan-300">${simNational}</strong></div>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Order Revenue Distribution Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-forest-900">Order Distribution & Payout Management</h3>
            <p className="text-xs text-charcoal-muted">All customer merchandise purchases with auto-calculated revenue shares</p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full border border-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {pendingPayoutsCount} Pending Settlements
          </span>
        </div>

        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
};
