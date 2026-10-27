import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export const StateMembershipSignUpPage = () => {
  const { stateId } = useParams();
  const navigate = useNavigate();
  const { states, clubs, registerStateMembership, showToast } = useApp();

  // Find state based on parameter or default to Texas
  const resolvedState = states.find(
    (s) =>
      s.id === stateId ||
      s.code.toLowerCase() === stateId?.toLowerCase() ||
      s.name.toLowerCase() === stateId?.toLowerCase() ||
      s.name.toLowerCase().includes(stateId?.toLowerCase())
  ) || { id: 'texas', name: 'Texas', code: 'TX' };

  // State Name & Title (e.g., Texas Hound Association)
  const stateTitle = resolvedState.name.includes('Association')
    ? resolvedState.name
    : `${resolvedState.name} Hound Association`;

  // Get clubs for this state
  const stateClubs = clubs.filter(
    (c) => c.state === resolvedState.name || c.stateCode === resolvedState.code
  );
  const clubOptions = stateClubs.length > 0
    ? stateClubs.map((c) => c.name)
    : ['Lone Star Hound Club', 'Texas Coonhound Club', 'Oak Ridge Hunting Club'];

  // Form State containing EXACT 9 CLIENT REQUESTED FIELDS
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: resolvedState.name || '',
    phone: '',
    email: '',
    membershipType: 'Individual Membership',
    clubAffiliation: clubOptions[0] || '',
    dogSportInterests: []
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    amount: 35.00
  });

  const [step, setStep] = useState(1); // 1: Form & Payment, 2: Confirmation
  const [createdMember, setCreatedMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available Dog Sport Interests
  const availableSportInterests = [
    'Coonhound Nite Hunts',
    'Treeing Trials',
    'Water Races',
    'Bench Shows',
    'Beagle Field Trials',
    'Squirrel Dog Competitions'
  ];

  // Available Membership Types
  const membershipTypes = [
    { name: 'Individual Membership', price: 35.00, desc: '1 Year Full Voting & Competition Membership' },
    { name: 'Family Membership', price: 60.00, desc: '1 Year Household Charter for All Family Members' },
    { name: 'Youth Handler Membership', price: 20.00, desc: '1 Year Junior Handler Charter (Under 18)' },
    { name: 'Lifetime Charter Membership', price: 250.00, desc: 'Permanent Lifetime State Association Charter' }
  ];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const current = prev.dogSportInterests || [];
      if (current.includes(interest)) {
        return { ...prev, dogSportInterests: current.filter((item) => item !== interest) };
      } else {
        return { ...prev, dogSportInterests: [...current, interest] };
      }
    });
  };

  const handleSelectMembershipType = (typeObj) => {
    setFormData((prev) => ({ ...prev, membershipType: typeObj.name }));
    setPaymentData((prev) => ({ ...prev, amount: typeObj.price }));
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await registerStateMembership({
        ...formData,
        amount: paymentData.amount
      });
      setCreatedMember(result);
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Official State Charter Sign-Up
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-forest-900 text-tan-300 border border-forest-700">
            {resolvedState.code}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Join the {stateTitle}
        </h1>

        <p className="text-xs sm:text-sm text-tan-200 font-medium max-w-2xl">
          Complete the official state membership registration form below to receive your state charter membership, voting rights, and online payment recording into the {stateTitle} database.
        </p>

        <div className="pt-2 text-xs text-tan-400 flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Direct Sign-Up Link: /join-state/{resolvedState.id || 'texas'}</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmitSignUp} className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-2xl space-y-8">
          {/* SECTION 1: MEMBER INFORMATION (Exact 9 Fields) */}
          <div className="space-y-4">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-tan-600" />
                <span>Member Information</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Provide your required member contact and affiliation details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              {/* Field 1: Name */}
              <div className="sm:col-span-2">
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  1. Member Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Walker"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Field 2: Address */}
              <div className="sm:col-span-2">
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  2. Street Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 104 Hunting Trail Rd"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Field 3: City */}
              <div>
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  3. City <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Austin"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Field 4: State */}
              <div>
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  4. State <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Field 5: Phone */}
              <div>
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  5. Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. (512) 555-0192"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Field 6: Email */}
              <div>
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  6. Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. member@huntingnetwork.org"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                />
              </div>

              {/* Field 7: Membership Type */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <label className="block font-extrabold text-forest-950 text-xs">
                  7. Select Membership Type <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {membershipTypes.map((t) => {
                    const isSelected = formData.membershipType === t.name;
                    return (
                      <div
                        key={t.name}
                        onClick={() => handleSelectMembershipType(t)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-forest-950 text-white border-tan-500 shadow-md ring-2 ring-tan-500/50'
                            : 'bg-surface-low hover:bg-surface-container border-surface-border text-charcoal'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">{t.name}</span>
                          <span className={`font-black text-sm ${isSelected ? 'text-tan-400' : 'text-forest-950'}`}>
                            ${t.price.toFixed(2)}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 ${isSelected ? 'text-tan-200' : 'text-charcoal-muted'}`}>
                          {t.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Field 8: Club Affiliation */}
              <div className="sm:col-span-2 pt-2">
                <label className="block font-extrabold text-forest-950 text-xs mb-1">
                  8. Affiliated Local Club <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.clubAffiliation}
                  onChange={(e) => setFormData({ ...formData, clubAffiliation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
                >
                  {clubOptions.map((clubName) => (
                    <option key={clubName} value={clubName}>{clubName}</option>
                  ))}
                </select>
              </div>

              {/* Field 9: Dog Sport Interests */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <label className="block font-extrabold text-forest-950 text-xs">
                  9. Dog Sport Interests <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSportInterests.map((interest) => {
                    const isChecked = formData.dogSportInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-left flex items-center justify-between ${
                          isChecked
                            ? 'bg-tan-500 text-forest-950 border-tan-600 shadow'
                            : 'bg-surface-low border-surface-border text-charcoal hover:bg-surface-container'
                        }`}
                      >
                        <span>{interest}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ONLINE PAYMENT GATEWAY */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xl font-black text-forest-950 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-tan-600" />
                <span>Online Membership Payment</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Online payment is automatically processed and recorded directly into the state association treasury ledger.
              </p>
            </div>

            <div className="bg-surface-low p-4 sm:p-5 rounded-2xl border border-surface-border space-y-4">
              <div className="flex items-center justify-between font-extrabold text-xs text-forest-950 pb-2 border-b border-surface-border">
                <span>{stateTitle} - {formData.membershipType}</span>
                <span className="text-base font-black text-emerald-700">${paymentData.amount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-3">
                  <label className="block font-bold text-charcoal mb-1">Cardholder Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-surface-lowest border border-surface-border rounded-xl font-mono text-xs font-bold text-forest-950 focus:outline-none focus:border-forest-800"
                    />
                    <Lock className="w-4 h-4 text-charcoal-muted absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Expiration Date</label>
                  <input
                    type="text"
                    required
                    value={paymentData.cardExpiry}
                    onChange={(e) => setPaymentData({ ...paymentData, cardExpiry: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-lowest border border-surface-border rounded-xl font-mono text-xs font-bold text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">CVC Code</label>
                  <input
                    type="text"
                    required
                    value={paymentData.cardCvc}
                    onChange={(e) => setPaymentData({ ...paymentData, cardCvc: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-lowest border border-surface-border rounded-xl font-mono text-xs font-bold text-forest-950 focus:outline-none focus:border-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Total Due</label>
                  <div className="px-3.5 py-2.5 bg-emerald-100 text-emerald-950 rounded-xl font-black text-xs border border-emerald-300 flex items-center justify-between">
                    <span>${paymentData.amount.toFixed(2)}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-800">Auto Recorded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT ACTION BUTTON */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to={`/states/${resolvedState.id || 'texas'}`} className="text-xs font-extrabold text-charcoal-muted hover:text-forest-950 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dedicated State Page</span>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Sign-Up & Recording Payment...</span>
              ) : (
                <>
                  <span>Pay ${paymentData.amount.toFixed(2)} & Complete State Sign-Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: SUCCESS CONFIRMATION VIEW */}
      {step === 2 && createdMember && (
        <div className="bg-surface-lowest p-8 sm:p-12 rounded-3xl border border-surface-border shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              State Membership Database Updated
            </span>
            <h2 className="text-3xl font-black text-forest-950">
              Welcome to the {stateTitle}!
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-medium">
              Your state association membership sign-up and online payment have been automatically recorded into the {resolvedState.name} State Membership Database.
            </p>
          </div>

          {/* Member Credentials Roster Card */}
          <div className="bg-surface-low p-6 rounded-2xl border border-surface-border text-left text-xs space-y-3">
            <div className="text-[10px] font-black uppercase text-tan-800 tracking-wider">
              Recorded State Association Member File
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-medium">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">1. Member Name</span>
                <strong className="text-sm font-extrabold text-forest-950">{createdMember.name}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Membership ID</span>
                <strong className="text-sm font-black text-forest-950 font-mono">{createdMember.membershipId}</strong>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">2. Address & Location</span>
                <span className="text-charcoal">{createdMember.address}, {createdMember.city}, {createdMember.state}</span>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">5 & 6. Phone & Email</span>
                <span className="text-charcoal">{createdMember.phone} • {createdMember.email}</span>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">7. Membership Tier</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-tan-100 text-tan-900 border border-tan-300 inline-block mt-0.5">
                  {createdMember.type}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">8. Club Affiliation</span>
                <strong className="text-charcoal">{createdMember.club}</strong>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">9. Dog Sport Interests</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {createdMember.dogSportInterests.map((interest) => (
                    <span key={interest} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-forest-900 text-white">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Online Payment Settled: ${createdMember?.amountPaid ? createdMember.amountPaid.toFixed(2) : '35.00'} (Clover MID: 526695041883)
                </span>
                <span className="text-charcoal-muted font-bold">Status: Active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/state-admin/membership"
              className="w-full sm:w-auto px-6 py-3 bg-forest-950 hover:bg-forest-900 text-white font-black text-xs rounded-xl shadow transition-all"
            >
              View State Membership Database (State Admin)
            </Link>

            <Link
              to={`/states/${resolvedState.id || 'texas'}`}
              className="w-full sm:w-auto px-6 py-3 bg-surface-low hover:bg-surface-container text-forest-950 border border-surface-border font-bold text-xs rounded-xl transition-all"
            >
              Return to {stateTitle} Home Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
