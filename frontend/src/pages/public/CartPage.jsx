import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useApp();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-forest-900/10 text-forest-900 mx-auto flex items-center justify-center border border-forest-800/20">
          <ShoppingBag className="w-12 h-12 text-forest-800" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-forest-950 tracking-tight">Your cart is empty.</h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            Looks like you haven't added any official merchandise or field gear to your shopping cart yet.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-tan-400" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Official Store</span>
          <h1 className="text-3xl lg:text-4xl font-black text-forest-950 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Review your selected items ({cartCount} {cartCount === 1 ? 'item' : 'items'}) before checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border bg-surface-lowest hover:bg-rose-50 hover:text-rose-700 text-charcoal transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>

          <Link
            to="/store"
            className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border bg-surface-lowest hover:bg-surface-low text-charcoal transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-surface-lowest rounded-2xl p-5 border border-surface-border shadow-ambient flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-tan-500/40 transition-all"
            >
              {/* Product Image & Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-surface-border shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-tan-100 text-tan-900">
                    {item.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-forest-950">{item.name}</h3>
                  <div className="text-xs text-charcoal-muted font-bold">${item.price.toFixed(2)} each</div>
                  <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-surface-border">
                {/* Quantity + / - Buttons */}
                <div className="flex items-center gap-2 bg-surface-low p-1 rounded-xl border border-surface-border">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-surface-lowest hover:bg-surface-border text-charcoal flex items-center justify-center transition-colors"
                    aria-label="Decrease Quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center text-xs font-black text-forest-950">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-surface-lowest hover:bg-surface-border text-charcoal flex items-center justify-center transition-colors"
                    aria-label="Increase Quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-xs text-charcoal-light font-medium">Subtotal</div>
                  <div className="text-base font-black text-forest-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-charcoal-light hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  aria-label="Remove item"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="lg:col-span-4 bg-surface-lowest rounded-2xl p-6 border border-surface-border shadow-ambient space-y-6 sticky top-24">
          <h2 className="text-lg font-black text-forest-950 border-b border-surface-border pb-3">
            Order Summary
          </h2>

          {/* Active Revenue Origin Channel Badge */}
          {cart[0]?.originDetails && (
            <div className="p-3.5 rounded-xl bg-forest-950 text-white space-y-1 text-xs border border-forest-800">
              <div className="text-[10px] uppercase font-black text-tan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-tan-400" />
                <span>Revenue Split Channel</span>
              </div>
              <div className="font-extrabold text-white text-xs">
                Channel: {cart[0]?.originDetails.orderSource} ({cart[0]?.originDetails.originType})
              </div>
              <div className="text-[10px] text-tan-200 font-medium">
                {cart[0]?.originDetails.originType === 'CLUB' && 'Club (15%) + State (7%) + National (8%) + Vendor (70%)'}
                {cart[0]?.originDetails.originType === 'STATE' && 'State (7%) + National (23%) + Vendor (70%)'}
                {cart[0]?.originDetails.originType === 'NATIONAL' && 'National HQ (30%) + Vendor (70%)'}
              </div>
            </div>
          )}

          <div className="space-y-3 text-xs font-medium text-charcoal">
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span className="font-black">{cartCount}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-black">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-black text-forest-800">
                {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax (8%):</span>
              <span className="font-black">${cartTax.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-between items-center text-base font-black text-forest-950">
              <span>Grand Total:</span>
              <span className="text-xl text-forest-900">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-tan-400 to-tan-600 hover:from-tan-500 hover:to-tan-700 text-forest-950 font-black text-xs rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-4 border-t border-surface-border space-y-2 text-[11px] text-charcoal-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-tan-600 shrink-0" />
              <span>Fast 3-5 Business Days Field Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tan-600 shrink-0" />
              <span>Sanctioned UKC & Platform Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
