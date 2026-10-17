import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Newspaper, Calendar, User, Filter, Search, ArrowRight, X, ArrowUpRight, ShieldCheck, Layers } from 'lucide-react';

export const PublicNewsPage = () => {
  const { news } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  const filteredNews = news.filter((item) => {
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'NATIONAL' && (item.level === 'NATIONAL' || item.isPromotedToNational || item.category?.includes('National'))) ||
      (selectedFilter === 'STATE' && (item.level === 'STATE' || item.category?.includes('State') || item.state)) ||
      (selectedFilter === 'LOCAL' && (item.level === 'LOCAL' || item.category?.includes('Club')));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.state && item.state.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-forest-950 text-white rounded-3xl p-8 lg:p-12 border border-forest-800 shadow-2xl space-y-6">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            State & National News Directory
          </span>
          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold text-tan-300 bg-forest-900 border border-forest-700">
            Hierarchy: Local News → State News → National News
          </span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
          News & Announcements
        </h1>
        <p className="text-xs sm:text-sm text-tan-200 max-w-2xl font-medium leading-relaxed">
          Stay updated with dedicated State Association News Feeds, local club accomplishments, state trial guidelines, and articles promoted to the National UHC News Feed.
        </p>

        {/* Toolbar & Hierarchy Level Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-forest-800">
          <div className="flex flex-wrap items-center gap-1.5 bg-forest-900 p-1.5 rounded-2xl border border-forest-800">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'ALL' ? 'bg-tan-500 text-forest-950 shadow-md' : 'text-tan-200 hover:text-white'
              }`}
            >
              All News Feeds
            </button>
            <button
              onClick={() => setSelectedFilter('LOCAL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'LOCAL' ? 'bg-tan-500 text-forest-950 shadow-md' : 'text-tan-200 hover:text-white'
              }`}
            >
              Local News
            </button>
            <button
              onClick={() => setSelectedFilter('STATE')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'STATE' ? 'bg-tan-500 text-forest-950 shadow-md' : 'text-tan-200 hover:text-white'
              }`}
            >
              State News
            </button>
            <button
              onClick={() => setSelectedFilter('NATIONAL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === 'NATIONAL' ? 'bg-tan-500 text-forest-950 shadow-md' : 'text-tan-200 hover:text-white'
              }`}
            >
              National Feed
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news title, state, author..."
              className="w-full pl-10 pr-3 py-2.5 text-xs bg-surface-lowest text-charcoal border border-surface-border rounded-xl font-semibold focus:outline-none focus:border-tan-500"
            />
          </div>
        </div>
      </div>

      {/* 8 SUPPORTED STATE NEWS CATEGORIES BAR */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-surface-border shadow-ambient space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-forest-950">
          <span>Filter by State News Category:</span>
          {selectedCategory !== 'ALL' && (
            <button onClick={() => setSelectedCategory('ALL')} className="text-tan-800 font-bold hover:underline">
              Clear Category
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold ${
              selectedCategory === 'ALL' ? 'bg-forest-950 text-white' : 'bg-surface-low text-charcoal'
            }`}
          >
            All Categories
          </button>
          {stateNewsCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                selectedCategory === cat ? 'bg-tan-500 text-forest-950' : 'bg-surface-low text-charcoal hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="group bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:border-tan-500/60 transition-all duration-300"
          >
            <div className="space-y-4">
              {item.image && (
                <div className="relative h-48 overflow-hidden bg-forest-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-forest-950/90 text-tan-300 backdrop-blur-md border border-forest-800">
                      {item.category}
                    </span>
                    {item.isPromotedToNational && (
                      <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-900/90 text-white backdrop-blur-md border border-emerald-500 flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" /> Promoted to National
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-tan-800 font-bold">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                  <span className="text-forest-950 font-black">{item.state || 'National HQ'}</span>
                </div>

                <h3 className="font-black text-lg text-forest-950 group-hover:text-tan-700 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed font-medium line-clamp-3">
                  {item.summary}
                </p>

                {/* News Progression Indicator */}
                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[10px] font-black uppercase text-charcoal-muted">
                  <span>Origin: {item.level || 'STATE'} News</span>
                  <span className="text-forest-950 font-bold">
                    {item.isPromotedToNational ? 'Promoted → National Feed' : 'State News Feed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setSelectedArticle(item)}
                className="w-full py-2.5 bg-surface-low hover:bg-forest-900 text-forest-950 hover:text-white font-black text-xs rounded-xl border border-surface-border transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md">
          <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-2xl w-full overflow-hidden space-y-6 p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.isPromotedToNational && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ★ Promoted to National UHC News Feed
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black text-forest-950 mt-1">{selectedArticle.title}</h3>
                <div className="text-xs text-charcoal-muted mt-0.5">
                  {selectedArticle.date} • Published by {selectedArticle.author} ({selectedArticle.state || 'National HQ'})
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-charcoal-muted hover:text-charcoal rounded-xl bg-surface-low"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedArticle.image && (
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-56 object-cover rounded-2xl" />
            )}

            <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <div className="text-xs text-tan-800 font-bold flex items-center gap-1">
                <Layers className="w-4 h-4 text-tan-600" />
                <span>Hierarchy: Local News → State News → National News</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-forest-900 text-white font-black text-xs rounded-xl shadow"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
