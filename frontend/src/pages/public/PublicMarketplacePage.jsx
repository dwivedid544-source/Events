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
  Compass
} from 'lucide-react';

export const PublicMarketplacePage = () => {
  const { products, addToCart, cartCount } = useApp();
  const [selectedSource, setSelectedSource] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // EXACT 10 CLIENT-SPECIFIED VENDOR / PRODUCT SOURCES
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

  const filteredProducts = products.filter((p) => {
    const matchesSource = selectedSource === 'All' || p.source === selectedSource;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
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
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              Unified National E-Commerce
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              National UHC Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              The official multi-vendor hunting marketplace uniting authorized gear, equipment, and apparel from national sponsors, equipment manufacturers, state associations, and local hunting chapters.
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

        {/* 10 Verified Vendor Sources Overview Bar */}
        <div className="pt-4 border-t border-forest-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-extrabold text-tan-300">
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">1. UHC Official</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">2. K9 Keep</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">3. Hunting Suppliers</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">4. Dog Equipment Co.</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">5. Apparel Companies</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">6. Sponsors</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">7. Outside Vendors</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">8. Drop-Shipping</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">9. State Associations</div>
          <div className="p-2 rounded-lg bg-forest-900/60 border border-forest-800">10. Local Clubs</div>
        </div>
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
              Filter marketplace products by authorized manufacturer, affiliate, or chapter source.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, clubs..."
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
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
          >
            {/* Image Header */}
            <div className="relative overflow-hidden h-52 bg-surface-low">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                {p.category}
              </span>

              {/* Vendor Source Badge */}
              <span
                className={`absolute bottom-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-lg border shadow-sm ${getSourceBadgeStyle(
                  p.source
                )}`}
              >
                Source: {p.source}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] text-charcoal-muted font-bold block">
                  Vendor: {p.vendorName}
                </span>
                <h3 className="font-black text-sm text-forest-950 group-hover:text-tan-700 transition-colors mt-0.5">
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
                  <span className="text-xl font-black text-forest-950">${p.price.toFixed(2)}</span>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {p.inStock} In Stock
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-surface-low/80 border-t border-surface-border flex items-center justify-between gap-2">
              <span className="text-[10px] text-charcoal-muted font-medium">
                Official Marketplace Item
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
          <h4 className="font-bold text-forest-950">No products found for this source.</h4>
          <p className="text-xs text-charcoal-muted">Try selecting "All Sources" or adjusting your search query.</p>
        </div>
      )}
    </div>
  );
};
