import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { DataTable } from '../../components/common/DataTable';
import { BarChart3, TrendingUp, Calendar, Filter, DollarSign, Building2, MapPin, Truck, ShoppingBag, Award, Download, PieChart } from 'lucide-react';

export const AnalyticsReportsPage = () => {
  const { orders = [], userMemberships = [], vendors = [], clubs = [], states = [] } = useApp();

  const [dateFilter, setDateFilter] = useState('This Year');
  const [activeReportTab, setActiveReportTab] = useState('By Club');

  // Filter orders by date range
  const filterOrdersByDate = (items) => {
    // Return all items for demonstration in mock, but filterable
    return items;
  };

  const currentOrders = filterOrdersByDate(orders);

  // Aggregation Calculations
  const totalMerchRev = currentOrders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0);
  const totalMembershipRev = userMemberships.reduce((a, b) => a + (Number(b.fee) || 25), 0);
  const totalCombinedRev = totalMerchRev + totalMembershipRev;

  // Sales by Club Aggregation
  const clubSalesMap = {};
  currentOrders.forEach((o) => {
    const club = o.orderSource || o.club || 'Oak Ridge Hunting Club';
    if (!clubSalesMap[club]) {
      clubSalesMap[club] = { clubName: club, ordersCount: 0, totalSales: 0, clubShare: 0 };
    }
    clubSalesMap[club].ordersCount += 1;
    clubSalesMap[club].totalSales += Number(o.sellingPrice || o.total) || 0;
    clubSalesMap[club].clubShare += Number(o.clubShare) || 0;
  });
  const clubSalesData = Object.values(clubSalesMap);

  // Sales by State Aggregation
  const stateSalesMap = {};
  currentOrders.forEach((o) => {
    const st = o.state || 'Tennessee';
    if (!stateSalesMap[st]) {
      stateSalesMap[st] = { stateName: st, ordersCount: 0, totalSales: 0, stateShare: 0 };
    }
    stateSalesMap[st].ordersCount += 1;
    stateSalesMap[st].totalSales += Number(o.sellingPrice || o.total) || 0;
    stateSalesMap[st].stateShare += Number(o.stateShare) || 0;
  });
  const stateSalesData = Object.values(stateSalesMap);

  // Sales by Vendor Aggregation
  const vendorSalesMap = {};
  currentOrders.forEach((o) => {
    const ven = o.vendorName || 'Garmin Outdoor';
    if (!vendorSalesMap[ven]) {
      vendorSalesMap[ven] = { vendorName: ven, ordersCount: 0, totalSales: 0, vendorShare: 0 };
    }
    vendorSalesMap[ven].ordersCount += 1;
    vendorSalesMap[ven].totalSales += Number(o.sellingPrice || o.total) || 0;
    vendorSalesMap[ven].vendorShare += Number(o.vendorAmount) || 0;
  });
  const vendorSalesData = Object.values(vendorSalesMap);

  const clubColumns = [
    { header: 'Local Club Name', accessor: 'clubName', render: (r) => <strong className="text-forest-950 font-black">{r.clubName}</strong> },
    { header: 'Total Orders', accessor: 'ordersCount', render: (r) => <span className="font-bold">{r.ordersCount}</span> },
    { header: 'Gross Merchandise Revenue', accessor: 'totalSales', render: (r) => <span className="font-bold text-forest-900">${r.totalSales.toFixed(2)}</span> },
    { header: 'Club Treasury Share (15%)', accessor: 'clubShare', render: (r) => <span className="font-extrabold text-emerald-700">${r.clubShare.toFixed(2)}</span> }
  ];

  const stateColumns = [
    { header: 'State Association', accessor: 'stateName', render: (r) => <strong className="text-forest-950 font-black">{r.stateName}</strong> },
    { header: 'Total Orders', accessor: 'ordersCount', render: (r) => <span className="font-bold">{r.ordersCount}</span> },
    { header: 'Gross Retail Sales', accessor: 'totalSales', render: (r) => <span className="font-bold text-forest-900">${r.totalSales.toFixed(2)}</span> },
    { header: 'State Association Share (7%)', accessor: 'stateShare', render: (r) => <span className="font-extrabold text-blue-700">${r.stateShare.toFixed(2)}</span> }
  ];

  const vendorColumns = [
    { header: 'Product Vendor', accessor: 'vendorName', render: (r) => <strong className="text-amber-900 font-black">{r.vendorName}</strong> },
    { header: 'Fulfilled Orders', accessor: 'ordersCount', render: (r) => <span className="font-bold">{r.ordersCount}</span> },
    { header: 'Gross Retail Sales', accessor: 'totalSales', render: (r) => <span className="font-bold text-forest-900">${r.totalSales.toFixed(2)}</span> },
    { header: 'Vendor Base Cost (70%)', accessor: 'vendorShare', render: (r) => <span className="font-extrabold text-amber-700">${r.vendorShare.toFixed(2)}</span> }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">National Platform Analytics & Financial Reports</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-forest-900/10 text-forest-900 border border-forest-800/20">
              Real-Time Metrics
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Comprehensive sales, commission splits, membership dues, and vendor payout reports across all 50 states & 635 local clubs.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface-low p-1.5 rounded-2xl border border-surface-border overflow-x-auto">
          {['Today', 'This Week', 'This Month', 'This Year', 'Previous Year', 'Custom Range'].map((tf) => (
            <button
              key={tf}
              onClick={() => setDateFilter(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                dateFilter === tf
                  ? 'bg-forest-950 text-white shadow-xs'
                  : 'text-charcoal-muted hover:bg-surface-border'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Gross Revenue" value={`$${totalCombinedRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext="Merchandise & Membership Combined" icon={DollarSign} />
        <StatCard title="Merchandise Sales Revenue" value={`$${totalMerchRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext={`${currentOrders.length} Completed Store Orders`} icon={ShoppingBag} />
        <StatCard title="Membership Dues Revenue" value={`$${totalMembershipRev.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} subtext={`${userMemberships.length} Active Member Subscriptions`} icon={Award} />
        <StatCard title="Active Revenue Entities" value="685+" subtext="National HQ, 50 States & 635 Clubs" icon={Building2} />
      </div>

      {/* Membership vs Merchandise Revenue Breakdown */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <h3 className="font-extrabold text-lg text-forest-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-tan-600" />
          <span>Revenue Streams Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-forest-950 text-white space-y-2 border border-forest-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-tan-300">Merchandise Sales Revenue</span>
              <span className="font-black text-amber-400 font-mono text-sm">${totalMerchRev.toFixed(2)}</span>
            </div>
            <div className="w-full bg-forest-900 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(totalMerchRev / totalCombinedRev) * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-tan-200 font-medium">100% Vendor drop-shipped gear, telemetry collars, vests & patch sets.</p>
          </div>

          <div className="p-4 rounded-xl bg-forest-950 text-white space-y-2 border border-forest-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-tan-300">Membership Dues Revenue</span>
              <span className="font-black text-emerald-400 font-mono text-sm">${totalMembershipRev.toFixed(2)}</span>
            </div>
            <div className="w-full bg-forest-900 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(totalMembershipRev / totalCombinedRev) * 100}%` }}></div>
            </div>
            <p className="text-[10px] text-tan-200 font-medium">Annual dues collected across National HQ, State Associations, and Local Clubs.</p>
          </div>
        </div>
      </div>

      {/* Detailed Reports Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          {['By Club', 'By State', 'By Vendor'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveReportTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeReportTab === tab
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-surface-low text-charcoal hover:bg-surface-border'
              }`}
            >
              Sales {tab} Report
            </button>
          ))}
        </div>

        {activeReportTab === 'By Club' && (
          <DataTable columns={clubColumns} data={clubSalesData} />
        )}

        {activeReportTab === 'By State' && (
          <DataTable columns={stateColumns} data={stateSalesData} />
        )}

        {activeReportTab === 'By Vendor' && (
          <DataTable columns={vendorColumns} data={vendorSalesData} />
        )}
      </div>
    </div>
  );
};
