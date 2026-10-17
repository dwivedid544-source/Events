import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Globe,
  MapPin,
  Building2,
  User,
  Store,
  KeyRound,
  Eye,
  Sliders,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

export const RolePermissionsPage = () => {
  const { permissions, updatePermission, switchRole, currentUser, showToast } = useApp();

  const [activeRole, setActiveRole] = useState('NATIONAL_ADMIN');

  // EXACT 5 CLIENT ROLES
  const rolesList = [
    {
      id: 'NATIONAL_ADMIN',
      name: '1. NATIONAL ADMIN',
      icon: Globe,
      scope: 'Controls the entire UHC platform (All 50 States, All Local Clubs, All Vendors)',
      badgeBg: 'bg-forest-950 text-tan-300 border-tan-500'
    },
    {
      id: 'STATE_ADMIN',
      name: '2. STATE ADMIN',
      icon: MapPin,
      scope: 'Controls only their State Association (e.g. Texas State Association)',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'CLUB_ADMIN',
      name: '3. CLUB ADMIN',
      icon: Building2,
      scope: 'Controls only their Local Club (e.g. Houston County Coon Hunters Association)',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'MEMBER',
      name: '4. MEMBER',
      icon: User,
      scope: 'Controls only their personal account (e.g. Marcus Vance)',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    {
      id: 'VENDOR',
      name: '5. VENDOR',
      icon: Store,
      scope: 'Controls only their products and orders (e.g. Garmin / K9 Keep Catalog)',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
    }
  ];

  const activeRoleObj = rolesList.find((r) => r.id === activeRole) || rolesList[0];
  const activeRolePerms = permissions[activeRole] || {};

  const handleRoleSwitch = (roleId) => {
    switchRole(roleId);
    showToast(`Switched active role scope to ${roleId}!`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Scope-Based Access Control System
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Role & Scope Permission Structure
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            Strict permission matrix ensuring each role can <strong>only control the scope assigned to that role</strong> across National HQ, State Associations, Local Clubs, Individual Members, and Equipment Vendors.
          </p>
        </div>
      </div>

      {/* 5 ROLES CARDS SELECTOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {rolesList.map((r) => {
          const Icon = r.icon;
          const isSelected = activeRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface-lowest border-2 border-tan-500 shadow-xl ring-2 ring-tan-500/20'
                  : 'bg-surface-low border-surface-border hover:bg-surface-lowest'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${r.badgeBg}`}>
                    {r.id}
                  </span>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-tan-600' : 'text-charcoal-muted'}`} />
                </div>
                <h3 className="font-extrabold text-sm text-forest-950">{r.name}</h3>
                <p className="text-[11px] text-charcoal-muted line-clamp-3 leading-relaxed">
                  {r.scope}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] font-bold">
                <span className={isSelected ? 'text-emerald-800' : 'text-charcoal-muted'}>
                  {isSelected ? '✓ Active View' : 'Select Role'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSwitch(r.id);
                  }}
                  className="px-2.5 py-1 bg-forest-950 text-tan-300 rounded-lg text-[10px] font-black uppercase hover:bg-forest-900"
                >
                  Test Scope
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCOPE BOUNDARY MATRIX DISPLAY FOR ACTIVE ROLE */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${activeRoleObj.badgeBg}`}>
                {activeRoleObj.id}
              </span>
              <h2 className="text-xl font-black text-forest-950">{activeRoleObj.name} Permission Matrix</h2>
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              Scope Boundary: <strong>{activeRoleObj.scope}</strong>
            </p>
          </div>

          <div className="p-3 bg-surface-low rounded-2xl border border-surface-border text-xs text-forest-950 font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Strict Enforced Scope Boundary</span>
          </div>
        </div>

        {/* Modules Permission Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-low text-charcoal-muted font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
                <th className="p-3.5">Platform Module</th>
                <th className="p-3.5">Module Scope Boundary</th>
                <th className="p-3.5 text-center">View Access</th>
                <th className="p-3.5 text-center">Create Access</th>
                <th className="p-3.5 text-center">Edit Access</th>
                <th className="p-3.5 text-center">Delete Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-medium">
              {[
                { key: 'members', label: 'Member Roster & Profiles', scope: 'Assigned Role Scope Only' },
                { key: 'events', label: 'Sanctioned Trials & Events', scope: 'Assigned Role Scope Only' },
                { key: 'products', label: 'Store Products & Catalog', scope: 'Assigned Role Scope Only' },
                { key: 'orders', label: 'Sales Orders & Fulfillment', scope: 'Assigned Role Scope Only' },
                { key: 'finance', label: 'Financial Accounting & Treasury', scope: 'Assigned Role Scope Only' },
                { key: 'news', label: 'News Feed & Announcements', scope: 'Assigned Role Scope Only' },
                { key: 'reports', label: 'Analytics & Compliance Reports', scope: 'Assigned Role Scope Only' }
              ].map((mod) => {
                const p = activeRolePerms[mod.key] || { view: false, create: false, edit: false, delete: false };

                return (
                  <tr key={mod.key} className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3.5 font-bold text-forest-950">{mod.label}</td>
                    <td className="p-3.5 text-charcoal-muted italic">{mod.scope}</td>

                    {/* View */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updatePermission(activeRole, mod.key, 'view', !p.view)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all ${
                          p.view ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-surface-low text-charcoal-light border border-surface-border'
                        }`}
                      >
                        {p.view ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-charcoal-light" />}
                      </button>
                    </td>

                    {/* Create */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updatePermission(activeRole, mod.key, 'create', !p.create)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all ${
                          p.create ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-surface-low text-charcoal-light border border-surface-border'
                        }`}
                      >
                        {p.create ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-charcoal-light" />}
                      </button>
                    </td>

                    {/* Edit */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updatePermission(activeRole, mod.key, 'edit', !p.edit)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all ${
                          p.edit ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-surface-low text-charcoal-light border border-surface-border'
                        }`}
                      >
                        {p.edit ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-charcoal-light" />}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updatePermission(activeRole, mod.key, 'delete', !p.delete)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all ${
                          p.delete ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-surface-low text-charcoal-light border border-surface-border'
                        }`}
                      >
                        {p.delete ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-charcoal-light" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
