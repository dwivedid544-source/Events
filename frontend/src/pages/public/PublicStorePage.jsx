import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag, CheckCircle2, Search, ArrowRight, ShieldCheck, Globe, MapPin, Building2, Plus, Edit, Truck, DollarSign, X } from 'lucide-react';

export const PublicStorePage = () => {
  const { products, setProducts, addToCart, cartCount, currentUser, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Purchase Scope Selection State (NATIONAL / STATE / LOCAL_CLUB)
  const [purchaseScope, setPurchaseScope] = useState('LOCAL_CLUB');
  const [selectedClubScope, setSelectedClubScope] = useState('Oak Ridge Hunting Club');
  const [selectedStateScope, setSelectedStateScope] = useState('Tennessee State Association');

  // 2. Admin Modal State for Add/Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gear',
    price: 35.00,
    wholesaleCost: 15.00,
    vendorName: 'Garmin Outdoor',
    inStock: 50,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80',
    description: ''
  });

  const categories = ['All', 'Gear', 'Apparel', 'Accessories', 'Caps', 'Hoodies', 'Jackets', 'Stickers & Patches'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScope = !p.scopeChannel || p.scopeChannel === purchaseScope || p.scopeChannel === 'ALL';
    return matchesCategory && matchesSearch && matchesScope;
  });

  // Calculate scope impact label for badges
  const getScopeImpactInfo = (p) => {
    const wholesale = p.wholesaleCost || Number((p.price * 0.70).toFixed(2));
    const margin = Number((p.price - wholesale).toFixed(2));

    if (purchaseScope === 'NATIONAL') {
      return {
        label: '100% Margin to National HQ Treasury',
        margin,
        badge: 'bg-forest-900/90 text-tan-300 border-tan-500/30'
      };
    } else if (purchaseScope === 'STATE') {
      return {
        label: `$${margin.toFixed(2)} Margin Payout to ${selectedStateScope}`,
        margin,
        badge: 'bg-amber-900/90 text-amber-200 border-amber-500/30'
      };
    } else {
      return {
        label: `$${margin.toFixed(2)} Margin Payout to ${selectedClubScope}`,
        margin,
        badge: 'bg-emerald-900/90 text-emerald-200 border-emerald-500/30'
      };
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Gear',
      price: 35.00,
      wholesaleCost: 15.00,
      vendorName: 'Garmin Outdoor',
      inStock: 50,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80',
      description: 'Vendor drop-shipped official merchandise.'
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      wholesaleCost: product.wholesaleCost || Math.round(product.price * 0.55),
      vendorName: product.vendorName || 'Browning Outdoors',
      inStock: product.inStock,
      image: product.image,
      description: product.description
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const retailPrice = Number(formData.price) || 0;
    const wholesale = Number(formData.wholesaleCost) || 0;
    const calcMargin = Number((retailPrice - wholesale).toFixed(2));

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: retailPrice, wholesaleCost: wholesale, margin: calcMargin }
            : p
        )
      );
      showToast(`Updated pricing & vendor details for ${formData.name}`, 'success');
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        ...formData,
        price: retailPrice,
        wholesaleCost: wholesale,
        margin: calcMargin
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Added new merchandise item: ${newProd.name}`, 'success');
    }
    setShowProductModal(false);
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'NATIONAL_ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Purchase Scope Selector Toolbar */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h3 className="font-extrabold text-sm text-forest-950 flex items-center gap-2">
              <Truck className="w-4 h-4 text-tan-600" />
              <span>Purchase Scope & Profit Distribution Channel</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Select which organization level receives the retail margin profit (difference between Retail Price and Vendor Wholesale Cost).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
            </Link>

            {isSuperAdmin && (
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. National Organization Store */}
          <button
            onClick={() => setPurchaseScope('NATIONAL')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              purchaseScope === 'NATIONAL'
                ? 'bg-forest-900/10 border-forest-800 ring-2 ring-forest-800/30'
                : 'bg-surface-low border-surface-border hover:bg-surface-low/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-forest-950 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-forest-800" /> National Organization Store
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-forest-900 text-tan-300">
                National Income
              </span>
            </div>
            <p className="text-xs text-charcoal-muted font-medium">
              Merchandise purchases directly generate revenue for the UHC National Organization Treasury.
            </p>
            <div className="text-[10px] font-bold text-forest-900 pt-1 border-t border-surface-border">
              Treasury Beneficiary: Ultimate Hound Club (UHC) National HQ
            </div>
          </button>

          {/* 2. State Association Store */}
          <button
            onClick={() => setPurchaseScope('STATE')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              purchaseScope === 'STATE'
                ? 'bg-amber-950/10 border-amber-600 ring-2 ring-amber-600/30'
                : 'bg-surface-low border-surface-border hover:bg-surface-low/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" /> State Association Store
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-600 text-white">
                State Income
              </span>
            </div>
            <p className="text-xs text-charcoal-muted font-medium">
              Merchandise purchases generate profit margin income directly for the State Association Treasury.
            </p>
            <div className="text-[10px] font-bold text-amber-900 pt-1 border-t border-surface-border">
              Treasury Beneficiary: {selectedStateScope}
            </div>
          </button>

          {/* 3. Local Club Store */}
          <button
            onClick={() => setPurchaseScope('LOCAL_CLUB')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              purchaseScope === 'LOCAL_CLUB'
                ? 'bg-emerald-950/10 border-emerald-600 ring-2 ring-emerald-600/30'
                : 'bg-surface-low border-surface-border hover:bg-surface-low/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" /> Local Club Store
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
                Club Income
              </span>
            </div>
            <p className="text-xs text-charcoal-muted font-medium">
              Merchandise purchases credit 100% of retail profit margins directly to the Local Club Treasury.
            </p>
            <div className="text-[10px] font-bold text-emerald-900 pt-1 border-t border-surface-border">
              Treasury Beneficiary: {selectedClubScope}
            </div>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-white shadow-md font-black'
                  : 'bg-surface-low text-charcoal hover:bg-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchandise..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const impact = getScopeImpactInfo(p);
          const wholesale = p.wholesaleCost || Number((p.price * 0.70).toFixed(2));
          const marginVal = Number((p.price - wholesale).toFixed(2));

          return (
            <div
              key={p.id}
              className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
            >
              <div className="relative overflow-hidden h-52 bg-surface-low">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-full bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                  {p.category}
                </span>

                {/* Vendor Tag */}
                <span className="absolute bottom-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded bg-charcoal/80 text-white backdrop-blur-xs">
                  Vendor: {p.vendorName || 'Browning Outdoors'}
                </span>

                {isSuperAdmin && (
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-forest-950/90 text-tan-300 hover:text-white border border-forest-700 shadow-md cursor-pointer"
                    title="Edit Product Wholesale & Retail Pricing"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-extrabold text-sm text-forest-950 group-hover:text-tan-700 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed font-medium">
                  {p.description}
                </p>

                {/* Price & Wholesale Margin Box */}
                <div className="p-3 rounded-xl bg-surface-low border border-surface-border space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-charcoal-muted uppercase font-bold">Retail Price</span>
                    <span className="text-lg font-black text-forest-950">${p.price.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-charcoal-light border-t border-surface-border pt-1.5">
                    <span>Vendor Cost: <strong className="text-charcoal">${wholesale.toFixed(2)}</strong></span>
                    <span className="font-extrabold text-emerald-700">Margin: ${marginVal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Profit Impact Badge */}
                <div className={`p-2.5 rounded-xl border text-[10px] font-black leading-tight flex items-center gap-1.5 ${impact.badge}`}>
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{impact.label}</span>
                </div>
              </div>

              <div className="p-4 bg-surface-low/80 border-t border-surface-border flex items-center justify-between gap-2">
                <span className="text-[10px] text-charcoal-light font-bold">
                  {p.inStock > 0 ? `${p.inStock} in stock` : 'Out of stock'}
                </span>
                <button
                  onClick={() =>
                    addToCart(p, 1, {
                      originType: purchaseScope === 'NATIONAL' ? 'NATIONAL' : purchaseScope === 'STATE' ? 'STATE' : 'CLUB',
                      orderSource: purchaseScope === 'NATIONAL' ? 'National HQ Store' : purchaseScope === 'STATE' ? selectedStateScope : selectedClubScope,
                      clubName: selectedClubScope,
                      stateName: selectedStateScope
                    })
                  }
                  disabled={p.inStock <= 0}
                  className={`px-4 py-2 text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                    p.inStock > 0
                      ? 'bg-tan-500 hover:bg-tan-600 text-forest-950 active:scale-95 cursor-pointer'
                      : 'bg-surface-border text-charcoal-light cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Super Admin Product Price / Wholesale Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <span>{editingProduct ? 'Edit Merchandise & Wholesale Rates' : 'Add New Drop-Ship Product'}</span>
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-charcoal-light hover:text-charcoal cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-extrabold text-forest-900 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Official UHC Field Vest"
                  className="w-full px-3 py-2 bg-surface-low border rounded-lg font-bold text-charcoal focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-forest-900 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border rounded-lg font-bold text-charcoal"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-forest-900 mb-1">Drop-Ship Vendor</label>
                  <select
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border rounded-lg font-bold text-charcoal"
                  >
                    <option value="Garmin Outdoor">Garmin Outdoor</option>
                    <option value="Purina Pro Plan">Purina Pro Plan</option>
                    <option value="Browning Outdoors">Browning Outdoors</option>
                    <option value="Drake Waterfowl">Drake Waterfowl</option>
                    <option value="Filson Outdoors">Filson Outdoors</option>
                  </select>
                </div>
              </div>

              {/* Pricing Controls: Retail vs Wholesale */}
              <div className="p-4 rounded-xl bg-surface-low border border-surface-border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-forest-950 mb-1">Retail Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-lowest border rounded-lg font-extrabold text-forest-950 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-charcoal-muted mb-1">Vendor Wholesale Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.wholesaleCost}
                      onChange={(e) => setFormData({ ...formData, wholesaleCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface-lowest border rounded-lg font-extrabold text-charcoal text-sm"
                    />
                  </div>
                </div>

                {/* Auto Calculated Net Margin Preview */}
                <div className="p-3 rounded-lg bg-emerald-950/10 border border-emerald-600/30 flex items-center justify-between text-xs font-black text-emerald-900">
                  <span>Net Profit Margin (Retail - Wholesale):</span>
                  <span className="text-sm font-black text-emerald-700">
                    ${(Number(formData.price || 0) - Number(formData.wholesaleCost || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-forest-900 mb-1">In Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-surface-low border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-forest-900 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-low border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-forest-900 mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-low border rounded-lg font-semibold"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-surface-low hover:bg-surface-border font-bold rounded-lg text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 font-black rounded-lg text-white shadow-md cursor-pointer"
                >
                  Save Product Rates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

