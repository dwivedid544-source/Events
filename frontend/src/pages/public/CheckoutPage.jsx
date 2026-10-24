import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, cartCount, cartSubtotal, cartShipping, cartTax, cartTotal, placeOrder, currentUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : 'James',
    lastName: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') || 'Wadley' : 'Wadley',
    email: currentUser?.email || 'Houstonroofing@yahoo.com',
    phone: currentUser?.phone || '(713) 555-0192',
    address1: '1420 Championship Way',
    address2: 'Suite 200',
    city: 'Knoxville',
    state: 'TN',
    zip: '37901',
    country: 'United States',
    paymentMethod: 'credit_card',
    cardNumber: '4532 8192 3910 8891',
    cardExp: '12/28',
    cardCvc: '884'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-forest-900/10 text-forest-900 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-forest-800" />
        </div>
        <h1 className="text-3xl font-black text-forest-950">No items to checkout</h1>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">Your shopping cart is currently empty.</p>
        <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-xl text-xs font-black">
          Return to Store
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address1 || !formData.city || !formData.state || !formData.zip) {
      setErrorMsg('Please fill in all required customer and shipping address fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = placeOrder(formData);
      setIsSubmitting(false);

      if (createdOrder) {
        navigate(`/order-confirmation?orderId=${createdOrder.id}`);
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-700">Secure Checkout</span>
          <h1 className="text-3xl lg:text-4xl font-black text-forest-950 tracking-tight">Checkout Order</h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Enter your shipping details and complete your order.
          </p>
        </div>

        <Link
          to="/cart"
          className="px-4 py-2 rounded-xl text-xs font-bold border border-surface-border bg-surface-lowest hover:bg-surface-low text-charcoal transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-4 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Customer Information */}
          <div className="bg-surface-lowest rounded-2xl p-6 border border-surface-border shadow-ambient space-y-5">
            <h2 className="text-lg font-black text-forest-950 flex items-center gap-2 border-b border-surface-border pb-3">
              <span>1. Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-surface-lowest rounded-2xl p-6 border border-surface-border shadow-ambient space-y-5">
            <h2 className="text-lg font-black text-forest-950 flex items-center gap-2 border-b border-surface-border pb-3">
              <span>2. Shipping Address</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  placeholder="Street address or P.O. Box"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    placeholder="ZIP Code"
                    className="w-full px-3.5 py-2.5 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-tan-500 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method (Clover Gateway) */}
          <div className="bg-surface-lowest rounded-2xl p-6 border border-surface-border shadow-ambient space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
              <h2 className="text-lg font-black text-forest-950 flex items-center gap-2">
                <span>3. Payment Method</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Clover Gateway (MID: 526695041883)
                </span>
                <span className="text-[10px] font-bold text-charcoal-muted">256-bit SSL</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.paymentMethod === 'credit_card'
                    ? 'bg-tan-500/10 border-tan-500 text-forest-950 font-black'
                    : 'bg-surface border-surface-border text-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleChange}
                  className="accent-tan-500"
                />
                <CreditCard className="w-5 h-5 text-forest-900" />
                <span className="text-xs font-bold">Credit / Debit Card</span>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.paymentMethod === 'paypal'
                    ? 'bg-tan-500/10 border-tan-500 text-forest-950 font-black'
                    : 'bg-surface border-surface-border text-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="accent-tan-500"
                />
                <span className="text-xs font-extrabold text-blue-700">PayPal Checkout</span>
              </label>
            </div>

            {/* Credit Card Details Form */}
            {formData.paymentMethod === 'credit_card' && (
              <div className="bg-surface p-4 rounded-xl border border-surface-border space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4532 •••• •••• 8891"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-surface-lowest border border-surface-border rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs bg-surface-lowest border border-surface-border rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-charcoal mb-1">CVC Code</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      placeholder="CVC"
                      className="w-full px-3 py-2 text-xs bg-surface-lowest border border-surface-border rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-4 bg-surface-lowest rounded-2xl p-6 border border-surface-border shadow-ambient space-y-6 sticky top-24">
          <h2 className="text-lg font-black text-forest-950 border-b border-surface-border pb-3">
            Order Review
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

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                  <div>
                    <div className="font-extrabold text-forest-950 line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-charcoal-light">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="font-black text-forest-900">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs font-medium text-charcoal pt-4 border-t border-surface-border">
            <div className="flex justify-between">
              <span>Items Total ({cartCount}):</span>
              <span className="font-black">${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-black text-forest-800">
                {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span className="font-black">${cartTax.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-surface-border flex justify-between items-center text-base font-black text-forest-950">
              <span>Order Total:</span>
              <span className="text-xl text-forest-900">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-tan-400 to-tan-600 hover:from-tan-500 hover:to-tan-700 text-forest-950 font-black text-sm rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing Order...' : `Place Order ($${cartTotal.toFixed(2)})`}</span>
          </button>

          <div className="text-center text-[10px] text-charcoal-muted flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Encrypted & Sanctioned Payment</span>
          </div>
        </div>
      </form>
    </div>
  );
};
