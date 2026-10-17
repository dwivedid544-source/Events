import React from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Building2 } from 'lucide-react';

export const StateAdminClubs = () => {
  const { clubs } = useApp();

  const columns = [
    { header: 'Club Name', accessor: 'name', render: (r) => <span className="font-extrabold text-forest-800">{r.name}</span> },
    { header: 'City', accessor: 'city' },
    { header: 'State', accessor: 'state' },
    { header: 'Active Members', accessor: 'membersCount', render: (r) => <span className="font-bold">{r.membersCount}</span> },
    { header: 'Annual Events', accessor: 'eventsCount', render: (r) => <span>{r.eventsCount}</span> },
    { header: 'Club Administrator', accessor: 'adminName' },
    { header: 'Status', accessor: 'status', isStatus: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Tennessee Chartered Clubs</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Assigned Scope: Tennessee State Association (42 Clubs)</p>
      </div>

      <DataTable
        columns={columns}
        data={clubs}
        searchPlaceholder="Search Tennessee clubs..."
        filterField="status"
        filterOptions={['Active']}
      />
    </div>
  );
};
