import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';

export const Header = ({ toggleMobileSidebar }) => {
  const { currentUser, showToast } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const roleLabels = {
    MEMBER: { label: 'Member Portal', scope: 'Own Account' },
    CLUB_ADMIN: { label: 'Local Club Admin', scope: 'Oak Ridge Hunting Club' },
    STATE_ADMIN: { label: 'State Admin', scope: 'Tennessee Association' },
    EVENT_ADMIN: { label: 'Event Admin', scope: 'Nite Hunt Sep 19' },
    NATIONAL_ADMIN: { label: 'National Admin', scope: 'National Org' },
    SUPER_ADMIN: { label: 'Super Admin', scope: 'Platform Master' }
  };

  const currentRoleInfo = roleLabels[currentUser.role] || roleLabels.MEMBER;

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
    navigate(profileRouteMap[currentUser.role] || '/member/profile');
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

      {/* Right section: Notifications & User Profile Dropdown */}
      <div className="flex items-center gap-3">
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
