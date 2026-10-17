import React from 'react';
import {
  Shield,
  Layers,
  Building2,
  Cpu,
  ShoppingBag,
  Calendar,
  Users,
  DollarSign,
  Globe,
  ArrowDown,
  ShieldCheck
} from 'lucide-react';

export const ConnectedNetworkBanner = () => {
  return (
    <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-8 lg:p-12 border-2 border-tan-500/40 shadow-2xl space-y-10 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-tan-500 text-forest-950 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow">
          <Shield className="w-3.5 h-3.5" />
          <span>3-Level National Platform Architecture</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          UHC National Management & Promotion Platform
        </h2>
        <p className="text-xs sm:text-sm text-tan-100/90 font-medium leading-relaxed">
          UHC is built as a complete national management and promotion platform for the entire hound community — connecting National, State, and Local Club levels into one seamless ecosystem.
        </p>
      </div>

      {/* 3-LEVEL ARCHITECTURE FLOW */}
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* LEVEL 1 — UHC NATIONAL */}
        <div className="bg-forest-900/90 border-2 border-tan-400 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-tan-500 text-forest-950 font-black flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500/20 text-tan-300 border border-tan-500/40">
                  Level 1 — Central Platform Hub
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">LEVEL 1 — UHC NATIONAL</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-tan-300 bg-forest-950 px-3 py-1 rounded-xl border border-forest-800 self-start sm:self-auto">
              National Platform Infrastructure
            </span>
          </div>

          <p className="text-xs text-tan-200 font-medium">
            UHC National provides the central foundation, nationwide reach, technology, and governance tools powering the entire platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <Cpu className="w-4 h-4" />
                <span>• Technology</span>
              </div>
              <p className="text-[11px] text-tan-200/80">SaaS platform infrastructure, digital pedigree database & check-ins</p>
            </div>

            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <ShoppingBag className="w-4 h-4" />
                <span>• Marketplace</span>
              </div>
              <p className="text-[11px] text-tan-200/80">National store & drop-ship vendor supply chain network</p>
            </div>

            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <Calendar className="w-4 h-4" />
                <span>• Event System</span>
              </div>
              <p className="text-[11px] text-tan-200/80">Unified event registration, pre-signups & live leaderboards</p>
            </div>

            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <Users className="w-4 h-4" />
                <span>• Membership Tools</span>
              </div>
              <p className="text-[11px] text-tan-200/80">National canine registry credentials & membership tools</p>
            </div>

            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <DollarSign className="w-4 h-4" />
                <span>• Accounting Tools</span>
              </div>
              <p className="text-[11px] text-tan-200/80">Automated revenue share splits & treasury accounting ledger</p>
            </div>

            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 space-y-1">
              <div className="flex items-center gap-2 text-tan-400 font-extrabold text-xs">
                <Globe className="w-4 h-4" />
                <span>• National Exposure</span>
              </div>
              <p className="text-[11px] text-tan-200/80">Nationwide promotion, sponsor exposure & national rankings</p>
            </div>
          </div>
        </div>

        {/* Down Arrow Indicator */}
        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-tan-400 animate-bounce" />
        </div>

        {/* LEVEL 2 — STATE ASSOCIATIONS */}
        <div className="bg-forest-900/80 border-2 border-forest-700 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-tan-300 font-black flex items-center justify-center shrink-0 border border-forest-700 shadow">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-800 text-tan-300 border border-forest-700">
                  Level 2 — State Governance
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">LEVEL 2 — STATE ASSOCIATIONS</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-tan-300 bg-forest-950 px-3 py-1 rounded-xl border border-forest-800 self-start sm:self-auto">
              50 Independent State Charters
            </span>
          </div>

          <p className="text-xs text-tan-200 font-medium">
            Each State Association operates inside the UHC system while maintaining its own:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Identity</div>
              <div className="text-[10px] text-tan-200/80">State logo & colors</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Page</div>
              <div className="text-[10px] text-tan-200/80">Public state site</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Members</div>
              <div className="text-[10px] text-tan-200/80">State roster & dues</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Events</div>
              <div className="text-[10px] text-tan-200/80">State trial meets</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Merchandise</div>
              <div className="text-[10px] text-tan-200/80">State gear store</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Income</div>
              <div className="text-[10px] text-tan-200/80">7% Margin share</div>
            </div>
          </div>
        </div>

        {/* Down Arrow Indicator */}
        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-tan-400 animate-bounce" />
        </div>

        {/* LEVEL 3 — LOCAL CLUBS */}
        <div className="bg-forest-900/70 border-2 border-forest-800 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-tan-300 font-black flex items-center justify-center shrink-0 border border-forest-700 shadow">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-800 text-tan-300 border border-forest-700">
                  Level 3 — Local Community
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">LEVEL 3 — LOCAL CLUBS</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-tan-300 bg-forest-950 px-3 py-1 rounded-xl border border-forest-800 self-start sm:self-auto">
              635+ Chartered Local Clubs
            </span>
          </div>

          <p className="text-xs text-tan-200 font-medium">
            Each Local Club operates inside the UHC system while maintaining its own:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Identity</div>
              <div className="text-[10px] text-tan-200/80">Club emblem & history</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Page</div>
              <div className="text-[10px] text-tan-200/80">Public club portal</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Members</div>
              <div className="text-[10px] text-tan-200/80">Local club roster</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Events</div>
              <div className="text-[10px] text-tan-200/80">Hosted hunts & races</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Merchandise</div>
              <div className="text-[10px] text-tan-200/80">Local club caps & gear</div>
            </div>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-forest-800 text-center space-y-1">
              <div className="font-extrabold text-tan-300 text-xs">Income</div>
              <div className="text-[10px] text-tan-200/80">15% Margin share</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="p-4 rounded-2xl bg-forest-900/90 border border-tan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 flex items-center justify-center shrink-0 shadow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-xs text-white">Full Independence & Shared Infrastructure Guaranteed</h4>
            <p className="text-[11px] text-tan-200/80 font-medium">
              National exposure & technology for every level while guaranteeing 100% independent identity, events, merchandise, and treasury income.
            </p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl bg-tan-500 text-forest-950 font-black text-[10px] uppercase tracking-wider shrink-0 shadow">
          Platform Active
        </span>
      </div>
    </div>
  );
};
