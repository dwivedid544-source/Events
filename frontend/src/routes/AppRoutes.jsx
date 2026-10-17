import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { PublicNationalPage } from '../pages/public/PublicNationalPage';
import { FindHuntPage } from '../pages/public/FindHuntPage';
import { FindClubPage } from '../pages/public/FindClubPage';
import { PublicStatePage } from '../pages/public/PublicStatePage';
import { PublicClubPage } from '../pages/public/PublicClubPage';
import { PublicResultsPage } from '../pages/public/PublicResultsPage';
import { PublicNewsPage } from '../pages/public/PublicNewsPage';
import { PublicStorePage } from '../pages/public/PublicStorePage';
import { PublicMarketplacePage } from '../pages/public/PublicMarketplacePage';
import { CartPage } from '../pages/public/CartPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { OrderConfirmationPage } from '../pages/public/OrderConfirmationPage';
import { PublicSponsorsPage } from '../pages/public/PublicSponsorsPage';
import { JoinPage } from '../pages/public/JoinPage';
import { StateMembershipSignUpPage } from '../pages/public/StateMembershipSignUpPage';
import { LocalClubMembershipSignUpPage } from '../pages/public/LocalClubMembershipSignUpPage';
import { LoginPage } from '../pages/public/LoginPage';
import { HoundSportsPage } from '../pages/public/HoundSportsPage';

// Member Dashboard Pages
import { MemberDashboard } from '../pages/member/MemberDashboard';
import { MemberMemberships } from '../pages/member/MemberMemberships';
import { MemberEvents } from '../pages/member/MemberEvents';
import { MemberEntries } from '../pages/member/MemberEntries';
import { MemberOrders } from '../pages/member/MemberOrders';
import { MemberDogs } from '../pages/member/MemberDogs';
import { MemberProfile } from '../pages/member/MemberProfile';

// Club Admin Pages
import { ClubAdminDashboard } from '../pages/clubAdmin/ClubAdminDashboard';
import { ClubAdminMembers } from '../pages/clubAdmin/ClubAdminMembers';
import { ClubAdminEvents } from '../pages/clubAdmin/ClubAdminEvents';
import { ClubAdminEntries } from '../pages/clubAdmin/ClubAdminEntries';
import { ClubAdminResults } from '../pages/clubAdmin/ClubAdminResults';
import { ClubAdminFinance } from '../pages/clubAdmin/ClubAdminFinance';
import { ClubAdminClubPage } from '../pages/clubAdmin/ClubAdminClubPage';
import { ClubAdminStorePage } from '../pages/clubAdmin/ClubAdminStorePage';

// State Admin Pages
import { StateAdminDashboard } from '../pages/stateAdmin/StateAdminDashboard';
import { StateAdminClubs } from '../pages/stateAdmin/StateAdminClubs';
import { StateMembershipPage } from '../pages/stateAdmin/StateMembershipPage';
import { StateAdminStorePage } from '../pages/stateAdmin/StateAdminStorePage';

// Event Admin Pages
import { EventAdminDashboard } from '../pages/eventAdmin/EventAdminDashboard';
import { EventAdminAttendance } from '../pages/eventAdmin/EventAdminAttendance';
import { EventAdminEntries } from '../pages/eventAdmin/EventAdminEntries';
import { EventAdminParticipants } from '../pages/eventAdmin/EventAdminParticipants';
import { EventDetailsConfigPage } from '../pages/eventAdmin/EventDetailsConfigPage';
import { EventPaymentsPage } from '../pages/eventAdmin/EventPaymentsPage';

// National Admin Pages
import { NationalAdminDashboard } from '../pages/nationalAdmin/NationalAdminDashboard';
import { NationalAdminStorePage } from '../pages/admin/NationalAdminStorePage';

// Super Admin Pages
import { SuperAdminDashboard } from '../pages/superAdmin/SuperAdminDashboard';
import { SuperAdminClubClaims } from '../pages/superAdmin/SuperAdminClubClaims';
import { SuperAdminPermissions } from '../pages/superAdmin/SuperAdminPermissions';
import { NationalHeadquartersSettings } from '../pages/superAdmin/NationalHeadquartersSettings';

