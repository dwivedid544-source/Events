import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  ArrowRight,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { orders } = useApp();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Find order in state or pick most recent
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-forest-950">Order Not Found</h1>
        <p className="text-xs text-charcoal-muted">We could not locate the requested order details.</p>
        <Link to="/store" className="inline-flex px-5 py-2.5 bg-forest-900 text-white rounded-xl text-xs font-bold">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-8">
      {/* Thank You Hero Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-8 lg:p-10 border border-forest-800 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-tan-500/20 text-tan-400 mx-auto flex items-center justify-center border border-tan-500/40">
          <CheckCircle2 className="w-10 h-10 text-tan-400" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-tan-400">Order Placed Successfully</span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">Thank You for Your Order!</h1>
          <p className="text-xs text-tan-200/90 max-w-lg mx-auto leading-relaxed">
            Your official field equipment order has been confirmed and is now being processed by National Headquarters.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2 bg-forest-900/90 rounded-xl border border-forest-700 text-xs font-mono text-tan-300">
          <span>Order ID: <strong className="text-white">{order.id}</strong></span>
          <span>•</span>
          <span>Date: <strong className="text-white">{order.date}</strong></span>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="bg-surface-lowest rounded-2xl p-6 lg:p-8 border border-surface-border shadow-ambient space-y-8">
        {/* Purchased Products */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-forest-950 flex items-center gap-2 border-b border-surface-border pb-3">
            <Package className="w-4 h-4 text-tan-600" />
            <span>Purchased Merchandise</span>
          </h2>

          <div className="space-y-3 divide-y divide-surface-border">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <div className="font-extrabold text-forest-950">{item.name}</div>
                      <div className="text-[10px] text-charcoal-light">Qty: {item.quantity} • ${item.price?.toFixed(2)} each</div>
                    </div>
                  </div>
                  <div className="font-black text-forest-900">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-charcoal-muted">{order.items || order.item}</div>
            )}
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-surface-border text-xs">
          {/* Shipping Info */}
          <div className="bg-surface p-4 rounded-xl border border-surface-border space-y-2">
            <div className="font-black text-forest-950 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-tan-600" />
              <span>Shipping Address</span>
            </div>
            <div className="text-charcoal space-y-0.5 font-medium text-[11px]">
              <div><strong>{order.customer}</strong></div>
              <div>{order.shippingAddress?.address1 || '1420 Hunting Ridge Rd'}</div>
              {order.shippingAddress?.address2 && <div>{order.shippingAddress.address2}</div>}
              <div>{order.shippingAddress?.city || 'Knoxville'}, {order.shippingAddress?.state || 'TN'} {order.shippingAddress?.zip || '37901'}</div>
              <div>{order.shippingAddress?.country || 'United States'}</div>
              <div className="text-charcoal-light pt-1">Phone: {order.phone}</div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="bg-surface p-4 rounded-xl border border-surface-border space-y-2">
            <div className="font-black text-forest-950 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-tan-600" />
              <span>Delivery & Payment Status</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {order.paymentStatus || 'Paid'} ({order.paymentMethod || 'Credit Card'})
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="font-bold text-forest-900">{order.estimatedDelivery || '3-5 Business Days'}</span>
              </div>

              <div className="flex justify-between">
                <span>Fulfillment Status:</span>
                <span className="font-bold text-tan-700 bg-tan-100 px-2 py-0.5 rounded">
                  {order.fulfillmentStatus || 'Processing'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-surface-low p-4 rounded-xl border border-surface-border space-y-2 text-xs font-medium">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold">${(order.subtotal || order.total || order.amount).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-bold text-forest-800">
              {order.shipping === 0 ? 'FREE' : `$${(order.shipping || 0).toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-bold">${(order.tax || 0).toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-surface-border flex justify-between items-center text-sm font-black text-forest-950">
            <span>Grand Total Paid:</span>
            <span className="text-lg text-forest-900">${(order.total || order.amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-surface-border">
          <Link
            to="/store"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-tan-400" />
            <span>Continue Shopping</span>
          </Link>

          <Link
            to="/member/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
