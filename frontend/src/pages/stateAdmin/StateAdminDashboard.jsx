import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Users, Building2, Calendar, DollarSign, MapPin, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StateAdminDashboard = () => {
  const { states, clubs, events, members, orders = [] } = useApp();

  // Dedicated Flow-Wise Page Load API Call to Express Backend & MySQL `club` Database
  React.useEffect(() => {
    fetch('http://localhost:5050/api/v1/states/tn')
      .then((res) => res.json())
      .then((data) => {
        console.log('📡 [State Admin Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching state admin API:', err.message));
  }, []);
  const myState = states[0] || {}; // Tennessee Association

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
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-400">Assigned Scope: State Charter</span>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">{myState.name} State Association</h1>
          <p className="text-xs text-tan-200 mt-1">State Admin: {myState.adminName} • Governance over {myState.clubsCount} Local Clubs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/state-admin/membership" className="px-4 py-2 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-lg shadow">
            State Membership System
          </Link>
          <Link to="/state-admin/clubs" className="px-4 py-2 bg-forest-950 hover:bg-forest-900 text-white font-extrabold text-xs rounded-lg shadow border border-forest-700">
            Manage State Clubs
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active State Members" value={myState.membersCount.toLocaleString()} subtext="Across 42 Clubs" icon={Users} trend="+8% YTD" />
        <StatCard title="Participating Clubs" value={myState.clubsCount.toString()} subtext="Chartered Local Clubs" icon={Building2} />
        <StatCard title="Merchandise Sales" value={`$${stateMerchSales.toFixed(2)}`} subtext={`${myStateOrders.length} State & Club Orders`} icon={Calendar} />
        <StatCard title="State Commission (7%)" value={`$${stateCommissionsEarned.toFixed(2)}`} subtext={`Pending Payout: $${pendingStatePayouts.toFixed(2)}`} icon={DollarSign} trend="+7% Margin Share" />
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
