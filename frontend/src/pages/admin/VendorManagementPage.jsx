import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { Truck, Package, CheckCircle2, Clock, MapPin, Building2, Search, Edit, ExternalLink, ShieldCheck, Mail, Phone } from 'lucide-react';

export const VendorManagementPage = () => {
  const { vendors = [], orders = [], updateFulfillmentStatus, showToast } = useApp();
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('All');
  const [editingOrder, setEditingOrder] = useState(null);
  const [fulfillmentForm, setFulfillmentForm] = useState({
    status: 'Shipped',
    trackingNumber: ''
  });

  const filteredOrders = orders.filter((o) => {
    if (selectedVendorFilter === 'All') return true;
    return (o.vendorName || '').toLowerCase().includes(selectedVendorFilter.toLowerCase());
  });

  const handleOpenFulfillmentModal = (order) => {
    setEditingOrder(order);
    setFulfillmentForm({
      status: order.fulfillmentStatus || 'Shipped',
      trackingNumber: order.trackingNumber || ''
    });
  };

  const handleSaveFulfillment = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateFulfillmentStatus(editingOrder.id, fulfillmentForm.status, fulfillmentForm.trackingNumber);
    setEditingOrder(null);
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (r) => <span className="font-mono font-black text-forest-950 whitespace-nowrap text-xs sm:text-sm">{r.id}</span>
    },
    {
      header: 'Assigned Vendor',
      accessor: 'vendorName',
      render: (r) => (
        <span className="inline-flex items-center px-3 py-1 rounded-md bg-amber-100/90 text-amber-950 font-extrabold text-xs border border-amber-300 shadow-2xs whitespace-nowrap leading-tight tracking-tight">
          {r.vendorName || 'Garmin Outdoor'}
        </span>
      )
    },
    {
      header: 'Product Items',
      accessor: 'product',
      render: (r) => (
        <div className="space-y-0.5 max-w-xs">
          <div className="font-extrabold text-forest-950 text-xs leading-snug">{r.product || r.items}</div>
          <div className="text-[10px] text-charcoal-muted font-bold">Qty: 1 | Customer: <span className="text-charcoal font-black">{r.customer}</span></div>
        </div>
      )
    },
    {
      header: 'Shipping Destination',
      accessor: 'shippingAddress',
      render: (r) => (
        <div className="text-xs space-y-0.5 whitespace-nowrap">
          <div className="font-extrabold text-forest-950">{r.shippingAddress?.city || 'Knoxville'}, {r.shippingAddress?.state || 'TN'}</div>
          <div className="text-[10px] text-charcoal-muted font-medium">{r.shippingAddress?.address1 || 'Field Address'}</div>
        </div>
      )
    },
    {
      header: 'Fulfillment Status',
      accessor: 'fulfillmentStatus',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
          r.fulfillmentStatus === 'Delivered'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : r.fulfillmentStatus === 'Shipped'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {r.fulfillmentStatus || 'Processing'}
        </span>
      )
    },
    {
      header: 'Tracking Number',
      accessor: 'trackingNumber',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-forest-900">
          {r.trackingNumber || 'Pending Dispatch'}
        </span>
      )
    },
    {
      header: 'Fulfill Action',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => handleOpenFulfillmentModal(r)}
          className="px-3 py-1.5 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Truck className="w-3.5 h-3.5 text-tan-400" />
          <span>Update Dispatch</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Multi-Vendor Management & Drop-Ship Dispatch</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-900/10 text-amber-800 border border-amber-800/20">
            Fulfillment Portal
          </span>
        </div>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Manage vendor inventory, order routing, drop-ship fulfillment, and courier tracking numbers.
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
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                selectedVendorFilter === v.name ? 'bg-tan-500 text-forest-950' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {v.status || 'Active'}
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm">{v.name}</h3>
              <p className={`text-[11px] ${selectedVendorFilter === v.name ? 'text-tan-200' : 'text-charcoal-muted'}`}>
                {v.shippingPolicy}
              </p>
            </div>

            <div className={`pt-2 border-t text-[11px] grid grid-cols-2 gap-2 font-bold ${
              selectedVendorFilter === v.name ? 'border-forest-800 text-tan-300' : 'border-surface-border text-charcoal-light'
            }`}>
              <div>Products: <strong>{v.productsCount}</strong></div>
              <div>In Stock: <strong>{v.inventoryUnits}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Dispatch Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-xl text-forest-900">Vendor Fulfillment & Tracking Queue</h3>
            <p className="text-xs text-charcoal-muted">Filter by vendor: <strong>{selectedVendorFilter}</strong></p>
          </div>

          {selectedVendorFilter !== 'All' && (
            <button
              onClick={() => setSelectedVendorFilter('All')}
              className="px-3 py-1.5 bg-surface-low border border-surface-border rounded-lg text-xs font-extrabold text-charcoal hover:bg-surface-border cursor-pointer"
            >
              Clear Filter (Show All Vendors)
            </button>
          )}
        </div>

        <DataTable columns={columns} data={filteredOrders} />
      </div>

      {/* Update Fulfillment Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg text-forest-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-tan-600" />
              <span>Update Order #{editingOrder.id} Fulfillment</span>
            </h3>

            <form onSubmit={handleSaveFulfillment} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Fulfillment Status</label>
                <select
                  value={fulfillmentForm.status}
                  onChange={(e) => setFulfillmentForm({ ...fulfillmentForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface border border-surface-border rounded-xl font-bold focus:outline-none focus:border-forest-800"
                >
                  <option value="Processing">Processing (Vendor Order Forwarded)</option>
                  <option value="Shipped">Shipped (Dispatched to Courier)</option>
                  <option value="Delivered">Delivered (Handed to Customer)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1Z9999999999999999 (FedEx / UPS / USPS)"
                  value={fulfillmentForm.trackingNumber}
                  onChange={(e) => setFulfillmentForm({ ...fulfillmentForm, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface border border-surface-border rounded-xl font-bold focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-surface-low border border-surface-border rounded-xl text-xs font-bold text-charcoal hover:bg-surface-border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Save Dispatch & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
