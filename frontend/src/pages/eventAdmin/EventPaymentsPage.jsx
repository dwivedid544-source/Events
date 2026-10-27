import React, { useState } from 'react';
import { useApp, API_BASE_URL } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { DollarSign, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export const EventPaymentsPage = () => {
  const { entries = [], setEntries, showToast } = useApp();
  const [loadingId, setLoadingId] = useState(null);

  const handleTogglePayment = async (id) => {
    const target = entries.find((e) => e.id === id);
    if (!target) return;

    const nextStatus = target.paymentStatus === 'Paid' ? 'Pending Payment' : 'Paid';
    setLoadingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/events/entries/${id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nh_token') || ''}`
        },
        body: JSON.stringify({ paymentStatus: nextStatus })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, paymentStatus: nextStatus } : e))
        );
        showToast(`Entry #${id} payment status updated to ${nextStatus}`, 'success');
      } else {
        const errorMsg =
          data?.error?.message ||
          'Payment verification required. Unverified payments cannot be marked Paid by administrative fiat.';
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast(`Payment update error: ${err.message}`, 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    { header: 'Entry ID', accessor: 'id', render: (r) => <span className="font-mono font-bold text-forest-800">#{r.id}</span> },
    { header: 'Participant', accessor: 'participant' },
    { header: 'Registered Dog', accessor: 'dog', render: (r) => <span className="font-bold text-tan-800">{r.dog || 'Registered Hound'}</span> },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Fee Amount', accessor: 'fee', render: (r) => <span className="font-extrabold text-forest-900">${r.fee}.00</span> },
    { header: 'Payment Status', accessor: 'paymentStatus', isStatus: true },
    {
      header: 'Action',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => handleTogglePayment(r.id)}
          disabled={loadingId === r.id}
          className={`px-3 py-1 text-xs font-bold rounded border transition-colors disabled:opacity-50 ${
            r.paymentStatus === 'Paid'
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
          }`}
          title={r.paymentStatus === 'Paid' ? 'Mark payment as Pending' : 'Requires verified gateway settlement'}
        >
          {loadingId === r.id
            ? 'Updating...'
            : r.paymentStatus === 'Paid'
            ? 'Mark Pending'
            : 'Mark Fee Paid'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Event Entry Payments Ledger</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Track entry fee collections, Clover digital receipts, and payment settlements</p>
        </div>
        <div className="flex items-center gap-2 bg-tan-500/10 border border-tan-300 text-forest-900 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-tan-700" />
          <span>Gateway Verification Required for Settlement</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search entries by ID, participant, dog..."
        filterField="paymentStatus"
        filterOptions={['Paid', 'Pending', 'Pending Payment', 'Unpaid']}
      />
    </div>
  );
};
