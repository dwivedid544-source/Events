import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, User, MapPin, Building2, Award, CreditCard, Shield, ArrowRight, ArrowLeft, LogIn, Lock } from 'lucide-react';

export const JoinPage = () => {
  const { states, clubs, registerMembership, switchRole, showToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Walker',
    email: 'john.walker@example.com',
    phone: '(865) 555-0192',
    password: 'password123',
    selectedState: 'Tennessee',
    selectedClub: 'Oak Ridge Hunting Club',
    membershipType: 'Individual Membership',
    price: 45
  });

  const [createdMember, setCreatedMember] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [cardData, setCardData] = useState({
    name: 'James Wadley',
    number: '4532 8821 9912 3401',
    expiry: '08/28',
    cvc: '391',
    zip: '77001'
  });

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    if (step === 5) {
      setIsCharging(true);
      try {
        const member = await registerMembership({ ...formData, cardData });
        setCreatedMember(member);
        setStep(6);
        showToast('Membership application registered! Gateway verification pending.', 'info');
      } catch (err) {
        showToast('Registration error: ' + err.message, 'error');
      } finally {
        setIsCharging(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleProceedToLogin = () => {
    navigate(`/login?email=${encodeURIComponent(formData.email)}&newAccount=true`);
  };

  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Select State' },
    { num: 3, label: 'Select Club' },
    { num: 4, label: 'Membership Plan' },
    { num: 5, label: 'Payment' },
    { num: 6, label: 'Success' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded bg-tan-100 text-tan-900 text-xs font-black uppercase tracking-wider">
          Membership Checkout
        </span>
        <h1 className="text-3xl font-extrabold text-forest-800 tracking-tight">Join National Hunting Network</h1>
        <p className="text-xs text-charcoal-muted max-w-lg mx-auto">
          One unified account across all 635 local clubs, state associations, and sanctioned competition registries.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-surface-lowest p-4 rounded-xl border border-surface-border shadow-ambient">
        <div className="flex items-center justify-between relative">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-tan-500 text-forest-900 ring-4 ring-tan-100 font-extrabold'
                    : step > s.num
                    ? 'bg-forest-800 text-white'
                    : 'bg-surface-low text-charcoal-light border border-surface-border'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-[10px] font-bold text-charcoal-muted mt-1 hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Forms */}
      <div className="bg-surface-lowest p-6 lg:p-8 rounded-xl border border-surface-border shadow-ambient">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4 max-w-md mx-auto">
            <h2 className="text-lg font-extrabold text-forest-800 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-tan-500" /> Step 1: Create Account Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded focus:border-forest-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded focus:border-forest-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded focus:border-forest-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded focus:border-forest-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded shadow flex items-center justify-center gap-2"
            >
              Continue to Select State <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-lg font-extrabold text-forest-800 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-tan-500" /> Step 2: Select State Association
            </h2>
            <div className="space-y-2">
              {states.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setFormData({ ...formData, selectedState: st.name })}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    formData.selectedState === st.name
                      ? 'bg-tan-50 border-forest-800 font-extrabold'
                      : 'bg-surface-low border-surface-border hover:bg-surface-container'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-bold text-charcoal">{st.name} Association</div>
                    <div className="text-[10px] text-charcoal-light">{st.clubsCount} Chartered Clubs</div>
                  </div>
                  {formData.selectedState === st.name && <CheckCircle2 className="w-4 h-4 text-forest-800" />}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2 border rounded text-xs font-bold">Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded shadow">
                Continue to Select Club
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-lg font-extrabold text-forest-800 mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-tan-500" /> Step 3: Select Local Club
            </h2>
            <div className="space-y-2">
              {clubs.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setFormData({ ...formData, selectedClub: c.name })}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    formData.selectedClub === c.name
                      ? 'bg-tan-50 border-forest-800 font-extrabold'
                      : 'bg-surface-low border-surface-border hover:bg-surface-container'
                  }`}
                >
                  <div className="text-xs">
                    <div className="font-bold text-charcoal">{c.name}</div>
                    <div className="text-[10px] text-charcoal-light">{c.city}, {c.state} ({c.membersCount} Members)</div>
                  </div>
                  {formData.selectedClub === c.name && <CheckCircle2 className="w-4 h-4 text-forest-800" />}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 border rounded text-xs font-bold">Back</button>
              <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded shadow">
                Continue to Plan Selection
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-lg font-extrabold text-forest-800 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-tan-500" /> Step 4: Membership Plan
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Individual Membership', price: 45, desc: 'Full event entry rights & registry card for 1 handler' },
                { name: 'Family Membership', price: 70, desc: 'Covers primary handler + immediate family members' },
                { name: 'Youth Handler Membership', price: 25, desc: 'Under 18 handlers with sanctioned youth hunt access' },
              ].map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setFormData({ ...formData, membershipType: plan.name, price: plan.price })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.membershipType === plan.name
                      ? 'bg-tan-50 border-forest-800 shadow-sm'
                      : 'bg-surface-low border-surface-border hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-charcoal">{plan.name}</span>
                    <span className="text-base font-black text-forest-800">${plan.price}/yr</span>
                  </div>
                  <p className="text-[11px] text-charcoal-light mt-1">{plan.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(3)} className="px-4 py-2 border rounded text-xs font-bold">Back</button>
              <button onClick={() => setStep(5)} className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded shadow">
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-lg font-extrabold text-forest-800 mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-tan-500" /> Step 5: Checkout & Payment
            </h2>

            <div className="bg-surface-low p-4 rounded-xl border text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>{formData.membershipType}</span>
                <span>${formData.price}.00</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Registry Processing Fee</span>
                <span>$2.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-black text-sm text-forest-800">
                <span>Total Due Today</span>
                <span>${formData.price + 2}.00</span>
              </div>
            </div>

            <div className="space-y-3 bg-emerald-50/80 p-4 rounded-xl border border-emerald-300">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" /> Clover Live Payment Gateway
                </div>
                <span className="text-[10px] font-mono font-bold bg-white/90 px-2 py-0.5 rounded border border-emerald-300 text-emerald-900">
                  Merchant ID: 526695041883
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal mb-1">Cardholder Full Name</label>
                <input
                  type="text"
                  required
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  placeholder="e.g. James Wadley"
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg font-semibold text-charcoal focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal mb-1">Credit / Debit Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardData.number}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                    setCardData({ ...cardData, number: formatted });
                  }}
                  placeholder="4532 8821 9912 3401"
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-lg font-mono font-bold text-charcoal focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal mb-0.5">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    placeholder="08/28"
                    className="w-full px-2.5 py-2 text-xs bg-white border border-emerald-200 rounded-lg font-mono font-bold text-charcoal focus:outline-none focus:border-emerald-600 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal mb-0.5">CVV / CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    placeholder="391"
                    className="w-full px-2.5 py-2 text-xs bg-white border border-emerald-200 rounded-lg font-mono font-bold text-charcoal focus:outline-none focus:border-emerald-600 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal mb-0.5">Billing ZIP</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardData.zip}
                    onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                    placeholder="77001"
                    className="w-full px-2.5 py-2 text-xs bg-white border border-emerald-200 rounded-lg font-mono font-bold text-charcoal focus:outline-none focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="text-[10px] text-emerald-800 font-semibold flex items-center justify-between pt-1">
                <span className="flex items-center gap-1">🔒 Clover End-to-End Encryption Active</span>
                <span className="text-[9px] text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-bold">PCI-DSS Level 1</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(4)} className="px-4 py-2 border rounded text-xs font-bold">Back</button>
              <button
                onClick={handleNext}
                disabled={isCharging}
                className="px-6 py-2.5 bg-tan-500 hover:bg-tan-600 text-forest-900 font-black text-xs rounded shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCharging ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-forest-900 border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application (${formData.price + 2}.00)</span>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 6 && createdMember && (
          <div className="text-center space-y-6 max-w-md mx-auto py-4">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 mx-auto flex items-center justify-center shadow border border-forest-300">
              <CheckCircle2 className="w-10 h-10 text-forest-800" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-tan-700 tracking-wider">
                Registration Recorded
              </span>
              <h2 className="text-2xl font-black text-forest-900">Application Submitted</h2>
              <p className="text-xs text-charcoal-muted">
                Your member account has been registered in the platform registry. Please sign in to view your dashboard.
              </p>
            </div>

            <div className="bg-surface-low p-6 rounded-2xl border border-surface-border text-xs text-left space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                <span className="text-[11px] uppercase font-black text-tan-800 tracking-wider">Membership Application Details</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  Payment Verification Pending
                </span>
              </div>

              <div className="text-base font-extrabold text-forest-900">
                {createdMember?.name || formData.name || formData.firstName || 'Member'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white/70 rounded-xl border border-surface-border">
                  <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Membership ID</span>
                  <strong className="font-mono text-forest-900 text-sm">
                    {createdMember?.membershipId || `TN-ORHC-2026-${Math.floor(10000 + Math.random() * 90000)}`}
                  </strong>
                </div>

                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold">Account Status</span>
                  <strong className="font-mono text-amber-900 text-sm">
                    Pending Verification
                  </strong>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Assigned Club</span>
                  <strong className="text-forest-900">
                    {createdMember?.club || formData.selectedClub || 'Oak Ridge Hunting Club'} ({createdMember?.state || formData.selectedState || 'Tennessee'})
                  </strong>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Plan Type</span>
                  <strong className="text-forest-900">
                    {createdMember?.type || formData.membershipType || 'Individual Membership'}
                  </strong>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Registered Email</span>
                  <strong className="text-forest-900">{formData.email}</strong>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase font-bold">Dues Annual Amount</span>
                  <strong className="font-mono text-forest-900">
                    ${formData.price ? formData.price + 2 : 47}.00 / year
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border text-[11px] text-charcoal-muted leading-relaxed">
                <strong>Gateway Notice:</strong> Card details have been registered with the application. Live payment verification via Clover Payment Gateway will settle once backend payment processor integration is confirmed.
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* BUTTON 1: Proceed to Login Page */}
              <button
                onClick={handleProceedToLogin}
                className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-2 border border-forest-900"
              >
                <LogIn className="w-4 h-4 text-tan-400" />
                <span>Proceed to Sign In / Login Page</span>
              </button>
              
              <Link to="/find-hunt" className="text-xs font-bold text-forest-800 hover:underline">
                Browse Upcoming Hunts & Register Dog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
