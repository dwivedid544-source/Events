import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Newspaper,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  Globe,
  CheckCircle2,
  Share2,
  Sparkles,
  Layers,
  ChevronRight,
  Tag
} from 'lucide-react';

export const NewsFlowPage = () => {
  const {
    news = [],
    postLocalClubNews,
    promoteNewsToState,
    promoteNewsToNational,
    showToast
  } = useApp();

  const [newsTitle, setNewsTitle] = useState('Houston County Youth Cast Training Day & Field Demonstration');
  const [newsClub, setNewsClub] = useState('Houston County Coon Hunters Association');
  const [newsSummary, setNewsSummary] = useState(
    'Houston County Coon Hunters Association hosted over 40 youth handlers for a full-day seminar on dog handling, GPS tracking collar safety, and night cast rules.'
  );

  const handleCreateClubNews = (e) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;

    postLocalClubNews({
      title: newsTitle,
      club: newsClub,
      state: 'Texas',
      stateId: 'texas',
      stateCode: 'TX',
      author: 'Club Secretary Marcus Vance',
      summary: newsSummary,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80'
    });

    setNewsTitle('');
    setNewsSummary('');
  };

  // Group news by stage in the News Flow: Local Club -> State Association -> National UHC
  const localClubStories = news.filter((n) => !n.isPromotedToState && !n.isPromotedToNational);
  const stateStories = news.filter((n) => n.isPromotedToState && !n.isPromotedToNational);
  const nationalStories = news.filter((n) => n.isPromotedToNational);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-tan-500/40 shadow-2xl space-y-4">
        <div className="space-y-2 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
            News Flow System
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Local Club → State Association → National UHC News Flow
          </h1>
          <p className="text-xs sm:text-sm text-tan-200 font-medium leading-relaxed">
            Engineered hierarchical news promotion pipeline. Local Clubs post important news, State Associations promote local stories to the state feed, and National UHC promotes selected stories nationally.
          </p>
        </div>
      </div>

      {/* 3-STAGE NEWS FLOW VISUAL PIPELINE */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-forest-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-tan-600" />
            <span>3-Stage Promotion Pipeline (Local Club → State Association → National UHC)</span>
          </h2>
          <span className="px-3 py-1 bg-tan-100 text-tan-900 border border-tan-300 font-black text-[10px] rounded-full uppercase">
            Hierarchical Curation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1: Local Club */}
          <div className="p-6 rounded-2xl bg-surface-low border-2 border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-700 text-white">
                  Stage 1: Local Club
                </span>
                <Building2 className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-black text-forest-950">1. Local Clubs Post News</h3>
              <p className="text-xs text-charcoal-muted font-medium">
                Local Clubs create and publish important news directly to their local club page.
              </p>
            </div>
            <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border text-xs text-emerald-900 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Visible on Local Club Page</span>
            </div>
          </div>

          {/* Stage 2: State Association */}
          <div className="p-6 rounded-2xl bg-surface-low border-2 border-amber-500/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-700 text-white">
                  Stage 2: State Association
                </span>
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-black text-amber-950">2. State Promotes Club News</h3>
              <p className="text-xs text-charcoal-muted font-medium">
                State Associations review member club articles and promote worthy stories to the statewide feed.
              </p>
            </div>
            <div className="p-3 bg-surface-lowest rounded-xl border border-surface-border text-xs text-amber-900 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Visible on State News Portal</span>
            </div>
          </div>

          {/* Stage 3: National UHC */}
          <div className="p-6 rounded-2xl bg-forest-950 text-white border-2 border-tan-500 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-tan-500 text-forest-950">
                  Stage 3: National UHC
                </span>
                <Globe className="w-5 h-5 text-tan-400" />
              </div>
              <h3 className="text-base font-black text-white">3. National Promotes Stories</h3>
              <p className="text-xs text-tan-200 font-medium">
                National UHC administrators promote selected high-impact stories across the national homepage and UHC feeds.
              </p>
            </div>
            <div className="p-3 bg-forest-900 rounded-xl border border-forest-800 text-xs text-tan-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Visible on National UHC Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* POST LOCAL CLUB NEWS FORM */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-5">
        <div className="border-b border-surface-border pb-3">
          <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
            <Plus className="w-5 h-5 text-tan-600" />
            <span>1. Local Club Posts Important News</span>
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Create an article under a chartered Local Club chapter to enter the promotion flow.
          </p>
        </div>

        <form onSubmit={handleCreateClubNews} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-forest-950 mb-1">Article Headline *</label>
              <input
                type="text"
                required
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="e.g. Houston County Youth Hunt Demonstration"
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-black text-forest-950 mb-1">Local Club Chapter *</label>
              <select
                value={newsClub}
                onChange={(e) => setNewsClub(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-bold"
              >
                <option value="Houston County Coon Hunters Association">Houston County Coon Hunters Association (TX)</option>
                <option value="Oak Ridge Hunting Club">Oak Ridge Hunting Club (TN)</option>
                <option value="Lone Star Hound Club">Lone Star Hound Club (TX)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-black text-forest-950 mb-1">Story Summary & Content *</label>
            <textarea
              rows="3"
              required
              value={newsSummary}
              onChange={(e) => setNewsSummary(e.target.value)}
              placeholder="Enter article summary..."
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-xl font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-tan-500 hover:bg-tan-400 text-forest-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-2"
          >
            <Newspaper className="w-4 h-4" />
            <span>Post Local Club News</span>
          </button>
        </form>
      </div>

      {/* LIVE INTERACTIVE 3-TIER NEWS PROMOTION MANAGER */}
      <div className="bg-surface-lowest p-6 sm:p-8 rounded-3xl border border-surface-border shadow-ambient space-y-6">
        <div className="border-b border-surface-border pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tan-600" />
              <span>Interactive News Flow Manager: Promote Stories Upward</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Click the promotion buttons below to move stories from Local Club → State Association → National UHC.
            </p>
          </div>
          <span className="text-xs text-forest-950 font-black">{news.length} Total Stories</span>
        </div>

        <div className="space-y-4">
          {news.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface-low border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-tan-500/50 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-forest-950">{item.title}</span>

                  {/* Flow Stage Badges */}
                  {item.isPromotedToNational ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-forest-950 text-tan-300 border border-tan-500/50 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-tan-400" />
                      <span>Stage 3: National UHC Live</span>
                    </span>
                  ) : item.isPromotedToState ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-700" />
                      <span>Stage 2: State Association Live</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-700" />
                      <span>Stage 1: Local Club Live</span>
                    </span>
                  )}
                </div>

                <p className="text-charcoal-muted line-clamp-2 text-[11px]">{item.summary}</p>
                <div className="text-[10px] text-charcoal-light flex items-center gap-2 font-mono">
                  <span>{item.club || 'Houston County Coon Hunters'}</span>
                  <span>•</span>
                  <span>{item.state || 'Texas'}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>

              {/* ACTION PROMOTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* 2. State Association can promote Local Club news */}
                <button
                  onClick={() => promoteNewsToState(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    item.isPromotedToState
                      ? 'bg-amber-700 text-white shadow'
                      : 'bg-surface-lowest border border-surface-border text-amber-900 hover:bg-amber-50'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.isPromotedToState ? '✓ Promoted to State' : '2. Promote to State'}</span>
                </button>

                {/* 3. National UHC can promote selected stories nationally */}
                <button
                  onClick={() => promoteNewsToNational(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    item.isPromotedToNational
                      ? 'bg-forest-950 text-tan-300 border border-tan-500 shadow'
                      : 'bg-surface-lowest border border-surface-border text-forest-950 hover:bg-forest-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{item.isPromotedToNational ? '✓ Promoted Nationally' : '3. Promote Nationally'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
