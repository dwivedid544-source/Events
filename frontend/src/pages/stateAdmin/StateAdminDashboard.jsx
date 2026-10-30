import React from 'react';
import { useApp , API_BASE_URL} from '../../context/AppContext';
import { apiClient } from '../../utils/apiClient';
import { StatCard } from '../../components/common/StatCard';
import { Users, Building2, Calendar, DollarSign, MapPin, Trophy, Landmark, CheckCircle2, ShieldCheck, Save, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StateAdminDashboard = () => {
  const { states, clubs, events, members, orders = [] } = useApp();

  // Dedicated Flow-Wise Page Load API Call to Express Backend & MySQL `club` Database
  React.useEffect(() => {
    apiClient
      .get('/states/tn')
      .then((data) => {
        console.log('📡 [State Admin Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching state admin API:', err.message));
  }, []);
  const { showToast, currentUser } = useApp();
  const [selectedStateCode, setSelectedStateCode] = React.useState(() => {
    return currentUser?.stateCode || (currentUser?.state?.toLowerCase().includes('hawaii') ? 'HI' : 'TN');
  });

  const myState = states.find(s => s.code === selectedStateCode || s.name.toLowerCase().includes(selectedStateCode.toLowerCase())) || states[0] || {};
  const cleanStateName = (myState.name || 'Tennessee').replace(/\s*State\s*Association.*/gi, '').trim();
  const stateTitle = myState.name?.includes('Association') ? myState.name : `${cleanStateName} State Association`;

  // Bank Account State for State Direct Deposit
  const [bankInfo, setBankInfo] = React.useState(() => {
    const saved = localStorage.getItem(`nh_bank_state_${myState.code || 'default'}`);
    return saved ? JSON.parse(saved) : {
      bankName: 'First Hawaiian Bank',
      accountHolder: 'Hawaii State Hunting Association LLC',
      routingNumber: '121301574',
      accountNumber: '••••••••4892',
      accountType: 'Checking',
      status: 'Verified & Active'
    };
  });

  const [isEditingBank, setIsEditingBank] = React.useState(false);

  const handleSaveBank = (e) => {
    e.preventDefault();
    localStorage.setItem(`nh_bank_state_${myState.code || 'default'}`, JSON.stringify(bankInfo));
    setIsEditingBank(false);
    showToast(`Bank deposit account successfully connected for ${stateTitle} Treasury!`, 'success');
  };

  // Calculate State Merchandise Sales & 7% Commissions
  const myStateOrders = orders.filter((o) => (o.state === myState.name || o.orderSource?.includes(myState.name) || o.originType === 'STATE' || o.originType === 'CLUB'));
  const stateMerchSales = myStateOrders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0);
  const stateCommissionsEarned = myStateOrders.reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const pendingStatePayouts = myStateOrders.filter((o) => o.payoutStatus === 'Pending').reduce((a, b) => a + (Number(b.stateShare) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-forest-800 text-white rounded-xl p-6 lg:p-8 shadow-ambient flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-400">Assigned Scope: State Charter</span>
            <select
              value={selectedStateCode}
              onChange={(e) => setSelectedStateCode(e.target.value)}
              className="bg-forest-900 border border-forest-700 text-tan-300 text-xs font-black rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="HI">Hawaii (HI) - Active Sandbox</option>
              <option value="TN">Tennessee (TN)</option>
              <option value="TX">Texas (TX)</option>
              {states.filter(s => !['HI', 'TN', 'TX'].includes(s.code)).map(s => (
                <option key={s.id} value={s.code}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{stateTitle}</h1>
          <p className="text-xs text-tan-200 mt-1">State Admin: <strong>{myState.adminName || 'James Wadley'}</strong> • Governance over {myState.clubsCount || 5} Local Clubs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/resources" className="px-4 py-2 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-lg shadow flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>State Management Center</span>
          </Link>
          <Link to="/state-admin/membership" className="px-4 py-2 bg-forest-950 hover:bg-forest-900 text-white font-extrabold text-xs rounded-lg shadow border border-forest-700">
            State Memberships
          </Link>
          <Link to="/state-admin/clubs" className="px-4 py-2 bg-forest-950 hover:bg-forest-900 text-white font-extrabold text-xs rounded-lg shadow border border-forest-700">
            Manage State Clubs
          </Link>
        </div>
      </div>

      {/* State Management Center Tile Callout */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-950 p-6 rounded-2xl border-2 border-tan-500/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
            State Officer Resource Center
          </span>
          <h2 className="text-lg font-black text-white">STATE MANAGEMENT CENTER</h2>
          <p className="text-xs text-tan-200">
            Master repository for Documents & Forms, Annual Planning, Financial Templates, State Event Calendars, and Disciplinary Policies.
          </p>
        </div>
        <Link
          to="/resources"
          className="px-5 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow transition-all shrink-0 cursor-pointer"
        >
          Open Forms & Documents →
        </Link>
      </div>

      {/* 5-Stream Daily Financial Revenue Tracking (Client Specification) */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h3 className="font-black text-base text-forest-950 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Daily Revenue & Financial Tracking (5 Core Streams)</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Real-time daily tracking of state revenues across all chartered chapters and sanctioned operations.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl">
            Total State Revenue: $6,715.00
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
            <span className="text-[10px] text-charcoal-muted uppercase font-black block">1. Monthly Memberships</span>
            <div className="text-lg font-black text-forest-950">$2,850.00</div>
            <span className="text-[10px] text-emerald-700 font-bold block">114 State Signups</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
            <span className="text-[10px] text-charcoal-muted uppercase font-black block">2. Sanctioned Events</span>
            <div className="text-lg font-black text-blue-900">$1,920.00</div>
            <span className="text-[10px] text-blue-700 font-bold block">Championship Entries</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
            <span className="text-[10px] text-charcoal-muted uppercase font-black block">3. Merchandise (7% Split)</span>
            <div className="text-lg font-black text-tan-800">`${stateCommissionsEarned.toFixed(2)}`</div>
            <span className="text-[10px] text-charcoal-muted font-bold block">Wholesale Drop-Ship</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
            <span className="text-[10px] text-charcoal-muted uppercase font-black block">4. Fundraising Drives</span>
            <div className="text-lg font-black text-purple-900">$650.00</div>
            <span className="text-[10px] text-purple-700 font-bold block">Youth Clinics & Conservation</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-1">
            <span className="text-[10px] text-charcoal-muted uppercase font-black block">5. Direct Donations</span>
            <div className="text-lg font-black text-emerald-800">$420.00</div>
            <span className="text-[10px] text-emerald-700 font-bold block">Public State Pledges</span>
          </div>

          <div className="p-4 rounded-xl bg-forest-950 text-white border-2 border-tan-500 space-y-1">
            <span className="text-[10px] text-tan-300 uppercase font-black block">TOTAL STATE TREASURY</span>
            <div className="text-lg font-black text-emerald-400">$6,715.00</div>
            <span className="text-[10px] text-tan-200 font-bold block">Current Active Balance</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active State Members" value={myState.membersCount.toLocaleString()} subtext="Across 42 Clubs" icon={Users} trend="+8% YTD" />
        <StatCard title="Participating Clubs" value={myState.clubsCount.toString()} subtext="Chartered Local Clubs" icon={Building2} />
        <StatCard title="Merchandise Sales" value={`${stateMerchSales.toFixed(2)}`} subtext={`${myStateOrders.length} State & Club Orders`} icon={Calendar} />
        <StatCard title="State Commission (7%)" value={`${stateCommissionsEarned.toFixed(2)}`} subtext={`Pending Payout: ${pendingStatePayouts.toFixed(2)}`} icon={DollarSign} trend="+7% Margin Share" />
      </div>

      {/* State Direct Deposit & Banking Configuration Card */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                <span>{stateTitle} Treasury & Direct Deposit Settings</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {bankInfo.status}
                </span>
              </h3>
              <p className="text-xs text-charcoal-muted">Attached bank account for receiving 7% state membership dues and merchandise splits.</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingBank(!isEditingBank)}
            className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all self-start sm:self-center"
          >
            {isEditingBank ? 'Cancel' : 'Edit Bank Account'}
          </button>
        </div>

        {isEditingBank ? (
          <form onSubmit={handleSaveBank} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-charcoal mb-1">Financial Institution</label>
              <input
                type="text"
                required
                value={bankInfo.bankName}
                onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                placeholder="e.g. First Hawaiian Bank / Chase"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Holder Legal Name</label>
              <input
                type="text"
                required
                value={bankInfo.accountHolder}
                onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                placeholder="e.g. Hawaii Hunting Association LLC"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Routing Number (ACH 9-digit)</label>
              <input
                type="text"
                required
                maxLength={9}
                value={bankInfo.routingNumber}
                onChange={(e) => setBankInfo({ ...bankInfo, routingNumber: e.target.value })}
                placeholder="121301574"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Account Number</label>
              <input
                type="text"
                required
                value={bankInfo.accountNumber}
                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                placeholder="48291038192"
                className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg font-mono font-bold text-forest-950 focus:outline-none focus:border-forest-800"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save State Bank Account Info
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Bank Name</span>
              <strong className="text-sm font-extrabold text-forest-950">{bankInfo.bankName}</strong>
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Legal Account Name</span>
              <strong className="text-sm font-extrabold text-forest-950">{bankInfo.accountHolder}</strong>
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">ACH Routing #</span>
              <strong className="text-sm font-mono font-black text-forest-950">{bankInfo.routingNumber}</strong>
            </div>
            <div className="p-3 bg-surface-low rounded-xl border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Account Number</span>
              <strong className="text-sm font-mono font-black text-emerald-800">{bankInfo.accountNumber}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Clubs & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-forest-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-tan-500" /> Chartered Tennessee Clubs ({clubs.length})
            </h3>
            <Link to="/state-admin/clubs" className="text-xs font-bold text-forest-800 hover:underline">
              View All Clubs
            </Link>
          </div>

          <div className="space-y-3">
            {clubs.map((c) => (
              <div key={c.id} className="p-3.5 rounded-lg border bg-surface-low flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-charcoal">{c.name}</div>
                  <div className="text-[10px] text-charcoal-light">{c.city}, {c.state} • {c.membersCount} Members</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-forest-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-tan-500" /> State Sanctioned Events
            </h3>
            <Link to="/state-admin/events" className="text-xs font-bold text-forest-800 hover:underline">
              Manage Events
            </Link>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map((e) => (
              <div key={e.id} className="p-3.5 rounded-lg border bg-surface-low flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-charcoal">{e.name}</div>
                  <div className="text-[10px] text-charcoal-light">{e.club} • {e.date}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-tan-100 text-tan-900 border">
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Association Store Orders & 7% Revenue Split Table */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div>
            <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-700" />
              <span>Tennessee State Association Store Orders & 7% Share Ledger</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Transparent breakdown showing order value, 7% state share ($), local club share (15%), national share (8%), and vendor payout.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-lg border border-amber-300">
            Total State Margin: ${stateCommissionsEarned.toFixed(2)}
          </span>
        </div>

        {myStateOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-low text-charcoal font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-3">Order ID & Customer</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Order Origin</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3 text-right text-amber-700">State Share (7%)</th>
                  <th className="p-3 text-right text-emerald-700">Club Share (15%)</th>
                  <th className="p-3 text-right text-forest-900">National (8%)</th>
                  <th className="p-3 text-center">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-medium">
                {myStateOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">
                      <div>{o.customer}</div>
                      <div className="text-[10px] text-charcoal-muted font-mono">{o.id} • {o.date || 'Aug 10'}</div>
                    </td>
                    <td className="p-3 font-semibold text-charcoal">{o.product || o.items}</td>
                    <td className="p-3 text-charcoal-muted font-bold">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-surface-low border text-forest-950">
                        {o.orderSource || o.originType}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-forest-950">${(Number(o.sellingPrice || o.total) || 0).toFixed(2)}</td>
                    <td className="p-3 text-right font-black text-amber-800 bg-amber-50/50">${(Number(o.stateShare) || 0).toFixed(2)}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-800">${(Number(o.clubShare) || 0).toFixed(2)}</td>
                    <td className="p-3 text-right font-extrabold text-forest-900">${(Number(o.nationalShare) || 0).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        o.payoutStatus === 'Approved' || o.payoutStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {o.payoutStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-charcoal-muted bg-surface-low rounded-xl border">
            No merchandise orders recorded for this state scope yet.
          </div>
        )}
      </div>
    </div>
  );
};
