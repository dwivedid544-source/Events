import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Users, Calendar, ArrowRight, ShoppingBag } from 'lucide-react';

export const FindClubPage = () => {
  const { clubs, states, products, addToCart, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredClubs = clubs.filter((c) => {
    if (selectedState !== 'ALL' && c.state !== selectedState && c.stateCode !== selectedState) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || (c.zip || '').includes(q);
  });

  const localClubProducts = products.filter((p) => p.scopeChannel === 'LOCAL_CLUB').slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-forest-800 text-white rounded-xl p-6 lg:p-8 shadow-ambient flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-tan-500 text-forest-900 text-xs font-black uppercase">Club Directory</span>
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight mt-2">Find Local Hunting Clubs</h1>
          <p className="text-xs lg:text-sm text-tan-200 mt-1">Discover over 635 registered local clubs across 50 state associations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-lowest rounded-xl border border-surface-border p-4 shadow-ambient grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by club name, city, or ZIP code..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-low border border-surface-border rounded-md focus:outline-none focus:border-forest-800"
          />
        </div>
        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-surface-low border border-surface-border rounded-md focus:outline-none focus:border-forest-800 font-medium"
          >
            <option value="ALL">All 50 States</option>
            {states.map((s) => (
              <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Club Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClubs.map((club) => (
          <div key={club.id} className="bg-surface-lowest rounded-xl border border-surface-border p-6 shadow-ambient flex flex-col justify-between hover:shadow-ambient-lg transition-all space-y-4">
            <div className="flex items-start gap-4">
              <img src={club.logo} alt={club.name} className="w-16 h-16 rounded-xl object-cover border border-surface-border" />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-tan-700">{club.state} • ZIP {club.zip}</span>
                <h3 className="font-extrabold text-lg text-charcoal">{club.name}</h3>
                <div className="text-xs text-charcoal-light flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-tan-500" />
                  <span>{club.city}, {club.state}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 bg-surface-low rounded-lg text-center border text-xs">
              <div><strong className="block text-forest-800 text-sm">{club.membersCount}</strong><span className="text-[10px] text-charcoal-light uppercase">Members</span></div>
              <div><strong className="block text-forest-800 text-sm">{club.eventsCount}</strong><span className="text-[10px] text-charcoal-light uppercase">Events/Yr</span></div>
              <div><strong className="block text-forest-800 text-sm">{club.estYear}</strong><span className="text-[10px] text-charcoal-light uppercase">Established</span></div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to={`/clubs/${club.id}`}
                className="px-4 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs shadow flex items-center gap-1.5"
              >
                <span>Visit Club Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/join"
                className="px-3 py-2 rounded-lg bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs"
              >
                Join Club
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ─── LOCAL CLUB STORE PRODUCTS SECTION ─── */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
              🏕️ Local Club Store
            </span>
            <h2 className="text-2xl font-black text-charcoal mt-2">Local Club Merchandise</h2>
            <p className="text-xs text-charcoal-muted mt-1">Buy from your local club — 100% of the profits go directly back to fund local hunts & events.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {localClubProducts.map((product) => (
            <div key={product.id} className="bg-surface-lowest rounded-2xl border border-surface-border shadow-ambient overflow-hidden group hover:shadow-xl hover:border-tan-500/50 transition-all duration-300 flex flex-col">
              <div className="relative overflow-hidden h-40 bg-surface-low">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-forest-950/80 text-tan-300 text-[9px] font-black uppercase backdrop-blur-sm">
                  {product.category}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-tan-500/90 text-forest-950 text-[9px] font-black uppercase">
                  Local Club
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="font-black text-sm text-charcoal leading-snug line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] text-charcoal-muted mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-surface-border">
                  <span className="text-lg font-black text-forest-800">${product.price.toLocaleString()}</span>
                  <button
                    onClick={() => { addToCart(product, 1); showToast(`${product.name} added to cart!`, 'success'); }}
                    className="px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-[10px] font-black flex items-center gap-1 transition-all"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
