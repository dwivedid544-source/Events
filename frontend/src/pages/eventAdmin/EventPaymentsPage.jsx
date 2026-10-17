import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

export const EventPaymentsPage = () => {
  const { entries = [], setEntries, showToast } = useApp();

  const handleTogglePayment = async (id) => {
    let nextStatus = 'Pending';
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          nextStatus = e.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
          showToast(`Entry #${id} payment set to ${nextStatus}`, 'info');
          return { ...e, paymentStatus: nextStatus };
        }
        return e;
      })
    );

    try {
      await fetch(`http://localhost:5050/api/v1/events/entries/${id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: nextStatus })
      });
      console.log(`📡 API Call Success: PUT http://localhost:5050/api/v1/events/entries/${id}/payment -> ${nextStatus}`);
    } catch (err) {
      console.warn('API Warning:', err.message);
    }
  };

  const columns = [
    { header: 'Entry ID', accessor: 'id', render: (r) => <span className="font-mono font-bold text-forest-800">#{r.id}</span> },
    { header: 'Participant', accessor: 'participant' },
    { header: 'Registered Dog', accessor: 'dog', render: (r) => <span className="font-bold text-tan-800">{r.dog}</span> },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Fee Amount', accessor: 'fee', render: (r) => <span className="font-extrabold text-forest-900">${r.fee}.00</span> },
    { header: 'Payment Status', accessor: 'paymentStatus', isStatus: true },
    {
      header: 'Action',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => handleTogglePayment(r.id)}
          className={`px-3 py-1 text-xs font-bold rounded border transition-colors ${
            r.paymentStatus === 'Paid'
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {r.paymentStatus === 'Paid' ? 'Mark Pending' : 'Mark Fee Paid'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Event Entry Payments Ledger</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Track entry fee collections, digital receipts, and cash on-site payments</p>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search entries by ID, participant, dog..."
        filterField="paymentStatus"
        filterOptions={['Paid', 'Pending']}
      />
    </div>
  );
};
