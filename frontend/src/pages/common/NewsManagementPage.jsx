import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Newspaper, Plus, Tag, Calendar, User, Eye, ArrowUpRight, Share2, Layers, CheckCircle2 } from 'lucide-react';

export const NewsManagementPage = () => {
  const { news = [], addNews, promoteNewsToNational, states, showToast } = useApp();
  const myState = states[0] || { name: 'Texas', code: 'TX' };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');

  // Exact 8 Client Required State News Feed Categories
  const stateNewsCategories = [
    'State Hunt announcements',
    'Championship results',
    'Officer announcements',
    'Youth events',
    'Meeting notices',
    'Rule discussions',
    'Club accomplishments',
    'Member recognition'
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: stateNewsCategories[0],
    level: 'STATE',
    state: myState.name,
    author: `${myState.name} State Board`,
    summary: '',
    isPromotedToNational: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      if (showToast) showToast('Please enter an Article Title.', 'error');
      return;
    }

    if (addNews) {
      addNews({
        ...formData,
        state: myState.name,
        stateId: myState.id || 'texas',
        stateCode: myState.code || 'TX'
      });
    }

    setSelectedFilterCategory('ALL'); // Reset filter tab so newly added article is immediately visible!
    setModalOpen(false);
    if (showToast) showToast(`State News Article "${formData.title}" published successfully!`, 'success');

    setFormData({
      title: '',
      category: stateNewsCategories[0],
      level: 'STATE',
      state: myState.name,
      author: `${myState.name} State Board`,
      summary: '',
      isPromotedToNational: false
    });
  };

  // Filter news for current state management
  const stateNewsList = news.filter(
    (n) => n.state === myState.name || n.stateCode === myState.code || n.level === 'STATE' || n.level === 'LOCAL'
  );

  const displayNews = stateNewsList.filter((item) => {
    if (selectedFilterCategory === 'ALL') return true;
    if (selectedFilterCategory === 'PROMOTED') return item.isPromotedToNational;
    return item.category === selectedFilterCategory;
  });

  const columns = [
    {
      header: 'Article Title & Excerpt',
      accessor: 'title',
      render: (r) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-forest-950 text-xs sm:text-sm">{r.title}</span>
            {r.isPromotedToNational && (
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3 text-emerald-700" />
                <span>Promoted to National</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-charcoal-muted line-clamp-1">{r.summary}</p>
        </div>
      )
    },
    {
      header: 'State News Category',
      accessor: 'category',
      render: (r) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300">
          {r.category || 'State Hunt announcements'}
        </span>
      )
    },
    {
      header: 'News Hierarchy Level',
      accessor: 'level',
      render: (r) => (
        <div className="flex items-center gap-1 text-[10px] font-black uppercase">
          <span className={`px-2 py-0.5 rounded ${
            r.level === 'LOCAL'
              ? 'bg-blue-100 text-blue-900 border border-blue-300'
              : r.level === 'STATE'
              ? 'bg-forest-900 text-tan-300'
              : 'bg-purple-100 text-purple-900 border border-purple-300'
          }`}>
            {r.level === 'LOCAL' ? 'Local News' : r.level === 'STATE' ? 'State News' : 'National News'}
          </span>
          <span className="text-charcoal-muted">→</span>
          <span className="text-forest-900 font-extrabold">{r.isPromotedToNational ? 'National Feed' : 'State Feed'}</span>
        </div>
      )
    },
    {
      header: 'Author / Board',
      accessor: 'author',
      render: (r) => <span className="text-xs text-charcoal font-medium">{r.author}</span>
    },
    {
      header: 'Published Date',
      accessor: 'date',
      render: (r) => <span className="text-xs text-charcoal-muted">{r.date}</span>
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (r) => (
        <div className="flex items-center gap-2">
          {/* REQUIREMENT 4: PROMOTE TO NATIONAL UHC NEWS FEED */}
          <button
            onClick={() => promoteNewsToNational(r.id)}
            className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all flex items-center gap-1 shadow cursor-pointer ${
              r.isPromotedToNational
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-tan-500 hover:bg-tan-400 text-forest-950'
            }`}
            title={r.isPromotedToNational ? 'Promoted to National Feed' : 'Promote to National UHC News Feed'}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{r.isPromotedToNational ? 'Promoted to National' : 'Promote to National'}</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-8 border border-forest-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-tan-500 text-forest-950 text-[10px] font-black uppercase tracking-wider">
              State News Control Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-forest-900 text-tan-300 text-[10px] font-bold uppercase border border-forest-700">
              {myState.name} State News Feed
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            State Association News System
          </h1>

          <p className="text-xs text-tan-200">
            Publish and manage official news bulletins for the {myState.name} State News Feed, and promote important articles to the National UHC News Feed.
          </p>

          <div className="pt-2 text-xs font-bold text-tan-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-tan-400" />
            <span>News Flow Structure: <strong>Local News → State News → National News</strong></span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish State News Article</span>
        </button>
      </div>

      {/* 8 CATEGORIES QUICK FILTER BAR */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-tan-600" />
            <span>Filter State News by Supported Category (8 Categories):</span>
          </span>
          {selectedFilterCategory !== 'ALL' && (
            <button
              onClick={() => setSelectedFilterCategory('ALL')}
              className="text-xs text-tan-800 font-bold hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilterCategory === 'ALL'
                ? 'bg-forest-950 text-tan-300 shadow'
                : 'bg-surface-low text-charcoal hover:bg-surface-container'
            }`}
          >
            All State News ({stateNewsList.length})
          </button>

          <button
            onClick={() => setSelectedFilterCategory('PROMOTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilterCategory === 'PROMOTED'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Promoted to National ({stateNewsList.filter((n) => n.isPromotedToNational).length})
          </button>

          {stateNewsCategories.map((cat) => {
            const count = stateNewsList.filter((n) => n.category === cat).length;
            const isSelected = selectedFilterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-tan-500 text-forest-950 shadow'
                    : 'bg-surface-low text-charcoal hover:bg-surface-container border border-surface-border'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && <span className="ml-1 text-[10px] opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATE NEWS TABLE */}
      <div className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-3 gap-3">
          <div>
            <h3 className="font-extrabold text-base text-forest-950">
              {myState.name} State News Control Feed ({displayNews.length} Displayed)
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Articles published to the {myState.name} State News Feed and promoted national articles.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={displayNews}
          searchPlaceholder="Search state news by title, category, author..."
          filterField="category"
          filterOptions={stateNewsCategories}
        />
      </div>

      {/* PUBLISH STATE NEWS MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Publish to ${myState.name} State News Feed`}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-extrabold text-forest-950 mb-1">
              Article Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Texas State Autumn Championship Nite Hunt Announced"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
            />
          </div>

          <div>
            <label className="block font-extrabold text-forest-950 mb-1">
              Supported State News Category (Select 1 of 8) <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
            >
              {stateNewsCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-extrabold text-forest-950 mb-1">
              News Level Hierarchy <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
            >
              <option value="STATE">State News (State Association Feed)</option>
              <option value="LOCAL">Local News (Submitted by Local Chartered Club)</option>
              <option value="NATIONAL">National News (Direct UHC HQ Broadcast)</option>
            </select>
            <p className="text-[10px] text-charcoal-muted mt-1">Hierarchy progression: Local News → State News → National News</p>
          </div>

          <div>
            <label className="block font-extrabold text-forest-950 mb-1">Author / State Board Officer</label>
            <input
              type="text"
              placeholder={`e.g. ${myState.name} State Board of Directors`}
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
            />
          </div>

          <div>
            <label className="block font-extrabold text-forest-950 mb-1">
              Summary / Excerpt Content <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter the full news summary or official announcement details..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold text-xs focus:outline-none focus:border-forest-800"
            />
          </div>

          {/* REQUIREMENT 4: PROMOTE TO NATIONAL CHECKBOX */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-xs text-emerald-950 block">Promote to National UHC News Feed</span>
              <span className="text-[10px] text-emerald-800">Check this box to automatically feature this important state news item on the National UHC News Feed.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isPromotedToNational}
              onChange={(e) => setFormData({ ...formData, isPromotedToNational: e.target.checked })}
              className="w-5 h-5 accent-emerald-700 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-charcoal font-bold hover:bg-surface-low rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow cursor-pointer"
            >
              Publish to {myState.name} State News Feed
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
