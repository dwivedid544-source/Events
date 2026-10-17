import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Plus, Download, CreditCard, ShieldCheck } from 'lucide-react';

export const TransactionsLedgerPage = () => {
  const { transactions = [], addTransaction, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    category: 'Event Revenue',
    amount: '',
    type: 'Credit',
    reference: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;
    addTransaction(formData);
    setModalOpen(false);
    setFormData({ description: '', category: 'Event Revenue', amount: '', type: 'Credit', reference: '' });
  };

  const totalCredits = transactions.filter(t => t.type === 'Credit').reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalDebits = transactions.filter(t => t.type === 'Debit').reduce((a, b) => a + Number(b.amount || 0), 0);

  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (r) => <span className="font-mono font-bold text-forest-800">{r.id}</span>
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Description',
      accessor: 'description',
      render: (r) => <span className="font-semibold text-charcoal">{r.description}</span>
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Type',
      accessor: 'type',
      render: (r) => (
        <span className={`inline-flex items-center gap-1 font-bold text-xs ${r.type === 'Credit' ? 'text-emerald-700' : 'text-red-700'}`}>
          {r.type === 'Credit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          {r.type}
        </span>
      )
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (r) => (
        <span className={`font-extrabold text-sm ${r.type === 'Credit' ? 'text-emerald-800' : 'text-red-800'}`}>
          {r.type === 'Credit' ? '+' : '-'}${Number(r.amount).toFixed(2)}
        </span>
      )
    },
    { header: 'Status', accessor: 'status', isStatus: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Platform Transactions Ledger</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Real-time audit log of entry payments, store sales, and sanction fees</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => showToast('Exported transaction ledger to CSV file!', 'success')}
            className="px-3.5 py-2 bg-surface-lowest border hover:bg-surface-low text-charcoal font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Ledger
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Volume" value={`$${(totalCredits + totalDebits).toFixed(2)}`} subtext="Gross Activity" icon={CreditCard} />
        <StatCard title="Total Credits" value={`+$${totalCredits.toFixed(2)}`} subtext="Incoming Revenues" icon={ArrowDownLeft} />
        <StatCard title="Total Debits" value={`-$${totalDebits.toFixed(2)}`} subtext="Disbursements & Dues" icon={ArrowUpRight} />
        <StatCard title="Settlement Status" value="100%" subtext="Audited & Reconciled" icon={ShieldCheck} />
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        searchPlaceholder="Search by ID, description, category..."
        filterField="type"
        filterOptions={['Credit', 'Debit']}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Manual Financial Transaction">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal mb-1">Transaction Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Sanction Fee Refund or Store Sale"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              >
                <option value="Event Revenue">Event Revenue</option>
                <option value="Store Revenue">Store Revenue</option>
                <option value="Membership Revenue">Membership Revenue</option>
                <option value="State Dues">State Dues</option>
                <option value="National Fee">National Fee</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Transaction Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              >
                <option value="Credit">Credit (+ Incoming)</option>
                <option value="Debit">Debit (- Outgoing)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Amount ($ USD)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="45.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">Reference Code</label>
              <input
                type="text"
                placeholder="e.g. INV-901"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-charcoal font-bold hover:bg-surface-low rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
