import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  LogIn
} from 'lucide-react';

export const Header = ({ toggleMobileSidebar }) => {
  const { currentUser, showToast, logoutUser } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Role information derived solely from verified authenticated user profile
  const userRole = currentUser?.role || 'MEMBER';

  const roleLabels = {
    MEMBER: { label: 'Member Portal', scope: currentUser?.scope || 'Personal Account', path: '/member' },
    CLUB_ADMIN: { label: 'Club Admin', scope: currentUser?.scope || currentUser?.club || 'Club Administration', path: '/club-admin' },
    STATE_ADMIN: { label: 'State Admin', scope: currentUser?.scope || currentUser?.state || 'State Charter', path: '/state-admin' },
    EVENT_ADMIN: { label: 'Event Admin', scope: currentUser?.scope || 'Sanctioned Trials', path: '/event-admin' },
    NATIONAL_ADMIN: { label: 'National Admin', scope: 'National Charter Network', path: '/national-admin' },
    SUPER_ADMIN: { label: 'Super Admin', scope: 'Platform Master Authority', path: '/super-admin' }
  };

  const currentRoleInfo = roleLabels[userRole] || roleLabels.MEMBER;

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    if (logoutUser) {
      logoutUser();
    }
    navigate('/login');
  };

  const handleViewProfile = () => {
    setProfileDropdownOpen(false);
    const profileRouteMap = {
      MEMBER: '/member/profile',
      CLUB_ADMIN: '/club-admin/settings',
      STATE_ADMIN: '/state-admin/settings',
      EVENT_ADMIN: '/event-admin/details',
      NATIONAL_ADMIN: '/national-admin/settings',
      SUPER_ADMIN: '/super-admin/settings'
    };
    navigate(profileRouteMap[userRole] || '/member/profile');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-lowest border-b border-surface-border shadow-sm px-4 lg:px-6 py-3 flex items-center justify-between">
      {/* Left section: mobile toggle & search */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-surface-low text-charcoal focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 relative max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            placeholder="Search hunts, members, clubs..."
            className="pl-9 pr-4 py-1.5 text-xs bg-surface-low border border-surface-border rounded-md focus:outline-none focus:border-forest-800 w-60"
          />
        </div>
      </div>

      {/* Right section: Authenticated Role Badge, Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            {/* Authenticated Role Status Badge (Read-only, derived strictly from user profile) */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-low border border-surface-border text-xs font-bold text-forest-900 shadow-xs"
              title={`Authenticated role: ${userRole}`}
            >
              <Shield className="w-3.5 h-3.5 text-tan-600" />
              <span className="font-extrabold">{currentRoleInfo.label}</span>
              <span className="hidden sm:inline text-[10px] text-charcoal-light font-normal">({userRole})</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 text-charcoal-muted hover:text-forest-800 rounded-full hover:bg-surface-low transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-tan-500 rounded-full"></span>
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg p-3 z-50 text-xs space-y-2">
                  <div className="font-extrabold text-forest-800 border-b pb-2 flex justify-between items-center">
                    <span>System Notifications</span>
                    <span className="text-[10px] bg-tan-100 text-tan-800 px-1.5 py-0.5 rounded font-bold">Verified</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="p-2 bg-surface-low rounded border">
                      <div className="font-bold text-charcoal">Authenticated Session Active</div>
                      <div className="text-[10px] text-charcoal-light">Logged in as {currentUser.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative border-l border-surface-border pl-3">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-low transition-all text-left focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-full bg-forest-800 text-tan-300 font-extrabold flex items-center justify-center border-2 border-forest-800 text-xs shadow-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-extrabold text-charcoal leading-tight flex items-center gap-1">
                    {currentUser.name || currentUser.email}
                    <ChevronDown className="w-3 h-3 text-charcoal-light group-hover:text-forest-800" />
                  </span>
                  <span className="text-[10px] text-charcoal-light">{currentUser.email}</span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg py-3 px-1 z-50 animate-fade-in divide-y divide-surface-border">
                  {/* User Header Info Card */}
                  <div className="px-3 pb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest-800 text-tan-300 font-extrabold flex items-center justify-center border-2 border-forest-800 text-sm shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-black text-sm text-forest-900 truncate">{currentUser.name || 'Member'}</span>
                      <span className="text-[10px] text-charcoal-light truncate">{currentUser.email}</span>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-tan-100 text-tan-900 border border-tan-300 w-fit">
                        {currentRoleInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Profile Links */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={handleViewProfile}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-charcoal hover:bg-surface-low hover:text-forest-800 rounded-md transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-tan-600" />
                        <span>View My Profile</span>
                      </div>
                      <span className="text-[10px] text-charcoal-light">Manage</span>
                    </button>

                    <button
                      onClick={handleViewProfile}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-charcoal hover:bg-surface-low hover:text-forest-800 rounded-md transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-tan-600" />
                        <span>Account Settings</span>
                      </div>
                      <span className="text-[10px] text-charcoal-light">Preferences</span>
                    </button>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-700" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-extrabold text-xs shadow-sm transition-all"
          >
            <LogIn className="w-3.5 h-3.5 text-tan-400" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
