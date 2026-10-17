import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Search,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  X,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';

export const VendorManagementPage = () => {
  const { vendors = [], orders = [], updateFulfillmentStatus, showToast } = useApp();
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('All');
  const [editingOrder, setEditingOrder] = useState(null);
  const [fulfillmentForm, setFulfillmentForm] = useState({
    status: 'Shipped',
    trackingNumber: '',
    carrier: 'UPS Ground Drop-ship'
  });

  const filteredOrders = orders.filter((o) => {
    if (selectedVendorFilter === 'All') return true;
    return (o.vendorName || '').toLowerCase().includes(selectedVendorFilter.toLowerCase());
  });

  const handleOpenFulfillmentModal = (order) => {
    setEditingOrder(order);
    const existingTracking =
      order.trackingNumber && order.trackingNumber !== 'Pending Dispatch'
        ? order.trackingNumber
        : '';
    setFulfillmentForm({
      status: order.fulfillmentStatus || 'Shipped',
      trackingNumber: existingTracking,
      carrier: order.carrier || (order.vendorName?.includes('Garmin') ? 'FedEx Standard 2-Day' : 'UPS Ground Drop-ship')
    });
  };

  const handleGenerateTracking = () => {
    let prefix = '1Z';
    if (fulfillmentForm.carrier.includes('FedEx')) prefix = '78';
    else if (fulfillmentForm.carrier.includes('USPS')) prefix = '9400';
    else if (fulfillmentForm.carrier.includes('DHL')) prefix = 'JD';

    const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000);
    const generated = `${prefix}${randomDigits}`;
    setFulfillmentForm((prev) => ({
      ...prev,
      trackingNumber: generated,
      status: prev.status === 'Processing' ? 'Shipped' : prev.status
    }));
    showToast(`Generated tracking: ${generated}`, 'info');
  };

  const handleSaveFulfillment = (e) => {
    if (e) e.preventDefault();
    if (!editingOrder) return;

    let finalTracking = fulfillmentForm.trackingNumber.trim();
    if (!finalTracking) {
      if (fulfillmentForm.status === 'Processing') {
        finalTracking = 'Pending Dispatch';
      } else {
        // Auto-generate if shipped/delivered without tracking
        let prefix = '1Z';
        if (fulfillmentForm.carrier.includes('FedEx')) prefix = '78';
        else if (fulfillmentForm.carrier.includes('USPS')) prefix = '9400';
        finalTracking = `${prefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      }
    }

    updateFulfillmentStatus(editingOrder.id, fulfillmentForm.status, finalTracking, fulfillmentForm.carrier);
    setEditingOrder(null);
  };

  const handleInlineStatusChange = (order, newStatus) => {
    let tracking = order.trackingNumber;
    if (newStatus === 'Processing' && (!tracking || tracking === 'Pending Dispatch')) {
      tracking = 'Pending Dispatch';
    } else if (!tracking || tracking === 'Pending Dispatch') {
      tracking = `1Z${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    }
    updateFulfillmentStatus(order.id, newStatus, tracking, order.carrier || 'UPS Ground Drop-ship');
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (r) => (
        <span className="font-mono font-black text-forest-950 whitespace-nowrap text-xs sm:text-sm">
          {r.id}
        </span>
      )
    },
    {
      header: 'Assigned Vendor',
      accessor: 'vendorName',
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100/90 text-amber-950 font-extrabold text-[11px] border border-amber-300 shadow-2xs whitespace-nowrap leading-tight">
          {r.vendorName || 'Garmin Outdoor'}
        </span>
      )
    },
    {
      header: 'Product Items',
      accessor: 'product',
      render: (r) => (
        <div className="space-y-0.5 min-w-[200px] max-w-xs">
          <div className="font-extrabold text-forest-950 text-xs leading-snug line-clamp-2">
            {r.product || r.items}
          </div>
          <div className="text-[10px] text-charcoal-muted font-bold">
            Qty: 1 | Customer: <span className="text-charcoal font-black">{r.customer}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Shipping Destination',
      accessor: 'shippingAddress',
      render: (r) => (
        <div className="text-xs space-y-0.5 whitespace-nowrap">
          <div className="font-extrabold text-forest-950">
            {r.shippingAddress?.city || 'Knoxville'}, {r.shippingAddress?.state || 'TN'}
          </div>
          <div className="text-[10px] text-charcoal-muted font-medium">
            {r.shippingAddress?.address1 || 'Field Address'}
          </div>
        </div>
      )
    },
    {
      header: 'Fulfillment Status',
      accessor: 'fulfillmentStatus',
      render: (r) => {
        const current = r.fulfillmentStatus || 'Processing';
        const isDelivered = current.toLowerCase() === 'delivered';
        const isShipped = current.toLowerCase() === 'shipped';
        const isProcessing = current.toLowerCase() === 'processing';

        return (
          <div className="flex items-center gap-1.5">
            <select
              value={current}
              onChange={(e) => handleInlineStatusChange(r, e.target.value)}
              className={`px-2.5 py-1 text-xs font-black rounded-lg border cursor-pointer transition-colors outline-none ${
                isDelivered
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : isShipped
                  ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <option value="Processing">🟡 Processing</option>
              <option value="Shipped">🔵 Shipped</option>
              <option value="Delivered">🟢 Delivered</option>
            </select>
          </div>
        );
      }
    },
    {
      header: 'Tracking Number',
      accessor: 'trackingNumber',
      render: (r) => {
        const hasTracking = r.trackingNumber && r.trackingNumber !== 'Pending Dispatch';
        return (
          <div className="space-y-0.5">
            <div className={`font-mono text-xs font-black ${hasTracking ? 'text-forest-950' : 'text-amber-700 italic'}`}>
              {r.trackingNumber || 'Pending Dispatch'}
            </div>
            <div className="text-[10px] text-charcoal-muted font-bold flex items-center gap-1">
              <Truck className="w-3 h-3 text-tan-600" />
              <span>{r.carrier || 'UPS Ground'}</span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Fulfill Action',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => handleOpenFulfillmentModal(r)}
          className="px-3 py-1.5 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        >
          <Truck className="w-3.5 h-3.5 text-tan-400" />
          <span>Update Dispatch</span>
        </button>
      )
    }
  ];

  const totalOrdersCount = orders.length;
  const processingCount = orders.filter((o) => (o.fulfillmentStatus || '').toLowerCase() === 'processing').length;
  const shippedCount = orders.filter((o) => (o.fulfillmentStatus || '').toLowerCase() === 'shipped').length;
  const deliveredCount = orders.filter((o) => (o.fulfillmentStatus || '').toLowerCase() === 'delivered').length;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">
            Multi-Vendor Management & Drop-Ship Dispatch
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-900/10 text-amber-800 border border-amber-800/20">
            Fulfillment Portal
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Manage vendor inventory, order routing, drop-ship fulfillment, and courier tracking numbers across the platform.
        </p>
      </div>

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedVendorFilter(selectedVendorFilter === v.name ? 'All' : v.name)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedVendorFilter === v.name
                ? 'bg-forest-950 text-white border-forest-800 shadow-2xl ring-2 ring-tan-500'
                : 'bg-surface-lowest text-forest-950 border-surface-border hover:border-tan-500/60 shadow-ambient'
            }`}
          >
            <div className="flex items-center justify-between">
              <img src={v.logo} alt={v.name} className="w-10 h-10 rounded-xl object-cover border border-surface-border" />
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  selectedVendorFilter === v.name ? 'bg-tan-500 text-forest-950' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {v.status || 'Active'}
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm">{v.name}</h3>
              <p className={`text-[11px] ${selectedVendorFilter === v.name ? 'text-tan-200' : 'text-charcoal-muted'}`}>
                {v.shippingPolicy}
              </p>
            </div>

            <div
              className={`pt-2 border-t text-[11px] grid grid-cols-2 gap-2 font-bold ${
                selectedVendorFilter === v.name ? 'border-forest-800 text-tan-300' : 'border-surface-border text-charcoal-light'
              }`}
            >
              <div>Products: <strong>{v.productsCount}</strong></div>
              <div>In Stock: <strong>{v.inventoryUnits}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Dispatch Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-xl text-forest-900">Vendor Fulfillment & Tracking Queue</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-charcoal-muted">
                Filter by vendor: <strong>{selectedVendorFilter}</strong>
              </span>
              <span className="text-charcoal-muted">•</span>
              <span className="text-xs text-charcoal-muted">
                Showing <strong>{filteredOrders.length}</strong> of {totalOrdersCount} orders
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Summary Badges */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg">
                Processing: {processingCount}
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-lg">
                Shipped: {shippedCount}
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg">
                Delivered: {deliveredCount}
              </span>
            </div>

            {selectedVendorFilter !== 'All' && (
              <button
                onClick={() => setSelectedVendorFilter('All')}
                className="px-3 py-1.5 bg-surface-low border border-surface-border rounded-lg text-xs font-extrabold text-charcoal hover:bg-surface-border cursor-pointer transition-colors"
              >
                Clear Filter (Show All)
              </button>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Search by order ID, customer, product, or tracking..."
          filterField="fulfillmentStatus"
          filterOptions={['Processing', 'Shipped', 'Delivered']}
        />
      </div>

      {/* Update Fulfillment Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEditingOrder(null)}
        >
          <div
            className="bg-surface-lowest rounded-2xl border border-surface-border p-6 max-w-lg w-full shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5 text-tan-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-forest-900 leading-tight">
                    Update Dispatch: {editingOrder.id}
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">
                    Assigned to: <strong className="text-forest-950">{editingOrder.vendorName || 'Garmin Outdoor'}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Details Preview Box */}
            <div className="bg-surface-low p-3.5 rounded-xl border border-surface-border text-xs space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="font-extrabold text-forest-950 text-sm">
                  {editingOrder.product || editingOrder.items}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-forest-900 text-white shrink-0">
                  {editingOrder.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-charcoal-muted">
                <div>
                  Customer: <strong className="text-charcoal">{editingOrder.customer}</strong>
                </div>
                <div>
                  Destination: <strong className="text-charcoal">{editingOrder.shippingAddress?.city || 'Knoxville'}, {editingOrder.shippingAddress?.state || 'TN'}</strong>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFulfillment} className="space-y-4">
              {/* Carrier Selection */}
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">
                  Shipping Courier / Carrier
                </label>
                <select
                  value={fulfillmentForm.carrier}
                  onChange={(e) => setFulfillmentForm({ ...fulfillmentForm, carrier: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface border border-surface-border rounded-xl font-bold focus:outline-none focus:border-forest-800"
                >
                  <option value="UPS Ground Drop-ship">UPS Ground Drop-ship</option>
                  <option value="FedEx Standard 2-Day">FedEx Standard 2-Day Ground</option>
                  <option value="USPS Priority Mail">USPS Priority Mail Sanctioned</option>
                  <option value="DHL Express Courier">DHL Express Courier</option>
                  <option value="Direct Heritage Express">Direct Heritage Express Drop-Ship</option>
                </select>
              </div>

              {/* Fulfillment Status */}
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">
                  Fulfillment Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'Processing', label: '🟡 Processing', desc: 'Order forward' },
                    { val: 'Shipped', label: '🔵 Shipped', desc: 'In courier transit' },
                    { val: 'Delivered', label: '🟢 Delivered', desc: 'Handed to customer' }
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.val}
                      onClick={() => {
                        setFulfillmentForm((prev) => ({
                          ...prev,
                          status: s.val,
                          trackingNumber: s.val === 'Processing' && !prev.trackingNumber ? 'Pending Dispatch' : prev.trackingNumber
                        }));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fulfillmentForm.status === s.val
                          ? 'bg-forest-900 text-white border-forest-900 shadow-md font-black'
                          : 'bg-surface-low text-charcoal border-surface-border hover:border-forest-800 font-bold'
                      }`}
                    >
                      <div className="text-xs">{s.label}</div>
                      <div className={`text-[10px] ${fulfillmentForm.status === s.val ? 'text-tan-300' : 'text-charcoal-muted'}`}>
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Courier Tracking Number with Generator Helper */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-charcoal">
                    Courier Tracking Number
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateTracking}
                      className="text-[11px] font-extrabold text-tan-700 hover:text-tan-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Generate #</span>
                    </button>
                    {fulfillmentForm.trackingNumber && (
                      <button
                        type="button"
                        onClick={() => setFulfillmentForm({ ...fulfillmentForm, trackingNumber: '' })}
                        className="text-[11px] font-bold text-charcoal-muted hover:text-red-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 1Z9999999999999999 (or click Auto-Generate)"
                  value={fulfillmentForm.trackingNumber}
                  onChange={(e) => setFulfillmentForm({ ...fulfillmentForm, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface border border-surface-border rounded-xl font-mono font-bold focus:outline-none focus:border-forest-800"
                />
                <p className="text-[10px] text-charcoal-muted mt-1">
                  {fulfillmentForm.status === 'Processing'
                    ? 'Optional: Can be left blank or set to Pending Dispatch while order is packed.'
                    : 'Customer will receive this tracking code in their Member Portal order history.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-surface-low border border-surface-border rounded-xl text-xs font-bold text-charcoal hover:bg-surface-border cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4 text-tan-400" />
                  <span>Save Dispatch & Notify Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
