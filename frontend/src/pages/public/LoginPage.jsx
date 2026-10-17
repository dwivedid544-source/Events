import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Shield,
  User,
  Building2,
  MapPin,
  Calendar,
  Globe,
  Key,
  ArrowRight,
  Lock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Compass,
  Zap
} from 'lucide-react';

export const LoginPage = () => {
  const { switchRole, loginUser, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlEmail = searchParams.get('email');
  const isNewAccount = searchParams.get('newAccount') === 'true';

  const [activeTab, setActiveTab] = useState(isNewAccount || urlEmail ? 'LOGIN' : 'ROLE_SWITCHER');
  const [email, setEmail] = useState(urlEmail || 'pancholelalit52@gmail.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail);
      setActiveTab('LOGIN');
    }
  }, [urlEmail]);

  const roleOptions = [
    { role: 'MEMBER', title: 'Member Portal', scope: 'Own Account', desc: 'Account, dogs, memberships & entries', icon: User, path: '/member', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    { role: 'CLUB_ADMIN', title: 'Local Club Admin', scope: 'Oak Ridge Hunting Club', desc: 'Manage 84 members, events & results', icon: Building2, path: '/club-admin', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { role: 'STATE_ADMIN', title: 'State Admin', scope: 'Tennessee Charter', desc: 'Oversee 42 clubs & state revenue', icon: MapPin, path: '/state-admin', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { role: 'EVENT_ADMIN', title: 'Event Admin', scope: 'Nite Hunt Sep 19', desc: 'Mobile check-in & score publishing', icon: Calendar, path: '/event-admin', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { role: 'NATIONAL_ADMIN', title: 'National Admin', scope: 'National Org', desc: '50 states governance & store CMS', icon: Globe, path: '/national-admin', badgeColor: 'bg-tan-500/20 text-tan-300 border-tan-500/40' },
    { role: 'SUPER_ADMIN', title: 'Super Admin', scope: 'Global Master', desc: 'Club claims, users & permission matrix', icon: Key, path: '/super-admin', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40' },
  ];

  const handleSelectRole = (roleKey, targetPath) => {
    switchRole(roleKey);
    navigate(targetPath);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
    navigate('/member');
  };

  return (
    <div className="min-h-screen bg-forest-950 text-white flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Glows & Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url('/stitch_national_hunting_network_portal/professional_cinematic_wide_angle_photograph_of_a_misty_morning_in_the_rolling/screen.png')`
        }}
      ></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forest-700/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-5xl bg-forest-900/80 backdrop-blur-xl rounded-3xl border border-forest-700/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        {/* Left Side: Brand Visual & Showcase Panel */}
        <div className="lg:col-span-5 bg-gradient-to-b from-forest-900 via-forest-900/90 to-forest-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-forest-800 relative">
          <div className="space-y-6">
            {/* Back Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-tan-300 hover:text-white transition-colors bg-forest-800/80 px-3 py-1.5 rounded-full border border-forest-700 w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Portal</span>
            </Link>

            {/* Brand Logo */}
            <div className="flex items-center gap-3.5 pt-2">
              <img src="/logo.png" alt="UHC Logo" className="h-16 sm:h-20 w-auto object-contain" />
            </div>

            {/* Headline */}
            <div className="space-y-3 pt-2">
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                One Network.<br />
                <span className="text-tan-400">Every Club.</span><br />
                Every Event.
              </h1>
              <p className="text-xs text-tan-200/90 leading-relaxed">
                The centralized digital registry for 635+ hunting clubs, 50 state charters, registered canines, sanctioned trials, and live event leaderboards.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-forest-800/60 border border-forest-700/60 text-xs">
                <div className="font-black text-tan-400 text-sm">635+</div>
                <div className="text-[10px] text-white/70">Chartered Clubs</div>
              </div>
              <div className="p-3 rounded-xl bg-forest-800/60 border border-forest-700/60 text-xs">
                <div className="font-black text-tan-400 text-sm">48,500+</div>
                <div className="text-[10px] text-white/70">Active Members</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-forest-800/80 text-[11px] text-tan-300/80 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-tan-400" /> Secure Member Authentication
            </span>
            <span className="font-mono text-[10px]">v1.0 Operational</span>
          </div>
        </div>

        {/* Right Side: Tabbed Login & Role Selector */}
        <div className="lg:col-span-7 p-6 lg:p-10 space-y-6 flex flex-col justify-between bg-surface-lowest text-charcoal">
          {/* Header & Tabs Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-700">Authentication Portal</span>
                <h2 className="text-2xl font-extrabold text-forest-800 tracking-tight">Sign In to Account</h2>
              </div>
            </div>

            {/* Registration Success Banner */}
            {isNewAccount && (
              <div className="bg-emerald-50 text-emerald-950 border border-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-black text-emerald-900">Membership Activated Successfully!</div>
                  <div className="text-[11px] font-normal text-emerald-800">Enter your password below to sign in to your new Member Dashboard.</div>
                </div>
              </div>
            )}

            {/* Tabs Bar */}
            <div className="bg-surface-low p-1 rounded-xl border border-surface-border grid grid-cols-2 gap-1 text-xs font-extrabold">
              <button
                onClick={() => setActiveTab('LOGIN')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'LOGIN'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <Lock className="w-4 h-4 text-tan-400" />
                <span>Standard Form Login</span>
              </button>
              <button
                onClick={() => setActiveTab('ROLE_SWITCHER')}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ROLE_SWITCHER'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <Shield className="w-4 h-4 text-tan-400" />
                <span>Interactive Role Switcher</span>
              </button>
            </div>
          </div>

          {/* TAB 1: STANDARD LOGIN FORM */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pancholelalit52@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-forest-800" />
                  <span className="font-semibold text-charcoal-muted">Remember Me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="font-bold text-forest-800 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-tan-400" /> Sign In to Member Account
              </button>

              <div className="text-center text-xs text-charcoal-muted pt-2 border-t">
                Don't have an account yet?{' '}
                <Link to="/join" className="font-extrabold text-forest-800 hover:underline">
                  Join Network ($45/yr)
                </Link>
              </div>
            </form>
          )}

          {/* TAB 2: INTERACTIVE ROLE SWITCHER GRID */}
          {activeTab === 'ROLE_SWITCHER' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-800 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-4 h-4 text-tan-500" /> Select Dashboard Scope (Instant Demo Access)
                </span>
                <span className="text-[10px] text-charcoal-light font-medium">6 Roles Available</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <div
                      key={opt.role}
                      onClick={() => handleSelectRole(opt.role, opt.path)}
                      className="p-3.5 rounded-xl border border-surface-border bg-surface-lowest hover:bg-tan-50/80 hover:border-forest-800 cursor-pointer transition-all flex items-start gap-3 group shadow-xs hover:shadow-ambient"
                    >
                      <div className="w-9 h-9 rounded-xl bg-surface-low text-forest-800 flex items-center justify-center shrink-0 group-hover:bg-forest-800 group-hover:text-tan-400 transition-colors shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-charcoal group-hover:text-forest-800">{opt.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-tan-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5" />
                        </div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold border mt-0.5 ${opt.badgeColor}`}>
                          {opt.scope}
                        </span>
                        <div className="text-[10px] text-charcoal-light leading-tight mt-1 truncate">{opt.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Demo Pre-fill Helper */}
          <div className="p-3 rounded-xl bg-surface-low border border-surface-border flex items-center justify-between text-xs">
            <span className="text-charcoal-light text-[11px]">Need test access? Use <strong>Role Switcher</strong> tab above for instant preview.</span>
            <button
              onClick={() => setActiveTab('ROLE_SWITCHER')}
              className="text-forest-800 font-extrabold text-xs hover:underline whitespace-nowrap ml-2"
            >
              Open Role Switcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
