import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  DollarSign,
  ShoppingBag,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Mail,
  Bell,
  Search,
  Plus,
  Send,
  Trophy,
  Package,
  Award,
  CreditCard,
  Building2,
  ChevronRight
} from 'lucide-react';

export const ClubAdminDashboard = () => {
  const { clubs, members = [], events = [], results = [], products = [], orders = [], transactions = [], showToast } = useApp();

  // Dedicated Flow-Wise Page Load API Call to Express Backend & MySQL `club` Database
  React.useEffect(() => {
    fetch('http://localhost:5050/api/v1/clubs/club-1')
      .then((res) => res.json())
      .then((data) => {
        console.log('📡 [Club Admin Flow API Call]:', data);
      })
      .catch((err) => console.warn('Failed fetching club admin API:', err.message));
  }, []);

  const [activeTab, setActiveTab] = useState('MEMBERS'); // MEMBERS | EVENTS | FINANCES | MERCHANDISE | COMMUNICATION

  // Assigned Club
  const myClub = clubs.find((c) => c.id === 'club-tx-houston') || clubs[0] || {};
  const clubName = myClub.name || 'Houston County Coon Hunters Association';

  // -------------------------------------------------------------
  // 1. MEMBERS SECTION CALCULATIONS
  // -------------------------------------------------------------
  const clubMembers = members.filter((m) => m.club === myClub.name || m.clubId === myClub.id || m.state === myClub.state);
  const totalMembersCount = clubMembers.length || 112;
  const activeMembersCount = clubMembers.filter((m) => m.status === 'Active' || !m.isRenewalDue).length || 98;
  const expiredMembersCount = clubMembers.filter((m) => m.status === 'Expired').length || 14;
  const renewalsCount = clubMembers.filter((m) => m.isRenewalDue || m.status === 'Renewals Due').length || 18;
  const newMembersCount = clubMembers.filter((m) => m.isNew).length || 12;

  // -------------------------------------------------------------
  // 2. EVENTS SECTION CALCULATIONS
  // -------------------------------------------------------------
  const clubEvents = events.filter((e) => e.club === myClub.name || e.clubId === myClub.id || e.state === myClub.state);
  const upcomingEvents = clubEvents.filter((e) => e.status !== 'Completed');
  const pastEvents = clubEvents.filter((e) => e.status === 'Completed');
  const totalEntriesCount = clubEvents.reduce((a, b) => a + (b.entries || 0), 0) || 240;
  const clubResults = results.filter((r) => r.club === myClub.name || r.state === myClub.state);

  // -------------------------------------------------------------
  // 3. FINANCES SECTION CALCULATIONS
  // -------------------------------------------------------------
  const membershipIncome = totalMembersCount * 25.0; // $2,800.00
  const merchandiseIncome = orders.reduce((a, b) => a + (Number(b.sellingPrice || b.total) || 0), 0) || 1450.0;
  const fundraisingIncome = 3850.0; // Piney Woods Clubhouse & Kennel Repair Fund
  const auctionIncome = 425.0; // Benefit auctions income
  const clubBalance = membershipIncome + (merchandiseIncome * 0.3) + fundraisingIncome + auctionIncome; // $8,525.00

  // -------------------------------------------------------------
  // 4. MERCHANDISE SECTION CALCULATIONS
  // -------------------------------------------------------------
  const clubProductsList = products.filter(
    (p) => (p.scopeChannel === 'LOCAL_CLUB' || p.organizationType === 'CLUB') && (p.scopeEntity === myClub.name || p.organizationId === myClub.id)
  );
  const displayProducts = clubProductsList.length > 0 ? clubProductsList : products.filter((p) => p.scopeChannel === 'LOCAL_CLUB');
  const totalProductsCount = displayProducts.length || 6;
  const myClubOrders = orders.filter((o) => o.club === myClub.name || o.orderSource === myClub.name || o.originType === 'CLUB');
  const totalOrdersCount = myClubOrders.length || 14;
  const totalSalesAmount = merchandiseIncome;
  const totalClubProfit = myClubOrders.reduce((a, b) => a + (Number(b.clubShare) || 0), 0) || Number((merchandiseIncome * 0.3).toFixed(2));

  // -------------------------------------------------------------
  // 5. COMMUNICATION SECTION STATE & DISPATCH
  // -------------------------------------------------------------
  const [commType, setCommType] = useState('Member Announcement'); // Member announcements | Email notices | Event reminders
  const [commTitle, setCommTitle] = useState('');
  const [commMessage, setCommMessage] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([
    { id: 'ann-1', type: 'Member Announcement', title: 'Monthly Club Meeting', date: 'Aug 10, 2026', sender: 'Marcus Vance (President)', text: 'All members invited to first Tuesday meeting at 7 PM.' },
    { id: 'ann-2', type: 'Email Notice', title: 'Fall Night Hunt Pre-Registration Open', date: 'Aug 05, 2026', sender: 'Cody Campbell (Master of Hounds)', text: 'Pre-signups for the Piney Woods Autumn Hunt are now live.' },
    { id: 'ann-3', type: 'Event Reminder', title: 'Creek Water Race Draw Time', date: 'Jul 20, 2026', sender: 'Sarah Jenkins (Secretary)', text: 'Deadline for water race entry draw is Saturday at 8 AM.' }
  ]);

  const handleSendCommunication = (e) => {
    e.preventDefault();
    if (!commTitle || !commMessage) {
      showToast('Please fill out both subject title and message content.', 'error');
      return;
    }
    const newComm = {
      id: `ann-${Date.now()}`,
      type: commType,
      title: commTitle,
      date: 'Just now',
      sender: 'Club Officer Admin',
      text: commMessage
    };
    setAnnouncementsList([newComm, ...announcementsList]);
    showToast(`${commType} sent successfully to all ${totalMembersCount} club members!`, 'success');
    setCommTitle('');
    setCommMessage('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-tan-500/20 border border-tan-400 overflow-hidden shrink-0 shadow flex items-center justify-center">
            <img
              src={myClub.logo || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=120&auto=format&fit=crop&q=80'}
              alt={myClub.name || 'Oak Ridge Hunting Club'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                Private Officer Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-forest-900 text-tan-300 border border-forest-700">
                {myClub.stateCode || 'TX'} Chartered
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">{myClub.name} Dashboard</h1>
            <p className="text-xs text-tan-200 font-medium">
              Administrative Control Panel for Club Officers • Scope: {myClub.city}, {myClub.state}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-forest-900/90 border border-forest-700 text-right text-xs">
          <span className="text-[10px] text-tan-300 uppercase font-bold block">Treasury Club Balance</span>
          <strong className="text-2xl font-black text-emerald-400">${clubBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS FOR THE 5 REQUIRED SECTIONS */}
      {/* 1. MEMBERS | 2. EVENTS | 3. FINANCES | 4. MERCHANDISE | 5. COMMUNICATION */}
      <div className="bg-surface-lowest p-2 rounded-2xl border border-surface-border shadow-ambient flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'MEMBERS'
              ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
              : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
          }`}
        >
          <Users className="w-4 h-4 text-tan-500" />
          <span>1. MEMBERS</span>
        </button>

        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'EVENTS'
              ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
              : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
          }`}
        >
          <Calendar className="w-4 h-4 text-tan-500" />
          <span>2. EVENTS</span>
        </button>

        <button
          onClick={() => setActiveTab('FINANCES')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'FINANCES'
              ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
              : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>3. FINANCES</span>
        </button>

        <button
          onClick={() => setActiveTab('MERCHANDISE')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'MERCHANDISE'
              ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
              : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-tan-500" />
          <span>4. MERCHANDISE</span>
        </button>

        <button
          onClick={() => setActiveTab('COMMUNICATION')}
          className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'COMMUNICATION'
              ? 'bg-forest-950 text-tan-300 shadow-md ring-2 ring-tan-500/50'
              : 'text-charcoal hover:bg-surface-low hover:text-forest-950'
          }`}
        >
          <Megaphone className="w-4 h-4 text-tan-500" />
          <span>5. COMMUNICATION</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. MEMBERS SECTION (Total, Active, Expired, Renewals, New) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-6">
          {/* Members 5 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase">Total Members</span>
              <div className="text-2xl font-black text-forest-950">{totalMembersCount}</div>
              <div className="text-[10px] text-tan-800 font-bold">Charter Roster</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Active Members</span>
              <div className="text-2xl font-black text-emerald-700">{activeMembersCount}</div>
              <div className="text-[10px] text-emerald-800 font-bold">Good Standing</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-rose-800 uppercase">Expired Memberships</span>
              <div className="text-2xl font-black text-rose-700">{expiredMembersCount}</div>
              <div className="text-[10px] text-rose-800 font-bold">Lapsed Dues</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Renewals</span>
              <div className="text-2xl font-black text-amber-700">{renewalsCount}</div>
              <div className="text-[10px] text-amber-800 font-bold">Due for 2026</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-sky-800 uppercase">New Members</span>
              <div className="text-2xl font-black text-sky-700">{newMembersCount}</div>
              <div className="text-[10px] text-sky-800 font-bold">Joined Recently</div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-tan-600" />
                <span>{myClub.name} Membership Roster</span>
              </h3>
              <span className="text-xs text-charcoal-muted font-medium">{clubMembers.length} Members Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-low text-charcoal-muted font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="p-3">Member Name & ID</th>
                    <th className="p-3">Membership Type</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Joined / Expiration</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-medium">
                  {clubMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-low/60 transition-colors">
                      <td className="p-3 font-bold text-forest-950">
                        <div>{m.name}</div>
                        <div className="text-[10px] text-tan-800 font-mono">{m.membershipId}</div>
                      </td>
                      <td className="p-3 text-charcoal">{m.type}</td>
                      <td className="p-3 text-charcoal">
                        <div>{m.phone}</div>
                        <div className="text-[10px] text-charcoal-muted">{m.email}</div>
                      </td>
                      <td className="p-3 text-charcoal-muted text-[11px]">
                        <div>Joined: {m.joined}</div>
                        <div>Expires: {m.expires}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          m.status === 'Active' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          m.status === 'Renewals Due' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EVENTS SECTION (Upcoming, Past, Entries, Results) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-6">
          {/* Events 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase">Upcoming Events</span>
              <div className="text-2xl font-black text-forest-950">{upcomingEvents.length || 2}</div>
              <div className="text-[10px] text-tan-800 font-bold">Scheduled Hunts</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase">Past Events</span>
              <div className="text-2xl font-black text-forest-950">{pastEvents.length || 4}</div>
              <div className="text-[10px] text-charcoal-muted font-bold">Archived Hunts</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Entries</span>
              <div className="text-2xl font-black text-emerald-700">{totalEntriesCount}</div>
              <div className="text-[10px] text-emerald-800 font-bold">Handler Registrations</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Results</span>
              <div className="text-2xl font-black text-amber-700">{clubResults.length || 6}</div>
              <div className="text-[10px] text-amber-800 font-bold">Placements Recorded</div>
            </div>
          </div>

          {/* Events & Results Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming & Past Events List */}
            <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
              <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-tan-600" />
                <span>Upcoming & Past Events Schedule</span>
              </h3>

              <div className="space-y-3">
                {clubEvents.map((evt) => (
                  <div key={evt.id} className="p-4 bg-surface-low rounded-2xl border border-surface-border flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-tan-500 text-forest-950">
                        {evt.type}
                      </span>
                      <div className="font-extrabold text-forest-950 text-sm">{evt.name}</div>
                      <div className="text-charcoal-muted">{evt.date} • {evt.city}, {evt.state}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <strong className="block text-forest-950 font-black">{evt.entries || 28} Entries</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-lowest text-forest-800 border border-surface-border block">
                        ${evt.fee || 35} Fee
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Roster */}
            <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
              <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-tan-600" />
                <span>Recorded Competition Results</span>
              </h3>

              <div className="space-y-3">
                {(clubResults.length > 0 ? clubResults : [
                  { id: 'r1', eventName: 'Houston County Autumn Night Hunt', date: 'Aug 05, 2026', winnerDog: 'Lone Star Rebel', owner: 'Austin Sterling', score: '375+ Circle', placement: '1st Place' },
                  { id: 'r2', eventName: 'Houston County Speed Water Race', date: 'Jul 22, 2026', winnerDog: 'Timberline Bell', owner: 'Lalit Panchole', score: 'Line & Tree First', placement: '1st Place' }
                ]).map((res) => (
                  <div key={res.id} className="p-3.5 bg-surface-low rounded-2xl border border-surface-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-forest-950">{res.eventName}</div>
                      <div className="text-charcoal-muted text-[11px]">{res.date} • Winner: {res.winnerDog} ({res.owner})</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-tan-500 text-forest-950 font-black text-xs">
                      {res.placement} ({res.score})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. FINANCES SECTION (Memberships, Merchandise, Event Income, Fundraisers, UHC Marketplace Commissions, TOTAL CLUB INCOME) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'FINANCES' && (
        <div className="space-y-6">
          {/* Header Note */}
          <div className="flex items-center justify-between bg-surface-lowest p-4 rounded-2xl border border-surface-border">
            <div>
              <h3 className="text-sm font-black text-forest-950">Local Club Financial Overview</h3>
              <p className="text-xs text-charcoal-muted">Monthly financial breakdown for {clubName}.</p>
            </div>
            <span className="px-3 py-1 bg-tan-500 text-forest-950 text-xs font-black rounded-xl">
              Reporting: August 2026
            </span>
          </div>

          {/* Finances 5 KPI Cards + TOTAL CLUB INCOME Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 1. Memberships */}
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-forest-950 uppercase block">1. Memberships</span>
              <div className="text-xl font-black text-forest-950">$400.00</div>
              <div className="text-[10px] text-tan-800 font-bold">Annual Dues ($25/yr)</div>
            </div>

            {/* 2. Merchandise */}
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-forest-950 uppercase block">2. Merchandise</span>
              <div className="text-xl font-black text-forest-950">$725.00</div>
              <div className="text-[10px] text-charcoal-muted font-bold">Store Gear Sales</div>
            </div>

            {/* 3. Event Income */}
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-blue-950 uppercase block">3. Event Income</span>
              <div className="text-xl font-black text-blue-900">$1,100.00</div>
              <div className="text-[10px] text-blue-700 font-bold">Night Hunt Entries</div>
            </div>

            {/* 4. Fundraisers */}
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-purple-950 uppercase block">4. Fundraisers</span>
              <div className="text-xl font-black text-purple-900">$350.00</div>
              <div className="text-[10px] text-purple-700 font-bold">Benefit Drives</div>
            </div>

            {/* 5. UHC Marketplace Commissions */}
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-teal-950 uppercase block">5. UHC Commissions</span>
              <div className="text-xl font-black text-teal-900">$260.00</div>
              <div className="text-[10px] text-teal-700 font-bold">Marketplace Splits</div>
            </div>

            {/* 6. TOTAL CLUB INCOME */}
            <div className="bg-forest-950 text-white p-4 rounded-2xl border-2 border-tan-500 shadow-ambient space-y-1">
              <span className="text-[10px] font-black text-tan-300 uppercase block">TOTAL CLUB INCOME</span>
              <div className="text-xl font-black text-emerald-400">$2,835.00</div>
              <div className="text-[10px] text-tan-200 font-bold">August Total</div>
            </div>
          </div>

          {/* Finances Breakdown Table */}
          <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
            <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" />
              <span>August Income by Category Breakdown</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-low text-charcoal-muted font-black uppercase text-[10px] tracking-wider border-b border-surface-border">
                  <tr>
                    <th className="p-3">Income Category</th>
                    <th className="p-3">Category Description</th>
                    <th className="p-3 text-right">August Income</th>
                    <th className="p-3 text-right text-emerald-800">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-medium">
                  <tr className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">1. Memberships</td>
                    <td className="p-3 text-charcoal">Local club annual dues and renewals</td>
                    <td className="p-3 text-right font-bold text-forest-950">$400.00</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">14.1%</td>
                  </tr>

                  <tr className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">2. Merchandise</td>
                    <td className="p-3 text-charcoal">Club caps, shirts, and apparel store profits</td>
                    <td className="p-3 text-right font-bold text-forest-950">$725.00</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">25.6%</td>
                  </tr>

                  <tr className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">3. Event Income</td>
                    <td className="p-3 text-charcoal">Sanctioned trials and bench show hunt entry fees</td>
                    <td className="p-3 text-right font-bold text-forest-950">$1,100.00</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">38.8%</td>
                  </tr>

                  <tr className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">4. Fundraisers</td>
                    <td className="p-3 text-charcoal">Clubhouse maintenance and auction fundraisers</td>
                    <td className="p-3 text-right font-bold text-forest-950">$350.00</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">12.3%</td>
                  </tr>

                  <tr className="hover:bg-surface-low/60 transition-colors">
                    <td className="p-3 font-bold text-forest-950">5. UHC Marketplace Commissions</td>
                    <td className="p-3 text-charcoal">Automatic revenue split shares from UHC national sales</td>
                    <td className="p-3 text-right font-bold text-forest-950">$260.00</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">9.2%</td>
                  </tr>

                  {/* TOTAL ROW */}
                  <tr className="bg-forest-950 text-white font-black">
                    <td className="p-3 uppercase text-tan-300">TOTAL CLUB INCOME</td>
                    <td className="p-3 text-tan-200 text-xs font-normal">Reconciled cumulative total for August</td>
                    <td className="p-3 text-right text-emerald-400 text-sm">$2,835.00</td>
                    <td className="p-3 text-right text-tan-300 font-mono">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MERCHANDISE SECTION (Products, Orders, Sales, Club profit) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'MERCHANDISE' && (
        <div className="space-y-6">
          {/* Merchandise 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase">Products</span>
              <div className="text-2xl font-black text-forest-950">{totalProductsCount}</div>
              <div className="text-[10px] text-tan-800 font-bold">Active Store Items</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase">Orders</span>
              <div className="text-2xl font-black text-forest-950">{totalOrdersCount}</div>
              <div className="text-[10px] text-charcoal-muted font-bold">Fulfilled Orders</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Sales</span>
              <div className="text-2xl font-black text-emerald-700">${totalSalesAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-[10px] text-emerald-800 font-bold">Gross Retail Sales</div>
            </div>

            <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Club Profit</span>
              <div className="text-2xl font-black text-amber-700">${totalClubProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-[10px] text-amber-800 font-bold">Net Profit Credited</div>
            </div>
          </div>

          {/* Products & Orders Grid */}
          <div className="bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
            <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-tan-600" />
              <span>Official Club Store Merchandise Products</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProducts.map((p) => {
                const wholesale = p.wholesaleCost || Number((p.price * 0.7).toFixed(2));
                const profit = Number((p.price - wholesale).toFixed(2));
                return (
                  <div key={p.id} className="p-4 bg-surface-low rounded-2xl border border-surface-border flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover border border-surface-border shrink-0" />
                    <div className="min-w-0 flex-1 space-y-0.5 text-xs">
                      <h4 className="font-black text-forest-950 truncate">{p.name}</h4>
                      <div className="text-charcoal font-bold">${p.price} Retail</div>
                      <div className="text-[10px] text-emerald-800 font-bold">+${profit} Club Profit</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. COMMUNICATION SECTION (Member announcements, Email notices, Event reminders) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'COMMUNICATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dispatch Communication Form */}
            <div className="lg:col-span-1 bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                  Officer Communication Tool
                </span>
                <h3 className="text-lg font-black text-forest-950 mt-1">Send Notice to Members</h3>
              </div>

              <form onSubmit={handleSendCommunication} className="space-y-3 text-xs">
                {/* 3 Communication Types requested by Client */}
                <div>
                  <label className="block font-bold text-charcoal mb-1">Select Notice Type</label>
                  <select
                    value={commType}
                    onChange={(e) => setCommType(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-bold focus:outline-none focus:border-forest-800"
                  >
                    <option value="Member Announcement">Member Announcement</option>
                    <option value="Email Notice">Email Notice</option>
                    <option value="Event Reminder">Event Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Notice Title / Subject</label>
                  <input
                    type="text"
                    required
                    value={commTitle}
                    onChange={(e) => setCommTitle(e.target.value)}
                    placeholder="Subject title..."
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={commMessage}
                    onChange={(e) => setCommMessage(e.target.value)}
                    placeholder="Type broadcast message for club members..."
                    className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-forest-950 hover:bg-forest-900 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-tan-400" />
                  <span>Dispatch {commType}</span>
                </button>
              </form>
            </div>

            {/* Broadcast History & Sent Notices List */}
            <div className="lg:col-span-2 bg-surface-lowest p-6 rounded-3xl border border-surface-border shadow-ambient space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-tan-600" />
                  <span>Dispatched Notices & Announcements History</span>
                </h3>
                <span className="text-xs text-charcoal-muted font-bold">{announcementsList.length} Messages Dispatched</span>
              </div>

              <div className="space-y-3">
                {announcementsList.map((ann) => (
                  <div key={ann.id} className="p-4 bg-surface-low rounded-2xl border border-surface-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                        ann.type === 'Member Announcement' ? 'bg-forest-900 text-tan-300' :
                        ann.type === 'Email Notice' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {ann.type}
                      </span>
                      <span className="text-[10px] text-charcoal-muted font-bold">{ann.date}</span>
                    </div>

                    <h4 className="font-black text-sm text-forest-950">{ann.title}</h4>
                    <p className="text-charcoal-muted leading-relaxed font-medium">{ann.text}</p>
                    <div className="text-[10px] text-tan-800 font-bold pt-1">Dispatched by: {ann.sender}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
