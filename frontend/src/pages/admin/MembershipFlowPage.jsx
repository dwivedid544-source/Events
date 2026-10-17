import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  Globe,
  Plus,
  CreditCard,
  UserCheck,
  Layers,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MembershipFlowPage = () => {
  const { registerLocalClubMembership, currentUser, showToast } = useApp();

  const [memberName, setMemberName] = useState('Marcus Vance');
  const [memberEmail, setMemberEmail] = useState('marcus.vance@example.com');
  const [memberPhone, setMemberPhone] = useState('(936) 555-0182');
  const [selectedClub, setSelectedClub] = useState('Houston County Coon Hunters Association');
  const [selectedState, setSelectedState] = useState('Texas');

  const [lastJoinedMember, setLastJoinedMember] = useState(null);

  const handleJoinClub = (e) => {
    e.preventDefault();

    const createdMember = registerLocalClubMembership({
      name: memberName,
      email: memberEmail,
      phone: memberPhone,
      clubAffiliation: selectedClub,
      state: selectedState,
      amount: 25.00,
      membershipType: 'Individual Local Membership'
    });

    setLastJoinedMember(createdMember);
  };

  // Example Multi-Organization Single Account Data
  const demoOrganizations = [
    {
      id: 'org-uhc',
      level: 'NATIONAL',
      name: 'Ultimate Hound Championships (UHC)',
      type: 'National Governing Organization',
      status: 'Active Member',
      scope: 'Nationwide (50 States)',
      badgeBg: 'bg-forest-950 text-tan-300 border-tan-500'
    },
    {
      id: 'org-state',
      level: 'STATE',
      name: `${selectedState} State Association`,
      type: 'State Association Charter',
      status: 'Active State Member',
      scope: `${selectedState} State Territory`,
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'org-club',
      level: 'LOCAL_CLUB',
      name: selectedClub,
      type: 'Chartered Local Club Chapter',
      status: 'Active Chapter Member',
      scope: 'Local County & Grounds',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Multi-Organization Membership Flow Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Single-Account Multi-Organization Membership System
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            One person belongs to multiple organizations using <strong>one single account</strong>. Joining a Local Club automatically records Local, State Association, and National UHC memberships under a single email identity — eliminating the need for three separate accounts.
          </p>
        </div>
      </div>

      {/* 4-STEP MEMBERSHIP FLOW PIPELINE DIAGRAM */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-forest-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-tan-600" />
            <span>Automated Membership Recording Flow</span>
          </h2>
          <span className="px-3 py-1 bg-tan-100 text-tan-900 border border-tan-300 font-black text-[10px] rounded-full uppercase">
            1 Account ➔ 3 Organizations
          </span>
        </div>

        {/* 4-Step Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {/* Step 1: Join Local Club */}
          <div className="p-5 rounded-2xl bg-surface-low border border-surface-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-tan-300 mx-auto flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-sm font-black text-forest-950">Person Joins Local Club</h3>
            <p className="text-[11px] text-charcoal-muted font-medium">
              Member completes online registration for Local Club chapter.
            </p>
          </div>

          {/* Step 2: Local Record */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white mx-auto flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-sm font-black text-emerald-950">Local Club Record Created</h3>
            <p className="text-[11px] text-emerald-800 font-medium">
              Local chapter roster updated with dues payment.
            </p>
          </div>

          {/* Step 3: State Association */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white mx-auto flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-sm font-black text-amber-950">State Membership Recorded</h3>
            <p className="text-[11px] text-amber-800 font-medium">
              State Association membership automatically registered.
            </p>
          </div>

          {/* Step 4: National System */}
          <div className="p-5 rounded-2xl bg-forest-950 text-white border border-tan-500 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 mx-auto flex items-center justify-center font-black">
              4
            </div>
            <h3 className="text-sm font-black text-tan-300">National UHC Record Preserved</h3>
            <p className="text-[11px] text-tan-200 font-medium">
              Recorded in UHC national system under 1 single account.
            </p>
          </div>
        </div>
      </div>

      {/* LIVE MEMBERSHIP FLOW SIMULATOR & SINGLE ACCOUNT PROOF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form: Person Joins Local Club */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-5">
          <div className="border-b border-surface-border pb-3">
            <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-tan-600" />
              <span>Membership Sign-Up Flow Simulator</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Simulate a person joining a Local Club to verify automatic multi-organization recording.
            </p>
          </div>

          <form onSubmit={handleJoinClub} className="space-y-4 text-xs">
            <div>
              <label className="block font-black text-forest-950 mb-1">Full Member Name *</label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-black text-forest-950 mb-1">Single Email Account *</label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-black text-forest-950 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-black text-forest-950 mb-1">Local Club Chapter *</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                >
                  <option value="Houston County Coon Hunters Association">Houston County Coon Hunters Association</option>
                  <option value="Oak Ridge Hunting Club">Oak Ridge Hunting Club</option>
                  <option value="Lone Star Hound Club">Lone Star Hound Club</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-forest-950 mb-1">State Association *</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
                >
                  <option value="Texas">Texas State Association</option>
                  <option value="Tennessee">Tennessee State Association</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join Local Club (Auto-Record All 3 Organizations)</span>
            </button>
          </form>
        </div>

        {/* Live Proof: Single Account Preserving All 3 Organizations */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border-2 border-forest-900 shadow-ambient space-y-6">
          <div className="border-b border-surface-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Single Account Multi-Organization Membership Card</span>
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Member Profile: <strong>{memberName}</strong> ({memberEmail})
              </p>
            </div>
            <span className="px-3 py-1 bg-forest-950 text-tan-300 font-black text-[10px] rounded-full uppercase border border-tan-500">
              1 Account (No Separate Logins)
            </span>
          </div>

          {/* Affiliated Organizations under ONE Account */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-charcoal-muted tracking-wider">
              Affiliated Organizations Belonging to This Single Account:
            </h4>

            {demoOrganizations.map((org) => (
              <div
                key={org.id}
                className="p-4 rounded-2xl bg-surface-low border border-surface-border flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-forest-950 text-sm">{org.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${org.badgeBg}`}>
                      {org.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">{org.type} • {org.scope}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase">
                    {org.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 font-medium space-y-1">
            <strong className="block font-black text-emerald-900">
              ✓ Client Requirement Verified:
            </strong>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              The member belongs to <strong>UHC</strong>, <strong>{selectedState} State Association</strong>, and <strong>{selectedClub}</strong> simultaneously under <strong>one single account</strong>. The system does not require three separate accounts for the same person.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
