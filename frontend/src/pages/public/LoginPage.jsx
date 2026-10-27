import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import {
  Shield,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Loader2
} from 'lucide-react';

export const LoginPage = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const urlEmail = searchParams.get('email');
  const isNewAccount = searchParams.get('newAccount') === 'true';

  const [email, setEmail] = useState(urlEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Destination route if redirected from ProtectedRoute
  const targetRedirect = location.state?.from;

  useEffect(() => {
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [urlEmail]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await loginUser(email, password);
      if (result?.success && result.user) {
        // If arrived via redirect, return to intended destination
        if (targetRedirect) {
          navigate(targetRedirect, { replace: true });
          return;
        }

        // Navigate based on verified authenticated role
        const roleHomeMap = {
          SUPER_ADMIN: '/super-admin',
          NATIONAL_ADMIN: '/national-admin',
          STATE_ADMIN: '/state-admin',
          CLUB_ADMIN: '/club-admin',
          EVENT_ADMIN: '/event-admin',
          MEMBER: '/member'
        };
        const dest = roleHomeMap[result.user.role] || '/member';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="relative z-10 w-full max-w-4xl bg-forest-900/80 backdrop-blur-xl rounded-3xl border border-forest-700/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
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
                The centralized digital registry for 635+ hunting clubs, 50 state charters, registered canines, sanctioned trials, and verified leaderboards.
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
              <Sparkles className="w-3.5 h-3.5 text-tan-400" /> Secure JWT Authentication
            </span>
            <span className="font-mono text-[10px]">Verified Portal</span>
          </div>
        </div>

        {/* Right Side: Authentic Login Form */}
        <div className="lg:col-span-7 p-6 lg:p-10 space-y-6 flex flex-col justify-between bg-surface-lowest text-charcoal">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-tan-700">Official Access Portal</span>
              <h2 className="text-2xl font-extrabold text-forest-900 tracking-tight">Sign In to Account</h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Enter your verified email and password to access your authorized portal.
              </p>
            </div>

            {/* Target Redirect Notice */}
            {targetRedirect && (
              <div className="bg-amber-50 text-amber-950 border border-amber-300 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Authentication required to access the requested portal.</span>
              </div>
            )}

            {/* Registration Success Banner */}
            {isNewAccount && (
              <div className="bg-emerald-50 text-emerald-950 border border-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-black text-emerald-900">Account Registered Successfully!</div>
                  <div className="text-[11px] font-normal text-emerald-800">Please sign in with your credentials to activate your dashboard.</div>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="bg-rose-50 text-rose-950 border border-rose-300 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-black text-rose-900">Authentication Failed</div>
                  <div className="text-[11px] font-normal text-rose-800 mt-0.5">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    disabled={isSubmitting}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium pr-10 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-forest-800 focus:ring-forest-800" />
                  <span className="font-semibold text-charcoal-muted">Remember Me</span>
                </label>
                <a
                  href="#contact-admin"
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMessage('Password reset requests must be processed by your State Charter administrator or National Headquarters.');
                  }}
                  className="font-bold text-forest-800 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-tan-400 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-tan-400" />
                    <span>Sign In to Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Guidance Note */}
          <div className="space-y-3 pt-4 border-t border-surface-border">
            <div className="text-xs text-charcoal-muted text-center">
              Don't have an active charter account?{' '}
              <Link to="/join" className="font-extrabold text-forest-800 hover:underline">
                Join Network ($45/yr)
              </Link>
            </div>
            <div className="p-3 rounded-xl bg-surface-low border border-surface-border text-[11px] text-charcoal-muted leading-relaxed">
              <strong className="text-forest-900 block font-bold mb-0.5">Role Authorization Policy:</strong>
              Access permissions (Super Admin, National, State, Club, Event, Member) are strictly validated by the backend service.
            </div>

            {/* Quick Fill Test Accounts for Pair Programming & Testing */}
            <div className="p-3 rounded-xl bg-tan-500/10 border border-tan-600/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-forest-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-tan-600" /> Quick-Fill Verified Test Accounts
                </span>
                <span className="text-[10px] text-charcoal-muted font-normal">Pass: 12345678</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { role: 'Super Admin', email: 'superadmin@gmail.com', color: 'hover:border-red-500' },
                  { role: 'National Admin', email: 'nationaladmin@gmail.com', color: 'hover:border-tan-600' },
                  { role: 'State Admin', email: 'stateadmin@gmail.com', color: 'hover:border-blue-500' },
                  { role: 'Club Admin', email: 'clubadmin@gmail.com', color: 'hover:border-amber-500' },
                  { role: 'Event Admin', email: 'eventadmin@gmail.com', color: 'hover:border-purple-500' },
                  { role: 'Member', email: 'member@gmail.com', color: 'hover:border-emerald-500' }
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword('12345678');
                    }}
                    className={`px-2 py-1.5 rounded-lg bg-surface-lowest border border-surface-border text-left transition-all ${acc.color} group hover:shadow-xs active:scale-98`}
                  >
                    <div className="text-[10px] font-extrabold text-forest-900 group-hover:text-forest-700 leading-tight">
                      {acc.role}
                    </div>
                    <div className="text-[9px] text-charcoal-light truncate max-w-full">
                      {acc.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
