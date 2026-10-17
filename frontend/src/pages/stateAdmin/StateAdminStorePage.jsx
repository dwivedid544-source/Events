import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  ShoppingBag,
  DollarSign,
  Building2,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  User,
  Mail,
  ShieldCheck,
  Search,
  Plus,
  X,
  Package,
  Upload,
  Trash2
} from 'lucide-react';

export const StateAdminStorePage = () => {
  const { states, orders = [], updatePayoutStatus, addProduct, deleteProduct, products = [], showToast, currentUser } = useApp();
  const myState = states.find((s) => s.name === currentUser?.state || s.code === currentUser?.stateCode) || states[0] || { name: 'Tennessee', code: 'TN', id: 'state-1' };

  const [dateFilter, setDateFilter] = useState('All Time');
  const [channelFilter, setChannelFilter] = useState('ALL'); // 'ALL' | 'CLUB' | 'STATE'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding a new State Association product
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Gear',
    price: '',
    vendorName: 'Browning Outdoors',
    inStock: 40,
    image: '',
    description: ''
  });

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) {
      if (showToast) showToast('Please fill in both Product Name and Price.', 'error');
      return;
    }

    const priceNum = Number(prodForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      if (showToast) showToast('Please enter a valid retail price greater than $0.', 'error');
      return;
    }

    const wholesale = Number((priceNum * 0.7).toFixed(2));
    const margin = Number((priceNum * 0.3).toFixed(2));

    if (addProduct) {
      addProduct({
        id: `prod-${Date.now()}`,
        name: prodForm.name,
        category: prodForm.category,
        price: priceNum,
        wholesaleCost: wholesale,
        margin: margin,
        vendorName: prodForm.vendorName,
        inStock: Number(prodForm.inStock) || 40,
        scopeChannel: 'STATE',
        organizationType: 'STATE',
        scopeEntity: `${myState.name} State Association`,
        organizationId: myState.id || myState.code || 'tn',
        image: prodForm.image || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80',
        description: prodForm.description || `Official ${myState.name} State Association merchandise. 7% margin directly funds state championship trials and events.`
      });
    }

    if (showToast) showToast(`Product "${prodForm.name}" added successfully to ${myState.name} store!`, 'success');

    setProdForm({
      name: '',
      category: 'Gear',
      price: '',
      vendorName: 'Browning Outdoors',
      inStock: 40,
      image: '',
      description: ''
    });
    setShowAddModal(false);
  };

  // Filter orders relevant to this State Association (Tennessee)
  const stateOrders = orders.filter((o) => {
    const isStateRelated =
      o.state === myState.name ||
      o.originType === 'STATE' ||
      o.originType === 'CLUB' ||
      (o.orderSource && o.orderSource.toLowerCase().includes('tennessee'));

    const matchesChannel =
      channelFilter === 'ALL' ||
      (channelFilter === 'CLUB' && o.originType === 'CLUB') ||
      (channelFilter === 'STATE' && o.originType === 'STATE');

    const matchesSearch =
      (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.product || o.items || '').toLowerCase().includes(searchQuery.toLowerCase());

    return isStateRelated && matchesChannel && matchesSearch;
  });

  // Calculate Metrics
  const totalStateSalesGross = stateOrders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0);
  const totalStateShare7 = stateOrders.reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const pendingStatePayout = stateOrders.filter((o) => o.payoutStatus === 'Pending').reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const settledStatePayout = stateOrders.filter((o) => o.payoutStatus === 'Paid' || o.payoutStatus === 'Approved').reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const displayProducts = products.filter(
    (p) =>
      p.scopeChannel === 'STATE' ||
      p.organizationType === 'STATE' ||
      (p.scopeEntity && p.scopeEntity.toLowerCase().includes((myState.name || '').toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes((myState.name || '').toLowerCase()))
  );

  const stateProductsCount = displayProducts.length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 px-2 sm:px-4 lg:px-6">
      {/* Header Banner */}
      <div className="bg-amber-950 text-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-tan-400 text-amber-950">
              State Association Revenue
            </span>
            <span className="text-[10px] text-tan-200 font-extrabold uppercase tracking-widest">
              {myState.name} State Association
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
            State Merchandise Store & 7% Commission Hub
          </h1>
          <p className="text-xs text-tan-100 opacity-90 max-w-2xl font-medium leading-relaxed">
            Audit store sales originating from {myState.name} State Store, add new state products to your landing page, and track exact 7% state commission earnings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-tan-400 hover:bg-tan-300 text-amber-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add State Product</span>
          </button>

          <div className="px-4 py-2.5 bg-amber-900/90 rounded-xl border border-amber-700/60 text-right">
            <div className="text-[10px] text-tan-300 font-bold uppercase tracking-wider">Total 7% State Revenue</div>
            <div className="text-xl font-black text-tan-300">${totalStateShare7.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Merchandise Sales" value={`$${totalStateSalesGross.toFixed(2)}`} subtext={`${stateOrders.length} State & Club Orders`} icon={DollarSign} />
        <StatCard title="State Share (7%)" value={`$${totalStateShare7.toFixed(2)}`} subtext="7% Margin Commission" icon={MapPin} trend="7% Share" />
        <StatCard title="Pending Payout" value={`$${pendingStatePayout.toFixed(2)}`} subtext="Pending Disbursement" icon={Clock} />
        <StatCard title="Settled Commission" value={`$${settledStatePayout.toFixed(2)}`} subtext="Paid to State Treasury" icon={CheckCircle2} />
        <StatCard title="Active State Products" value={stateProductsCount.toString()} subtext="Live on State Page" icon={Package} />
      </div>

      {/* Active State Products Catalog Section */}
      <div className="bg-surface-lowest p-4 sm:p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h3 className="font-black text-base sm:text-lg text-amber-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-700 shrink-0" />
              <span>Active {myState.name} State Products Catalog ({displayProducts.length})</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5 font-medium">
              Live merchandise catalog available for purchase on your state store landing page.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>
        </div>

        {displayProducts.length === 0 ? (
          <div className="p-8 text-center bg-surface-low rounded-xl border border-dashed border-surface-border space-y-2">
            <Package className="w-8 h-8 text-amber-700 mx-auto opacity-50" />
            <div className="font-black text-charcoal text-sm">No Active State Products Yet</div>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Click the "+ Add Product" button to add merchandise for {myState.name} State Association.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-black rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProducts.map((prod) => (
              <div key={prod.id} className="p-4 rounded-xl border border-surface-border bg-surface-low space-y-3 flex flex-col justify-between shadow-xs relative group">
                <div className="flex gap-3 items-start">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80'}
                    alt={prod.name}
                    className="w-16 h-16 rounded-lg object-cover border border-surface-border shrink-0 shadow-xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1 pr-6">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-950 border border-amber-300">
                      {prod.category || 'Merchandise'}
                    </span>
                    <h4 className="font-extrabold text-xs text-forest-950 mt-1 line-clamp-1">{prod.name}</h4>
                    <p className="text-[10px] text-charcoal-muted line-clamp-2 mt-0.5">{prod.description}</p>
                  </div>
                  {deleteProduct && (
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="absolute top-3 right-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-bold">
                  <div>
                    <span className="text-charcoal-muted text-[10px] block">Retail Price</span>
                    <strong className="text-amber-950 text-sm font-black">${Number(prod.price).toFixed(2)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-800 text-[10px] font-bold block">7% State Share</span>
                    <span className="text-amber-950 font-extrabold text-xs bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      +${(Number(prod.price) * 0.07).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-surface-lowest p-4 sm:p-5 rounded-2xl border border-surface-border shadow-ambient flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-surface-border text-[11px] font-bold overflow-x-auto whitespace-nowrap scrollbar-none">
          {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setDateFilter(tf)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                dateFilter === tf ? 'bg-amber-800 text-white font-black shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, order ID..."
            className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-amber-700"
          />
        </div>
      </div>

      {/* Customer Orders & 7% State Share Table — Showing ONLY State Share (7%) */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden space-y-4">
        <div className="p-4 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base sm:text-lg text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <span>{myState.name} State Store Orders & 7% Share Table</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5 font-medium">
              Displays Customer Details (Name, Email), Product Purchased, Selling Price, and exact 7% State Association Share.
            </p>
          </div>

          <div className="text-xs font-extrabold text-amber-950 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-300">
            Assigned Scope: {myState.name} State Association
          </div>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="block md:hidden p-4 space-y-4">
          {stateOrders.map((o) => {
            const price = Number(o.sellingPrice || o.total) || 0;
            const stateVal = Number(o.stateShare) || 0;

            return (
              <div key={o.id} className="p-4 rounded-xl border border-surface-border bg-surface-low space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-black text-forest-950 text-sm flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{o.customer || 'Lalit Panchole'}</span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted font-medium flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-charcoal-light" />
                      <span>{o.email || 'pancholelalit52@gmail.com'}</span>
                    </div>
                    <div className="text-[10px] text-charcoal-light font-mono mt-0.5">
                      Order ID: <strong>{o.id}</strong> • {o.date || 'Aug 10'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border bg-amber-50 text-amber-950 border-amber-300 shrink-0">
                    {o.orderSource || o.originType}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-lowest border border-surface-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-charcoal-muted block">Product Purchased</span>
                      <span className="text-forest-950 font-extrabold">{o.product || o.items}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-charcoal-muted block">Selling Price</span>
                      <span className="text-base font-black text-forest-950">${price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-surface-border flex items-center justify-between font-bold">
                    <span className="text-amber-950">Tennessee State Share (7%):</span>
                    <span className="text-base font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      ${stateVal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => updatePayoutStatus(o.id, o.payoutStatus === 'Paid' ? 'Pending' : 'Paid')}
                    className={`w-full py-2 rounded-lg text-xs font-black shadow-xs transition-all cursor-pointer ${
                      o.payoutStatus === 'Paid'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-amber-500 text-forest-950 hover:bg-amber-600'
                    }`}
                  >
                    {o.payoutStatus === 'Paid' ? 'Settled to State Treasury' : 'Approve State Payout'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP TABLE VIEW — Showing ONLY State Share (7%) */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-surface-border shadow-sm bg-surface-lowest">
          <table className="w-full text-left text-xs min-w-[800px] border-collapse">
            <thead className="bg-surface-low text-charcoal font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
              <tr>
                <th className="p-3.5 min-w-[180px]">Customer Details</th>
                <th className="p-3.5 min-w-[200px]">Product & Vendor</th>
                <th className="p-3.5 min-w-[170px]">Channel Origin</th>
                <th className="p-3.5 text-right min-w-[110px] whitespace-nowrap">Selling Price</th>
                <th className="p-3.5 text-right bg-amber-100/60 text-amber-950 min-w-[180px] whitespace-nowrap">State Share (7%)</th>
                <th className="p-3.5 text-center min-w-[130px] whitespace-nowrap">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {stateOrders.map((o) => {
                const price = Number(o.sellingPrice || o.total) || 0;
                const stateVal = Number(o.stateShare) || 0;

                return (
                  <tr key={o.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Customer Details */}
                    <td className="p-3.5 min-w-[180px]">
                      <div className="font-extrabold text-forest-950 text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{o.customer || 'Lalit Panchole'}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <Mail className="w-3 h-3 text-charcoal-light shrink-0" />
                        <span>{o.email || 'pancholelalit52@gmail.com'}</span>
                      </div>
                      <div className="text-[10px] text-charcoal-light font-mono mt-0.5 whitespace-nowrap">
                        ID: <strong className="text-forest-900">{o.id}</strong> • {o.date || 'Aug 10, 2026'}
                      </div>
                    </td>

                    {/* Product & Vendor */}
                    <td className="p-3.5 min-w-[200px]">
                      <div className="font-black text-charcoal text-xs leading-snug">{o.product || o.items}</div>
                      <div className="text-[10px] text-charcoal-muted flex items-center gap-1 mt-1 whitespace-nowrap">
                        <Truck className="w-3 h-3 text-charcoal-light shrink-0" />
                        <span>Vendor: <strong className="text-charcoal">{o.vendorName || 'Garmin Outdoor'}</strong></span>
                      </div>
                    </td>

                    {/* Channel Origin */}
                    <td className="p-3.5 min-w-[170px]">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border whitespace-nowrap shadow-2xs ${
                        o.originType === 'CLUB'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        {o.orderSource || o.originType}
                      </span>
                    </td>

                    {/* Retail Selling Price */}
                    <td className="p-3.5 text-right min-w-[110px] whitespace-nowrap">
                      <div className="font-black text-forest-950 text-sm">${price.toFixed(2)}</div>
                      <div className="text-[9px] text-charcoal-muted font-bold">100% Retail</div>
                    </td>

                    {/* State Share (7%) - HIGHLIGHTED */}
                    <td className="p-3.5 text-right bg-amber-100/60 border-x border-amber-200 min-w-[180px] whitespace-nowrap">
                      <div className="font-black text-amber-950 text-base font-mono">${stateVal.toFixed(2)}</div>
                      <div className="text-[9px] text-amber-900 font-extrabold">7% State Margin Share</div>
                    </td>

                    {/* Payout Status */}
                    <td className="p-3.5 text-center min-w-[130px] whitespace-nowrap">
                      <button
                        onClick={() => updatePayoutStatus(o.id, o.payoutStatus === 'Paid' ? 'Pending' : 'Paid')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black shadow-xs transition-all cursor-pointer ${
                          o.payoutStatus === 'Paid'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-500 text-forest-950 hover:bg-amber-600'
                        }`}
                      >
                        {o.payoutStatus === 'Paid' ? 'Settled to State' : 'Approve Payout'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD STATE ASSOCIATION PRODUCT (FULL RESPONSIVE) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col p-5 sm:p-6 animate-fade-in my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-border pb-3 shrink-0">
              <div className="flex items-center gap-2 text-amber-950 font-black text-base">
                <Package className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Add State Association Product</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-surface-low transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body (Scrollable if height exceeds screen) */}
            <form onSubmit={handleAddProductSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs font-medium scrollbar-thin">
              <div>
                <label className="block text-charcoal font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. Tennessee State Championship Water Race Lead"
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal font-bold mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                  >
                    <option value="Gear">Gear</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Caps">Caps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-charcoal font-bold mb-1">Retail Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="649.99"
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal font-bold mb-1">Vendor Name</label>
                  <select
                    value={prodForm.vendorName}
                    onChange={(e) => setProdForm({ ...prodForm, vendorName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                  >
                    <option value="Browning Outdoors">Browning Outdoors</option>
                    <option value="Drake Waterfowl">Drake Waterfowl</option>
                    <option value="Filson Outdoors">Filson Outdoors</option>
                    <option value="Garmin Outdoor">Garmin Outdoor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-charcoal font-bold mb-1">In Stock Qty</label>
                  <input
                    type="number"
                    value={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Product Photo Upload Section */}
              <div className="space-y-2 pt-1 border-t border-surface-border">
                <label className="block text-charcoal font-bold">Product Photo / Image *</label>

                {/* Live Image Preview if Image is Selected */}
                {prodForm.image ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-amber-600 bg-surface-low group shadow-xs">
                    <img src={prodForm.image} alt="Preview" className="w-full h-full object-contain bg-surface-low" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setProdForm({ ...prodForm, image: '' })}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-surface-border hover:border-amber-600 rounded-2xl p-4 bg-surface-low text-center space-y-2 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-charcoal block">Upload Product Photo</span>
                      <span className="text-[10px] text-charcoal-muted block">Choose image file from your device</span>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProdForm({ ...prodForm, image: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-[11px] text-charcoal-muted file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                    />
                  </div>
                )}

                {/* Direct Image URL input backup */}
                <div className="pt-1">
                  <span className="text-[10px] text-charcoal-muted font-semibold block mb-0.5">Or paste direct image URL:</span>
                  <input
                    type="url"
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 bg-surface-low border border-surface-border rounded-xl font-mono text-[11px] truncate focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal font-bold mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Official Tennessee State Association merchandise..."
                  className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-amber-700"
                ></textarea>
              </div>

              {/* Fixed Footer Buttons at bottom of form */}
              <div className="pt-3 border-t border-surface-border sticky bottom-0 bg-surface-lowest flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-low hover:bg-surface-border text-charcoal font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to State Store</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
