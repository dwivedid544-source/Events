import React from 'react';
import { UhcPhilosophyBanner } from '../../components/common/UhcPhilosophyBanner';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Globe,
  Target,
  Users,
  ShoppingBag,
  Trophy,
  Cpu,
  Award,
  Calendar,
  DollarSign,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UhcPhilosophyPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Hero Banner Component */}
      <UhcPhilosophyBanner />

      {/* DETAILED PHILOSOPHY PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Purpose: Preserving Identity */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-950 text-tan-300 font-black flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-forest-950">Preserving Individual Identity</h3>
              <p className="text-xs text-charcoal-muted">UHC infrastructure empowers existing organizations.</p>
            </div>
          </div>

          <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
            The purpose of UHC is <strong>not to take the identity away</strong> from existing clubs and organizations. Each National, State, and Local Club platform maintains its own custom logo/emblem, history, Officers, event rules, and chapter identity while leveraging shared national technology.
          </p>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>100% Independent Charter Identity Maintained</span>
          </div>
        </div>

        {/* What UHC Provides */}
        <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 font-black flex items-center justify-center shadow">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-forest-950">What UHC Provides</h3>
              <p className="text-xs text-charcoal-muted">The 6 value pillars supporting every level.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
            <div className="p-2.5 bg-surface-low rounded-xl border">1. Technology</div>
            <div className="p-2.5 bg-surface-low rounded-xl border">2. Exposure</div>
            <div className="p-2.5 bg-surface-low rounded-xl border">3. Membership Tools</div>
            <div className="p-2.5 bg-surface-low rounded-xl border">4. Event Promotion</div>
            <div className="p-2.5 bg-surface-low rounded-xl border">5. Merchandise Systems</div>
            <div className="p-2.5 bg-surface-low rounded-xl border">6. New Income Streams</div>
          </div>
        </div>
      </div>
    </div>
  );
};
