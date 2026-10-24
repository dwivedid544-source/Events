import React, { useState } from 'react';
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
  ShieldCheck,
  X,
  Download,
  Clock,
  ExternalLink,
  Hash,
  User,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const OrderConfirmationPage = () => {
  const { orders } = useApp();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Modal State for "View My Orders"
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedModalOrderId, setSelectedModalOrderId] = useState(null);

  // Find order in state or pick most recent
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-forest-950">Order Not Found</h1>
        <p className="text-xs text-charcoal-muted">We could not locate the requested order details.</p>
        <Link to="/marketplace" className="inline-flex px-5 py-2.5 bg-forest-900 text-white rounded-xl text-xs font-bold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Filter orders that belong to this customer
  const customerOrders = orders.filter((o) => {
    if (order.id && o.id === order.id) return true;
    if (order.email && o.email && o.email.toLowerCase() === order.email.toLowerCase()) return true;
    if (order.customer && o.customer && o.customer.toLowerCase() === order.customer.toLowerCase()) return true;
    return false;
  });

  const orderList = customerOrders.length > 0 ? customerOrders : [order];
  const activeModalOrder = orderList.find((o) => o.id === (selectedModalOrderId || order.id)) || orderList[0];

  // Helper to generate and download a clean PDF receipt
  const handleDownloadReceipt = (o) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header Banner
      doc.setFillColor(27, 59, 43); // Deep Forest Green
      doc.rect(0, 0, 210, 28, 'F');
      doc.setFillColor(197, 160, 89); // Gold stripe
      doc.rect(0, 28, 210, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('UNITED HOUND CHAMPIONSHIPS (UHC)', 14, 12);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 210, 185);
      doc.text('Official Customer Order Receipt & Proof of Purchase', 14, 18);

      // Order Reference Block
      doc.setTextColor(27, 59, 43);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Order Reference: ${o.id}`, 14, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Date Placed: ${o.date || new Date().toLocaleDateString()}`, 14, 44);
      doc.text(`Customer Name: ${o.customer || 'Valued Customer'}`, 14, 50);
      doc.text(`Email: ${o.email || 'customer@example.com'} • Phone: ${o.phone || 'N/A'}`, 14, 56);
      doc.text(`Payment Status: ${o.paymentStatus || 'Paid'} (Clover MID: 526695041883)`, 14, 62);

      // Table Header
      let y = 72;
      doc.setFillColor(240, 245, 240);
      doc.rect(14, y, 182, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(27, 59, 43);
      doc.text('Item Description', 18, y + 5);
      doc.text('Qty', 130, y + 5);
      doc.text('Price', 152, y + 5);
      doc.text('Total', 178, y + 5);
      y += 8;

      // Table Items
      const items = o.orderItems && o.orderItems.length > 0
        ? o.orderItems
        : [{ name: o.items || o.item || 'Sanctioned Field Merchandise', quantity: 1, price: o.total || o.amount }];

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      items.forEach((it) => {
        const title = String(it.name || 'Item').substring(0, 52);
        const qty = it.quantity || 1;
        const price = Number(it.price || 0);
        doc.text(title, 18, y + 5);
        doc.text(String(qty), 132, y + 5);
        doc.text(`$${price.toFixed(2)}`, 152, y + 5);
        doc.text(`$${(price * qty).toFixed(2)}`, 178, y + 5);
        y += 7;
      });

      // Pricing Summary Box
      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, 196, y);
      y += 6;

      const subtotal = Number(o.subtotal || o.total || o.amount || 0);
      const shipping = Number(o.shipping || 0);
      const tax = Number(o.tax || 0);
      const grandTotal = Number(o.total || o.amount || 0);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Subtotal:`, 140, y);
      doc.text(`$${subtotal.toFixed(2)}`, 196, y, { align: 'right' });
      y += 5;

      doc.text(`Shipping:`, 140, y);
      doc.text(shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, 196, y, { align: 'right' });
      y += 5;

      doc.text(`Estimated Tax:`, 140, y);
      doc.text(`$${tax.toFixed(2)}`, 196, y, { align: 'right' });
      y += 7;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(27, 59, 43);
      doc.text(`Grand Total Paid:`, 140, y);
      doc.text(`$${grandTotal.toFixed(2)}`, 196, y, { align: 'right' });

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for supporting United Hound Championships field events & sanctioned clubs.', 14, 280);

      doc.save(`UHC_Receipt_${o.id}.pdf`);
    } catch (err) {
      console.warn('PDF Receipt generation error:', err);
      window.print();
    }
  };

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

              <div className="flex justify-between items-center pt-2 border-t border-surface-border">
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Clover Gateway:
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                  MID: 526695041883 • PAID
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
            to="/marketplace"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-tan-400" />
            <span>Continue Shopping</span>
          </Link>

          {/* Opens Pop-up Modal instead of navigating to internal super-admin dashboard */}
          <button
            type="button"
            onClick={() => {
              setSelectedModalOrderId(order.id);
              setShowOrdersModal(true);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POP-UP MODAL: Customer Order Tracking & History Details */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-surface-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-border overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white flex items-center justify-between border-b border-forest-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-tan-500/20 text-tan-400 flex items-center justify-center border border-tan-500/30">
                  <ShoppingBag className="w-5 h-5 text-tan-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>My Order Details & Tracking</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Live Status
                    </span>
                  </h3>
                  <p className="text-[11px] text-tan-200/80">Customer fulfillment ledger & delivery progress</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOrdersModal(false)}
                className="text-tan-200/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-charcoal">
              {/* Order Selector Tabs (if customer has placed multiple orders) */}
              {orderList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-border">
                  <span className="text-[10px] font-black uppercase text-charcoal-muted tracking-wide shrink-0">
                    Your Orders ({orderList.length}):
                  </span>
                  {orderList.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedModalOrderId(o.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        activeModalOrder.id === o.id
                          ? 'bg-forest-900 text-tan-300 shadow-sm'
                          : 'bg-surface-low text-charcoal hover:bg-surface-border'
                      }`}
                    >
                      {o.id}
                    </button>
                  ))}
                </div>
              )}

              {/* Order Meta Header Card */}
              <div className="bg-surface-low p-4 rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-forest-950">
                      Order #{activeModalOrder.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {activeModalOrder.paymentStatus || 'Paid'}
                    </span>
                  </div>
                  <div className="text-[11px] text-charcoal-muted flex items-center gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-tan-600" />
                    <span>Placed on {activeModalOrder.date}</span>
                    <span>•</span>
                    <User className="w-3.5 h-3.5 text-tan-600" />
                    <span>{activeModalOrder.customer}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-charcoal-light">Total Paid</div>
                  <div className="text-base font-black text-forest-950 font-mono">
                    ${(activeModalOrder.total || activeModalOrder.amount || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Visual Delivery Status Progress Tracker */}
              <div className="bg-surface-lowest p-4 rounded-xl border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-forest-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-tan-600" />
                    <span>Fulfillment Progress</span>
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-tan-100 text-tan-800 border border-tan-300">
                    Status: {activeModalOrder.fulfillmentStatus || 'Processing'}
                  </span>
                </div>

                {/* Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { label: 'Order Confirmed', done: true },
                    { label: 'Payment Verified', done: true },
                    { label: 'Vendor Drop-Ship', done: true },
                    { label: 'Delivered', done: activeModalOrder.fulfillmentStatus === 'Delivered' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center space-y-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                          step.done
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-surface-low border border-surface-border text-charcoal-light'
                        }`}
                      >
                        {step.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className="text-[10px] font-bold text-forest-950 leading-tight">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-charcoal-muted bg-surface-low p-2.5 rounded-lg flex items-center justify-between border border-surface-border">
                  <span>Logistics Carrier: <strong className="text-forest-950">{activeModalOrder.carrier || 'Direct Vendor Drop-Ship'}</strong></span>
                  <span className="font-mono text-[10px] font-bold text-forest-900 bg-white px-2 py-0.5 rounded border">
                    {activeModalOrder.trackingNumber ? `Track #${activeModalOrder.trackingNumber}` : 'Tracking: Pending Dispatch'}
                  </span>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="space-y-3">
                <div className="font-extrabold text-forest-950 flex items-center gap-1.5 border-b border-surface-border pb-2">
                  <Package className="w-4 h-4 text-tan-600" />
                  <span>Purchased Items</span>
                </div>

                <div className="space-y-2.5 divide-y divide-surface-border">
                  {activeModalOrder.orderItems && activeModalOrder.orderItems.length > 0 ? (
                    activeModalOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop&q=80'}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover border border-surface-border"
                          />
                          <div>
                            <div className="font-bold text-forest-950 text-xs">{item.name}</div>
                            <div className="text-[11px] text-charcoal-light font-medium">
                              Qty: {item.quantity} • ${item.price?.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-forest-900 text-xs">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-charcoal-muted font-medium py-1">
                      {activeModalOrder.items || activeModalOrder.item || 'Sanctioned Field Merchandise'}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address & Summary Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-surface p-3.5 rounded-xl border border-surface-border space-y-1">
                  <div className="font-extrabold text-forest-950 flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-tan-600" />
                    <span>Delivery Address</span>
                  </div>
                  <div className="text-[11px] text-charcoal font-medium space-y-0.5 leading-relaxed">
                    <div className="font-bold">{activeModalOrder.customer}</div>
                    <div>{activeModalOrder.shippingAddress?.address1 || '1420 Hunting Ridge Rd'}</div>
                    <div>
                      {activeModalOrder.shippingAddress?.city || 'Knoxville'},{' '}
                      {activeModalOrder.shippingAddress?.state || 'TN'}{' '}
                      {activeModalOrder.shippingAddress?.zip || '37901'}
                    </div>
                    <div className="text-charcoal-light">Phone: {activeModalOrder.phone || 'N/A'}</div>
                  </div>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-surface-border space-y-1.5 font-medium text-[11px]">
                  <div className="font-extrabold text-forest-950 text-[11px] pb-1 border-b border-surface-border">
                    Payment Breakdown
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">${(activeModalOrder.subtotal || activeModalOrder.total || activeModalOrder.amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-bold text-forest-800">
                      {activeModalOrder.shipping === 0 ? 'FREE' : `$${(activeModalOrder.shipping || 0).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-bold">${(activeModalOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="pt-1 border-t border-surface-border flex justify-between items-center font-black text-forest-950">
                    <span>Grand Total:</span>
                    <span className="text-xs text-forest-900">${(activeModalOrder.total || activeModalOrder.amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface-low border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(activeModalOrder)}
                className="w-full sm:w-auto px-4 py-2 bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-tan-400" />
                <span>Download PDF Receipt</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/marketplace"
                  onClick={() => setShowOrdersModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-bold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Keep Shopping</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowOrdersModal(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-surface-border bg-white hover:bg-surface-low text-charcoal font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
