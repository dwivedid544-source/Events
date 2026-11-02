import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Globe,
  MapPin,
  Tag,
  Package,
  Layers,
  Award,
  Truck,
  Store,
  Compass,
  HeartPulse,
  Crosshair,
  Sparkles,
  Shirt,
  Baby,
  Filter
} from 'lucide-react';

export const PublicMarketplacePage = () => {
  const { products, addToCart, cartCount } = useApp();
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('All'); // 'All', 'DropShip', 'Chapter'
  const [searchQuery, setSearchQuery] = useState('');

  // 5 MAIN CLIENT-SPECIFIED DEPARTMENTS & SUBCATEGORIES
  const departments = [
    {
      id: 'All',
      label: 'All Departments',
      icon: Store,
      subCategories: []
    },
    {
      id: 'Dog Health & Performance',
      label: 'Dog Health & Performance',
      icon: HeartPulse,
      subCategories: [
        'Nutrition & Supplements',
        'Flea & Tick',
        'Wormers',
        'Ear & Eye Care',
        'First Aid & Kennel Health',
        'Conditioning & Performance'
      ]
    },
    {
      id: 'Hunting Equipment',
      label: 'Hunting Equipment',
      icon: Crosshair,
      subCategories: [
        'Tracking Systems',
        'Collars',
        'Leads',
        'Lights',
        'Boots & Clothing',
        'Dog Boxes & Kennel Equipment'
      ]
    },
    {
      id: 'Training Equipment',
      label: 'Training Equipment',
      icon: Sparkles,
      subCategories: [
        'Training Collars',
        'Leads & Check Cords',
        'Scent & Training Products',
        'Treeing/Training Equipment'
      ]
    },
    {
      id: 'Apparel & UHC Gear',
      label: 'Apparel & UHC Gear',
      icon: Shirt,
      subCategories: [
        'Shirts',
        'Hats',
        'Hoodies/Jackets',
        'Decals'
      ]
    },
    {
      id: 'Breeding Supplies',
      label: 'Breeding Supplies',
      icon: Baby,
      subCategories: [
        'Whelping Supplies',
        'Breeding Supplies'
      ]
    }
  ];

  // 10 VENDOR / PRODUCT SOURCES
  const marketplaceSources = [
    'All',
    'UHC',
    'K9 Keep',
    'Hunting suppliers',
    'Dog equipment companies',
    'Apparel companies',
    'Sponsors',
    'Outside vendors',
    'Drop-shipping vendors',
    'State Associations',
    'Local Clubs'
  ];

  const currentDeptObj = departments.find((d) => d.id === selectedDepartment);

  const filteredProducts = products.filter((p) => {
    // 1. Department match
    const matchesDept =
      selectedDepartment === 'All' ||
      p.department === selectedDepartment ||
      (selectedDepartment === 'Apparel & UHC Gear' && (p.category === 'Caps' || p.category === 'Hoodies' || p.category === 'Apparel' || p.category === 'Jackets')) ||
      (selectedDepartment === 'Hunting Equipment' && (p.category === 'Electronics' || p.category === 'Gear' || p.category === 'Equipment')) ||
      (selectedDepartment === 'Dog Health & Performance' && (p.category === 'Dog Health' || p.category === 'First Aid')) ||
      (selectedDepartment === 'Breeding Supplies' && p.category === 'Breeding Supplies');

    // 2. Subcategory match
    const matchesSub =
      selectedSubCategory === 'All' ||
      p.subCategory === selectedSubCategory;

    // 3. Source match
    const matchesSource =
      selectedSource === 'All' ||
      p.source === selectedSource;

    // 4. Fulfillment match
    const matchesFulfillment =
      fulfillmentFilter === 'All' ||
      (fulfillmentFilter === 'DropShip' && p.isDropShip !== false) ||
      (fulfillmentFilter === 'Chapter' && p.isDropShip === false);

    // 5. Search match
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSub && matchesSource && matchesFulfillment && matchesSearch;
  });

  const getSourceBadgeStyle = (source) => {
    switch (source) {
      case 'UHC':
        return 'bg-forest-950 text-tan-300 border-tan-500/40';
      case 'K9 Keep':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'Hunting suppliers':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'Dog equipment companies':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'Apparel companies':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      case 'Sponsors':
        return 'bg-amber-900 text-yellow-200 border-yellow-400/50';
      case 'Outside vendors':
        return 'bg-slate-900 text-slate-200 border-slate-600/40';
      case 'Drop-shipping vendors':
        return 'bg-cyan-950 text-cyan-200 border-cyan-500/40';
      case 'State Associations':
        return 'bg-orange-950 text-orange-200 border-orange-500/40';
      case 'Local Clubs':
        return 'bg-emerald-900 text-emerald-100 border-emerald-400/50';
      default:
        return 'bg-forest-900 text-tan-200 border-forest-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Marketplace Hero Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              Unified National E-Commerce & Wholesaler Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              UHC National Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Official hunting equipment, canine health, performance training gear, and national apparel. Powered by verified wholesale drop-shipping with automated chapter commission splits (15% Club / 7% State).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/cart"
              className="px-5 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
            </Link>
          </div>
        </div>

        {/* Drop-Shipping Architecture Callout */}
        <div className="p-4 rounded-2xl bg-forest-900/80 border border-tan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-400 border border-tan-500/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-tan-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Wholesale Drop-Shipping Guarantee</h4>
              <p className="text-tan-200/90 text-xs mt-0.5">
                Clubs and State Associations do not need to stock or ship inventory. Orders are fulfilled directly by authorized manufacturers and distributors.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFulfillmentFilter(fulfillmentFilter === 'DropShip' ? 'All' : 'DropShip')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fulfillmentFilter === 'DropShip'
                  ? 'bg-tan-500 text-forest-950'
                  : 'bg-forest-800 text-tan-200 hover:text-white'
              }`}
            >
              {fulfillmentFilter === 'DropShip' ? '✓ Showing Drop-Ship Only' : 'Filter Drop-Ship Only'}
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Departments Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-forest-950 flex items-center gap-2">
            <Tag className="w-5 h-5 text-tan-600" />
            <span>Shop by Department</span>
          </h2>
          <span className="text-xs text-charcoal-muted font-bold">
            Showing {filteredProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isSelected = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept.id);
                  setSelectedSubCategory('All');
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-forest-950 text-white border-forest-950 shadow-md ring-2 ring-tan-500'
                    : 'bg-surface-lowest text-forest-950 border-surface-border hover:border-tan-500/60 hover:shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-tan-500 text-forest-950' : 'bg-surface-low text-forest-900'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs leading-tight">{dept.label}</h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subcategories Pill Chips (if current department has subcategories) */}
        {currentDeptObj && currentDeptObj.subCategories.length > 0 && (
          <div className="p-3.5 bg-surface-lowest rounded-2xl border border-surface-border flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-black uppercase text-charcoal-muted shrink-0 pr-2">
              Subcategory:
            </span>
            <button
              onClick={() => setSelectedSubCategory('All')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubCategory === 'All'
                  ? 'bg-forest-900 text-white'
                  : 'bg-surface-low text-charcoal hover:bg-surface-border'
              }`}
            >
              All {currentDeptObj.label}
            </button>
            {currentDeptObj.subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-tan-500 text-forest-950 font-black'
                    : 'bg-surface-low text-charcoal hover:bg-surface-border'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-forest-950 flex items-center gap-2">
              <Store className="w-4 h-4 text-tan-600" />
              <span>Browse by Vendor & Product Source</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Filter marketplace products by authorized manufacturer, sponsor, or chapter source.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, gear..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold"
            />
          </div>
        </div>

        {/* 10 Source Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-surface-border">
          {marketplaceSources.map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedSource === src
                  ? 'bg-forest-950 text-white shadow-md'
                  : 'bg-surface-low text-charcoal hover:bg-surface-border'
              }`}
            >
              {src === 'All' ? 'All Sources (10 Types)' : src}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
          >
            {/* Image Header */}
            <div className="relative overflow-hidden h-52 bg-surface-low">
              <img
                src={p.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80'}
                alt={p.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Department / Category Pill */}
              <span className="absolute top-3 left-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                {p.subCategory || p.department || p.category || 'Gear'}
              </span>

              {/* Drop-Ship Indicator Pill */}
              <div className="absolute top-3 right-3">
                {p.isDropShip !== false ? (
                  <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md shadow-sm">
                    <Truck className="w-3 h-3" />
                    <span>Drop-Ship</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/50 backdrop-blur-md shadow-sm">
                    Chapter Item
                  </span>
                )}
              </div>

              {/* Vendor Source Badge */}
              <span
                className={`absolute bottom-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-lg border shadow-sm ${getSourceBadgeStyle(
                  p.source || 'UHC'
                )}`}
              >
                Source: {p.source || p.scopeChannel || 'UHC'}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold block">
                  Vendor: {p.vendorName || p.club || 'Authorized Wholesaler'}
                </span>
                <h3 className="font-black text-sm text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5 line-clamp-2">
                  {p.name}
                </h3>
              </div>

              <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed font-medium">
                {p.description}
              </p>

              {/* Pricing & Stock */}
              <div className="p-3 rounded-xl bg-surface-low border border-surface-border flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Price</span>
                  <span className="text-xl font-black text-forest-950">${Number(p.price).toFixed(2)}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded block">
                    {p.inStock || 50} In Stock
                  </span>
                  {p.wholesaleCost && (
                    <span className="text-[9px] text-charcoal-muted font-semibold mt-0.5 block">
                      Wholesale: ${Number(p.wholesaleCost).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-surface-low/80 border-t border-surface-border flex items-center justify-between gap-2">
              <span className="text-[10px] text-charcoal-muted font-medium">
                {p.isDropShip !== false ? 'Direct Wholesale Fulfillment' : 'Local Chapter Inventory'}
              </span>
              <button
                onClick={() =>
                  addToCart(p, 1, {
                    originType: 'MARKETPLACE',
                    orderSource: p.vendorName,
                    sourceType: p.source
                  })
                }
                className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-surface-lowest rounded-2xl border border-surface-border space-y-3">
          <Package className="w-12 h-12 text-charcoal-muted mx-auto" />
          <h4 className="font-bold text-forest-950">No products found for this selection.</h4>
          <p className="text-xs text-charcoal-muted">
            Try selecting "All Departments" or "All Sources", or clearing the search query.
          </p>
        </div>
      )}
    </div>
  );
};
