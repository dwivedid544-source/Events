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
  ArrowUpRight,
  Eye,
  RefreshCw,
  Download,
  X,
  ChevronRight,
  Calculator,
  Percent,
  Check,
  Tag,
  Upload,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

export const NationalAdminStorePage = () => {
  const {
    products = [],
    setProducts,
    addProduct,
    vendors = [],
    orders = [],
    placeOrder,
    updatePayoutStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'catalog' | 'governance'
  const [dateFilter, setDateFilter] = useState('All Time'); // 'All Time' | 'Today' | 'This Month' | 'This Year'
  const [channelFilter, setChannelFilter] = useState('ALL'); // 'ALL' | 'CLUB' | 'STATE' | 'NATIONAL'
  const [payoutFilter, setPayoutFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'PAID'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedOrderForAudit, setSelectedOrderForAudit] = useState(null);

  // Split Rules Simulator State
  const [simulatedPrice, setSimulatedPrice] = useState(100);
  const [simulatedChannel, setSimulatedChannel] = useState('CLUB');

  // Image Upload Mode: 'upload' | 'url'
  const [imageUploadMode, setImageUploadMode] = useState('upload');

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Gear',
    price: '',
    wholesaleCost: '',
    vendorName: vendors[0]?.name || 'Garmin Outdoor',
    source: 'Dog equipment companies',
    inStock: '50',
    scopeChannel: 'NATIONAL',
    image: '',
    description: ''
  });

  // Handle local image file upload from device
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (showToast) showToast('Image size should be less than 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm((prev) => ({ ...prev, image: reader.result }));
      if (showToast) showToast('Product image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Manual Test Order Form State
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productId: products[0]?.id || '',
    originType: 'CLUB', // CLUB | STATE | NATIONAL
    clubName: 'Oak Ridge Hunting Club',
    stateName: 'Tennessee'
  });

  // Filter Orders by Channel, Payout, and Search
  const filteredOrders = orders.filter((o) => {
    const matchesChannel = channelFilter === 'ALL' || o.originType === channelFilter;
    const isPaid = o.payoutStatus === 'Paid' || o.payoutStatus === 'Approved';
    const matchesPayout =
      payoutFilter === 'ALL' ||
      (payoutFilter === 'PAID' && isPaid) ||
      (payoutFilter === 'PENDING' && !isPaid);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (o.customer || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q) ||
      (o.product || o.items || '').toLowerCase().includes(q) ||
      (o.vendorName || '').toLowerCase().includes(q) ||
      (o.orderSource || '').toLowerCase().includes(q);

    return matchesChannel && matchesPayout && matchesSearch;
  });

  // Financial Metrics Summaries
  const totalSalesGross = filteredOrders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0);
  const totalClubPayouts = filteredOrders.reduce((a, b) => a + (Number(b.clubShare) || 0), 0);
  const totalStatePayouts = filteredOrders.reduce((a, b) => a + (Number(b.stateShare) || 0), 0);
  const totalNationalShare = filteredOrders.reduce((a, b) => a + (Number(b.nationalShare) || 0), 0);
  const totalVendorPayouts = filteredOrders.reduce((a, b) => a + (Number(b.vendorAmount || b.wholesaleCost) || 0), 0);

  // Handle Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.wholesaleCost) {
      showToast('Please fill in product name, retail price, and wholesale cost.', 'error');
      return;
    }

    const retail = parseFloat(productForm.price);
    const wholesale = parseFloat(productForm.wholesaleCost);
    const margin = Number((retail - wholesale).toFixed(2));

    const finalImage = productForm.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';

    const newProd = {
      id: `prod-custom-${Date.now()}`,
      name: productForm.name,
      category: productForm.category || 'Gear',
      price: retail,
      wholesaleCost: wholesale,
      margin: margin,
      vendorName: productForm.vendorName || vendors[0]?.name || 'Garmin Outdoor',
      source: productForm.source || 'Dog equipment companies',
      inStock: parseInt(productForm.inStock) || 50,
      scopeChannel: productForm.scopeChannel || 'NATIONAL',
      organizationType: productForm.scopeChannel || 'NATIONAL',
      scopeEntity:
        productForm.scopeChannel === 'LOCAL_CLUB'
          ? 'Oak Ridge Hunting Club'
          : productForm.scopeChannel === 'STATE'
          ? 'Tennessee State Association'
          : 'Ultimate Hound Club (UHC) HQ',
      image: finalImage,
      description: productForm.description || `${productForm.name} added by National Admin.`
    };

    if (addProduct) {
      await addProduct(newProd);
    } else {
      setProducts((prev) => [newProd, ...prev]);
    }

    showToast(`New product "${newProd.name}" added to Marketplace successfully!`, 'success');
    setShowAddProductModal(false);
    setProductForm({
      name: '',
      category: 'Gear',
      price: '',
      wholesaleCost: '',
      vendorName: vendors[0]?.name || 'Garmin Outdoor',
      source: 'Dog equipment companies',
      inStock: '50',
      scopeChannel: 'NATIONAL',
      image: '',
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

    const targetCartItems = [
      {
        id: selProd.id,
        name: selProd.name,
        category: selProd.category || 'Gear',
        price: selProd.price || 50.0,
        quantity: 1,
        vendorName: selProd.vendorName || 'Garmin Outdoor',
        image: selProd.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80'
      }
    ];

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
      vendorName: selProd.vendorName || 'Garmin Outdoor',
      cartItems: targetCartItems
    });

    if (created) {
      showToast(`Order ${created.id} generated with automatic percentage margin splits!`, 'success');
      setShowAddOrderModal(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.', 'warning');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'Email',
      'Product',
      'Vendor',
      'Store Channel',
      'Retail Price ($)',
      'Wholesale Cost ($)',
      'Gross Profit ($)',
      'Vendor Payout ($)',
      'Club Share ($)',
      'State Share ($)',
      'National Share ($)',
      'Payout Status'
    ];

    const rows = filteredOrders.map((o) => {
      const price = Number(o.sellingPrice || o.total) || 0;
      const wholesale = Number(o.wholesaleCost || o.vendorAmount) || price * 0.7;
      const profit = Number((price - wholesale).toFixed(2));
      return [
        o.id,
        `"${o.date || ''}"`,
        `"${o.customer || ''}"`,
        `"${o.email || ''}"`,
        `"${o.product || o.items || ''}"`,
        `"${o.vendorName || 'Garmin Outdoor'}"`,
        `"${o.orderSource || o.originType}"`,
        price.toFixed(2),
        wholesale.toFixed(2),
        profit.toFixed(2),
        (Number(o.vendorAmount) || wholesale).toFixed(2),
        (Number(o.clubShare) || 0).toFixed(2),
        (Number(o.stateShare) || 0).toFixed(2),
        (Number(o.nationalShare) || 0).toFixed(2),
        `"${o.payoutStatus || 'Pending'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Store_Audit_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredOrders.length} order records to CSV!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Modern Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-forest-900 tracking-tight">
              National Merchandise Store & Revenue Audit
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-800 text-tan-400 font-extrabold text-[11px] rounded-full shadow-xs border border-forest-900">
              <ShieldCheck className="w-3.5 h-3.5 text-tan-400" />
              National HQ Store System
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl font-medium">
            Audit multi-vendor drop-ship orders, inspect percentage revenue splits (Club 15%, State 7%, National 8%, Vendor 70%), and manage store product inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface-lowest hover:bg-surface-low text-forest-800 border border-surface-border font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Download CSV of audited orders"
          >
            <Download className="w-4 h-4 text-forest-700" /> Export Audit Ledger (CSV)
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-3.5 py-2 bg-surface-lowest hover:bg-surface-low text-forest-800 border border-surface-border font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Package className="w-4 h-4 text-forest-700" /> + Add Vendor Product
          </button>

          <button
            onClick={() => setShowAddOrderModal(true)}
            className="px-4 py-2 bg-tan-500 hover:bg-tan-600 active:scale-95 text-forest-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Create Test Order
          </button>
        </div>
      </div>

      {/* 2. Top 5 Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Gross Retail Sales"
          value={`$${totalSalesGross.toFixed(2)}`}
          subtext={`${filteredOrders.length} audited orders`}
          icon={DollarSign}
          trend="100% Retail"
          trendType="up"
        />
        <StatCard
          title="National Share"
          value={`$${totalNationalShare.toFixed(2)}`}
          subtext="8% on club/state, 30% HQ direct"
          icon={Globe}
          trend="HQ Revenue"
          trendType="up"
        />
        <StatCard
          title="Club Payouts"
          value={`$${totalClubPayouts.toFixed(2)}`}
          subtext="15% Local club treasury"
          icon={Building2}
          trend="15% Margin"
          trendType="up"
        />
        <StatCard
          title="State Payouts"
          value={`$${totalStatePayouts.toFixed(2)}`}
          subtext="7% State association fund"
          icon={MapPin}
          trend="7% Margin"
          trendType="up"
        />
        <StatCard
          title="Vendor Drop-Ship"
          value={`$${totalVendorPayouts.toFixed(2)}`}
          subtext="70% Wholesale manufacturing"
          icon={Truck}
          trend="70% Drop-Ship"
          trendType="up"
        />
      </div>

      {/* 3. Tab Bar & Search / Multi-Filter Toolbar */}
      <div className="bg-surface-lowest rounded-2xl p-4 border border-surface-border shadow-xs space-y-3">
        {/* Row A: Primary Tabs & Live Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center bg-surface-low p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-forest-800 text-tan-400 shadow-xs'
                  : 'text-charcoal-muted hover:text-forest-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Store Orders Audit ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-forest-800 text-tan-400 shadow-xs'
                  : 'text-charcoal-muted hover:text-forest-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Product Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'governance'
                  ? 'bg-forest-800 text-tan-400 shadow-xs'
                  : 'text-charcoal-muted hover:text-forest-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Split Governance</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search customer, order ID, product, vendor, channel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-surface-low border border-surface-border rounded-xl text-xs font-medium text-forest-900 placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-forest-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row B: Channel Pills & Payout Filters */}
        {activeTab === 'orders' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Store Channel:
              </span>
              {[
                { id: 'ALL', label: 'All Channels' },
                { id: 'CLUB', label: 'Local Club Stores (15%)' },
                { id: 'STATE', label: 'State Stores (7%)' },
                { id: 'NATIONAL', label: 'National HQ Store (30%)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChannelFilter(c.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    channelFilter === c.id
                      ? 'bg-forest-800 text-tan-400 shadow-xs'
                      : 'bg-surface-low hover:bg-surface-border text-charcoal-muted hover:text-forest-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-surface-border mx-1 hidden sm:block"></div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mr-1">Payout:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'PENDING', label: 'Pending' },
                { id: 'PAID', label: 'Settled' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayoutFilter(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    payoutFilter === p.id
                      ? 'bg-tan-500 text-forest-950 shadow-xs'
                      : 'bg-surface-low hover:bg-surface-border text-charcoal-muted hover:text-forest-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              {(searchQuery || channelFilter !== 'ALL' || payoutFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setChannelFilter('ALL');
                    setPayoutFilter('ALL');
                  }}
                  className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1 ml-2"
                >
                  <X className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="text-[11px] text-charcoal-muted font-medium">
              Showing <strong className="text-forest-900 font-extrabold">{filteredOrders.length}</strong> of{' '}
              {orders.length} orders
            </div>
          </div>
        )}
      </div>

      {/* 4. TAB A: ORDERS & PERCENTAGE SPLIT AUDIT LEDGER */}
      {activeTab === 'orders' && (
        <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-surface-border">
            <table className="w-full text-left text-xs min-w-[980px] border-collapse">
              <thead>
                <tr className="bg-surface-low/80 border-b border-surface-border text-charcoal-muted uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3 px-4 w-[220px]">Order & Customer</th>
                  <th className="py-3 px-4 w-[210px]">Product & Vendor</th>
                  <th className="py-3 px-4 w-[160px]">Store Origin</th>
                  <th className="py-3 px-4 w-[140px] text-right">Retail & Cost</th>
                  <th className="py-3 px-4 w-[180px]">Margin Split Distribution</th>
                  <th className="py-3 px-4 w-[130px] text-center">Payout Status</th>
                  <th className="py-3 px-4 w-[60px] text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                      <ShoppingBag className="w-10 h-10 mx-auto text-charcoal-muted/40 mb-2" />
                      <p className="font-bold text-sm text-forest-900">No store orders match current filters</p>
                      <p className="text-xs mt-1">Try resetting filters or generating a test order.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const price = Number(o.sellingPrice || o.total) || 0;
                    const wholesale = Number(o.wholesaleCost || o.vendorAmount) || price * 0.7;
                    const profit = Number((price - wholesale).toFixed(2));
                    const isPaid = o.payoutStatus === 'Paid' || o.payoutStatus === 'Approved';

                    const clubVal = Number(o.clubShare) || 0;
                    const stateVal = Number(o.stateShare) || 0;
                    const natVal = Number(o.nationalShare) || 0;

                    return (
                      <tr key={o.id} className="hover:bg-surface-low/40 transition-colors group">
                        {/* 1. Order & Customer */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <button
                              onClick={() => setSelectedOrderForAudit(o)}
                              className="font-extrabold text-sm text-forest-900 hover:text-tan-600 transition-colors text-left flex items-center gap-1.5"
                            >
                              <span>{o.customer || 'Lalit Panchole'}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 bg-forest-800/10 text-forest-900 font-mono text-[10px] font-black rounded border border-forest-800/20">
                                {o.id}
                              </span>
                              <span className="text-[10px] text-charcoal-muted font-medium">{o.date || 'Aug 10, 2026'}</span>
                            </div>
                            <div className="text-[10px] text-charcoal-muted truncate max-w-[200px]">{o.email}</div>
                          </div>
                        </td>

                        {/* 2. Product & Vendor */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-extrabold text-forest-900 text-xs leading-snug line-clamp-1">
                              {o.product || o.items}
                            </div>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-low border border-surface-border rounded-md text-[10px] font-bold text-charcoal">
                              <Truck className="w-3 h-3 text-charcoal-muted shrink-0" />
                              <span className="truncate max-w-[150px]">{o.vendorName || 'Garmin Outdoor'}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Origin Channel */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border shadow-2xs ${
                              o.originType === 'CLUB'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : o.originType === 'STATE'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-forest-950 text-tan-300 border-forest-800'
                            }`}
                          >
                            {o.originType === 'CLUB' && <Building2 className="w-3 h-3 text-emerald-700" />}
                            {o.originType === 'STATE' && <MapPin className="w-3 h-3 text-amber-700" />}
                            {o.originType === 'NATIONAL' && <Globe className="w-3 h-3 text-tan-400" />}
                            <span className="truncate max-w-[130px]">{o.orderSource || o.originType}</span>
                          </span>
                        </td>

                        {/* 4. Retail & Wholesale Cost */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-black text-forest-950 text-sm">${price.toFixed(2)}</div>
                            <div className="text-[10px] text-charcoal-muted font-medium">Cost: ${wholesale.toFixed(2)}</div>
                            <div className="text-[10px] font-black text-emerald-800">+${profit.toFixed(2)} (30%)</div>
                          </div>
                        </td>

                        {/* 5. Margin Split Distribution */}
                        <td className="py-3 px-4">
                          <div className="bg-surface-low/80 p-2 rounded-xl border border-surface-border text-[10px] space-y-1 font-bold">
                            <div className="flex items-center justify-between text-forest-950">
                              <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-charcoal-muted">
                                🏛️ National HQ:
                              </span>
                              <span className="font-mono font-black text-forest-900">${natVal.toFixed(2)}</span>
                            </div>

                            {o.originType === 'CLUB' && (
                              <>
                                <div className="flex items-center justify-between text-emerald-900">
                                  <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-emerald-800">
                                    🏢 Club (15%):
                                  </span>
                                  <span className="font-mono font-black text-emerald-900">${clubVal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-900">
                                  <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-amber-800">
                                    📍 State (7%):
                                  </span>
                                  <span className="font-mono font-black text-amber-900">${stateVal.toFixed(2)}</span>
                                </div>
                              </>
                            )}

                            {o.originType === 'STATE' && (
                              <div className="flex items-center justify-between text-amber-900">
                                <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-amber-800">
                                  📍 State (7%):
                                </span>
                                <span className="font-mono font-black text-amber-900">${stateVal.toFixed(2)}</span>
                              </div>
                            )}

                            {o.originType === 'NATIONAL' && (
                              <div className="text-[9px] font-black text-forest-800 italic">
                                Direct Sale (100% Margin to HQ)
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 6. Payout Status */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${
                                isPaid
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {isPaid ? 'Settled' : 'Pending'}
                            </span>

                            <button
                              onClick={() => updatePayoutStatus(o.id, isPaid ? 'Pending' : 'Paid')}
                              className={`px-2 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                                isPaid
                                  ? 'text-charcoal-muted hover:text-forest-900 underline'
                                  : 'bg-amber-500 hover:bg-amber-600 text-forest-950 shadow-xs'
                              }`}
                            >
                              {isPaid ? 'Mark Pending' : 'Approve Payout'}
                            </button>
                          </div>
                        </td>

                        {/* 7. Audit Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrderForAudit(o)}
                            className="p-1.5 text-charcoal-muted hover:text-forest-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="View Full Margin Audit & Breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-3 bg-surface-low/50 border-t border-surface-border text-xs text-charcoal-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Total Store Margin Audit Volume: <strong className="text-forest-900 font-black">${totalSalesGross.toFixed(2)}</strong> across{' '}
              <strong className="text-forest-900 font-black">{filteredOrders.length} orders</strong>
            </span>
            <span className="font-semibold text-[11px]">
              Multi-Tier Split Formula: 70% Vendor • 15% Club • 7% State • 8% National
            </span>
          </div>
        </div>
      )}

      {/* 5. TAB B: STORE PRODUCTS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-forest-950">Store Product Catalog ({products.length})</h3>
              <p className="text-xs text-charcoal-muted">Manage product retail prices, wholesale vendor costs, and profit margin allocations.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Vendor Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const wholesale = p.wholesaleCost || Math.round(p.price * 0.7);
              const margin = Number((p.price - wholesale).toFixed(2));
              const marginPct = p.price > 0 ? Math.round((margin / p.price) * 100) : 30;

              return (
                <div key={p.id} className="bg-surface-lowest rounded-2xl border border-surface-border shadow-xs p-5 space-y-4 hover:border-forest-800/40 transition-all group">
                  <div className="flex items-start gap-4">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-surface-border shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-tan-100 text-forest-900 border border-tan-300">
                        {p.scopeChannel || 'LOCAL_CLUB'}
                      </span>
                      <h4 className="font-extrabold text-sm text-forest-950 group-hover:text-tan-600 transition-colors line-clamp-1">{p.name}</h4>
                      <div className="text-[11px] text-charcoal-muted font-bold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-charcoal-light" />
                        <span>Vendor: {p.vendorName || 'Garmin Outdoor'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-low border border-surface-border grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div>
                      <div className="text-[10px] text-charcoal-muted uppercase">Retail</div>
                      <div className="font-black text-forest-950 mt-0.5">${p.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-charcoal-muted uppercase">Cost (70%)</div>
                      <div className="font-black text-charcoal mt-0.5">${wholesale.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-800 uppercase">Margin ({marginPct}%)</div>
                      <div className="font-black text-emerald-800 mt-0.5">+${margin.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="text-xs text-charcoal-muted leading-relaxed font-medium line-clamp-2">
                    {p.description || 'Sanctioned gear item available across network store portals.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TAB C: SPLIT GOVERNANCE & INTERACTIVE SIMULATOR */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-xs p-6 space-y-6">
            <div>
              <h3 className="font-extrabold text-lg text-forest-950 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-tan-600" />
                <span>Multi-Tier Commission Split Governance Formula</span>
              </h3>
              <p className="text-xs text-charcoal-muted mt-1 max-w-3xl leading-relaxed">
                Every merchandise transaction on the platform is automatically audited and split across manufacturer wholesale costs and three tiers of hunting network stakeholders:
              </p>
            </div>

            {/* Split Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-900 text-sm">Local Club Store Link</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">Standard</span>
                </div>
                <div className="space-y-1.5 text-charcoal">
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 font-semibold">
                    <span>Wholesale Drop-Ship (Vendor):</span>
                    <strong className="text-forest-950">70.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 font-semibold">
                    <span>Local Club Treasury:</span>
                    <strong className="text-emerald-800">15.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200/60 font-semibold">
                    <span>State Association Fund:</span>
                    <strong className="text-amber-800">7.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 font-semibold">
                    <span>National HQ Platform:</span>
                    <strong className="text-forest-950">8.00%</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-900 text-sm">State Association Store Link</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-black uppercase">State</span>
                </div>
                <div className="space-y-1.5 text-charcoal">
                  <div className="flex justify-between py-1 border-b border-amber-200/60 font-semibold">
                    <span>Wholesale Drop-Ship (Vendor):</span>
                    <strong className="text-forest-950">70.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-200/60 font-semibold">
                    <span>State Association Fund:</span>
                    <strong className="text-amber-800">7.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 font-semibold">
                    <span>National HQ Platform:</span>
                    <strong className="text-forest-950">23.00%</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-forest-800/30 bg-forest-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-tan-300 text-sm">National HQ Main Store</span>
                  <span className="px-2 py-0.5 rounded bg-tan-500 text-forest-950 text-[10px] font-black uppercase">National</span>
                </div>
                <div className="space-y-1.5 text-tan-100">
                  <div className="flex justify-between py-1 border-b border-white/10 font-semibold">
                    <span>Wholesale Drop-Ship (Vendor):</span>
                    <strong className="text-white">70.00%</strong>
                  </div>
                  <div className="flex justify-between py-1 font-semibold">
                    <span>National HQ Platform (100% Margin):</span>
                    <strong className="text-tan-400">30.00%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="p-5 rounded-2xl bg-surface-low border border-surface-border space-y-4">
              <h4 className="font-extrabold text-sm text-forest-950 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-forest-800" />
                <span>Interactive Percentage Margin Calculator</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Simulated Retail Price ($)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={simulatedPrice}
                    onChange={(e) => setSimulatedPrice(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-surface-lowest border border-surface-border rounded-xl font-mono font-bold text-forest-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Channel Origin</label>
                  <select
                    value={simulatedChannel}
                    onChange={(e) => setSimulatedChannel(e.target.value)}
                    className="w-full p-2.5 bg-surface-lowest border border-surface-border rounded-xl font-bold text-forest-950"
                  >
                    <option value="CLUB">Local Club Store Link (15% Club + 7% State + 8% Nat)</option>
                    <option value="STATE">State Association Link (7% State + 23% Nat)</option>
                    <option value="NATIONAL">National HQ Main Store (30% Nat)</option>
                  </select>
                </div>

                <div className="sm:col-span-1 flex flex-col justify-end">
                  <div className="p-2.5 rounded-xl bg-forest-800 text-white font-mono text-xs flex items-center justify-between">
                    <span>Total Retail Pool:</span>
                    <strong className="text-tan-400 text-sm font-black">${simulatedPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              {(() => {
                const ven = simulatedPrice * 0.7;
                const club = simulatedChannel === 'CLUB' ? simulatedPrice * 0.15 : 0;
                const state = simulatedChannel === 'CLUB' || simulatedChannel === 'STATE' ? simulatedPrice * 0.07 : 0;
                const nat =
                  simulatedChannel === 'NATIONAL'
                    ? simulatedPrice * 0.3
                    : simulatedChannel === 'STATE'
                    ? simulatedPrice * 0.23
                    : simulatedPrice * 0.08;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                    <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border">
                      <div className="text-[10px] text-charcoal-muted uppercase font-bold">Vendor Wholesale (70%)</div>
                      <div className="text-lg font-black text-charcoal mt-0.5">${ven.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border">
                      <div className="text-[10px] text-emerald-800 uppercase font-bold">Club Share (15%)</div>
                      <div className="text-lg font-black text-emerald-800 mt-0.5">${club.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border">
                      <div className="text-[10px] text-amber-800 uppercase font-bold">State Share (7%)</div>
                      <div className="text-lg font-black text-amber-800 mt-0.5">${state.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border">
                      <div className="text-[10px] text-forest-800 uppercase font-bold">National HQ Share</div>
                      <div className="text-lg font-black text-forest-900 mt-0.5">${nat.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: ORDER AUDIT DOSSIER & PERCENTAGE SPLIT MATH */}
      {selectedOrderForAudit && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-forest-800 text-tan-400">
                    {selectedOrderForAudit.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tan-100 text-forest-900 border border-tan-300">
                    {selectedOrderForAudit.orderSource || selectedOrderForAudit.originType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-low text-charcoal-muted">
                    {selectedOrderForAudit.date || 'Aug 10, 2026'}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-forest-900 mt-2">
                  Order Margin & Multi-Tier Distribution Audit
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Customer: <strong className="text-forest-900 font-bold">{selectedOrderForAudit.customer}</strong> ({selectedOrderForAudit.email})
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderForAudit(null)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-4 rounded-xl bg-surface-low border border-surface-border flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">Purchased Merchandise</div>
                <div className="font-black text-sm text-forest-950">{selectedOrderForAudit.product || selectedOrderForAudit.items}</div>
                <div className="text-[11px] text-charcoal-muted font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Drop-ship Vendor: {selectedOrderForAudit.vendorName || 'Garmin Outdoor'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">Selling Price</div>
                <div className="text-xl font-black text-forest-950">
                  ${Number(selectedOrderForAudit.sellingPrice || selectedOrderForAudit.total).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Split Math Breakdown Table */}
            {(() => {
              const price = Number(selectedOrderForAudit.sellingPrice || selectedOrderForAudit.total) || 0;
              const wholesale = Number(selectedOrderForAudit.wholesaleCost || selectedOrderForAudit.vendorAmount) || price * 0.7;
              const profit = Number((price - wholesale).toFixed(2));
              const clubVal = Number(selectedOrderForAudit.clubShare) || 0;
              const stateVal = Number(selectedOrderForAudit.stateShare) || 0;
              const natVal = Number(selectedOrderForAudit.nationalShare) || 0;
              const isPaid = selectedOrderForAudit.payoutStatus === 'Paid' || selectedOrderForAudit.payoutStatus === 'Approved';

              return (
                <div className="space-y-4 text-xs">
                  <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-forest-800" />
                    <span>Exact Revenue Split Allocation</span>
                  </h3>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-surface-border rounded-full h-3 overflow-hidden flex">
                      <div style={{ width: '70%' }} className="bg-charcoal/70" title="Vendor 70%"></div>
                      {selectedOrderForAudit.originType === 'CLUB' ? (
                        <>
                          <div style={{ width: '15%' }} className="bg-emerald-600" title="Club 15%"></div>
                          <div style={{ width: '7%' }} className="bg-amber-500" title="State 7%"></div>
                          <div style={{ width: '8%' }} className="bg-forest-900" title="National 8%"></div>
                        </>
                      ) : selectedOrderForAudit.originType === 'STATE' ? (
                        <>
                          <div style={{ width: '7%' }} className="bg-amber-500" title="State 7%"></div>
                          <div style={{ width: '23%' }} className="bg-forest-900" title="National 23%"></div>
                        </>
                      ) : (
                        <div style={{ width: '30%' }} className="bg-forest-900" title="National HQ 30%"></div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-charcoal-muted font-bold">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-charcoal/70"></span> Vendor: 70% (${wholesale.toFixed(2)})
                      </span>
                      {selectedOrderForAudit.originType === 'CLUB' && (
                        <>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Club: 15% (${clubVal.toFixed(2)})
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> State: 7% (${stateVal.toFixed(2)})
                          </span>
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-forest-900"></span> National HQ: ${natVal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <div className="border border-surface-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-surface-low border-b border-surface-border text-[10px] font-black text-charcoal-muted uppercase">
                          <th className="py-2.5 px-3">Distribution Entity</th>
                          <th className="py-2.5 px-3">Split Formula</th>
                          <th className="py-2.5 px-3 text-right">Amount ($)</th>
                          <th className="py-2.5 px-3 text-center">Settlement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border/60 font-medium">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-forest-950">Wholesale Drop-Ship (Vendor)</td>
                          <td className="py-2.5 px-3 text-charcoal-muted">70% Cost Base</td>
                          <td className="py-2.5 px-3 text-right font-black text-forest-900">${wholesale.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">Disbursed</span>
                          </td>
                        </tr>
                        {clubVal > 0 && (
                          <tr>
                            <td className="py-2.5 px-3 font-bold text-forest-950">Local Club Treasury</td>
                            <td className="py-2.5 px-3 text-charcoal-muted">15% Margin Split</td>
                            <td className="py-2.5 px-3 text-right font-black text-emerald-800">${clubVal.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPaid ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {isPaid ? 'Settled' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        )}
                        {stateVal > 0 && (
                          <tr>
                            <td className="py-2.5 px-3 font-bold text-forest-950">State Association Fund</td>
                            <td className="py-2.5 px-3 text-charcoal-muted">7% Margin Split</td>
                            <td className="py-2.5 px-3 text-right font-black text-amber-800">${stateVal.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPaid ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {isPaid ? 'Settled' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-forest-950">National HQ Platform</td>
                          <td className="py-2.5 px-3 text-charcoal-muted">
                            {selectedOrderForAudit.originType === 'NATIONAL' ? '30% HQ Direct' : selectedOrderForAudit.originType === 'STATE' ? '23% HQ Split' : '8% HQ Split'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-forest-900">${natVal.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">Recorded</span>
                          </td>
                        </tr>
                        <tr className="bg-surface-low/60 font-black">
                          <td className="py-2.5 px-3 text-forest-900" colSpan={2}>Total Retail Price Accounted For (100% Balanced):</td>
                          <td className="py-2.5 px-3 text-right text-forest-950 text-sm">${price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-800 text-[10px]">✓ Balanced</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                    <button
                      onClick={() => {
                        updatePayoutStatus(selectedOrderForAudit.id, isPaid ? 'Pending' : 'Paid');
                        setSelectedOrderForAudit((prev) => ({
                          ...prev,
                          payoutStatus: isPaid ? 'Pending' : 'Paid'
                        }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 ${
                        isPaid
                          ? 'bg-amber-500 hover:bg-amber-600 text-forest-950'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isPaid ? 'Revert to Pending Payout' : 'Approve & Settle Payout'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrderForAudit(null)}
                      className="px-5 py-2 bg-forest-800 text-tan-400 font-extrabold rounded-xl shadow-xs hover:bg-forest-900"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD NEW VENDOR PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient-lg max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-base font-extrabold text-forest-950 flex items-center gap-2">
                  <Package className="w-5 h-5 text-tan-600" /> Add New Marketplace Product
                </h3>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  Publish authorized merchandise and hunting equipment directly to the National Marketplace
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-charcoal-muted hover:text-forest-950 p-1 rounded-lg hover:bg-surface-low transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-medium">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Garmin TT 25 High-Gain Dog Tracking Collar"
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold focus:outline-none focus:border-tan-500"
                />
              </div>

              {/* Category & In-Stock Inventory */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Product Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold focus:outline-none focus:border-tan-500"
                  >
                    <option value="Gear">Gear & Field Equipment</option>
                    <option value="Caps">Caps & Headwear</option>
                    <option value="Hoodies">Hoodies & Sweatshirts</option>
                    <option value="Apparel">Apparel & Outerwear</option>
                    <option value="Tracking Collars">Tracking Collars & Antennas</option>
                    <option value="Accessories">Accessories & Decals</option>
                    <option value="Jackets">Hunting Jackets & Vests</option>
                    <option value="Stickers & Patches">Stickers & Patches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">In-Stock Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value })}
                    placeholder="50"
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-tan-500"
                  />
                </div>
              </div>

              {/* Retail Selling Price & Wholesale Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Retail Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="79.99"
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-tan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-forest-900">Wholesale Cost ($) *</label>
                    {productForm.price && productForm.wholesaleCost && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Margin: ${(Number(productForm.price) - Number(productForm.wholesaleCost)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.wholesaleCost}
                    onChange={(e) => setProductForm({ ...productForm, wholesaleCost: e.target.value })}
                    placeholder="49.99"
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-tan-500"
                  />
                </div>
              </div>

              {/* Assigned Vendor & Target Store Channel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Assigned Vendor / Brand *</label>
                  <select
                    value={productForm.vendorName}
                    onChange={(e) => setProductForm({ ...productForm, vendorName: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold focus:outline-none focus:border-tan-500"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                    <option value="K9 Keep Systems">K9 Keep Systems</option>
                    <option value="Garmin Outdoor">Garmin Outdoor</option>
                    <option value="Browning Outdoors">Browning Outdoors</option>
                    <option value="UHC National Organization">UHC National Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Target Store Channel *</label>
                  <select
                    value={productForm.scopeChannel}
                    onChange={(e) => setProductForm({ ...productForm, scopeChannel: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold focus:outline-none focus:border-tan-500"
                  >
                    <option value="NATIONAL">Main National HQ Store (30% Margin)</option>
                    <option value="STATE">State Association Store (7% State Margin)</option>
                    <option value="LOCAL_CLUB">Local Club Store (15% Club Margin)</option>
                  </select>
                </div>
              </div>

              {/* Marketplace Source Filter Group */}
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Marketplace Source Tag (Multi-Vendor Filter) *
                </label>
                <select
                  value={productForm.source}
                  onChange={(e) => setProductForm({ ...productForm, source: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold focus:outline-none focus:border-tan-500"
                >
                  <option value="Dog equipment companies">Dog equipment companies</option>
                  <option value="UHC">UHC (Ultimate Hound Championships)</option>
                  <option value="K9 Keep">K9 Keep Systems</option>
                  <option value="Hunting suppliers">Hunting suppliers</option>
                  <option value="Apparel companies">Apparel companies</option>
                  <option value="Sponsors">Sponsors</option>
                  <option value="Outside vendors">Outside vendors</option>
                  <option value="Drop-shipping vendors">Drop-shipping vendors</option>
                  <option value="State Associations">State Associations</option>
                  <option value="Local Clubs">Local Clubs</option>
                </select>
              </div>

              {/* PRODUCT IMAGE UPLOAD SECTION (Live Preview & File / URL Support) */}
              <div className="bg-surface p-3.5 rounded-xl border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-tan-600" />
                    <span>Product Image *</span>
                  </label>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-surface-lowest p-1 rounded-lg border border-surface-border text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        imageUploadMode === 'upload'
                          ? 'bg-forest-900 text-tan-300 shadow-xs'
                          : 'text-charcoal-muted hover:text-forest-950'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        imageUploadMode === 'url'
                          ? 'bg-forest-900 text-tan-300 shadow-xs'
                          : 'text-charcoal-muted hover:text-forest-950'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Paste URL</span>
                    </button>
                  </div>
                </div>

                {/* Upload from Local Computer */}
                {imageUploadMode === 'upload' ? (
                  <div>
                    <label className="border-2 border-dashed border-surface-border hover:border-tan-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-surface-lowest hover:bg-surface-low/60 transition-all text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-tan-500/10 text-tan-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-xs text-forest-950">
                        Choose photo from your device
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        Click to browse JPG, PNG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className="w-full p-2.5 bg-surface-lowest border border-surface-border rounded-xl text-xs font-mono focus:outline-none focus:border-tan-500"
                    />
                  </div>
                )}

                {/* Live Image Preview Card */}
                {productForm.image ? (
                  <div className="flex items-center gap-3 bg-surface-lowest p-2.5 rounded-xl border border-surface-border">
                    <img
                      src={productForm.image}
                      alt="Product Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-surface-border shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-forest-950 block">Active Product Photo</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        ✓ Ready to display in Marketplace
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: '' })}
                      className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Quick Sample Image Presets */
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-charcoal-muted block mb-1.5">
                      Or select a popular sample equipment image:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'GPS Collar', url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=80' },
                        { label: 'Official Cap', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80' },
                        { label: 'Fleece Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80' },
                        { label: 'Hunting Jacket', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: preset.url })}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-surface-lowest hover:bg-tan-500/20 text-forest-950 border border-surface-border transition-all cursor-pointer"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enter detailed technical gear specifications, sizing, or warranty..."
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs focus:outline-none focus:border-tan-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border text-charcoal-muted hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-forest-900 hover:bg-forest-950 text-tan-300 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-tan-400" />
                  <span>Save & Publish Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: CREATE TEST ORDER WITH AUTOMATIC SPLITS */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-base font-extrabold text-forest-950 flex items-center gap-2">
                <Plus className="w-5 h-5 text-tan-600" /> Create Test Order (Automatic Splits)
              </h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-charcoal-muted hover:text-forest-950 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrderSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">Select Product *</label>
                  <select
                    value={orderForm.productId}
                    onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">Purchase Channel Origin *</label>
                <select
                  value={orderForm.originType}
                  onChange={(e) => setOrderForm({ ...orderForm, originType: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl text-xs font-bold"
                >
                  <option value="CLUB">Local Club Store Link (15% Club + 7% State + 8% National)</option>
                  <option value="STATE">State Association Link (7% State + 23% National)</option>
                  <option value="NATIONAL">Main National HQ Link (100% Margin to HQ)</option>
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
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border text-charcoal-muted hover:bg-surface-low"
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
