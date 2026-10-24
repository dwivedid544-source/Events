import React, { useState } from 'react';
import { useApp , API_BASE_URL} from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  CheckCircle2,
  XCircle,
  UserPlus,
  Clock,
  DollarSign,
  Award,
  Sparkles,
  Search,
  Download,
  Send,
  Mail,
  Filter,
  ShieldCheck,
  CreditCard,
  Building2,
  MapPin,
  Phone,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  ChevronRight,
  Dog,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const StateMembershipPage = () => {
  const {
    members = [],
    transactions = [],
    states = [],
    clubs = [],
    dogs = [],
    currentUser,
    updateMemberStatus,
    updateMember,
    deleteMember,
    renewMember,
    registerStateMembership,
    showToast
  } = useApp();

  const rawState = currentUser?.state || 'Tennessee';
  const stateName = rawState.replace(/\s+State\s+Association$/i, '');
  const stateAssocTitle = `${stateName} State Association`;

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [clubFilter, setClubFilter] = useState('ALL');
  const [stateScope, setStateScope] = useState(stateName); // Defaults to current state admin scope

  // Modals
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTargetMember, setNoticeTargetMember] = useState(null);
  const [isCommunicateModalOpen, setIsCommunicateModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);

  // Form State for Register New Member
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '(865) 555-0199',
    city: 'Knoxville',
    state: stateName,
    address: '1420 Hunting Ridge Rd',
    clubAffiliation: 'Oak Ridge Hunting Club',
    membershipType: 'Individual Membership',
    dogSportInterests: ['Coonhound Hunts'],
    duesAmount: 35.00
  });

  // Notice Form State
  const [noticeForm, setNoticeForm] = useState({
    subject: `Official Membership Renewal Notice — ${stateAssocTitle}`,
    message: `Dear Member,\n\nYour annual state association membership renewal is approaching. Please submit your annual dues to remain in good standing for upcoming sanctioned field trials and competition championships.\n\nThank you,\n${stateAssocTitle} Governance`
  });

  // Communication Broadcast State
  const [commData, setCommData] = useState({
    recipientGroup: 'ALL',
    subject: `${stateAssocTitle} Member Bulletin`,
    message: ''
  });

  // Calculate Metrics for Current State Scope
  const scopedMembers = members.filter((m) => {
    if (stateScope === 'ALL') return true;
    return (m.state || '').toLowerCase() === stateScope.toLowerCase();
  });

  const totalMembersCount = scopedMembers.length;
  const activeMembers = scopedMembers.filter((m) => (m.status || '').toLowerCase() === 'active');
  const activeCount = activeMembers.length;
  const renewalsDueMembers = scopedMembers.filter(
    (m) => (m.status || '').toLowerCase() === 'renewals due' || m.isRenewalDue || (m.status || '').toLowerCase() === 'expired'
  );
  const renewalsDueCount = renewalsDueMembers.length;
  const activeRate = totalMembersCount > 0 ? Math.round((activeCount / totalMembersCount) * 100) : 100;

  // Calculate State Dues Revenue
  const stateMembershipTxns = transactions.filter(
    (t) =>
      (t.category === 'State Membership Dues' || t.description?.toLowerCase().includes('state membership')) &&
      (stateScope === 'ALL' || (t.state || '').toLowerCase() === stateScope.toLowerCase())
  );
  const recordedTxnTotal = stateMembershipTxns.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  const baseDues = scopedMembers.reduce((acc, m) => acc + (Number(m.duesAmount) || 35.0), 0);
  const totalStateRevenue = baseDues + recordedTxnTotal;

  // Filter Members List
  const filteredMembers = scopedMembers.filter((m) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchId = m.membershipId?.toLowerCase().includes(q);
      const matchClub = m.club?.toLowerCase().includes(q);
      const matchCity = m.city?.toLowerCase().includes(q);
      const matchPhone = m.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchClub && !matchCity && !matchPhone) return false;
    }

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Active' && (m.status || '').toLowerCase() !== 'active') return false;
      if (statusFilter === 'Renewals Due' && (m.status || '').toLowerCase() !== 'renewals due' && !m.isRenewalDue) return false;
      if (statusFilter === 'Expired' && (m.status || '').toLowerCase() !== 'expired') return false;
    }

    if (typeFilter !== 'ALL' && !m.type?.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    if (clubFilter !== 'ALL' && m.club !== clubFilter) return false;

    return true;
  });

  // Handle Quick Status Change
  const handleQuickStatusChange = async (member, newStatus) => {
    await updateMemberStatus(member.id, newStatus);
    setOpenStatusMenuId(null);
  };

  // Handle 1-Click Renew
  const handleRenewMember = async (member) => {
    await renewMember(member.id);
  };

  // Handle Register New Member Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerForm.name.trim()) {
      showToast('Please provide the member full name', 'warning');
      return;
    }

    await registerStateMembership({
      ...registerForm,
      amount: Number(registerForm.duesAmount) || 35.00
    });

    setIsRegisterModalOpen(false);
    setRegisterForm({
      name: '',
      email: '',
      phone: '(865) 555-0199',
      city: 'Knoxville',
      state: stateName,
      address: '1420 Hunting Ridge Rd',
      clubAffiliation: 'Oak Ridge Hunting Club',
      membershipType: 'Individual Membership',
      dogSportInterests: ['Coonhound Hunts'],
      duesAmount: 35.00
    });
  };

  // Handle Edit Member Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    await updateMember(editingMember.id, {
      ...editingMember,
      duesAmount: Number(editingMember.duesAmount) || 35.00
    });

    setEditingMember(null);
  };

  // Handle Send Notice Submit
  const handleSendNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!noticeTargetMember) return;

    try {
      await fetch(`${API_BASE_URL}/states/send-renewal-notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: noticeTargetMember.id,
          memberName: noticeTargetMember.name,
          email: noticeTargetMember.email,
          subject: noticeForm.subject,
          message: noticeForm.message,
          state: noticeTargetMember.state || stateName
        })
      });
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Official renewal notice delivered to ${noticeTargetMember.name} (${noticeTargetMember.email})!`, 'success');
    setIsNoticeModalOpen(false);
    setNoticeTargetMember(null);
  };

  // Handle Broadcast Communication
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/states/communicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientGroup: commData.recipientGroup,
          subject: commData.subject,
          message: commData.message,
          state: stateName
        })
      });
    } catch (err) {
      console.warn('API Warning:', err.message);
    }

    showToast(`Broadcast sent to ${commData.recipientGroup === 'ALL' ? `all ${stateName} State Members` : 'selected group'}!`, 'success');
    setIsCommunicateModalOpen(false);
    setCommData({ recipientGroup: 'ALL', subject: '', message: '' });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) {
      showToast('No member records to export.', 'warning');
      return;
    }

    const headers = [
      'Member ID',
      'Full Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'Affiliated Club',
      'Membership Type',
      'Dog Sport Interests',
      'Joined Date',
      'Expiration Date',
      'Status',
      'Dues Amount ($)'
    ];

    const rows = filteredMembers.map((m) => [
      `"${m.membershipId || m.id || ''}"`,
      `"${m.name || ''}"`,
      `"${m.email || ''}"`,
      `"${m.phone || ''}"`,
      `"${m.address || ''}"`,
      `"${m.city || ''}"`,
      `"${m.state || stateName}"`,
      `"${m.club || 'Oak Ridge Hunting Club'}"`,
      `"${m.type || 'Individual Membership'}"`,
      `"${Array.isArray(m.dogSportInterests) ? m.dogSportInterests.join('; ') : (m.dogSportInterests || 'Coonhound Hunts')}"`,
      `"${m.joined || 'Aug 01, 2026'}"`,
      `"${m.expires || 'Aug 01, 2027'}"`,
      `"${m.status || 'Active'}"`,
      m.duesAmount || 35.00
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${stateName}_State_Association_Members_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredMembers.length} member records to CSV!`, 'success');
  };

  // Extract distinct club names for filter
  const distinctClubs = Array.from(new Set(scopedMembers.map((m) => m.club).filter(Boolean)));

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-forest-900 tracking-tight">
              State Association Membership Management
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-forest-800 text-tan-400 font-extrabold text-[11px] rounded-full shadow-xs border border-forest-900">
              <ShieldCheck className="w-3.5 h-3.5 text-tan-400" />
              {stateAssocTitle} Charter
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-1 max-w-2xl">
            Review state member registrations, expiration tracking, club affiliations, roll-call eligibility, and renewal notices across {stateName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsCommunicateModalOpen(true)}
            className="px-3.5 py-2 bg-surface-lowest hover:bg-surface-low text-forest-800 border border-surface-border font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Broadcast announcement to state members"
          >
            <Send className="w-4 h-4 text-forest-700" /> Broadcast Notice
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-surface-lowest hover:bg-surface-low text-forest-800 border border-surface-border font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            title="Download CSV of filtered members"
          >
            <Download className="w-4 h-4 text-forest-700" /> Export Roster (CSV)
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-tan-500 hover:bg-tan-600 active:scale-95 text-forest-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" /> Register New Member
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="State Members"
          value={totalMembersCount}
          subtext={`Enrolled across affiliated clubs`}
          icon={Users}
          trend={`${stateScope === 'ALL' ? 'National' : stateName} Roster`}
          trendType="up"
        />
        <StatCard
          title="Good Standing"
          value={activeCount}
          subtext={`${activeRate}% current active rate`}
          icon={CheckCircle2}
          trend="Sanction Eligible"
          trendType="up"
        />
        <StatCard
          title="Renewals Due"
          value={renewalsDueCount}
          subtext="Requires renewal follow-up"
          icon={Clock}
          trend={renewalsDueCount > 0 ? `${renewalsDueCount} Expiring` : 'All Current'}
          trendType={renewalsDueCount > 0 ? 'down' : 'up'}
        />
        <StatCard
          title="Recorded Revenue"
          value={`$${totalStateRevenue.toLocaleString()}`}
          subtext="Annual membership dues"
          icon={DollarSign}
          trend="Dues Gross"
          trendType="up"
        />
      </div>

      {/* 3. Multi-Filter Toolbar */}
      <div className="bg-surface-lowest rounded-2xl p-4 border border-surface-border shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search by member name, email, phone, ID, club, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-surface-low border border-surface-border rounded-xl text-xs font-medium text-forest-900 placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-forest-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {['ALL', 'Active', 'Renewals Due', 'Expired'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-forest-800 text-tan-400 shadow-xs'
                    : 'bg-surface-low hover:bg-surface-border text-charcoal-muted hover:text-forest-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* State Scope Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-charcoal-muted">State Scope:</span>
              <select
                value={stateScope}
                onChange={(e) => setStateScope(e.target.value)}
                className="py-1 px-2.5 bg-surface-low border border-surface-border rounded-lg text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-800"
              >
                <option value={stateName}>{stateName} (Charter Active)</option>
                <option value="ALL">All 50 States (National Registry)</option>
                <option value="Texas">Texas</option>
                <option value="Alabama">Alabama</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Virginia">Virginia</option>
              </select>
            </div>

            {/* Membership Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-charcoal-muted">Membership Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-1 px-2.5 bg-surface-low border border-surface-border rounded-lg text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-800"
              >
                <option value="ALL">All Types</option>
                <option value="Individual">Individual Membership</option>
                <option value="Youth">Youth Handler Membership</option>
                <option value="Family">Family Membership</option>
                <option value="Lifetime">Lifetime Membership</option>
              </select>
            </div>

            {/* Club Affiliation Filter */}
            {distinctClubs.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-charcoal-muted">Club:</span>
                <select
                  value={clubFilter}
                  onChange={(e) => setClubFilter(e.target.value)}
                  className="py-1 px-2.5 bg-surface-low border border-surface-border rounded-lg text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All Clubs</option>
                  {distinctClubs.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL' || clubFilter !== 'ALL' || stateScope !== stateName) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setClubFilter('ALL');
                  setStateScope(stateName);
                }}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>

          <div className="text-[11px] text-charcoal-muted font-medium">
            Showing <strong className="text-forest-900 font-extrabold">{filteredMembers.length}</strong> of{' '}
            {scopedMembers.length} members
          </div>
        </div>
      </div>

      {/* 4. Members Data Table */}
      <div className="bg-surface-lowest rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-low/80 border-b border-surface-border text-charcoal-muted uppercase text-[10px] font-black tracking-wider">
                <th className="py-3 px-4">Member Name & ID</th>
                <th className="py-3 px-4">Location & Address</th>
                <th className="py-3 px-4">Affiliated Club</th>
                <th className="py-3 px-4">Membership Type</th>
                <th className="py-3 px-4">Sport Interests</th>
                <th className="py-3 px-4">Expiration Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    <Users className="w-10 h-10 mx-auto text-charcoal-muted/40 mb-2" />
                    <p className="font-bold text-sm text-forest-900">No state association members found</p>
                    <p className="text-xs mt-1">Try resetting filters or registering a new member.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const isMenuOpen = openStatusMenuId === m.id;
                  const isLifetime = m.type?.toLowerCase().includes('lifetime') || m.expires === 'Lifetime';
                  const isExpired = (m.status || '').toLowerCase() === 'expired';
                  const isRenewalsDue = (m.status || '').toLowerCase() === 'renewals due' || m.isRenewalDue;

                  return (
                    <tr key={m.id} className="hover:bg-surface-low/40 transition-colors group">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedMemberForProfile(m)}
                            className="font-extrabold text-sm text-forest-900 hover:text-tan-600 transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>{m.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-forest-800/10 text-forest-900 text-[10px] font-mono font-black rounded border border-forest-800/20">
                              {m.membershipId || m.id}
                            </span>
                            <span className="text-[10px] text-charcoal-muted font-medium truncate max-w-[150px]">
                              {m.email}
                            </span>
                          </div>
                          {m.phone && (
                            <div className="text-[10px] text-charcoal-muted flex items-center gap-1">
                              <Phone className="w-3 h-3 text-charcoal-muted/70" />
                              <span>{m.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location & Address */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[180px]">
                          <div className="font-bold text-forest-900 flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>
                              {m.city || (m.state === 'Tennessee' ? 'Knoxville' : 'Austin')}, {m.state === 'Tennessee' ? 'TN' : m.state === 'Texas' ? 'TX' : (m.state || 'TN')}
                            </span>
                          </div>
                          <div className="text-[10px] text-charcoal-muted truncate pl-5">
                            {m.address || 'Sanctioned Grounds'}
                          </div>
                        </div>
                      </td>

                      {/* Affiliated Club */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-forest-900 text-xs">
                          <Building2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span className="truncate max-w-[150px]">{m.club || 'Oak Ridge Hunting Club'}</span>
                        </div>
                      </td>

                      {/* Membership Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isLifetime
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : m.type?.includes('Youth')
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : m.type?.includes('Family')
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-tan-100 text-forest-900 border border-tan-300'
                        }`}>
                          {isLifetime && <Award className="w-3 h-3 text-amber-600" />}
                          {m.type || 'Individual Membership'}
                        </span>
                      </td>

                      {/* Dog Sport Interests */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {Array.isArray(m.dogSportInterests) ? (
                            m.dogSportInterests.map((interest, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-surface-low text-forest-900 border border-surface-border">
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-surface-low text-forest-900 border border-surface-border">
                              {m.dogSportInterests || 'Coonhound Hunts'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Expiration Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-forest-900 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-forest-700 shrink-0" />
                            <span>{m.expires || 'Aug 01, 2027'}</span>
                          </div>
                          <div className="text-[10px] text-charcoal-muted pl-4">
                            Joined: {m.joined || 'Aug 01, 2026'}
                          </div>
                        </div>
                      </td>

                      {/* Interactive Status Selector */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap relative">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setOpenStatusMenuId(isMenuOpen ? null : m.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 transition-all shadow-xs ${
                              (m.status || '').toLowerCase() === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : (m.status || '').toLowerCase() === 'renewals due' || m.isRenewalDue
                                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                            }`}
                            title="Click to toggle member status"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {m.status || 'Active'}
                          </button>

                          {/* Status Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-40 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg z-30 p-1 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-2 py-1 text-[10px] font-black text-charcoal-muted uppercase">Set Status</div>
                              {['Active', 'Renewals Due', 'Expired', 'Inactive'].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleQuickStatusChange(m, st)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                                    (m.status || '').toLowerCase() === st.toLowerCase()
                                      ? 'bg-forest-800 text-tan-400'
                                      : 'hover:bg-surface-low text-forest-900'
                                  }`}
                                >
                                  <span>{st}</span>
                                  {(m.status || '').toLowerCase() === st.toLowerCase() && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Profile Dossier */}
                          <button
                            onClick={() => setSelectedMemberForProfile(m)}
                            className="p-1.5 text-charcoal-muted hover:text-forest-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="View Member Dossier & Dogs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Renew */}
                          <button
                            onClick={() => handleRenewMember(m)}
                            className="p-1.5 text-charcoal-muted hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Renew Membership (+1 Year)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* Send Notice */}
                          <button
                            onClick={() => {
                              setNoticeTargetMember(m);
                              setIsNoticeModalOpen(true);
                            }}
                            className="p-1.5 text-charcoal-muted hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Send Formal Renewal Notice"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Edit Member */}
                          <button
                            onClick={() => setEditingMember({ ...m })}
                            className="p-1.5 text-charcoal-muted hover:text-forest-800 hover:bg-surface-low rounded-lg transition-colors"
                            title="Edit Member Information"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Member */}
                          <button
                            onClick={() => setMemberToDelete(m)}
                            className="p-1.5 text-charcoal-muted hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove Member from Registry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-surface-low/50 border-t border-surface-border text-xs text-charcoal-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Total Registered State Members: <strong className="text-forest-900 font-black">{scopedMembers.length} houndsmen</strong> across{' '}
            <strong className="text-forest-900 font-black">{distinctClubs.length || 1} affiliated clubs</strong>
          </span>
          <span className="font-semibold text-[11px]">
            Governance Authority: {stateAssocTitle}
          </span>
        </div>
      </div>

      {/* 5. Member Profile Dossier Modal */}
      {selectedMemberForProfile && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-tan-400 flex items-center justify-center font-black text-lg border border-forest-900 shadow-md">
                  {selectedMemberForProfile.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-forest-900">{selectedMemberForProfile.name}</h2>
                  <p className="text-xs text-charcoal-muted flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-forest-900">{selectedMemberForProfile.membershipId || selectedMemberForProfile.id}</span>
                    <span>•</span>
                    <span className="font-semibold">{selectedMemberForProfile.club || 'Oak Ridge Hunting Club'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMemberForProfile(null)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Digital Membership Card Preview */}
            <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white rounded-2xl p-5 border border-forest-700 shadow-lg relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] font-black uppercase text-tan-400 tracking-wider">Official State Member Card</div>
                  <div className="text-sm font-extrabold text-white">{stateAssocTitle}</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-tan-400" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Member Name</span>
                  <span className="font-black text-white text-sm">{selectedMemberForProfile.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Membership Type</span>
                  <span className="font-black text-tan-300">{selectedMemberForProfile.type || 'Individual'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Status</span>
                  <span className="inline-flex items-center gap-1 font-black text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {selectedMemberForProfile.status || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Joined Date</span>
                  <span className="font-bold text-white">{selectedMemberForProfile.joined || 'Aug 01, 2026'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Expiration</span>
                  <span className="font-bold text-white">{selectedMemberForProfile.expires || 'Aug 01, 2027'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-tan-200/70 block uppercase font-bold">Annual Dues</span>
                  <span className="font-bold text-white">${Number(selectedMemberForProfile.duesAmount || 35).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Contact Details & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-low p-4 rounded-xl border border-surface-border">
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">Email Address</span>
                <span className="font-bold text-forest-900">{selectedMemberForProfile.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">Phone Number</span>
                <span className="font-bold text-forest-900">{selectedMemberForProfile.phone || '(865) 555-0192'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">City & State</span>
                <span className="font-bold text-forest-900">
                  {selectedMemberForProfile.city || 'Knoxville'}, {selectedMemberForProfile.state || stateName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-charcoal-muted block">Street Address</span>
                <span className="font-bold text-forest-900">{selectedMemberForProfile.address || '1420 Hunting Ridge Rd'}</span>
              </div>
            </div>

            {/* Registered Dogs Section */}
            {(() => {
              const memberDogs = dogs.filter(
                (d) =>
                  d.owner?.toLowerCase() === selectedMemberForProfile.name?.toLowerCase() ||
                  d.ownerEmail?.toLowerCase() === selectedMemberForProfile.email?.toLowerCase()
              );

              return (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-1.5">
                      <Dog className="w-4 h-4 text-forest-800" /> Registered Canines ({memberDogs.length})
                    </h3>
                  </div>

                  {memberDogs.length === 0 ? (
                    <div className="p-4 bg-surface-low rounded-xl border border-surface-border text-center text-charcoal-muted">
                      <Dog className="w-6 h-6 mx-auto text-charcoal-muted/40 mb-1" />
                      <p className="font-bold text-xs">No dogs registered under this member profile yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {memberDogs.map((d) => (
                        <div key={d.id} className="p-3 bg-surface-low rounded-xl border border-surface-border flex items-center justify-between">
                          <div>
                            <div className="font-black text-forest-900">{d.callName}</div>
                            <div className="text-[10px] text-charcoal-muted">{d.breed} • {d.regNo}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tan-100 text-forest-900 border border-tan-300">
                            {d.eventsCount || 0} Trials
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleRenewMember(selectedMemberForProfile);
                    setSelectedMemberForProfile((prev) => ({ ...prev, status: 'Active', isRenewalDue: false }));
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Renew for 1 Year
                </button>

                <button
                  onClick={() => {
                    setNoticeTargetMember(selectedMemberForProfile);
                    setIsNoticeModalOpen(true);
                  }}
                  className="px-3.5 py-2 border border-surface-border font-bold text-xs rounded-xl text-forest-900 hover:bg-surface-low flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Renewal Notice
                </button>
              </div>

              <button
                onClick={() => setSelectedMemberForProfile(null)}
                className="px-5 py-2 bg-forest-800 text-tan-400 font-extrabold rounded-xl shadow-xs hover:bg-forest-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Register New Member Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-tan-500/20 text-forest-900 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-forest-900">Register New State Member</h2>
                  <p className="text-xs text-charcoal-muted">Add a hunter or handler into {stateAssocTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Crockett"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@hunting.org"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="(865) 555-0199"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={registerForm.state}
                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 1420 Hunting Ridge Rd"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Affiliated Club</label>
                  <input
                    type="text"
                    required
                    value={registerForm.clubAffiliation}
                    onChange={(e) => setRegisterForm({ ...registerForm, clubAffiliation: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Membership Type</label>
                  <select
                    value={registerForm.membershipType}
                    onChange={(e) => setRegisterForm({ ...registerForm, membershipType: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Individual Membership">Individual Membership ($35/yr)</option>
                    <option value="Youth Handler Membership">Youth Handler Membership ($20/yr)</option>
                    <option value="Family Membership">Family Membership ($60/yr)</option>
                    <option value="Lifetime Membership">Lifetime Membership ($350 one-time)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Annual Dues Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={registerForm.duesAmount}
                  onChange={(e) => setRegisterForm({ ...registerForm, duesAmount: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-tan-400 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-tan-400" /> Activate Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-forest-900 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-forest-900">Edit Member Record</h2>
                  <p className="text-xs text-charcoal-muted">Update member profile, club affiliation, and status</p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">City</label>
                  <input
                    type="text"
                    value={editingMember.city || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, city: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">State</label>
                  <input
                    type="text"
                    value={editingMember.state || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, state: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingMember.address || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Affiliated Club</label>
                  <input
                    type="text"
                    value={editingMember.club || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, club: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Status</label>
                  <select
                    value={editingMember.status || 'Active'}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Renewals Due">Renewals Due</option>
                    <option value="Expired">Expired</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">Membership Type</label>
                  <select
                    value={editingMember.type || 'Individual Membership'}
                    onChange={(e) => setEditingMember({ ...editingMember, type: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  >
                    <option value="Individual Membership">Individual Membership</option>
                    <option value="Youth Handler Membership">Youth Handler Membership</option>
                    <option value="Family Membership">Family Membership</option>
                    <option value="Lifetime Membership">Lifetime Membership</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    value={editingMember.expires || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, expires: e.target.value })}
                    className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-tan-400 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-tan-400" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Send Formal Renewal Notice Modal */}
      {isNoticeModalOpen && noticeTargetMember && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-tan-500/20 text-forest-900 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-forest-800" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-forest-900">Send Renewal Notice</h3>
                  <p className="text-xs text-charcoal-muted">Delivering notice to {noticeTargetMember.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsNoticeModalOpen(false);
                  setNoticeTargetMember(null);
                }}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNoticeSubmit} className="space-y-3.5 text-xs">
              <div className="bg-surface-low p-3 rounded-xl border border-surface-border space-y-1">
                <div>
                  <span className="font-bold text-charcoal-muted">Recipient:</span>{' '}
                  <span className="font-extrabold text-forest-900">{noticeTargetMember.name}</span>{' '}
                  <span className="text-charcoal-muted font-mono">({noticeTargetMember.email})</span>
                </div>
                <div>
                  <span className="font-bold text-charcoal-muted">Membership ID:</span>{' '}
                  <span className="font-mono font-bold text-forest-900">{noticeTargetMember.membershipId || noticeTargetMember.id}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={noticeForm.subject}
                  onChange={(e) => setNoticeForm({ ...noticeForm, subject: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Notice Message Body</label>
                <textarea
                  rows={5}
                  required
                  value={noticeForm.message}
                  onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsNoticeModalOpen(false);
                    setNoticeTargetMember(null);
                  }}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Renewal Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Broadcast Communication Modal */}
      {isCommunicateModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-forest-800 text-tan-400 flex items-center justify-center">
                  <Send className="w-5 h-5 text-tan-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-forest-900">Broadcast Member Bulletin</h3>
                  <p className="text-xs text-charcoal-muted">Send mass announcement across {stateAssocTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCommunicateModalOpen(false)}
                className="p-1.5 text-charcoal-muted hover:text-forest-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-forest-900 mb-1">Target Recipient Group</label>
                <select
                  value={commData.recipientGroup}
                  onChange={(e) => setCommData({ ...commData, recipientGroup: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                >
                  <option value="ALL">All {stateName} State Association Members ({scopedMembers.length})</option>
                  <option value="EXPIRING">Expiring & Renewals Due Members ({renewalsDueCount})</option>
                  <option value="ACTIVE">Active Members in Good Standing ({activeCount})</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Bulletin Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Championship Trial Schedule & Meeting Notice"
                  value={commData.subject}
                  onChange={(e) => setCommData({ ...commData, subject: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">Message Content</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your state association update, trial guidelines, or general announcement..."
                  value={commData.message}
                  onChange={(e) => setCommData({ ...commData, message: e.target.value })}
                  className="w-full p-2.5 bg-surface-low border border-surface-border rounded-xl font-medium text-forest-900 focus:outline-none focus:border-forest-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsCommunicateModalOpen(false)}
                  className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-tan-400 font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-tan-400" /> Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Delete Member Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-lowest border border-surface-border rounded-2xl shadow-ambient-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-extrabold text-forest-900">Remove Association Member</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Are you sure you want to remove <strong className="text-forest-900 font-black">"{memberToDelete.name}"</strong> ({memberToDelete.membershipId || memberToDelete.id}) from the state association registry?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 border border-surface-border font-bold rounded-xl text-charcoal-muted hover:bg-surface-low transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteMember(memberToDelete.id);
                  setMemberToDelete(null);
                  if (selectedMemberForProfile?.id === memberToDelete.id) {
                    setSelectedMemberForProfile(null);
                  }
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md transition-colors text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
