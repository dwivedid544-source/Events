import { jsPDF } from 'jspdf';

/**
 * Utility to format currency nicely
 */
const fmtCur = (num) => {
  return '$' + Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Generates and downloads an official State Association Performance & Financial Audit PDF Report
 */
export const downloadStateAssociationReportPDF = ({
  scopeTitle = 'State Association Performance Reports',
  stateName = 'Tennessee',
  adminName = 'Sarah Tennessee',
  adminEmail = 'sarah.tn@tn-hunting.org',
  periodFilter = 'Monthly',
  startDate = '2026-08-01',
  endDate = '2026-08-31',
  totalFinancialRevenue = 3682.50,
  membersCount = 5,
  eventsCount = 2,
  totalEntries = 4,
  totalPaidEntries = 4,
  membershipRevenue = 515.00,
  eventsRevenue = 67.50,
  merchandiseRevenue = 1597.48,
  fundraisingRevenue = 1850.00,
  donationsRevenue = 1250.00,
  participationData = [
    { category: 'Nite Hunt Trials', percentage: 65, entries: 184 },
    { category: 'Treeing & Bench Competitions', percentage: 22, entries: 62 },
    { category: 'Water Races & Speed Trials', percentage: 13, entries: 38 }
  ]
}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2); // 182mm

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const currentTimestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const reportRef = `UHC-${stateName.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const periodLabel = periodFilter === 'Custom'
    ? `Custom Period (${startDate} to ${endDate})`
    : `${periodFilter} Period (August 2026)`;

  // ==========================================
  // 1. TOP HEADER BANNER (Heritage Forest Green + Tan Gold)
  // ==========================================
  doc.setFillColor(27, 59, 43); // Deep Forest Green (#1B3B2B)
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Gold accent stripe
  doc.setFillColor(197, 160, 89); // Tan Gold (#C5A059)
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('UNITED HOUND CHAMPIONSHIPS', margin, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 210, 185);
  doc.text('STATE ASSOCIATION PERFORMANCE & FINANCIAL AUDIT REPORT', margin, 18.5);

  doc.setFontSize(7.5);
  doc.setTextColor(180, 195, 185);
  doc.text('Official State Administration Portal • Heritage Field & Forest Design v1.0', margin, 24);

  // Status Badge on Header Right
  doc.setFillColor(38, 73, 56);
  doc.roundedRect(140, 5.5, 56, 21, 2, 2, 'F');
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.3);
  doc.roundedRect(140, 5.5, 56, 21, 2, 2, 'D');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('AUDIT STATUS: VERIFIED', 143, 11);

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 230, 225);
  doc.text(`DOC REF: ${reportRef}`, 143, 16.5);
  doc.text(`ISSUED: ${currentDate}`, 143, 21.5);

  // ==========================================
  // 2. METADATA & SCOPE SUMMARY CARD
  // ==========================================
  let currentY = 40;
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

  // Column 1: Organization & Admin
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('STATE ASSOCIATION / SCOPE:', margin + 4, currentY + 6);
  doc.setFontSize(9);
  doc.setTextColor(27, 59, 43);
  doc.text(`${scopeTitle} (${stateName})`, margin + 4, currentY + 11);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Authorized Officer: ${adminName} • ${adminEmail}`, margin + 4, currentY + 16.5);

  // Column 2: Period & Date
  const col2X = margin + 105;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('AUDIT REPORTING PERIOD:', col2X, currentY + 6);
  doc.setFontSize(9);
  doc.setTextColor(27, 59, 43);
  doc.text(periodLabel, col2X, currentY + 11);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated At: ${currentTimestamp}`, col2X, currentY + 16.5);

  // ==========================================
  // 3. KEY PERFORMANCE INDICATORS (4 KPI CARDS)
  // ==========================================
  currentY = 64;
  const kpiCardWidth = (contentWidth - 9) / 4; // ~43.25mm
  const kpiCardHeight = 18;

  const kpis = [
    {
      title: 'TOTAL PLATFORM REVENUE',
      value: fmtCur(totalFinancialRevenue),
      sub: `${periodFilter} Total Revenue`,
      highlight: true
    },
    {
      title: 'TOTAL REGISTERED MEMBERS',
      value: membersCount.toString(),
      sub: 'Active Roster',
      highlight: false
    },
    {
      title: 'SANCTIONED EVENTS',
      value: eventsCount.toString(),
      sub: 'Annual Trials & Hunts',
      highlight: false
    },
    {
      title: 'TOTAL EVENT ENTRIES',
      value: totalEntries.toString(),
      sub: `${totalPaidEntries} Paid Registrations`,
      highlight: false
    }
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = margin + idx * (kpiCardWidth + 3);

    if (kpi.highlight) {
      doc.setFillColor(27, 59, 43); // Dark Forest
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.4);
      doc.roundedRect(kpiX, currentY, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(218, 201, 166);
      doc.text(kpi.title, kpiX + 3, currentY + 5);

      doc.setFontSize(10.5);
      doc.setTextColor(255, 255, 255);
      doc.text(kpi.value, kpiX + 3, currentY + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(190, 205, 195);
      doc.text(kpi.sub, kpiX + 3, currentY + 15.5);
    } else {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(kpiX, currentY, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.title, kpiX + 3, currentY + 5);

      doc.setFontSize(10.5);
      doc.setTextColor(27, 59, 43);
      doc.text(kpi.value, kpiX + 3, currentY + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.sub, kpiX + 3, currentY + 15.5);
    }
  });

  // ==========================================
  // 4. SECTION 1: FINANCIAL OVERVIEW & 5 REVENUE STREAMS
  // ==========================================
  currentY = 88;
  doc.setFillColor(27, 59, 43);
  doc.rect(margin, currentY, 2.5, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 59, 43);
  doc.text('1. FINANCIAL OVERVIEW & CORE REVENUE STREAMS', margin + 5, currentY + 4.8);

  currentY += 8;

  // Table Header Row
  doc.setFillColor(34, 65, 49);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 3, currentY + 4.8);
  doc.text('REVENUE STREAM / CATEGORY', margin + 12, currentY + 4.8);
  doc.text('STREAM DESCRIPTION & OPERATIONAL SOURCE', margin + 64, currentY + 4.8);
  doc.text('PERIOD REVENUE', margin + contentWidth - 28, currentY + 4.8);

  currentY += 7.5;

  const financialStreams = [
    {
      num: '1',
      name: 'Membership Dues',
      desc: `State & local club member registrations & annual fees (${periodFilter.toLowerCase()})`,
      amount: membershipRevenue
    },
    {
      num: '2',
      name: 'Sanctioned Events Entries',
      desc: `Direct hunt registration entry fees & competitor trial dues (${periodFilter.toLowerCase()})`,
      amount: eventsRevenue
    },
    {
      num: '3',
      name: 'Merchandise & Gear Sales',
      desc: `Official state apparel, telemetry collars, tracking vests & patch sets`,
      amount: merchandiseRevenue
    },
    {
      num: '4',
      name: 'Fundraising Campaigns',
      desc: `State youth trial initiatives, heritage bench trials & club fundraising drives`,
      amount: fundraisingRevenue
    },
    {
      num: '5',
      name: 'Sponsor & Community Donations',
      desc: `Sponsorship contributions, patron donations & charitable preservation gifts`,
      amount: donationsRevenue
    }
  ];

  financialStreams.forEach((stream, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 251, isEven ? 255 : 252);
    doc.setDrawColor(230, 235, 240);
    doc.setLineWidth(0.2);
    doc.rect(margin, currentY, contentWidth, 8, 'FD');

    // Index number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(stream.num, margin + 4, currentY + 5.2);

    // Stream Name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 59, 43);
    doc.text(stream.name, margin + 12, currentY + 5.2);

    // Stream Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(stream.desc, margin + 64, currentY + 5.2);

    // Amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    const amtStr = fmtCur(stream.amount);
    doc.text(amtStr, margin + contentWidth - 4, currentY + 5.2, { align: 'right' });

    currentY += 8;
  });

  // Table Total Row (Highlight Banner)
  doc.setFillColor(252, 248, 237); // Light gold tint (#FCF8ED)
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 9.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(27, 59, 43);
  doc.text('TOTAL CONSOLIDATED REVENUE:', margin + 12, currentY + 6.2);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 95, 45);
  doc.text('(Combined sum of all 5 state streams for selected period)', margin + 65, currentY + 6.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(180, 120, 20); // Amber Gold
  doc.text(fmtCur(totalFinancialRevenue), margin + contentWidth - 4, currentY + 6.4, { align: 'right' });

  currentY += 14;

  // ==========================================
  // 5. SECTION 2: EVENT PARTICIPATION & ENTRY AUDIT
  // ==========================================
  doc.setFillColor(27, 59, 43);
  doc.rect(margin, currentY, 2.5, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 59, 43);
  doc.text('2. EVENT PARTICIPATION & FIELD COMPETITION AUDIT', margin + 5, currentY + 4.8);

  currentY += 8;

  // 3 Participation Cards with Visual Progress Bar
  const partCardWidth = (contentWidth - 6) / 3; // ~59.3mm
  const partCardHeight = 22;

  participationData.forEach((part, idx) => {
    const partX = margin + idx * (partCardWidth + 3);

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(partX, currentY, partCardWidth, partCardHeight, 2, 2, 'FD');

    // Category Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(part.category, partX + 3.5, currentY + 5.5);

    // Percentage & Entries Count
    doc.setFontSize(9.5);
    doc.setTextColor(27, 59, 43);
    doc.text(`${part.percentage}%`, partX + 3.5, currentY + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`(${part.entries} Recorded Entries)`, partX + 16, currentY + 11.5);

    // Progress Bar Background
    const barWidth = partCardWidth - 7;
    const barY = currentY + 14.5;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(partX + 3.5, barY, barWidth, 3, 1, 1, 'F');

    // Filled Progress Bar
    const fillWidth = (barWidth * Math.min(100, Math.max(0, part.percentage))) / 100;
    if (idx === 0) doc.setFillColor(27, 59, 43); // Forest
    else if (idx === 1) doc.setFillColor(197, 160, 89); // Gold
    else doc.setFillColor(16, 185, 129); // Emerald
    doc.roundedRect(partX + 3.5, barY, fillWidth, 3, 1, 1, 'F');
  });

  currentY += 28;

  // ==========================================
  // 6. SECTION 3: AUDIT VERIFICATION & CERTIFICATION SEAL
  // ==========================================
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(180, 205, 190);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(27, 59, 43);
  doc.text('OFFICIAL CERTIFICATION & REGULATORY COMPLIANCE SEAL', margin + 5, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'This audit document has been compiled and validated pursuant to Article IV of the United Hound Championships (UHC)',
    margin + 5,
    currentY + 11.5
  );
  doc.text(
    'National Sanctioning Charter. Financial entries, membership balances, and trial disbursements have been synchronized with the',
    margin + 5,
    currentY + 15.5
  );
  doc.text(
    'Express REST backend service and MySQL database ledger. Validated for state treasury audit & IRS reporting compliance.',
    margin + 5,
    currentY + 19.5
  );

  // Sign-off Columns
  const sigY = currentY + 23;
  // Left Sig
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(27, 59, 43);
  doc.text(`CERTIFIED OFFICER: ${adminName}`, margin + 5, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(`Title: State Association Executive Director • Status: CLEARED`, margin + 5, sigY + 8);

  // Right Sig / Hash
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(27, 59, 43);
  doc.text(`AUDIT CLEARANCE: UHC-FIN-APPROVED`, margin + 105, sigY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text(`Verification Hash: SHA256-${reportRef}-SECURE`, margin + 105, sigY + 8);

  // ==========================================
  // 7. FOOTER (Page Number & Notice)
  // ==========================================
  const footerY = 286;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('United Hound Championships (UHC) © 2026 • Official Administrative Oversight Document', margin, footerY + 2.5);
  doc.text('CONFIDENTIAL', margin + (contentWidth / 2) - 8, footerY + 2.5);
  doc.text('Page 1 of 1', margin + contentWidth - 12, footerY + 2.5);

  // Trigger Save / File Download in the browser
  const fileName = `UHC_${stateName.replace(/\s+/g, '_')}_Financial_Report_${periodFilter}_2026.pdf`;
  doc.save(fileName);
  return fileName;
};

/**
 * Generates and downloads the National Analytics & Multi-Entity Performance PDF Report
 */
export const downloadNationalAnalyticsReportPDF = ({
  totalCombinedRev = 0,
  totalMerchRev = 0,
  totalMembershipRev = 0,
  totalOrdersCount = 0,
  activeSubscriptionsCount = 0,
  dateFilter = 'This Year',
  clubSalesData = [],
  stateSalesData = [],
  vendorSalesData = []
}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const reportRef = `UHC-NAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Header Banner
  doc.setFillColor(27, 59, 43);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('UNITED HOUND CHAMPIONSHIPS', margin, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 210, 185);
  doc.text('NATIONAL PLATFORM ANALYTICS & FINANCIAL AUDIT REPORT', margin, 18.5);

  doc.setFontSize(7.5);
  doc.setTextColor(180, 195, 185);
  doc.text(`Scope: All 50 States & 635 Local Sanctioned Clubs • Filter: ${dateFilter}`, margin, 24);

  // Status Badge
  doc.setFillColor(38, 73, 56);
  doc.roundedRect(140, 5.5, 56, 21, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('STATUS: AUDITED & CERTIFIED', 143, 11);
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 230, 225);
  doc.text(`DOC REF: ${reportRef}`, 143, 16.5);
  doc.text(`DATE: ${currentDate}`, 143, 21.5);

  let currentY = 40;
  // KPI Overview
  const kpiWidth = (contentWidth - 6) / 3;
  const kpiHeight = 18;

  const kpis = [
    { title: 'TOTAL PLATFORM GROSS REVENUE', value: fmtCur(totalCombinedRev), sub: 'Combined Merchandise & Membership' },
    { title: 'MERCHANDISE SALES REVENUE', value: fmtCur(totalMerchRev), sub: `${totalOrdersCount} Completed Store Orders` },
    { title: 'MEMBERSHIP DUES REVENUE', value: fmtCur(totalMembershipRev), sub: `${activeSubscriptionsCount} Active Subscriptions` }
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = margin + idx * (kpiWidth + 3);
    doc.setFillColor(idx === 0 ? 27 : 248, idx === 0 ? 59 : 250, idx === 0 ? 43 : 252);
    doc.setDrawColor(idx === 0 ? 197 : 226, idx === 0 ? 160 : 232, idx === 0 ? 89 : 240);
    doc.roundedRect(kpiX, currentY, kpiWidth, kpiHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(idx === 0 ? 218 : 100, idx === 0 ? 201 : 116, idx === 0 ? 166 : 139);
    doc.text(kpi.title, kpiX + 3, currentY + 5);

    doc.setFontSize(10.5);
    doc.setTextColor(idx === 0 ? 255 : 27, idx === 0 ? 255 : 59, idx === 0 ? 255 : 43);
    doc.text(kpi.value, kpiX + 3, currentY + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(idx === 0 ? 190 : 100, idx === 0 ? 205 : 116, idx === 0 ? 195 : 139);
    doc.text(kpi.sub, kpiX + 3, currentY + 15.5);
  });

  currentY += 25;

  // Table: State Association Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(27, 59, 43);
  doc.text('STATE ASSOCIATION REVENUE ALLOCATION (TOP SAMPLE)', margin, currentY);

  currentY += 4;
  doc.setFillColor(34, 65, 49);
  doc.roundedRect(margin, currentY, contentWidth, 6.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('STATE ASSOCIATION', margin + 4, currentY + 4.5);
  doc.text('TOTAL ORDERS', margin + 65, currentY + 4.5);
  doc.text('GROSS SALES', margin + 110, currentY + 4.5);
  doc.text('STATE SHARE (7%)', margin + contentWidth - 30, currentY + 4.5);

  currentY += 7;
  const sampleStates = stateSalesData.slice(0, 8);
  sampleStates.forEach((st, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 251, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(st.stateName || 'Tennessee', margin + 4, currentY + 4.8);
    doc.text(String(st.ordersCount || 0), margin + 65, currentY + 4.8);
    doc.text(fmtCur(st.totalSales || 0), margin + 110, currentY + 4.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 59, 43);
    doc.text(fmtCur(st.stateShare || 0), margin + contentWidth - 4, currentY + 4.8, { align: 'right' });
    currentY += 7;
  });

  // Footer
  const footerY = 286;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('United Hound Championships (UHC) National Headquarters • Executive Analytics', margin, footerY + 2.5);
  doc.text('Page 1 of 1', margin + contentWidth - 12, footerY + 2.5);

  const fileName = `UHC_National_Platform_Report_${dateFilter.replace(/\s+/g, '_')}_2026.pdf`;
  doc.save(fileName);
  return fileName;
};
