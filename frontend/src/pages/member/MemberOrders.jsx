import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { ShoppingBag, DollarSign, PackageCheck, Truck } from 'lucide-react';

export const MemberOrders = () => {
  const { currentUser, orders = [] } = useApp();

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  // Always show all completed store orders so no order is ever hidden
  const userOrders = orders.length > 0 ? orders : [];

  // Normalize order objects defensively to prevent any undefined .toFixed() crashes
  const normalizedOrders = userOrders.map((o) => {
    const rawTotal = typeof o.total === 'number' ? o.total : (typeof o.amount === 'number' ? o.amount : 0);
    return {
      ...o,
      items: o.items || o.item || 'Sanctioned Gear / Equipment',
      total: rawTotal,
      amount: rawTotal,
      customer: o.customer || currentUser?.name || 'Lalit Panchole',
      email: o.email || currentUser?.email || 'pancholelalit52@gmail.com',
      paymentStatus: o.paymentStatus || 'Paid',
      fulfillmentStatus: o.fulfillmentStatus || o.status || 'Delivered'
    };
  });

  // Calculate quick summary metrics
  const totalSpent = normalizedOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const deliveredCount = normalizedOrders.filter((o) => o.fulfillmentStatus === 'Delivered').length;
  const inTransitCount = normalizedOrders.filter((o) => ['Shipped', 'Processing'].includes(o.fulfillmentStatus)).length;

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (r) => <span className="font-mono font-bold text-forest-800">{r.id}</span>
    },
    {
      header: 'Customer Details',
      accessor: 'customer',
      render: (r) => (
        <div>
          <div className="font-bold text-forest-950">{r.customer || 'Lalit Panchole'}</div>
          <div className="text-[10px] text-charcoal-muted font-medium">{r.email || 'pancholelalit52@gmail.com'}</div>
        </div>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Purchased Products',
      accessor: 'items',
      render: (r) => <span className="font-semibold text-charcoal">{r.items}</span>
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (r) => {
        const val = typeof r?.total === 'number' ? r.total : 0;
        return <span className="font-extrabold text-forest-900">${val.toFixed(2)}</span>;
      }
    },
    { header: 'Payment', accessor: 'paymentStatus', isStatus: true },
    { header: 'Fulfillment', accessor: 'fulfillmentStatus', isStatus: true },
    {
      header: 'Vendor Drop-Ship Logistics',
      accessor: 'fulfillmentStatus',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-tan-600 shrink-0" />
          <div>
            <div className="font-extrabold text-[11px] text-forest-950">Direct Vendor Drop-Ship</div>
            <div className="text-[9px] text-charcoal-muted font-mono font-bold">Tracking #UHC-99{r.id ? r.id.replace(/\D/g, '') : '812'}</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">
          {isSuperAdmin ? 'Platform Order History' : 'Order History'}
        </h1>
        <p className="text-xs text-charcoal-muted mt-0.5">
          {isSuperAdmin
            ? 'Complete audit ledger of merchandise, equipment, and license purchases'
            : 'Track your official gear, patches, and equipment purchases'}
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={normalizedOrders.length.toString()} subtext="Lifetime Orders" icon={ShoppingBag} />
        <StatCard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} subtext="Gear & Equipment" icon={DollarSign} />
        <StatCard title="Delivered" value={deliveredCount.toString()} subtext="Completed Shipments" icon={PackageCheck} />
        <StatCard title="In Transit" value={inTransitCount.toString()} subtext="Shipped & Processing" icon={Truck} />
      </div>

      {/* Main Orders Data Table */}
      <DataTable
        columns={columns}
        data={normalizedOrders}
        searchPlaceholder="Search order ID, products, date..."
        filterField="fulfillmentStatus"
        filterOptions={['Delivered', 'Shipped', 'Processing']}
      />
    </div>
  );
};

