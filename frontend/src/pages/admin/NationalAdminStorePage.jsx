import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  ShoppingBag,
  DollarSign,
  Building2,
  MapPin,
  Globe,
  Truck,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Mail,
  ShieldCheck,
  Search,
  Package,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const NationalAdminStorePage = () => {
  const {
    products,
    setProducts,
    vendors,
    orders = [],
    placeOrder,
    calculateOrderSplit,
    updatePayoutStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'catalog'
  const [dateFilter, setDateFilter] = useState('All Time'); // 'Today' | 'This Week' | 'This Month' | 'This Year' | 'Previous Year' | 'All Time'
  const [channelFilter, setChannelFilter] = useState('ALL'); // 'ALL' | 'CLUB' | 'STATE' | 'NATIONAL'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Gear',
    price: '',
    wholesaleCost: '',
    vendorName: vendors[0]?.name || 'Garmin Outdoor',
    inStock: '50',
    scopeChannel: 'LOCAL_CLUB',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    description: ''
  });

  // Manual Test Order Form State
  const [orderForm, setOrderForm] = useState({
    customerName: 'Lalit Panchole',
    customerEmail: 'pancholelalit52@gmail.com',
    customerPhone: '(865) 555-0199',
    productId: products[0]?.id || '',
    originType: 'CLUB', // CLUB | STATE | NATIONAL
    clubName: 'Oak Ridge Hunting Club',
    stateName: 'Tennessee'
  });

  // 1. Filter Orders by Date & Channel
  const filteredOrders = orders.filter((o) => {
    const matchesChannel = channelFilter === 'ALL' || o.originType === channelFilter;
    const matchesSearch =
      (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.product || o.items || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesChannel && matchesSearch;
  });

  // Financial Metrics Summaries
  const totalSalesGross = filteredOrders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0);
  const totalClubPayouts = filteredOrders.reduce((a, b) => a + (Number(b.clubShare) || 0), 0);
  const totalStatePayouts = filteredOrders.reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const totalNationalShare = filteredOrders.reduce((a, b) => a + (Number(b.nationalShare) || 0), 0);
  const totalVendorPayouts = filteredOrders.reduce((a, b) => a + (Number(b.vendorAmount) || 0), 0);

  // Handle Add Product Submit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.wholesaleCost) {
      showToast('Please fill in product name, retail price, and wholesale cost.', 'error');
      return;
    }

    const retail = parseFloat(productForm.price);
    const wholesale = parseFloat(productForm.wholesaleCost);
    const margin = Number((retail - wholesale).toFixed(2));

    const newProd = {
      id: `prod-custom-${Date.now()}`,
      name: productForm.name,
      category: productForm.category,
      price: retail,
      wholesaleCost: wholesale,
      margin: margin,
      vendorName: productForm.vendorName,
      inStock: parseInt(productForm.inStock) || 50,
      scopeChannel: productForm.scopeChannel,
      scopeEntity: productForm.scopeChannel === 'LOCAL_CLUB' ? 'Oak Ridge Hunting Club' : productForm.scopeChannel === 'STATE' ? 'Tennessee State Association' : 'Ultimate Hound Club (UHC) HQ',
      image: productForm.image,
      description: productForm.description || `${productForm.name} added by National Admin.`
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`New product "${newProd.name}" added to ${productForm.scopeChannel} store successfully!`, 'success');
    setShowAddProductModal(false);
    setProductForm({
      name: '',
      category: 'Gear',
      price: '',
      wholesaleCost: '',
      vendorName: vendors[0]?.name || 'Garmin Outdoor',
      inStock: '50',
      scopeChannel: 'LOCAL_CLUB',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
      description: ''
    });
  };

  // Handle Create Manual Order Submit
  const handleAddOrderSubmit = (e) => {
    e.preventDefault();
    const selProd = products.find((p) => p.id === orderForm.productId) || products[0];

    if (!selProd) {
      showToast('Please select a valid product.', 'error');
      return;
    }

    const names = orderForm.customerName.split(' ');
    const firstName = names[0] || 'Member';
    const lastName = names.slice(1).join(' ') || 'Customer';

    const orderSource =
      orderForm.originType === 'CLUB'
        ? orderForm.clubName
        : orderForm.originType === 'STATE'
        ? `${orderForm.stateName} State Store`
        : 'National HQ Store';

    const selectedProd = products.find((p) => p.id === orderForm.productId) || products[0] || {
      id: 'prd-custom',
      name: 'Official Merchandise Item',
      price: 50.00,
      vendorName: 'Garmin Outdoor'
    };

    const targetCartItems = [
      {
        id: selectedProd.id,
        name: selectedProd.name,
        category: selectedProd.category || 'Gear',
        price: selectedProd.price || 50.00,
        quantity: 1,
        vendorName: selectedProd.vendorName || 'Garmin Outdoor',
        image: selectedProd.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
      }
    ];

    // Cart item override for admin test order placeOrder execution
    const created = placeOrder({
      firstName,
      lastName,
      email: orderForm.customerEmail,
      phone: orderForm.customerPhone,
      address1: '1420 Hunting Ridge Rd',
      city: 'Knoxville',
      state: 'TN',
      zip: '37901',
      paymentMethod: 'credit_card',
      originType: orderForm.originType,
      orderSource,
      clubName: orderForm.clubName,
      stateName: orderForm.stateName,
      vendorName: selectedProd.vendorName || 'Garmin Outdoor',
      cartItems: targetCartItems
    });

    if (created) {
      showToast(`Test order ${created.id} generated with automatic percentage splits!`, 'success');
      setShowAddOrderModal(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 px-2 sm:px-4 lg:px-6">
      {/* Top Header */}
      <div className="bg-forest-950 text-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-forest-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-tan-500 text-forest-950">
              Governance & CMS
            </span>
            <span className="text-[10px] text-tan-400 font-extrabold uppercase tracking-widest">
              Multi-Vendor Revenue System
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
            National Merchandise Store & Revenue Split Hub
          </h1>
          <p className="text-xs text-tan-200 opacity-90 max-w-2xl font-medium leading-relaxed">
            Audit store sales, view customer order details, manage products, and inspect exact percentage margin splits (Club 15%, State 7%, National 8%, Vendor 70%).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => setShowAddOrderModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Test Order</span>
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-black text-xs rounded-xl border border-forest-700 shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Package className="w-4 h-4 text-tan-400" />
            <span>Add Vendor Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar - Actual Database Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Retail Sales" value={`$${totalSalesGross.toFixed(2)}`} subtext={`${filteredOrders.length} Actual Orders`} icon={DollarSign} />
        <StatCard title="Club Share (15%)" value={`$${totalClubPayouts.toFixed(2)}`} subtext="Local Club Treasury (15%)" icon={Building2} trend="15% Margin" />
        <StatCard title="State Share (7%)" value={`$${totalStatePayouts.toFixed(2)}`} subtext="State Association (7%)" icon={MapPin} trend="7% Margin" />
        <StatCard title="National Platform Share" value={`$${totalNationalShare.toFixed(2)}`} subtext="National HQ Revenue" icon={Globe} trend="HQ Share" />
        <StatCard title="Vendor Payouts (70%)" value={`$${totalVendorPayouts.toFixed(2)}`} subtext="Wholesale Drop-ship (70%)" icon={Truck} />
      </div>

      {/* Time-Period & Channel Filters Toolbar */}
      <div className="bg-surface-lowest p-4 sm:p-5 rounded-2xl border border-surface-border shadow-ambient flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-surface-low p-1 rounded-xl border border-surface-border w-full lg:w-auto overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 lg:flex-none px-3.5 sm:px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-forest-950 text-white shadow-md'
                : 'text-charcoal-muted hover:text-forest-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 lg:flex-none px-3.5 sm:px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-forest-950 text-white shadow-md'
                : 'text-charcoal-muted hover:text-forest-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Catalog ({products.length})</span>
          </button>
        </div>

        {/* Date Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto justify-end">
          {/* Date Filter Pills */}
          <div className="flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-surface-border text-[11px] font-bold overflow-x-auto whitespace-nowrap scrollbar-none">
            {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map((tf) => (
              <button
                key={tf}
                onClick={() => setDateFilter(tf)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  dateFilter === tf ? 'bg-tan-500 text-forest-950 font-black shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, order ID..."
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs bg-surface-lowest border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
            />
          </div>
        </div>
      </div>

      {/* TAB A: STORE ORDERS & PERCENTAGE SPLIT AUDIT LEDGER */}
      {activeTab === 'orders' && (
        <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base sm:text-lg text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Customer Orders & Percentage Margin Audit</span>
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5 font-medium">
                Displays Customer Details, Retail Price, Vendor Cost, and exact Share Calculations (Club 15%, State 7%, National 8%, Vendor 70%).
              </p>
            </div>

            {/* Channel Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-extrabold text-charcoal-muted mr-1 hidden sm:inline">Filter Channel:</span>
              <button
                onClick={() => setChannelFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  channelFilter === 'ALL' ? 'bg-forest-950 text-white shadow-xs' : 'bg-surface-low border border-surface-border text-charcoal'
                }`}
              >
                All Store Channels
              </button>
              <button
                onClick={() => setChannelFilter('NATIONAL')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  channelFilter === 'NATIONAL' ? 'bg-forest-900 text-tan-300 shadow-xs' : 'bg-surface-low border border-surface-border text-forest-900'
                }`}
              >
                National HQ Main Store
              </button>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (Shown on small screens <768px) */}
          <div className="block md:hidden p-4 space-y-4">
            {filteredOrders.map((o) => {
              const price = Number(o.sellingPrice || o.total) || 0;
              const wholesale = Number(o.wholesaleCost || o.vendorAmount) || price * 0.7;
              const profit = Number((price - wholesale).toFixed(2));
              const clubVal = Number(o.clubShare) || 0;
              const stateVal = Number(o.stateShare) || 0;
              const natVal = Number(o.nationalShare) || 0;
              const venVal = Number(o.vendorAmount) || price * 0.7;

              return (
                <div key={o.id} className="p-4 rounded-xl border border-surface-border bg-surface-low space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-black text-forest-950 text-sm flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-tan-600 shrink-0" />
                        <span>{o.customer}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-muted font-medium flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-charcoal-light" />
                        <span>{o.email}</span>
                      </div>
                      <div className="text-[10px] text-charcoal-light font-mono mt-0.5">
                        Order: <strong>{o.id}</strong> • {o.date || 'Aug 10'}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border shrink-0 ${
                      o.originType === 'CLUB'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : o.originType === 'STATE'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-forest-950 text-white border-forest-800'
                    }`}>
                      {o.orderSource || o.originType}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-lowest border border-surface-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-charcoal-muted block">Product & Vendor</span>
                        <span className="text-forest-950 font-extrabold">{o.product || o.items}</span>
                        <span className="text-[10px] text-charcoal-muted block font-normal">Vendor: {o.vendorName || 'Garmin'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-charcoal-muted block">Selling Price</span>
                        <span className="text-base font-black text-forest-950">${price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-surface-border grid grid-cols-2 gap-2 text-[10px] font-bold">
                      <div>
                        <span className="text-charcoal-muted block">Wholesale Cost (70%)</span>
                        <span className="font-black text-charcoal text-xs">${wholesale.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-800 block">Gross Profit Margin (30%)</span>
                        <span className="font-black text-emerald-800 text-xs">+${profit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Splits Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-900 font-bold block">Club Share (15%)</span>
                      <span className="text-xs font-black text-emerald-950">${clubVal.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200">
                      <span className="text-amber-900 font-bold block">State Share (7%)</span>
                      <span className="text-xs font-black text-amber-950">${stateVal.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded bg-forest-900/10 border border-forest-800/20">
                      <span className="text-forest-950 font-bold block">National Share (8%)</span>
                      <span className="text-xs font-black text-forest-950">${natVal.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface border border-surface-border">
                      <span className="text-charcoal-muted font-bold block">Vendor Drop-ship (70%)</span>
                      <span className="text-xs font-black text-charcoal">${venVal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => updatePayoutStatus(o.id, o.payoutStatus === 'Paid' ? 'Pending' : 'Paid')}
                      className={`w-full py-2 rounded-lg text-xs font-black shadow-xs transition-all cursor-pointer ${
                        o.payoutStatus === 'Paid'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-amber-500 text-forest-950 hover:bg-amber-600'
                      }`}
                    >
                      {o.payoutStatus === 'Paid' ? 'Status: Paid / Settled' : 'Approve Payout'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (Shown on screens >=768px) */}
          {/* DESKTOP TABLE VIEW (Shown on screens >=768px with horizontal scrolling) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-surface-border shadow-sm bg-surface-lowest">
            <table className="w-full text-left text-xs min-w-[950px] border-collapse">
              <thead className="bg-surface-low text-charcoal font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-3.5 min-w-[180px]">Customer Details</th>
                  <th className="p-3.5 min-w-[200px]">Product & Vendor</th>
                  <th className="p-3.5 min-w-[170px]">Channel Origin</th>
                  <th className="p-3.5 text-right min-w-[110px] whitespace-nowrap">Selling Price</th>
                  <th className="p-3.5 text-right min-w-[110px] whitespace-nowrap">Wholesale Cost</th>
                  <th className="p-3.5 text-right text-emerald-800 min-w-[125px] whitespace-nowrap bg-emerald-50/40">Gross Profit ($ / %)</th>
                  <th className="p-3.5 text-right bg-forest-950 text-tan-400 min-w-[160px] whitespace-nowrap">National Share (8%-30%)</th>
                  <th className="p-3.5 text-center min-w-[130px] whitespace-nowrap">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border font-medium">
                {filteredOrders.map((o) => {
                  const price = Number(o.sellingPrice || o.total) || 0;
                  const wholesale = Number(o.wholesaleCost || o.vendorAmount) || price * 0.7;
                  const profit = Number((price - wholesale).toFixed(2));
                  const natVal = Number(o.nationalShare) || 0;

                  return (
                    <tr key={o.id} className="hover:bg-surface-low/60 transition-colors">
                      {/* Customer Details */}
                      <td className="p-3.5 min-w-[180px]">
                        <div className="font-extrabold text-forest-950 text-xs flex items-center gap-1.5 whitespace-nowrap">
                          <User className="w-3.5 h-3.5 text-tan-600 shrink-0" />
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
                            : o.originType === 'STATE'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-forest-950 text-tan-300 border-forest-800'
                        }`}>
                          {o.orderSource || o.originType}
                        </span>
                      </td>

                      {/* Retail Selling Price */}
                      <td className="p-3.5 text-right min-w-[110px] whitespace-nowrap">
                        <div className="font-black text-forest-950 text-sm">${price.toFixed(2)}</div>
                        <div className="text-[9px] text-emerald-700 font-bold">100% Retail</div>
                      </td>

                      {/* Wholesale Cost */}
                      <td className="p-3.5 text-right min-w-[110px] whitespace-nowrap">
                        <div className="font-black text-charcoal text-sm">${wholesale.toFixed(2)}</div>
                        <div className="text-[9px] text-charcoal-muted font-bold">70% Vendor Cost</div>
                      </td>

                      {/* Gross Profit Margin ($ / %) */}
                      <td className="p-3.5 text-right bg-emerald-50/40 min-w-[125px] whitespace-nowrap">
                        <div className="font-black text-emerald-900 text-sm">+${profit.toFixed(2)}</div>
                        <div className="text-[9px] text-emerald-800 font-bold">30% Gross Margin</div>
                      </td>

                      {/* National Share (8% / 23% / 30%) - HIGHLIGHTED */}
                      <td className="p-3.5 text-right bg-forest-900/20 border-x border-forest-900/20 min-w-[160px] whitespace-nowrap">
                        <div className="font-black text-forest-950 text-base font-mono">${natVal.toFixed(2)}</div>
                        <div className="text-[9px] text-forest-800 font-extrabold">
                          {o.originType === 'NATIONAL' ? '30% Nat Margin' : o.originType === 'STATE' ? '23% Nat Share' : '8% Nat Share ($8 of 30%)'}
                        </div>
                      </td>

                      {/* Payout Status & Action */}
                      <td className="p-3.5 text-center min-w-[130px] whitespace-nowrap">
                        <button
                          onClick={() => updatePayoutStatus(o.id, o.payoutStatus === 'Paid' ? 'Pending' : 'Paid')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black shadow-xs transition-all cursor-pointer ${
                            o.payoutStatus === 'Paid'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-amber-500 text-forest-950 hover:bg-amber-600'
                          }`}
                        >
                          {o.payoutStatus === 'Paid' ? 'Paid / Settled' : 'Approve Payout'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: STORE PRODUCTS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <h3 className="font-black text-lg text-forest-950">Store Product Catalog ({products.length})</h3>
              <p className="text-xs text-charcoal-muted">Manage product retail prices, wholesale vendor costs, and profit margin allocations.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-tan-500 text-forest-950 font-black text-xs rounded-xl shadow hover:bg-tan-600 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const wholesale = p.wholesaleCost || Math.round(p.price * 0.55);
              const margin = Number((p.price - wholesale).toFixed(2));

              return (
                <div key={p.id} className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-tan-100 text-tan-900">
                        {p.scopeChannel || 'LOCAL_CLUB'}
                      </span>
                      <h4 className="font-extrabold text-sm text-forest-950">{p.name}</h4>
                      <div className="text-[11px] text-charcoal-muted font-bold">Vendor: {p.vendorName}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-low border border-surface-border grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div>
                      <div className="text-[10px] text-charcoal-muted">Retail Price</div>
                      <div className="font-black text-forest-950">${p.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-charcoal-muted">Wholesale Cost</div>
                      <div className="font-black text-charcoal">${wholesale.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-800">Margin Profit</div>
                      <div className="font-black text-emerald-800">${margin.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-charcoal-muted leading-relaxed font-medium">
                    {p.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW VENDOR PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
                <Package className="w-5 h-5 text-tan-600" /> Add New Vendor Product
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-charcoal-light hover:text-charcoal font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Oak Ridge Field Jacket"
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Retail Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="49.99"
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Vendor Wholesale Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.wholesaleCost}
                    onChange={(e) => setProductForm({ ...productForm, wholesaleCost: e.target.value })}
                    placeholder="22.00"
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Assigned Vendor *</label>
                  <select
                    value={productForm.vendorName}
                    onChange={(e) => setProductForm({ ...productForm, vendorName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Target Store Channel *</label>
                  <select
                    value={productForm.scopeChannel}
                    onChange={(e) => setProductForm({ ...productForm, scopeChannel: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                  >
                    <option value="LOCAL_CLUB">Local Club Store (15% Club Margin)</option>
                    <option value="STATE">State Association Store (7% State Margin)</option>
                    <option value="NATIONAL">Main National HQ Store (100% Margin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enter detailed description of gear..."
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border bg-surface hover:bg-surface-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-forest-950 hover:bg-forest-900 text-white shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE TEST ORDER WITH AUTOMATIC SPLITS */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tan-600" /> Create Test Order (Automatic Splits)
              </h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-charcoal-light hover:text-charcoal font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrderSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Select Product *</label>
                  <select
                    value={orderForm.productId}
                    onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Purchase Channel Origin *</label>
                <select
                  value={orderForm.originType}
                  onChange={(e) => setOrderForm({ ...orderForm, originType: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold"
                >
                  <option value="CLUB">Local Club Store Link (15% Club + 7% State + 8% National)</option>
                  <option value="STATE">State Association Link (7% State + 23% National)</option>
                  <option value="NATIONAL">Main National HQ Link (100% National Margin)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-forest-950 text-white space-y-1 text-[11px]">
                <div className="font-extrabold text-tan-300">Revenue Split Impact Preview:</div>
                <div className="text-[10px] text-tan-100">
                  {orderForm.originType === 'CLUB' && 'Club: 15% ($7.50) | State: 7% ($3.50) | National: 8% ($4.00) | Vendor: 70% ($35.00)'}
                  {orderForm.originType === 'STATE' && 'State: 7% ($3.50) | National: 23% ($11.50) | Vendor: 70% ($35.00)'}
                  {orderForm.originType === 'NATIONAL' && 'National HQ: 30% ($15.00) | Vendor: 70% ($35.00)'}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border bg-surface hover:bg-surface-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-tan-500 hover:bg-tan-600 text-forest-950 shadow-md"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
