import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Key, Shield, UserCheck, RefreshCw } from 'lucide-react';

export const UsersRolesPage = () => {
  const { users = [], updateUserRole, showToast } = useApp();

  const columns = [
    {
      header: 'User Account',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <img src={r.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={r.name} className="w-8 h-8 rounded-full object-cover border" />
          <div>
            <div className="font-extrabold text-charcoal">{r.name}</div>
            <div className="text-[10px] text-charcoal-light">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Role',
      accessor: 'role',
      render: (r) => (
        <select
          value={r.role}
          onChange={(e) => updateUserRole(r.id, e.target.value)}
          className="px-2.5 py-1 bg-surface-low border rounded text-xs font-extrabold text-forest-800 focus:border-forest-800"
        >
          <option value="SUPER_ADMIN">SUPER ADMIN</option>
          <option value="NATIONAL_ADMIN">NATIONAL ADMIN</option>
          <option value="STATE_ADMIN">STATE ADMIN</option>
          <option value="CLUB_ADMIN">CLUB ADMIN</option>
          <option value="EVENT_ADMIN">EVENT ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      )
    },
    { header: 'Assigned Scope', accessor: 'scope' },
    { header: 'Last Active', accessor: 'lastActive', render: (r) => <span className="text-[11px] text-charcoal-muted">{r.lastActive || 'Just now'}</span> },
    { header: 'Account Status', accessor: 'status', isStatus: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">User Account & Role Assignments</h1>
        <p className="text-xs text-charcoal-muted mt-0.5">Manage administrative roles, scope access levels, and user credentials across the platform</p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search by name, email, role, scope..."
        filterField="role"
        filterOptions={['SUPER_ADMIN', 'NATIONAL_ADMIN', 'STATE_ADMIN', 'CLUB_ADMIN', 'EVENT_ADMIN', 'MEMBER']}
      />
    </div>
  );
};
