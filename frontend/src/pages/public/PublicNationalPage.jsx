import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConnectedNetworkBanner } from '../../components/common/ConnectedNetworkBanner';

export const PublicNationalPage = () => {
  const { products, addToCart, cartCount, cartSubtotal, showToast } = useApp();
  const [addedId, setAddedId] = useState(null);

  const nationalProducts = products.filter(
    (p) => p.scopeChannel === 'NATIONAL' || p.organizationType === 'NATIONAL' || p.source === 'UHC' || (p.id && p.id.startsWith('mkt-'))
  );

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => {
      setAddedId((prev) => (prev === product.id ? null : prev));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-3xl p-8 lg:p-10 border border-forest-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            🏠 Ultimate Hound Club National Headquarters
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            National Platform Hub & Store
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium max-w-xl">
            Connecting 50 State Platforms and hundreds of Local Club Platforms across America.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-forest-900 border border-forest-700 rounded-xl text-tan-300 text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-tan-400" />
          <span>Central Network Hub</span>
        </div>
      </div>

      {/* Connected Network Architecture (Section 33 UI) */}
      <ConnectedNetworkBanner />

      {/* Floating / Prominent Live Cart Notification Bar */}
      {cartCount > 0 && (
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white p-4 sm:p-5 rounded-2xl border border-tan-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500/20 text-tan-400 flex items-center justify-center border border-tan-500/30">
              <ShoppingBag className="w-5 h-5 text-tan-400" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{cartCount} item{cartCount > 1 ? 's' : ''} in cart</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">Live Database Ready</span>
              </div>
              <div className="text-xs text-tan-200">
                Subtotal: <strong className="text-white font-black">${cartSubtotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/cart"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nationalProducts.map((product) => {
          const isAdded = addedId === product.id;
          return (
            <div
              key={product.id}
              className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden group hover:shadow-xl hover:border-tan-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative overflow-hidden h-48 bg-surface-low">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-forest-950/80 text-tan-300 text-[9px] font-black uppercase backdrop-blur-sm">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-tan-500 text-forest-950 text-[9px] font-black uppercase shadow-md">
                  {product.vendorName || 'National'}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-black text-base text-charcoal leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1.5 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal-muted font-bold block uppercase tracking-wider">Retail Price</span>
                    <span className="text-xl font-black text-forest-800">
                      ${Number(product.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-forest-900 hover:bg-forest-950 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
