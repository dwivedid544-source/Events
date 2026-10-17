import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';

export const ClubAdminEntries = () => {
  const { entries } = useApp();

  const columns = [
    { header: 'Entry ID', accessor: 'id', render: (r) => <span className="font-mono font-bold">#{r.id}</span> },
    { header: 'Member / Participant', accessor: 'participant', render: (r) => <span className="font-extrabold text-forest-800">{r.participant}</span> },
    { header: 'Dog', accessor: 'dog', render: (r) => <span className="font-semibold text-tan-800">{r.dog}</span> },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Payment', accessor: 'paymentStatus', isStatus: true },
    { header: 'Attendance Check-in', accessor: 'checkInStatus', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Club Entries Management</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Review member registrations and entry payments across club events</p>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search entries..."
        filterField="paymentStatus"
        filterOptions={['Paid', 'Pending']}
      />
    </div>
  );
};
