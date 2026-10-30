import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  User,
  Star,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';

export const StudDogsPage = () => {
  const [selectedTier, setSelectedTier] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollTier, setEnrollTier] = useState('stud'); // 'free', 'stud', 'featured', 'premier'
  const [isUhcMember, setIsUhcMember] = useState(true);

  const pricingTiers = [
    {
      id: 'free',
      name: 'Hound Profile',
      price: '$0',
      period: 'Permanent Free',
      description: 'Get your canine athlete into the National UHC network database.',
      features: [
        'Permanent UHC public profile',
        'Official 3-generation pedigree',
        'Upload verified photos',
        'Competition titles and verified hunt wins',
        'Owner & handler credentials'
      ],
      ctaText: 'Create Free Profile',
      popular: false
    },
    {
      id: 'stud',
      name: 'Stud Dog Listing',
      price: isUhcMember ? '$39' : '$49',
      period: 'per year',
      badge: 'Most Popular / Workhorse',
      description: 'Activates breeding availability, stud inquiries, and genetic offspring tracking.',
      features: [
        'Everything in Free Profile',
        'Activates "Available at Stud ✓" badge',
        'Published Stud Fee & breeding terms',
        'Direct inquiry button to owner/kennel',
        'Automatic Offspring Connection (tracks pups to sire)',
        'Offspring cast-win rate analytics',
        'Searchable in National Stud Directory'
      ],
      ctaText: 'List Stud Dog ($49/yr)',
      popular: true
    },
    {
      id: 'featured',
      name: 'Featured Stud',
      price: '$99',
      period: 'per year',
      badge: 'High Visibility',
      description: 'Priority placement across directory search results with gold verification badge.',
      features: [
        'Everything in Stud Dog Listing',
        'Prominent "Featured Stud" badge',
        'Top placement in breed & state search',
        'Pedigree video embedding',
        'Highlighted breeding announcements'
      ],
      ctaText: 'Upgrade to Featured ($99/yr)',
      popular: false
    },
    {
      id: 'premier',
      name: 'Premier Stud',
      price: '$149',
      period: 'per year',
      badge: 'Maximum Promotion',
      description: 'National homepage rotation and premier promotion for elite champions.',
      features: [
        'Everything in Featured Stud',
        'National Homepage Stud Carousel rotation',
        'Exclusive promotion in UHC monthly newsletter',
        'Full championship pedigree highlight',
        'Priority breeding contract support'
      ],
      ctaText: 'Get Premier Placement ($149/yr)',
      popular: false
    }
  ];

  const studDogs = [
    {
      id: 'stud-1',
      name: 'BOGGY CREEK KOBE',
      tier: 'Premier Stud',
      badgeColor: 'bg-tan-500 text-forest-950',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      breed: 'Treeing Walker Coonhound',
      owner: 'James Wadley',
      kennel: 'Boggy Creek Kennels',
      location: 'Knoxville, TN',
      studFee: '$500 / Private Treaty',
      registeredOffspring: 42,
      competitionHounds: 18,
      castWinners: 11,
      champions: 4,
      castWinRate: '26%',
      record: '28W - 10L - 2S',
      earnings: '$18,750',
      titles: 'GRNITECH (UKC), Gold Champion (PKC)'
    },
    {
      id: 'stud-2',
      name: 'DIXIE RIVER THUNDER',
      tier: 'Featured Stud',
      badgeColor: 'bg-amber-500 text-forest-950',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
      breed: 'Black and Tan Coonhound',
      owner: 'Robert Miller',
      kennel: 'Dixie River Hounds',
      location: 'Oak Ridge, TN',
      studFee: '$400',
      registeredOffspring: 28,
      competitionHounds: 12,
      castWinners: 7,
      champions: 2,
      castWinRate: '25%',
      record: '22W - 9L - 3S',
      earnings: '$14,200',
      titles: 'NITECH (UKC), Silver Champion (PKC)'
    },
    {
      id: 'stud-3',
      name: 'LONE STAR REBEL ROUSER',
      tier: 'Featured Stud',
      badgeColor: 'bg-amber-500 text-forest-950',
      photo: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
      breed: 'Bluetick Coonhound',
      owner: 'Austin Sterling',
      kennel: 'Lone Star Bluetick Kennels',
      location: 'Crockett, TX',
      studFee: '$450',
      registeredOffspring: 16,
      competitionHounds: 7,
      castWinners: 4,
      champions: 1,
      castWinRate: '25%',
      record: '19W - 7L - 2S',
      earnings: '$11,800',
      titles: 'NITECH (UKC), Gold Champion (PKC)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              UHC National Breeding Marketplace
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Official Stud Dog Directory
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Connect with champion reproduction sires. Every UHC stud listing features certified pedigrees, verified competition cast wins, and live tracking of registered offspring cast-win rates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="px-6 py-3.5 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>List Your Stud Dog ($49/yr)</span>
          </button>
        </div>
      </div>

      {/* Pricing & Subscription Tiers (Client's Exact Specification) */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-forest-950 tracking-tight">
            Stud Dog Listing Tiers & Benefits
          </h2>
          <p className="text-xs text-charcoal-muted">
            Simple, fair annual pricing designed for serious hound owners. UHC active members receive a <strong>$10 discount</strong> on annual stud listings.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <span className={!isUhcMember ? 'font-bold text-forest-950' : 'text-charcoal-muted'}>Public Rate</span>
            <button
              type="button"
              onClick={() => setIsUhcMember(!isUhcMember)}
              className="w-12 h-6 bg-forest-800 rounded-full p-1 transition-all cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full bg-tan-400 transition-all ${isUhcMember ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={isUhcMember ? 'font-bold text-forest-950 flex items-center gap-1' : 'text-charcoal-muted'}>
              <span>UHC Member Rate ($39/yr)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">Save $10</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-6 bg-surface-lowest flex flex-col justify-between transition-all border ${
                tier.popular
                  ? 'border-2 border-forest-800 shadow-xl relative'
                  : 'border-surface-border shadow-sm hover:border-forest-700/60'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-forest-900 text-tan-300 border border-forest-700">
                  {tier.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-forest-950">{tier.name}</h3>
                  <p className="text-[11px] text-charcoal-muted mt-1 leading-snug">{tier.description}</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-forest-950">{tier.price}</span>
                    <span className="text-xs text-charcoal-muted">/{tier.period}</span>
                  </div>
                  {tier.id === 'stud' && isUhcMember && (
                    <div className="text-[10px] text-emerald-700 font-bold mt-0.5">UHC Member pricing applied!</div>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-surface-border text-xs">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-charcoal text-[11px] font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEnrollTier(tier.id);
                  setShowEnrollModal(true);
                }}
                className={`w-full mt-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tier.popular
                    ? 'bg-forest-900 hover:bg-forest-950 text-white shadow-md'
                    : 'bg-surface-low hover:bg-surface-border text-forest-950'
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Stud Dogs Directory Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-forest-950 tracking-tight">
              Featured Stud Dogs Available for Service
            </h2>
            <p className="text-xs text-charcoal-muted">
              Live offspring cast-win rates and certified competition histories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studDogs.map((dog) => (
            <div
              key={dog.id}
              className="bg-surface-lowest rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative">
                  <img
                    src={dog.photo}
                    alt={dog.name}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${dog.badgeColor}`}>
                    {dog.tier}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-black">
                    Fee: {dog.studFee}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-forest-950">{dog.name}</h3>
                    <div className="text-xs font-semibold text-charcoal">{dog.breed}</div>
                    <div className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" /> {dog.location} • {dog.kennel}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-tan-50 border border-tan-200 space-y-1.5 text-xs">
                    <div className="font-extrabold text-[11px] text-forest-950 flex items-center justify-between">
                      <span>Offspring Track Record</span>
                      <span className="text-emerald-700 font-black">{dog.castWinRate} Win Rate</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center text-[10px] pt-1">
                      <div className="bg-white p-1 rounded border border-tan-200">
                        <strong className="block text-forest-900">{dog.registeredOffspring}</strong>
                        <span className="text-charcoal-muted">Offspring</span>
                      </div>
                      <div className="bg-white p-1 rounded border border-tan-200">
                        <strong className="block text-forest-900">{dog.castWinners}</strong>
                        <span className="text-charcoal-muted">Cast Wins</span>
                      </div>
                      <div className="bg-white p-1 rounded border border-tan-200">
                        <strong className="block text-emerald-700">{dog.champions}</strong>
                        <span className="text-charcoal-muted">Champions</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-charcoal space-y-1">
                    <div><strong>Career Record:</strong> <span className="font-mono font-bold text-forest-900">{dog.record}</span> (${dog.earnings})</div>
                    <div className="truncate"><strong>Titles:</strong> {dog.titles}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => alert(`Inquiring about stud service with ${dog.owner} for ${dog.name}. Contact details will be forwarded to your email.`)}
                  className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-tan-400" />
                  <span>Inquire Stud Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-lowest text-charcoal w-full max-w-xl rounded-3xl shadow-2xl border border-surface-border p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-lg font-black text-forest-950">Activate Stud Dog Listing</h3>
                <p className="text-xs text-charcoal-muted">Enroll your sire into the National UHC Stud Directory</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                className="text-charcoal-muted hover:text-charcoal font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Stud Dog Listing successfully enrolled! It is now active on the UHC Stud Directory.');
                setShowEnrollModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-charcoal mb-1">Hound Registered Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOGGY CREEK KOBE"
                  className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Breed</label>
                  <select className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold">
                    <option>Treeing Walker Coonhound</option>
                    <option>Black and Tan Coonhound</option>
                    <option>Bluetick Coonhound</option>
                    <option>Redbone Coonhound</option>
                    <option>English Coonhound</option>
                    <option>Plott Hound</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">Stud Fee ($)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $500 or Private Treaty"
                    className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">PKC Registration #</label>
                  <input
                    type="text"
                    placeholder="e.g. PKC-192847"
                    className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal mb-1">UKC Registration #</label>
                  <input
                    type="text"
                    placeholder="e.g. UKC-W91823"
                    className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-tan-50 border border-tan-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-forest-950 block">Selected Tier:</span>
                  <span className="text-[11px] text-charcoal-muted">Stud Dog Annual Listing</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-forest-950">{isUhcMember ? '$39' : '$49'}</span>
                  <span className="text-[10px] text-charcoal-muted block">/year via Clover</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Proceed to Checkout ({isUhcMember ? '$39' : '$49'}/yr)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudDogsPage;

