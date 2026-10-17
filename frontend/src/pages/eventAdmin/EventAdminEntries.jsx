import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';

export const EventAdminEntries = () => {
  const { entries } = useApp();

  const columns = [
    { header: 'Entry ID', accessor: 'id', render: (r) => <span className="font-mono font-bold">#{r.id}</span> },
    { header: 'Participant', accessor: 'participant', render: (r) => <span className="font-extrabold text-forest-800">{r.participant}</span> },
    { header: 'Dog Registered', accessor: 'dog', render: (r) => <span className="font-semibold text-tan-800">{r.dog}</span> },
    { header: 'Payment Status', accessor: 'paymentStatus', isStatus: true },
    { header: 'Attendance Status', accessor: 'checkInStatus', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Event Registrations & Entries</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Assigned Scope: Nite Hunt (Sep 19, 2026)</p>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchPlaceholder="Search event entries..."
        filterField="checkInStatus"
        filterOptions={['Checked In', 'Not Arrived']}
      />
    </div>
  );
};
