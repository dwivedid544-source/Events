import React from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Loader2, LogOut } from 'lucide-react';

/**
 * ProtectedRoute Component
 * - Blocks unauthenticated visitors from accessing protected dashboard routes.
 * - Restricts access based on the verified `currentUser.role` from the backend profile.
 * - Displays a loading screen during session validation on initial load to prevent content flash.
 * - Provides clean fallback navigation for unauthorized roles.
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, authLoading, logoutUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Session initialization / token verification state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-forest-950 text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans select-none">
        <div className="relative">
          <img src="/logo.png" alt="UHC Logo" className="h-16 w-auto object-contain opacity-90" />
          <div className="absolute -bottom-2 -right-2">
            <Loader2 className="w-5 h-5 text-tan-400 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-tan-200">Verifying security credentials...</p>
          <p className="text-xs text-white/50">Validating authenticated session with network registry</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated user -> Redirect to Login with return path
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  // 3. Role authorization check
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    const roleHomeMap = {
      SUPER_ADMIN: '/super-admin',
      NATIONAL_ADMIN: '/national-admin',
      STATE_ADMIN: '/state-admin',
      CLUB_ADMIN: '/club-admin',
      EVENT_ADMIN: '/event-admin',
      MEMBER: '/member'
    };
    const userHomePath = roleHomeMap[currentUser.role] || '/member';

    const handleSwitchAccount = () => {
      if (logoutUser) {
        logoutUser();
      }
      navigate('/login');
    };

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-lowest border border-surface-border rounded-2xl p-6 lg:p-8 shadow-ambient space-y-5 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-7 h-7 text-rose-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-forest-950 tracking-tight">Access Restricted</h2>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Your account (<strong className="text-forest-900">{currentUser.email}</strong>) has the assigned role of{' '}
              <span className="font-mono font-bold text-forest-800 bg-surface-low px-1.5 py-0.5 rounded border border-surface-border">
                {currentUser.role}
              </span>
              , which does not have permission to access this administrative portal.
            </p>
            <p className="text-[11px] text-charcoal-light">
              This section is reserved for administrative roles ({allowedRoles.join(', ')}).
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to={userHomePath}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-xs font-bold transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to My Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleSwitchAccount}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized -> Render children or Outlet
  return children ? children : null;
};

export default ProtectedRoute;
