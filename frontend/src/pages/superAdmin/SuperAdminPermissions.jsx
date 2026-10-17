import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Check,
  X,
  Users,
  Calendar,
  FileCheck,
  Dog,
  ShoppingBag,
  DollarSign,
  Newspaper,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { DEFAULT_PERMISSIONS } from '../../data/mockData';

const MODULE_METADATA = {
  members: { label: 'Members & Users', desc: 'Member profiles, account credentials, and rosters', icon: Users },
  events: { label: 'Hunting Events', desc: 'Event listings, registrations, and check-ins', icon: Calendar },
  claims: { label: 'Club Claims', desc: 'Club ownership claims and verification requests', icon: FileCheck },
  dogs: { label: 'Canine Registry', desc: 'Dog profiles, UKC registrations, and achievements', icon: Dog },
  products: { label: 'Store & Gear', desc: 'Official merchandise, pricing, and inventory', icon: ShoppingBag },
  orders: { label: 'Orders & Sales', desc: 'Member merchandise purchases and shipping status', icon: ShoppingBag },
  finance: { label: 'Financial Ledger', desc: 'Platform revenues, payouts, and transaction audits', icon: DollarSign },
  news: { label: 'News & Announcements', desc: 'Public news articles, alerts, and broadcasts', icon: Newspaper },
  reports: { label: 'Audit Reports', desc: 'Platform activity, system logs, and data exports', icon: FileSpreadsheet }
};

const ROLES = [
  { key: 'SUPER_ADMIN', label: 'Super Admin', badge: 'bg-red-500/10 text-red-700 border-red-200' },
  { key: 'NATIONAL_ADMIN', label: 'National Admin', badge: 'bg-blue-500/10 text-blue-700 border-blue-200' },
  { key: 'STATE_ADMIN', label: 'State Admin', badge: 'bg-amber-500/10 text-amber-700 border-amber-200' },
  { key: 'CLUB_ADMIN', label: 'Club Admin', badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
  { key: 'EVENT_ADMIN', label: 'Event Admin', badge: 'bg-purple-500/10 text-purple-700 border-purple-200' },
  { key: 'MEMBER', label: 'Member', badge: 'bg-stone-500/10 text-stone-700 border-stone-200' }
];

export const SuperAdminPermissions = () => {
  const { permissions, updatePermission, grantAllPermissionsForRole, showToast } = useApp();
  const [activeRole, setActiveRole] = useState('SUPER_ADMIN');

  // Safeguard: handle if permissions is an array or object
  const rolePermissions = React.useMemo(() => {
    if (!permissions) return DEFAULT_PERMISSIONS[activeRole] || {};
    if (Array.isArray(permissions)) {
      const map = {};
      permissions.forEach((row) => {
        if (row && row.module) {
          map[row.module.toLowerCase()] = {
            view: !!row.view,
            create: !!row.create,
            edit: !!row.edit,
            delete: !!row.delete
          };
        }
      });
      return map;
    }
    return permissions[activeRole] || DEFAULT_PERMISSIONS[activeRole] || {};
  }, [permissions, activeRole]);

  const activeRoleConfig = ROLES.find((r) => r.key === activeRole) || ROLES[0];
  const moduleKeys = Object.keys(MODULE_METADATA);

  // Stats calculation
  const totalPermissions = moduleKeys.length * 4;
  let allowedCount = 0;
  moduleKeys.forEach((mod) => {
    const perm = rolePermissions[mod] || { view: false, create: false, edit: false, delete: false };
    if (perm.view) allowedCount++;
    if (perm.create) allowedCount++;
    if (perm.edit) allowedCount++;
    if (perm.delete) allowedCount++;
  });

  const toggleAllForRole = (grant) => {
    if (grantAllPermissionsForRole) {
      grantAllPermissionsForRole(activeRole, grant);
    } else {
      moduleKeys.forEach((mod) => {
        ['view', 'create', 'edit', 'delete'].forEach((action) => {
          if (updatePermission) updatePermission(activeRole, mod, action, grant);
        });
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Role & Permission Matrix</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-forest-900/10 text-forest-800 border border-forest-800/20">
              Super Admin Level
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Configure system access capabilities (View, Create, Edit, Delete) across platform modules for each user role
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAllForRole(true)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Grant All
          </button>
          <button
            onClick={() => toggleAllForRole(false)}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" /> Revoke All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-lowest rounded-xl border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="p-3 bg-forest-900/10 rounded-lg text-forest-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-charcoal-muted font-bold">Selected Target Role</div>
            <div className="text-sm font-extrabold text-forest-900">{activeRoleConfig.label}</div>
          </div>
        </div>

        <div className="p-4 bg-surface-lowest rounded-xl border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-charcoal-muted font-bold">Active Permission Nodes</div>
            <div className="text-sm font-extrabold text-forest-900">
              {allowedCount} / {totalPermissions} ({Math.round((allowedCount / totalPermissions) * 100)}%)
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-lowest rounded-xl border border-surface-border shadow-ambient flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-charcoal-muted font-bold">Configured Modules</div>
            <div className="text-sm font-extrabold text-forest-900">{moduleKeys.length} Core Modules</div>
          </div>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-surface-border overflow-x-auto pb-1">
        {ROLES.map((r) => {
          const isActive = activeRole === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setActiveRole(r.key)}
              className={`px-4 py-2.5 text-xs font-black rounded-t-lg transition-all border-t border-x whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-surface-lowest text-forest-900 border-surface-border shadow-xs border-b-2 border-b-forest-800'
                  : 'bg-surface-low text-charcoal-muted border-transparent hover:text-forest-800 hover:bg-surface-low/80'
              }`}
            >
              <span>{r.label}</span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${r.badge}`}>
                {r.key.replace('_', ' ')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-surface-lowest rounded-xl border border-surface-border shadow-ambient overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-low text-charcoal-muted uppercase text-[10px] font-black border-b border-surface-border">
            <tr>
              <th className="p-4">Module Name & Capability Scope</th>
              <th className="p-4 text-center w-28">View Access</th>
              <th className="p-4 text-center w-28">Create Access</th>
              <th className="p-4 text-center w-28">Edit Access</th>
              <th className="p-4 text-center w-28">Delete Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {moduleKeys.map((modKey) => {
              const meta = MODULE_METADATA[modKey];
              const Icon = meta.icon;
              const permObj = rolePermissions[modKey] || { view: false, create: false, edit: false, delete: false };

              return (
                <tr key={modKey} className="hover:bg-surface-low/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-low text-forest-800 border border-surface-border">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-forest-900 text-xs">{meta.label}</div>
                        <div className="text-[11px] text-charcoal-muted mt-0.5">{meta.desc}</div>
                      </div>
                    </div>
                  </td>

                  {['view', 'create', 'edit', 'delete'].map((action) => {
                    const isGranted = Boolean(permObj[action]);
                    return (
                      <td key={action} className="p-4 text-center">
                        <button
                          onClick={() => updatePermission(activeRole, modKey, action, !isGranted)}
                          title={`${isGranted ? 'Revoke' : 'Grant'} ${action} permission on ${meta.label} for ${activeRoleConfig.label}`}
                          className={`w-9 h-9 rounded-lg font-extrabold inline-flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                            isGranted
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700'
                              : 'bg-surface-low hover:bg-surface-border text-charcoal-light border border-surface-border'
                          }`}
                        >
                          {isGranted ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[2.5]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
