import React from 'react';
import {
  Globe,
  MapPin,
  Building2,
  Cpu,
  Calendar,
  Users,
  ShoppingBag,
  DollarSign,
  Database,
  Lock,
  ArrowDown,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConnectedNetworkArchitecturePage = () => {
  // THE 7 EXACT SHARED CORE SYSTEMS SPECIFIED BY CLIENT
  const sharedSystems = [
    {
      id: 'events',
      name: '1. Event System',
      icon: Calendar,
      description: 'Single-entry event registration with automatic upward propagation to Local, State, and National calendars.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'members',
      name: '2. Member System',
      icon: Users,
      description: 'Multi-organization membership rosters preserving Local Club, State Association, and National affiliations.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'marketplace',
      name: '3. Marketplace',
      icon: ShoppingBag,
      description: 'Unified 10-source marketplace store system with automated profit margin distribution.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'accounting',
      name: '4. Accounting System',
      icon: DollarSign,
      description: 'Automatic 6-element revenue tracking calculating Vendor Cost, National, State, Local shares, Processing, & Net Profit.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'database',
      name: '5. Database',
      icon: Database,
      description: 'Centralized state store keeping real-time synchronization across all chartered chapters.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'login',
      name: '6. Login System',
      icon: Lock,
      description: 'One Member Login system allowing members to access all 3 tiers with a single login account.',
      badge: 'Shared Across All Tiers'
    },
    {
      id: 'technology',
      name: '7. Technology',
      icon: Cpu,
      description: 'Shared React + Tailwind CSS + Vite platform infrastructure powering all connected portals.',
      badge: 'Shared Across All Tiers'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            Client Core Architecture Concept
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Network of Connected Platforms Architecture
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            UHC is structured as a network of connected platforms — NOT as one website with hundreds of static info pages, but as <strong>One National Platform ➔ 50 State Platforms ➔ Hundreds of Local Club Platforms</strong>.
          </p>
        </div>
      </div>

      {/* HIERARCHICAL CONNECTED PLATFORMS DIAGRAM */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-forest-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-tan-600" />
            <span>3-Tier Connected Platform Structure</span>
          </h2>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px] rounded-full uppercase">
            Network of Platforms (Not Info Pages)
          </span>
        </div>

        {/* 3 Tier Visual Diagram */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* TIER 1: National Platform */}
          <div className="p-6 rounded-3xl bg-forest-950 text-white border-2 border-tan-500 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-forest-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 font-black flex items-center justify-center shadow">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-tan-300">Tier 1 Platform</span>
                  <h3 className="text-lg font-black text-white">One National Platform</h3>
                </div>
              </div>
              <Link to="/marketplace" className="px-3 py-1 bg-tan-500 text-forest-950 font-black text-xs rounded-lg hover:bg-tan-400">
                National Portal
              </Link>
            </div>
            <p className="text-xs text-tan-200 font-medium">
              Individual Identity: UHC National HQ branding, national championship rankings, nationwide news feed, national sponsor marketplace.
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-tan-600 animate-bounce" />
          </div>

          {/* TIER 2: 50 State Platforms */}
          <div className="p-6 rounded-3xl bg-surface-lowest border-2 border-amber-500/50 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center shadow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-900">Tier 2 Platforms</span>
                  <h3 className="text-lg font-black text-amber-950">50 State Platforms</h3>
                </div>
              </div>
              <Link to="/states/texas" className="px-3 py-1 bg-amber-700 text-white font-black text-xs rounded-lg hover:bg-amber-800">
                Texas State Platform
              </Link>
            </div>
            <p className="text-xs text-charcoal-muted font-medium">
              Individual Identity: Texas State Association branding, state Officers, state championship hunts, state membership dues, state store.
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-tan-600 animate-bounce" />
          </div>

          {/* TIER 3: Hundreds of Local Club Platforms */}
          <div className="p-6 rounded-3xl bg-surface-lowest border-2 border-emerald-500/50 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center shadow">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-900">Tier 3 Platforms</span>
                  <h3 className="text-lg font-black text-emerald-950">Hundreds of Local Club Platforms</h3>
                </div>
              </div>
              <Link to="/clubs/club-tx-houston" className="px-3 py-1 bg-emerald-700 text-white font-black text-xs rounded-lg hover:bg-emerald-800">
                Houston County Club Platform
              </Link>
            </div>
            <p className="text-xs text-charcoal-muted font-medium">
              Individual Identity: Houston County Coon Hunters Association logo, local history, local Officers, local trial dates, Houston County store.
            </p>
          </div>
        </div>
      </div>

      {/* THE 7 EXACT SHARED CORE SYSTEMS GRID */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-forest-950 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-tan-600" />
              <span>The 7 Shared Core Systems Across All Platforms</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              All National, State, and Local Club platforms share the exact 7 core underlying systems.
            </p>
          </div>
          <span className="px-3 py-1 bg-forest-950 text-tan-300 font-black text-[10px] rounded-full uppercase border border-tan-500">
            7 Shared Core Systems
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sharedSystems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.id}
                className="p-5 rounded-2xl bg-surface-low border border-surface-border space-y-3 flex flex-col justify-between hover:border-tan-500/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {sys.badge}
                    </span>
                    <Icon className="w-5 h-5 text-tan-600" />
                  </div>
                  <h3 className="font-extrabold text-sm text-forest-950">{sys.name}</h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
                    {sys.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border text-[11px] font-bold text-forest-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% Fully Shared System</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
