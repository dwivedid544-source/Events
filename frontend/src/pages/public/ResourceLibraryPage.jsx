import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  FolderOpen,
  Bookmark,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Layers,
  Calendar,
  Building2,
  DollarSign,
  Users,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
  ExternalLink,
  Edit3
} from 'lucide-react';

export const ResourceLibraryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({});

  const categories = [
    'All',
    'Business & Planning',
    'Financial Management',
    'Club Administration',
    'Meetings & Governance',
    'Event & Hunt Management',
    'Membership',
    'Marketing & Sponsorship',
    'State Association Tools'
  ];

  const resources = [
    {
      id: 'res-1',
      title: 'Monthly Meeting Package Bundle',
      category: 'Meetings & Governance',
      isPublicFree: true,
      downloads: 412,
      format: 'DOCX / Interactive Form',
      description: 'The master monthly package including Meeting Agenda, Previous Minutes, Treasurer Report, Membership Roster, and Upcoming Hunt Planner.',
      items: ['Meeting Agenda Template', 'Previous Minutes Template', 'Treasurer Report Worksheet', 'Membership Report', 'Upcoming Hunt Planner', 'Action Item Sheet'],
      fields: ['Club Name', 'Meeting Date', 'Meeting Location', 'Presiding Officer', 'Treasurer Balance', 'Key Decisions']
    },
    {
      id: 'res-2',
      title: '2027 Annual Club Business & Strategic Plan',
      category: 'Business & Planning',
      isPublicFree: false,
      downloads: 289,
      format: 'Interactive Operating Template',
      description: 'Comprehensive operational roadmap for local clubs. Plan membership targets, revenue goals, sanctioned trials, and conservation projects.',
      fields: ['Club Name', 'Charter Year', 'Target Active Members', 'Projected Annual Revenue', 'Planned Sanctioned Hunts', 'Facility Improvement Goals']
    },
    {
      id: 'res-3',
      title: 'Annual Club Operating Budget & Monthly P&L Worksheet',
      category: 'Financial Management',
      isPublicFree: false,
      downloads: 345,
      format: 'Excel / Online Form',
      description: 'Standardized accounting worksheet for club treasurers. Track entry fee income, merchandise commission splits, facility expenses, and tax records.',
      fields: ['Fiscal Year', 'Starting Cash Balance', 'Projected Membership Revenue', 'Projected Hunt Entry Revenue', 'Facility Upkeep Budget']
    },
    {
      id: 'res-4',
      title: 'Sanctioned Hunt Event Planner & Score Sheet Packet',
      category: 'Event & Hunt Management',
      isPublicFree: true,
      downloads: 580,
      format: 'Printable PDF & Score Form',
      description: 'Official master hunt paperwork packet: Bench show scoresheet, Nite hunt cast scorecard, entry cutoff tracking sheet, and judge assignment roster.',
      fields: ['Event Name', 'Sanctioning Body (UKC/PKC/UHC)', 'Hunt Date', 'Master of Hounds', 'Entry Deadline Time']
    },
    {
      id: 'res-5',
      title: 'Club Officer Duties & Transition Guide',
      category: 'Club Administration',
      isPublicFree: true,
      downloads: 620,
      format: 'PDF Guide',
      description: 'Standard operating manual defining the responsibilities of Club President, Vice President, Secretary, Treasurer, and Master of Hounds.',
      fields: ['Club Charter', 'Effective Term', 'President Name', 'Secretary Name', 'Treasurer Name']
    },
    {
      id: 'res-6',
      title: 'New Member Welcome Letter & Code of Conduct',
      category: 'Membership',
      isPublicFree: true,
      downloads: 490,
      format: 'Customizable DOCX',
      description: 'Official onboarding template for newly registered club members detailing hunting ethics, canine welfare standards, and meeting dates.',
      fields: ['Member Name', 'Club Name', 'State Association', 'Join Date', 'Assigned Mentor']
    },
    {
      id: 'res-7',
      title: 'Corporate Sponsor Pitch Letter & Vendor Request Form',
      category: 'Marketing & Sponsorship',
      isPublicFree: false,
      downloads: 198,
      format: 'Customizable DOCX',
      description: 'Proven sponsorship proposal letter for local businesses to sponsor club hunt trophies, youth casts, and bench show prizes.',
      fields: ['Sponsor Company', 'Club Name', 'Event Name', 'Sponsorship Tier ($)', 'Banner Display Rights']
    },
    {
      id: 'res-8',
      title: 'State Association Charter Annual Compliance Audit',
      category: 'State Association Tools',
      isPublicFree: false,
      downloads: 112,
      format: 'Audit Form',
      description: 'State association regulatory checklist for verifying affiliated local clubs, active bylaws, 7% state merchandise dividend tracking, and championships.',
      fields: ['State Association Name', 'State Code', 'Active Affiliated Clubs Count', 'Total State Members', 'State Championship Date']
    }
  ];

  const filteredResources = resources.filter((r) => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              National UHC Club Management System
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Master Resource Library
            </h1>
            <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
              Standardized operational templates, financial worksheets, governance documents, and sanctioned event paperwork for State Charters and Chartered Local Clubs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                const pkg = resources.find(r => r.id === 'res-1');
                setEditingTemplate(pkg);
              }}
              className="px-5 py-3 rounded-xl bg-tan-500 hover:bg-tan-400 text-forest-950 text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Monthly Meeting Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-lowest p-5 rounded-2xl border border-surface-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search forms, agendas, budgets, worksheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
            <span className="text-xs font-bold text-charcoal-muted shrink-0">Filter:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'bg-surface-low text-charcoal hover:bg-surface-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-surface-lowest rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-low text-forest-900 border border-surface-border">
                  {res.category}
                </span>
                {res.isPublicFree ? (
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Free Download
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-tan-800 bg-tan-50 border border-tan-300 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-tan-600" /> UHC Club Member
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-forest-950">{res.title}</h3>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{res.description}</p>
              </div>

              {res.items && (
                <div className="p-3 rounded-xl bg-surface-low border border-surface-border space-y-1 text-xs">
                  <div className="font-extrabold text-[10px] uppercase text-charcoal-muted">Package Includes:</div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-forest-900">
                    {res.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Action Buttons: USE ONLINE | DOWNLOAD | SAVE TO CLUB */}
            <div className="pt-4 border-t border-surface-border grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEditingTemplate(res)}
                className="py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-tan-400" />
                <span>Use Online</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Downloading official document: "${res.title}". Clean PDF template generated.`)}
                className="py-2 rounded-xl bg-surface-low hover:bg-surface-border text-charcoal font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-surface-border"
              >
                <Download className="w-3.5 h-3.5 text-forest-700" />
                <span>Download</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Document "${res.title}" successfully saved to your Club Management Center records!`)}
                className="py-2 rounded-xl bg-surface-low hover:bg-surface-border text-charcoal font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-surface-border"
              >
                <Bookmark className="w-3.5 h-3.5 text-tan-600" />
                <span>Save to Club</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Online Editable Template Modal ("USE ONLINE") */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-lowest text-charcoal w-full max-w-2xl rounded-3xl shadow-2xl border border-surface-border p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-forest-900 text-tan-300">
                  Interactive Operating Form
                </span>
                <h3 className="text-xl font-black text-forest-950 mt-1">{editingTemplate.title}</h3>
                <p className="text-xs text-charcoal-muted">Fill out this document inside UHC to automatically archive it in your club records.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="text-charcoal-muted hover:text-charcoal font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Template "${editingTemplate.title}" successfully completed and saved into your Club Management Center!`);
                setEditingTemplate(null);
              }}
              className="space-y-4 text-xs"
            >
              {editingTemplate.fields.map((field, idx) => (
                <div key={idx}>
                  <label className="block font-bold text-charcoal mb-1">{field}</label>
                  {field.toLowerCase().includes('goals') || field.toLowerCase().includes('decisions') ? (
                    <textarea
                      rows={3}
                      placeholder={`Enter ${field}...`}
                      className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder={`Enter ${field}...`}
                      className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl focus:outline-none focus:border-forest-800 font-medium"
                    />
                  )}
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-900 space-y-1">
                <strong>Permanent Record Archival:</strong>
                <p className="text-[11px] text-forest-800">
                  This document will be saved directly into your local club dashboard so you can copy and update goals for future years without starting over.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2.5 rounded-xl bg-surface-low text-charcoal font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-extrabold shadow-md transition-all cursor-pointer"
                >
                  Save & Archive to My Club Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibraryPage;

