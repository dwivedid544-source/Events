import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { ClipboardList } from 'lucide-react';

export const MemberEntries = () => {
  const { entries, currentUser } = useApp();

  const myEntries = entries.filter((e) => e.participant === currentUser.name || e.participant === 'John Walker');

  const columns = [
    { header: 'Entry ID', accessor: 'id', render: (r) => <span className="font-mono font-bold text-forest-800">#{r.id}</span> },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Club', accessor: 'club' },
    { header: 'Registered Dog', accessor: 'dog', render: (r) => <span className="font-semibold text-tan-800">{r.dog}</span> },
    { header: 'Date', accessor: 'date' },
    { header: 'Payment', accessor: 'paymentStatus', isStatus: true },
    { header: 'Attendance', accessor: 'checkInStatus', isStatus: true },
    { header: 'Result / Score', accessor: 'result', render: (r) => <span className="font-bold">{r.result}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">My Event Entries</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Track your event registrations, check-in status, and competition scores</p>
      </div>

      <DataTable
        columns={columns}
        data={myEntries}
        searchPlaceholder="Search my entries..."
        filterField="paymentStatus"
        filterOptions={['Paid', 'Pending']}
      />
    </div>
  );
};
