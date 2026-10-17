import React from 'react';
import {
  Shield,
  TrendingUp,
  Target,
  Users,
  MapPin,
  ShoppingBag,
  Trophy,
  Cpu,
  Globe,
  Award,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UhcPhilosophyBanner = () => {
  return (
    <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-tan-500/40 shadow-2xl space-y-10 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Philosophy Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-tan-500 text-forest-950 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow">
          <Shield className="w-3.5 h-3.5" />
          <span>Core UHC Philosophy</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Empowering State Associations & Local Clubs
        </h2>
        <p className="text-xs sm:text-sm text-tan-100/90 font-medium leading-relaxed">
          UHC provides the infrastructure that makes State Associations and Local Clubs stronger. The purpose of UHC is not to take identity away, but to provide technology, exposure, membership tools, event promotion, merchandise systems, and new income streams.
        </p>
      </div>

      {/* 1. GROWTH STRUCTURE HIERARCHY */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <h3 className="text-xs font-black uppercase text-tan-400 text-center tracking-wider">
          UHC Growth Structure
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Level 1 */}
          <div className="p-5 rounded-2xl bg-forest-900/90 border border-forest-700 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
              National Growth
            </span>
            <h4 className="text-sm font-black text-white">National UHC Grows</h4>
            <p className="text-xs text-tan-200">When State Associations grow and thrive nationwide.</p>
          </div>

          {/* Level 2 */}
          <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-600/40 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-600 text-white">
              State Growth
            </span>
            <h4 className="text-sm font-black text-white">State Associations Grow</h4>
            <p className="text-xs text-amber-200">When Local Clubs grow and chartered chapters expand.</p>
          </div>

          {/* Level 3 */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-600 text-white">
              Grassroots Growth
            </span>
            <h4 className="text-sm font-black text-white">Local Clubs Grow</h4>
            <p className="text-xs text-emerald-200">When hunters & houndsmen actively participate.</p>
          </div>
        </div>
      </div>

      {/* 2. CONSTANT VISITOR CALLS TO ACTION (5 ACTIONS) */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <h3 className="text-xs font-black uppercase text-tan-400 text-center tracking-wider">
          Participate & Support Your Organization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Find a Hunt */}
          <Link
            to="/find-hunt"
            className="p-4 rounded-2xl bg-surface-lowest/10 border border-tan-500/30 hover:border-tan-500 text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-tan-500 text-forest-950 mx-auto flex items-center justify-center font-black shadow group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-white">1. Find a Hunt</div>
            <div className="text-[10px] text-tan-300">Sanctioned Trials</div>
          </Link>

          {/* 2. Join a Club */}
          <Link
            to="/join-club"
            className="p-4 rounded-2xl bg-surface-lowest/10 border border-tan-500/30 hover:border-tan-500 text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center font-black shadow group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-white">2. Join a Club</div>
            <div className="text-[10px] text-emerald-300">Local Chapter Dues</div>
          </Link>

          {/* 3. Support Your State */}
          <Link
            to="/join-state"
            className="p-4 rounded-2xl bg-surface-lowest/10 border border-tan-500/30 hover:border-tan-500 text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-black shadow group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-white">3. Support Your State</div>
            <div className="text-[10px] text-amber-300">State Association</div>
          </Link>

          {/* 4. Shop Through Your Club */}
          <Link
            to="/store"
            className="p-4 rounded-2xl bg-surface-lowest/10 border border-tan-500/30 hover:border-tan-500 text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white mx-auto flex items-center justify-center font-black shadow group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-white">4. Shop Through Club</div>
            <div className="text-[10px] text-rose-300">Merchandise Margin</div>
          </Link>

          {/* 5. Participate in the Sport */}
          <Link
            to="/sports"
            className="p-4 rounded-2xl bg-surface-lowest/10 border border-tan-500/30 hover:border-tan-500 text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white mx-auto flex items-center justify-center font-black shadow group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-white">5. Participate</div>
            <div className="text-[10px] text-purple-300">Hound Sport Events</div>
          </Link>
        </div>
      </div>

      {/* 3. PURPOSE OF UHC (6 PILLARS) */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <h3 className="text-xs font-black uppercase text-tan-400 text-center tracking-wider">
          What UHC Provides to Every Organization
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs text-center">
          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <Cpu className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">Technology</div>
          </div>

          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <Globe className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">Exposure</div>
          </div>

          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <Award className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">Membership Tools</div>
          </div>

          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <Calendar className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">Event Promotion</div>
          </div>

          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <ShoppingBag className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">Merchandise</div>
          </div>

          <div className="p-3 bg-forest-900/90 rounded-xl border border-forest-700 space-y-1">
            <DollarSign className="w-4 h-4 text-tan-400 mx-auto" />
            <div className="font-extrabold text-white">New Income</div>
          </div>
        </div>
      </div>
    </div>
  );
};
