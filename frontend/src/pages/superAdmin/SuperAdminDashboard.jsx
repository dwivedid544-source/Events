import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Key, Shield, FileCheck, Users, Building2, MapPin, DollarSign, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SuperAdminDashboard = () => {
  const { claims } = useApp();

  const pendingClaims = claims.filter((c) => c.claimStatus === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-forest-800 text-white rounded-xl p-6 lg:p-8 shadow-ambient flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-400">Assigned Scope: Entire Platform</span>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">Super Admin Control Center</h1>
          <p className="text-xs text-tan-200 mt-1">Global platform governance, club claims review, permissions, and security matrix.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/super-admin/club-claims" className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" /> Review Club Claims ({pendingClaims.length})
          </Link>
          <Link to="/super-admin/permissions" className="px-3.5 py-2 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-lg border border-forest-700">
            Permission Matrix
          </Link>
        </div>
      </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total States" value="50" subtext="All Charters Active" icon={MapPin} />
        <StatCard title="Total Clubs" value="635" subtext="Chartered Local Clubs" icon={Building2} />
        <StatCard title="Total Members" value="48,526" subtext="Platform Users" icon={Users} trend="+14% YTD" />
        <StatCard title="Total Platform Revenue" value="$2.48M" subtext="Gross Transaction Vol" icon={DollarSign} trend="+18% YTD" />
      </div>

      {/* Pending Club Claims Workflow Module */}
      <div className="bg-surface-lowest p-6 rounded-xl border shadow-ambient space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-forest-800 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-tan-500" /> Pending Club Access Claims ({pendingClaims.length})
          </h3>
          <Link to="/super-admin/club-claims" className="text-xs font-bold text-forest-800 hover:underline">
            Manage All Claims
          </Link>
        </div>

        <div className="space-y-3">
          {claims.map((claim) => (
            <div key={claim.id} className="p-4 rounded-xl border bg-surface-low flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-forest-800">{claim.id}</span>
                  <span className="font-extrabold text-charcoal">{claim.club} ({claim.state})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${claim.claimStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {claim.claimStatus}
                  </span>
                </div>
                <div className="text-charcoal-muted mt-1">Applicant: <strong>{claim.applicant}</strong> ({claim.email}) • {claim.verificationStatus}</div>
                <div className="text-charcoal-light italic mt-1">"{claim.message}"</div>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/super-admin/club-claims" className="px-3 py-1.5 bg-forest-800 text-white font-bold text-xs rounded">
                  Review & Action
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