// Shared Common Functional Views
import { UhcPhilosophyPage } from '../pages/public/UhcPhilosophyPage';
import { PlatformStructurePage } from '../pages/admin/PlatformStructurePage';
import { ConnectedNetworkArchitecturePage } from '../pages/admin/ConnectedNetworkArchitecturePage';
import { RolePermissionsPage } from '../pages/admin/RolePermissionsPage';
import { MembershipFlowPage } from '../pages/admin/MembershipFlowPage';
import { NewsFlowPage } from '../pages/admin/NewsFlowPage';
import { InformationFlowPage } from '../pages/admin/InformationFlowPage';
import { RevenueTrackingPage } from '../pages/admin/RevenueTrackingPage';
import { NewsManagementPage } from '../pages/common/NewsManagementPage';
import { AnnouncementsPage } from '../pages/common/AnnouncementsPage';
import { OfficersPage } from '../pages/common/OfficersPage';
import { TransactionsLedgerPage } from '../pages/common/TransactionsLedgerPage';
import { CommissionsGovernancePage } from '../pages/common/CommissionsGovernancePage';
import { ReportsAnalyticsPage } from '../pages/common/ReportsAnalyticsPage';
import { SettingsPage } from '../pages/common/SettingsPage';
import { UsersRolesPage } from '../pages/common/UsersRolesPage';
import { CmsEditorPage } from '../pages/common/CmsEditorPage';
import { VendorManagementPage } from '../pages/admin/VendorManagementPage';
import { AnalyticsReportsPage } from '../pages/admin/AnalyticsReportsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Experience */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/national" element={<PublicNationalPage />} />
        <Route path="/about" element={<PublicNationalPage />} />
        <Route path="/find-hunt" element={<FindHuntPage />} />
        <Route path="/events" element={<FindHuntPage />} />
        <Route path="/sports" element={<HoundSportsPage />} />
        <Route path="/clubs" element={<FindClubPage />} />
        <Route path="/clubs/:clubId" element={<PublicClubPage />} />
        <Route path="/states" element={<PublicStatePage />} />
        <Route path="/states/:stateId" element={<PublicStatePage />} />
        <Route path="/texas" element={<PublicStatePage />} />
        <Route path="/results" element={<PublicResultsPage />} />
        <Route path="/news" element={<PublicNewsPage />} />
        <Route path="/store" element={<PublicStorePage />} />
        <Route path="/marketplace" element={<PublicMarketplacePage />} />
        <Route path="/auctions" element={<PublicStorePage />} />
        <Route path="/education" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/sponsors" element={<PublicSponsorsPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/join-state" element={<StateMembershipSignUpPage />} />
        <Route path="/join-state/:stateId" element={<StateMembershipSignUpPage />} />
        <Route path="/states/:stateId/join" element={<StateMembershipSignUpPage />} />
        <Route path="/join-texas" element={<StateMembershipSignUpPage />} />
        <Route path="/join-club" element={<LocalClubMembershipSignUpPage />} />
        <Route path="/join-club/:clubId" element={<LocalClubMembershipSignUpPage />} />
        <Route path="/clubs/:clubId/join" element={<LocalClubMembershipSignUpPage />} />
        <Route path="/join-houston-county" element={<LocalClubMembershipSignUpPage />} />
        <Route path="/revenue-tracking" element={<RevenueTrackingPage />} />
        <Route path="/accounting" element={<RevenueTrackingPage />} />
        <Route path="/information-flow" element={<InformationFlowPage />} />
        <Route path="/news-flow" element={<NewsFlowPage />} />
        <Route path="/membership-flow" element={<MembershipFlowPage />} />
        <Route path="/role-permissions" element={<RolePermissionsPage />} />
        <Route path="/network-architecture" element={<ConnectedNetworkArchitecturePage />} />
        <Route path="/platform-structure" element={<PlatformStructurePage />} />
        <Route path="/philosophy" element={<UhcPhilosophyPage />} />
        <Route path="/core-philosophy" element={<UhcPhilosophyPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated Dashboard Experience (6 Roles, 70 Sidebar Entries) */}
      <Route element={<DashboardLayout />}>
        {/* Role 1: Member Portal (7 entries) */}
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/memberships" element={<MemberMemberships />} />
        <Route path="/member/events" element={<MemberEvents />} />
        <Route path="/member/entries" element={<MemberEntries />} />
        <Route path="/member/orders" element={<MemberOrders />} />
        <Route path="/member/dogs" element={<MemberDogs />} />
        <Route path="/member/profile" element={<MemberProfile />} />

        {/* Role 2: Club Admin Portal (13 entries) */}
        <Route path="/club-admin" element={<ClubAdminDashboard />} />
        <Route path="/club-admin/members" element={<ClubAdminMembers />} />
        <Route path="/club-admin/events" element={<ClubAdminEvents />} />
        <Route path="/club-admin/entries" element={<ClubAdminEntries />} />
        <Route path="/club-admin/results" element={<ClubAdminResults />} />
        <Route path="/club-admin/news" element={<NewsManagementPage />} />
        <Route path="/club-admin/store" element={<ClubAdminStorePage />} />
        <Route path="/club-admin/finance" element={<ClubAdminFinance />} />
        <Route path="/club-admin/announcements" element={<AnnouncementsPage defaultScope="Club" />} />
        <Route path="/club-admin/club-page" element={<ClubAdminClubPage />} />
        <Route path="/club-admin/officers" element={<OfficersPage />} />
        <Route path="/club-admin/sponsors" element={<PublicSponsorsPage />} />
        <Route path="/club-admin/settings" element={<SettingsPage scopeTitle="Club Administration Settings" />} />

        {/* Role 3: State Admin Portal (12 entries) */}
        <Route path="/state-admin" element={<StateAdminDashboard />} />
        <Route path="/state-admin/membership" element={<StateMembershipPage />} />
        <Route path="/state-admin/clubs" element={<StateAdminClubs />} />
        <Route path="/state-admin/events" element={<ClubAdminEvents />} />
        <Route path="/state-admin/entries" element={<ClubAdminEntries />} />
        <Route path="/state-admin/results" element={<PublicResultsPage />} />
        <Route path="/state-admin/news" element={<NewsManagementPage />} />
        <Route path="/state-admin/store" element={<StateAdminStorePage />} />
        <Route path="/state-admin/revenue" element={<ClubAdminFinance />} />
        <Route path="/state-admin/reports" element={<ReportsAnalyticsPage scopeTitle="State Association Performance Reports" />} />
        <Route path="/state-admin/state-page" element={<CmsEditorPage pageTitle="Public State Association Page CMS" />} />
        <Route path="/state-admin/settings" element={<SettingsPage scopeTitle="State Association Charter Settings" />} />

        {/* Role 4: Event Admin Portal (8 entries) */}
        <Route path="/event-admin" element={<EventAdminDashboard />} />
        <Route path="/event-admin/details" element={<EventDetailsConfigPage />} />
        <Route path="/event-admin/entries" element={<EventAdminEntries />} />
        <Route path="/event-admin/participants" element={<EventAdminParticipants />} />
        <Route path="/event-admin/attendance" element={<EventAdminAttendance />} />
        <Route path="/event-admin/results" element={<ClubAdminResults />} />
        <Route path="/event-admin/payments" element={<EventPaymentsPage />} />
        <Route path="/event-admin/announcements" element={<AnnouncementsPage defaultScope="Event" />} />

        {/* Role 5: National Admin Portal (13 entries) */}
        <Route path="/national-admin" element={<NationalAdminDashboard />} />
        <Route path="/national-admin/events" element={<ClubAdminEvents />} />
        <Route path="/national-admin/states" element={<StateAdminClubs />} />
        <Route path="/national-admin/clubs" element={<StateAdminClubs />} />
        <Route path="/national-admin/members" element={<ClubAdminMembers />} />
        <Route path="/national-admin/news" element={<NewsManagementPage />} />
        <Route path="/national-admin/results" element={<PublicResultsPage />} />
        <Route path="/national-admin/store" element={<NationalAdminStorePage />} />
        <Route path="/national-admin/sponsors" element={<PublicSponsorsPage />} />
        <Route path="/national-admin/revenue" element={<ClubAdminFinance />} />
        <Route path="/national-admin/commissions" element={<CommissionsGovernancePage />} />
        <Route path="/national-admin/vendors" element={<VendorManagementPage />} />
        <Route path="/national-admin/analytics" element={<AnalyticsReportsPage />} />
        <Route path="/national-admin/reports" element={<AnalyticsReportsPage />} />
        <Route path="/national-admin/website" element={<CmsEditorPage pageTitle="National Network Website CMS" />} />
        <Route path="/national-admin/settings" element={<SettingsPage scopeTitle="National Association Settings" />} />

        {/* Role 6: Super Admin Portal (17 entries) */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/national" element={<NationalHeadquartersSettings />} />
        <Route path="/super-admin/states" element={<PublicStatePage />} />
        <Route path="/super-admin/clubs" element={<StateAdminClubs />} />
        <Route path="/super-admin/club-claims" element={<SuperAdminClubClaims />} />
        <Route path="/super-admin/events" element={<ClubAdminEvents />} />
        <Route path="/super-admin/members" element={<ClubAdminMembers />} />
        <Route path="/super-admin/store" element={<NationalAdminStorePage />} />
        <Route path="/super-admin/orders" element={<MemberOrders />} />
        <Route path="/super-admin/transactions" element={<TransactionsLedgerPage />} />
        <Route path="/super-admin/revenue" element={<ClubAdminFinance />} />
        <Route path="/super-admin/commissions" element={<CommissionsGovernancePage />} />
        <Route path="/super-admin/vendors" element={<VendorManagementPage />} />
        <Route path="/super-admin/analytics" element={<AnalyticsReportsPage />} />
        <Route path="/super-admin/sponsors" element={<PublicSponsorsPage />} />
        <Route path="/super-admin/reports" element={<AnalyticsReportsPage />} />
        <Route path="/super-admin/users-roles" element={<UsersRolesPage />} />
        <Route path="/super-admin/permissions" element={<SuperAdminPermissions />} />
        <Route path="/super-admin/settings" element={<SettingsPage scopeTitle="Super Admin Platform Infrastructure Settings" />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
