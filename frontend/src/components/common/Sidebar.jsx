import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Award,
  Calendar,
  ClipboardList,
  ShoppingBag,
  Dog,
  User,
  Users,
  Trophy,
  Newspaper,
  DollarSign,
  Megaphone,
  Building2,
  Briefcase,
  ShieldAlert,
  Settings,
  MapPin,
  FileSpreadsheet,
  CheckCircle,
  Globe,
  Tag,
  Key,
  Shield,
  Layers,
  ArrowRightLeft,
  Store,
  Compass,
  FileCheck,
  TrendingUp,
  Truck,
  BarChart3,
  X
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, closeMobileSidebar }) => {
  const { currentUser } = useApp();

  const getMenuForRole = (role) => {
    switch (role) {
      case 'MEMBER':
        return [
          { label: 'Dashboard', path: '/member', icon: LayoutDashboard },
          { label: 'Memberships', path: '/member/memberships', icon: Award },
          { label: 'Events', path: '/member/events', icon: Calendar },
          { label: 'My Entries', path: '/member/entries', icon: ClipboardList },
          { label: 'Orders', path: '/member/orders', icon: ShoppingBag },
          { label: 'My Dogs', path: '/member/dogs', icon: Dog },
          { label: 'Profile', path: '/member/profile', icon: User },
        ];

      case 'CLUB_ADMIN':
        return [
          { label: 'Dashboard', path: '/club-admin', icon: LayoutDashboard },
          { label: 'Members', path: '/club-admin/members', icon: Users },
          { label: 'Events', path: '/club-admin/events', icon: Calendar },
          { label: 'Entries', path: '/club-admin/entries', icon: ClipboardList },
          { label: 'Results', path: '/club-admin/results', icon: Trophy },
          { label: 'News', path: '/club-admin/news', icon: Newspaper },
          { label: 'Store', path: '/club-admin/store', icon: Store },
          { label: 'Finance', path: '/club-admin/finance', icon: DollarSign },
          { label: 'Announcements', path: '/club-admin/announcements', icon: Megaphone },
          { label: 'Club Page', path: '/club-admin/club-page', icon: Building2 },
          { label: 'Officers', path: '/club-admin/officers', icon: Briefcase },
          { label: 'Sponsors', path: '/club-admin/sponsors', icon: ShieldAlert },
          { label: 'Settings', path: '/club-admin/settings', icon: Settings },
        ];

      case 'STATE_ADMIN':
        return [
          { label: 'Dashboard', path: '/state-admin', icon: LayoutDashboard },
          { label: 'Membership', path: '/state-admin/membership', icon: Award },
          { label: 'Clubs', path: '/state-admin/clubs', icon: Building2 },
          { label: 'Events', path: '/state-admin/events', icon: Calendar },
          { label: 'Entries', path: '/state-admin/entries', icon: ClipboardList },
          { label: 'Results', path: '/state-admin/results', icon: Trophy },
          { label: 'News', path: '/state-admin/news', icon: Newspaper },
          { label: 'Store', path: '/state-admin/store', icon: Store },
          { label: 'Revenue', path: '/state-admin/revenue', icon: TrendingUp },
          { label: 'Reports', path: '/state-admin/reports', icon: FileSpreadsheet },
          { label: 'State Page', path: '/state-admin/state-page', icon: MapPin },
          { label: 'Settings', path: '/state-admin/settings', icon: Settings },
        ];

      case 'EVENT_ADMIN':
        return [
          { label: 'Dashboard', path: '/event-admin', icon: LayoutDashboard },
          { label: 'Event Details', path: '/event-admin/details', icon: Calendar },
          { label: 'Entries', path: '/event-admin/entries', icon: ClipboardList },
          { label: 'Participants', path: '/event-admin/participants', icon: Users },
          { label: 'Attendance', path: '/event-admin/attendance', icon: CheckCircle },
          { label: 'Results', path: '/event-admin/results', icon: Trophy },
          { label: 'Payments', path: '/event-admin/payments', icon: DollarSign },
          { label: 'Announcements', path: '/event-admin/announcements', icon: Megaphone },
        ];

      case 'NATIONAL_ADMIN':
        return [
          { label: 'Dashboard', path: '/national-admin', icon: LayoutDashboard },
          { label: 'Events', path: '/national-admin/events', icon: Calendar },
          { label: 'States', path: '/national-admin/states', icon: MapPin },
          { label: 'Clubs', path: '/national-admin/clubs', icon: Building2 },
          { label: 'Members', path: '/national-admin/members', icon: Users },
          { label: 'News', path: '/national-admin/news', icon: Newspaper },
          { label: 'Results', path: '/national-admin/results', icon: Trophy },
          { label: 'Store', path: '/national-admin/store', icon: Store },
          { label: 'Vendors', path: '/national-admin/vendors', icon: Truck },
          { label: 'Sponsors', path: '/national-admin/sponsors', icon: ShieldAlert },
          { label: 'Revenue', path: '/national-admin/revenue', icon: TrendingUp },
          { label: 'Commissions', path: '/national-admin/commissions', icon: Tag },
          { label: 'Analytics & Reports', path: '/national-admin/analytics', icon: BarChart3 },
          { label: 'Website', path: '/national-admin/website', icon: Globe },
          { label: 'Settings', path: '/national-admin/settings', icon: Settings },
        ];

      case 'SUPER_ADMIN':
      default:
        return [
          { label: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
          { label: 'National', path: '/super-admin/national', icon: Globe },
          { label: 'States', path: '/super-admin/states', icon: MapPin },
          { label: 'Clubs', path: '/super-admin/clubs', icon: Building2 },
          { label: 'Club Claims', path: '/super-admin/club-claims', icon: FileCheck },
          { label: 'Events', path: '/super-admin/events', icon: Calendar },
          { label: 'Members', path: '/super-admin/members', icon: Users },
          { label: 'Store', path: '/super-admin/store', icon: Store },
          { label: 'Vendors', path: '/super-admin/vendors', icon: Truck },
          { label: 'Orders', path: '/super-admin/orders', icon: ShoppingBag },
          { label: 'Transactions', path: '/super-admin/transactions', icon: ArrowRightLeft },
          { label: 'Revenue', path: '/super-admin/revenue', icon: TrendingUp },
          { label: 'Commissions', path: '/super-admin/commissions', icon: Tag },
          { label: 'Analytics & Reports', path: '/super-admin/analytics', icon: BarChart3 },
          { label: 'Sponsors', path: '/super-admin/sponsors', icon: ShieldAlert },
          { label: 'Users & Roles', path: '/super-admin/users-roles', icon: Key },
          { label: 'Permissions', path: '/super-admin/permissions', icon: Shield },
          { label: 'Settings', path: '/super-admin/settings', icon: Settings },
        ];
    }
  };

  const menuItems = getMenuForRole(currentUser.role);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-charcoal/60 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-forest-800 text-white z-50 flex flex-col transition-transform duration-300 ease-in-out border-r border-forest-900 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-forest-700 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="UHC Logo" className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105" />
          </NavLink>
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-4 py-2.5 bg-forest-900/60 border-b border-forest-700/60 flex items-center justify-between text-xs text-tan-200">
          <span className="font-semibold">{currentUser.role.replace('_', ' ')}</span>
          <span className="text-[10px] bg-tan-500/20 text-tan-300 px-2 py-0.5 rounded border border-tan-500/30">
            {menuItems.length} Modules
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/member' || item.path === '/club-admin' || item.path === '/state-admin' || item.path === '/event-admin' || item.path === '/national-admin' || item.path === '/super-admin'}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-tan-500 text-forest-900 shadow-sm font-bold'
                      : 'text-white/80 hover:bg-forest-700 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-forest-700 bg-forest-900/80 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-tan-500"
            />
            <div className="flex flex-col truncate">
              <span className="font-bold text-white truncate">{currentUser.name}</span>
              <span className="text-[10px] text-tan-300 truncate">{currentUser.scope}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-forest-800 text-[10px] text-white/50 text-center">
            Heritage Field & Forest Design v1.0
          </div>
        </div>
      </aside>
    </>
  );
};
