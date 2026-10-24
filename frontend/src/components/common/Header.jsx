import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';

export const Header = ({ toggleMobileSidebar }) => {
  const { currentUser, showToast, switchRole } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleFromPath = (pathname) => {
    if (pathname.startsWith('/state-admin')) return 'STATE_ADMIN';
    if (pathname.startsWith('/club-admin')) return 'CLUB_ADMIN';
    if (pathname.startsWith('/event-admin')) return 'EVENT_ADMIN';
    if (pathname.startsWith('/national-admin')) return 'NATIONAL_ADMIN';
    if (pathname.startsWith('/super-admin')) return 'SUPER_ADMIN';
    if (pathname.startsWith('/member')) return 'MEMBER';
    return null;
  };

  const effectiveRole = getRoleFromPath(location.pathname) || currentUser?.role || 'MEMBER';

  const stateScopeLabel = currentUser?.role === 'STATE_ADMIN' && currentUser?.scope
    ? currentUser.scope
    : (currentUser?.state ? `${currentUser.state} (${currentUser.stateCode || 'HI'})` : 'Hawaii (HI) / TN');

  const roleLabels = {
    MEMBER: { label: 'Member Portal', scope: 'Own Account', path: '/member' },
    CLUB_ADMIN: { label: 'Club Admin', scope: currentUser?.scope || 'Honolulu / Oak Ridge HC', path: '/club-admin' },
    STATE_ADMIN: { label: 'State Admin', scope: stateScopeLabel, path: '/state-admin' },
    EVENT_ADMIN: { label: 'Event Admin', scope: 'Nite Hunt Sep 19', path: '/event-admin' },
    NATIONAL_ADMIN: { label: 'National Admin', scope: 'National Org', path: '/national-admin' },
    SUPER_ADMIN: { label: 'Super Admin', scope: 'Platform Master', path: '/super-admin' }
  };

  const PORTAL_LIST = [
    { role: 'MEMBER', label: 'Member Portal', scope: 'Personal Account', path: '/member' },
    { role: 'CLUB_ADMIN', label: 'Local Club Admin', scope: 'Honolulu Hound & Hunting Club', path: '/club-admin' },
    { role: 'STATE_ADMIN', label: 'State Admin', scope: stateScopeLabel, path: '/state-admin' },
    { role: 'EVENT_ADMIN', label: 'Event Admin', scope: 'Nite Hunt Sep 19', path: '/event-admin' },
    { role: 'NATIONAL_ADMIN', label: 'National Admin', scope: 'National Org', path: '/national-admin' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', scope: 'Platform Master', path: '/super-admin' }
  ];

  const currentRoleInfo = roleLabels[effectiveRole] || roleLabels.MEMBER;

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    showToast('Logged out successfully. Switched to public view.', 'info');
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
    navigate(profileRouteMap[effectiveRole] || '/member/profile');
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

      {/* Right section: Portal Switcher, Notifications & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Portal Switcher Dropdown */}
        <div className="relative">
          <button
            id="header-portal-switcher-btn"
            onClick={() => {
              setPortalDropdownOpen(!portalDropdownOpen);
              setProfileDropdownOpen(false);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-low hover:bg-forest-50 border border-surface-border hover:border-tan-500 text-xs font-bold text-forest-800 transition-all shadow-xs"
            title="Switch portal view"
          >
            <Shield className="w-3.5 h-3.5 text-tan-600" />
            <span className="hidden md:inline font-bold">{currentRoleInfo.label}</span>
            <ChevronDown className="w-3 h-3 text-charcoal-light" />
          </button>

          {portalDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg py-2 z-50 animate-fade-in divide-y divide-surface-border">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-forest-800 tracking-wider">
                Switch Admin Portal
              </div>
              <div className="py-1">
                {PORTAL_LIST.map((p) => {
                  const isCurrent = p.role === effectiveRole;
                  return (
                    <button
                      key={p.role}
                      onClick={() => {
                        setPortalDropdownOpen(false);
                        if (switchRole) switchRole(p.role);
                        navigate(p.path);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-tan-50 text-forest-900 font-extrabold'
                          : 'text-charcoal hover:bg-surface-low hover:text-forest-800'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{p.label}</span>
                        <span className="text-[10px] text-charcoal-light">{p.scope}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] bg-tan-200 text-tan-900 px-1.5 py-0.5 rounded font-black">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 text-charcoal-muted hover:text-forest-800 rounded-full hover:bg-surface-low transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tan-500 rounded-full"></span>
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg p-3 z-50 text-xs space-y-2">
              <div className="font-extrabold text-forest-800 border-b pb-2 flex justify-between items-center">
                <span>System Notifications</span>
                <span className="text-[10px] bg-tan-100 text-tan-800 px-1.5 py-0.5 rounded font-bold">2 New</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="p-2 bg-surface-low rounded border">
                  <div className="font-bold text-charcoal">New Entry Registered</div>
                  <div className="text-[10px] text-charcoal-light">Entry #E1049 for Fall Championship Hunt</div>
                </div>
                <div className="p-2 bg-surface-low rounded border">
                  <div className="font-bold text-charcoal">Club Claim Submitted</div>
                  <div className="text-[10px] text-charcoal-light">Claim #CLM-401 pending Super Admin review</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE DROPDOWN (AVATAR + NAME + DROPDOWN) */}
        <div className="relative border-l border-surface-border pl-3">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-low transition-all text-left focus:outline-none group"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-forest-800 shadow-xs group-hover:border-tan-500 transition-colors"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-extrabold text-charcoal leading-tight flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className="w-3 h-3 text-charcoal-light group-hover:text-forest-800" />
              </span>
              <span className="text-[10px] text-charcoal-light">{currentUser.email}</span>
            </div>
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-lowest border border-surface-border rounded-xl shadow-ambient-lg py-3 px-1 z-50 animate-fade-in divide-y divide-surface-border">
              {/* User Header Info Card */}
              <div className="px-3 pb-3 flex items-center gap-3">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-forest-800"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-sm text-forest-800 truncate">{currentUser.name}</span>
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

              {/* Logout Button */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-700" />
                  <span>Sign Out / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
