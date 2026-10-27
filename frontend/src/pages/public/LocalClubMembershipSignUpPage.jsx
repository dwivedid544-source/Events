import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, Building2, ChevronRight, User, Phone, Mail, Award, Calendar } from 'lucide-react';

export const LocalClubMembershipSignUpPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { clubs, registerLocalClubMembership, showToast } = useApp();

  // Find club or default to Houston County Coon Hunters Association
  const selectedClub = clubs.find(
    (c) => c.id === clubId || c.name.toLowerCase().includes(clubId?.toLowerCase())
  ) || clubs.find((c) => c.id === 'club-tx-houston') || clubs[0];

  const [step, setStep] = useState(1); // Step 1: Member Info & Type | Step 2: Payment | Step 3: Success Confirmation

  // EXACT 7 REQUIRED DATA FIELDS (+ Payment fields)
  const [formData, setFormData] = useState({
    name: '', // 1. Member name
    phone: '', // 2. Contact information
    email: '', // 2. Contact information
    membershipType: 'Individual Local Membership ($25.00/year)', // 6. Membership type
    clubAffiliation: selectedClub.name, // 7. Club affiliation
    amount: 25.00,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: ''
  });

  const [completedMember, setCompletedMember] = useState(null);

  const handleMembershipTypeChange = (e) => {
    const val = e.target.value;
    let cost = 25.00;
    if (val.includes('Family')) cost = 45.00;
    if (val.includes('Youth')) cost = 15.00;
    if (val.includes('Lifetime')) cost = 250.00;

    setFormData({
      ...formData,
      membershipType: val,
      amount: cost
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      showToast('Please fill out Member Name and Contact Information.', 'error');
      return;
    }
    setFormData((prev) => ({ ...prev, cardHolder: formData.name }));
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Execute automated recording of all 7 client requirements in central context
    const createdMember = await registerLocalClubMembership(formData);
    setCompletedMember(createdMember);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Hierarchy Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-charcoal-muted">
        <Link to="/" className="hover:text-forest-950 transition-colors">National</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/clubs/${selectedClub.id}`} className="hover:text-forest-950 transition-colors">{selectedClub.name}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-forest-950 font-black">Local Membership Sign-Up</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex items-center gap-4">
          <img src={selectedClub.logo} alt={selectedClub.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-tan-400 shrink-0 shadow-md" />
          <div>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              Official Local Membership Sign-Up
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Join {selectedClub.name}
            </h1>
            <p className="text-xs text-tan-200 font-medium mt-0.5">
              Complete your information below to register and pay online. Dues are automatically recorded into the {selectedClub.name} member database.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="pt-4 border-t border-forest-800 flex items-center justify-between text-xs font-bold text-tan-300">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-tan-400 font-black' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-tan-500 text-forest-950 flex items-center justify-center text-[10px] font-black">1</span>
            <span>1. Member & Contact Info</span>
          </div>
          <ChevronRight className="w-4 h-4 text-forest-700" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-tan-400 font-black' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-tan-500 text-forest-950 flex items-center justify-center text-[10px] font-black">2</span>
            <span>2. Online Payment</span>
          </div>
          <ChevronRight className="w-4 h-4 text-forest-700" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-tan-400 font-black' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-emerald-400 text-forest-950 flex items-center justify-center text-[10px] font-black">✓</span>
            <span>3. Automated Entry</span>
          </div>
        </div>
      </div>

      {/* STEP 1: MEMBER INFORMATION FORM */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
              <User className="w-5 h-5 text-tan-600" />
              <span>Step 1: Required Member Information</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Enter details for local membership under {selectedClub.name}.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Member Name */}
            <div>
              <label className="block font-extrabold text-forest-950 mb-1">1. Member Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Legal Name (e.g. Marcus Vance)"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            {/* 2. Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-extrabold text-forest-950 mb-1">2. Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(936) 555-0182"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-extrabold text-forest-950 mb-1">2. Contact Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="member@example.com"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
                />
              </div>
            </div>

            {/* 6. Membership Type */}
            <div>
              <label className="block font-extrabold text-forest-950 mb-1">6. Membership Type *</label>
              <select
                value={formData.membershipType}
                onChange={handleMembershipTypeChange}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
              >
                <option value="Individual Local Membership ($25.00/year)">Individual Local Membership ($25.00/year)</option>
                <option value="Family Local Membership ($45.00/year)">Family Local Membership ($45.00/year)</option>
                <option value="Youth Local Membership ($15.00/year)">Youth Local Membership ($15.00/year)</option>
                <option value="Lifetime Local Membership ($250.00 one-time)">Lifetime Local Membership ($250.00 one-time)</option>
              </select>
            </div>

            {/* 7. Club Affiliation */}
            <div>
              <label className="block font-extrabold text-forest-950 mb-1">7. Club Affiliation *</label>
              <input
                type="text"
                disabled
                value={formData.clubAffiliation}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-black text-forest-950 text-xs"
              />
              <span className="text-[10px] text-charcoal-muted mt-1 block">Local club charter chapter assigned to this membership.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-xs font-black text-forest-950 text-center sm:text-left">Total Membership Fee: ${formData.amount.toFixed(2)}</span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Online Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: ONLINE PAYMENT FORM */}
      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
          <div className="border-b border-surface-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Step 2: Pay Online</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Complete online payment for {formData.name}'s membership under {formData.clubAffiliation}.
              </p>
            </div>
            <span className="w-fit px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-lg border border-emerald-300">
              Amount Due: ${formData.amount.toFixed(2)}
            </span>
          </div>

          {/* Membership Summary */}
          <div className="p-4 rounded-2xl bg-surface-low border border-surface-border space-y-2 text-xs font-medium">
            <div className="flex justify-between"><span>Member Name:</span><strong className="text-forest-950">{formData.name}</strong></div>
            <div className="flex justify-between"><span>Contact Info:</span><strong className="text-forest-950">{formData.phone} • {formData.email}</strong></div>
            <div className="flex justify-between"><span>Membership Type:</span><strong className="text-forest-950">{formData.membershipType}</strong></div>
            <div className="flex justify-between"><span>Club Affiliation:</span><strong className="text-forest-950">{formData.clubAffiliation}</strong></div>
          </div>

          {/* Payment Card Form */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={formData.cardHolder}
                onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium focus:outline-none focus:border-forest-800"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Credit / Debit Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-mono focus:outline-none focus:border-forest-800"
                />
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-charcoal mb-1">Expiration Date</label>
                <input
                  type="text"
                  required
                  value={formData.cardExpiry}
                  onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-mono focus:outline-none focus:border-forest-800"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">CVC Code</label>
                <input
                  type="text"
                  required
                  value={formData.cardCvc}
                  onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-mono focus:outline-none focus:border-forest-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-surface-low border border-surface-border text-charcoal font-bold text-xs rounded-xl"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Pay ${formData.amount.toFixed(2)} Online & Activate</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: AUTOMATED RECORDING CONFIRMATION */}
      {step === 3 && completedMember && (
        <div className="bg-surface-lowest p-6 sm:p-10 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              Payment & Membership Recorded
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-forest-950 mt-2">
              Welcome to {completedMember.club}!
            </h2>
            <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
              Your online payment of <strong>${completedMember.amountPaid.toFixed(2)}</strong> has been processed and automatically recorded in the local club membership database.
            </p>
          </div>

          {/* 7 AUTOMATICALLY RECORDED CLIENT FIELDS SUMMARY */}
          <div className="p-6 rounded-2xl bg-surface-low border border-surface-border text-left text-xs space-y-3 max-w-xl mx-auto">
            <div className="text-[11px] font-black uppercase tracking-wider text-forest-950 border-b border-surface-border pb-2 flex items-center justify-between">
              <span>Automatically Recorded Member Profile:</span>
              <span className="text-emerald-700 font-bold font-mono">ID: {completedMember.membershipId}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">1. Member Name:</span>
                <strong className="text-forest-950">{completedMember.name}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">2. Contact Info:</span>
                <strong className="text-forest-950">{completedMember.phone} • {completedMember.email}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">3. Join Date:</span>
                <strong className="text-forest-950">{completedMember.joined}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">4. Expiration Date:</span>
                <strong className="text-forest-950">{completedMember.expires}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">5. Payment:</span>
                <strong className="text-emerald-800">${completedMember?.amountPaid ? completedMember.amountPaid.toFixed(2) : '25.00'} (Clover MID: 526695041883)</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">6. Membership Type:</span>
                <strong className="text-forest-950">{completedMember.type}</strong>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-charcoal-muted uppercase block font-bold">7. Club Affiliation:</span>
                <strong className="text-forest-950">{completedMember.club}</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/clubs/${selectedClub.id}`}
              className="px-5 py-2.5 bg-forest-950 hover:bg-forest-900 text-white font-black text-xs rounded-xl shadow"
            >
              Return to {selectedClub.name} Page
            </Link>

            <Link
              to="/club-admin/members"
              className="px-5 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow"
            >
              View in Club Database →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
