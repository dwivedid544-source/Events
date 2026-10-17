import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Trophy,
  Save,
  Clock,
  Users,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  Building2,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Loader2
} from 'lucide-react';

export const EventDetailsConfigPage = () => {
  const { events = [], updateEvent, showToast } = useApp();

  const [selectedEventId, setSelectedEventId] = useState(() => {
    return events[0]?.id || 'evt-1';
  });

  const [formData, setFormData] = useState({
    id: 'evt-1',
    name: 'Nite Hunt & Treeing Contest',
    federation: 'UKC (United Kennel Club)',
    sport: 'Coonhounds',
    type: 'Nite Hunt',
    club: 'Oak Ridge Hunting Club',
    clubId: 'club-1',
    state: 'Tennessee',
    stateCode: 'TN',
    city: 'Knoxville',
    date: 'September 19, 2026',
    startTime: '7:00 PM',
    deadline: 'Sep 18, 2026',
    fee: 30,
    entries: 43,
    maxCapacity: 50,
    paidEntries: 39,
    pendingEntries: 4,
    checkedIn: 31,
    status: 'Registration Open',
    address: '1420 Hunting Ridge Rd, Knoxville, TN 37901',
    description: 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds.'
  });

  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize form data whenever the selected event or events list updates
  useEffect(() => {
    if (events.length > 0) {
      const target = events.find((e) => e.id === selectedEventId) || events[0];
      if (target) {
        setFormData({
          id: target.id || 'evt-1',
          name: target.name || 'Nite Hunt & Treeing Contest',
          federation: target.federation || 'UKC (United Kennel Club)',
          sport: target.sport || 'Coonhounds',
          type: target.type || 'Nite Hunt',
          club: target.club || 'Oak Ridge Hunting Club',
          clubId: target.clubId || 'club-1',
          state: target.state || 'Tennessee',
          stateCode: target.stateCode || 'TN',
          city: target.city || 'Knoxville',
          date: target.date || 'September 19, 2026',
          startTime: target.startTime || '7:00 PM',
          deadline: target.deadline || 'Sep 18, 2026',
          fee: Number(target.fee !== undefined ? target.fee : 30),
          entries: Number(target.entriesCount !== undefined ? target.entriesCount : (target.entries || 0)),
          maxCapacity: Number(target.maxCapacity !== undefined ? target.maxCapacity : 50),
          paidEntries: Number(target.paidEntries !== undefined ? target.paidEntries : 39),
          pendingEntries: Number(target.pendingEntries !== undefined ? target.pendingEntries : 4),
          checkedIn: Number(target.checkedIn !== undefined ? target.checkedIn : 31),
          status: target.status || 'Registration Open',
          address: (target.address && String(target.address).trim()) ? target.address : '1420 Hunting Ridge Rd, Knoxville, TN 37901',
          description: (target.description && String(target.description).trim())
            ? target.description
            : 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds. Mandatory tracking collars required for all casts.'
        });
      }
    }
  }, [selectedEventId, events]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateEvent) {
        await updateEvent(formData.id, formData);
      }
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error(err);
      showToast('Failed saving event configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const target = events.find((e) => e.id === selectedEventId) || events[0];
    if (target) {
      setFormData({
        ...target,
        deadline: (target.deadline && String(target.deadline).trim()) ? target.deadline : 'Sep 18, 2026',
        address: (target.address && String(target.address).trim()) ? target.address : '1420 Hunting Ridge Rd, Knoxville, TN 37901',
        description: (target.description && String(target.description).trim())
          ? target.description
          : 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds. Mandatory tracking collars required for all casts.'
      });
      showToast('Form reset to saved event parameters', 'info');
    }
  };

  const capacityPercent = Math.min(100, Math.round(((formData.entries || 0) / (formData.maxCapacity || 50)) * 100));

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      {/* Header & Quick Event Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-lowest p-5 rounded-xl border border-surface-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-tan-100 text-tan-900 border border-tan-300">
              Event Management Portal
            </span>
            {lastSaved && (
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved at {lastSaved}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-forest-800 tracking-tight mt-1">Event Configuration & Details</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Manage trial rules, location address, check-in deadlines, and capacity limits</p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-charcoal shrink-0">Active Event:</label>
          <div className="relative">
            <select
              id="event-selector-dropdown"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="pl-3 pr-8 py-2 text-xs font-extrabold bg-surface-low border border-surface-border rounded-lg text-forest-900 focus:outline-none focus:border-forest-800 shadow-xs cursor-pointer appearance-none"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.date || 'TBD'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-light pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Live Operational Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Capacity Status</div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-forest-800">{formData.entries || 0}</span>
            <span className="text-xs text-charcoal-muted">/ {formData.maxCapacity || 50} Dogs</span>
          </div>
          <div className="w-full bg-surface-low h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 75 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-charcoal-muted mt-1">{capacityPercent}% full</div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Entry Fee</div>
          <div className="text-lg font-black text-forest-800 mt-1">${Number(formData.fee || 30).toFixed(2)}</div>
          <div className="text-[10px] text-charcoal-muted mt-1">Per dog registration</div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Trial Status</div>
          <div className="mt-1">
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {formData.status}
            </span>
          </div>
          <div className="text-[10px] text-charcoal-muted mt-1.5">Official Sanctioned Trial</div>
        </div>

        <div className="bg-surface-lowest p-3.5 rounded-xl border border-surface-border shadow-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-charcoal-light">Checked-in Casts</div>
          <div className="text-lg font-black text-forest-800 mt-1">{formData.checkedIn || 31} Dogs</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">Ready for Bench Call</div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="bg-surface-lowest p-6 rounded-xl border border-surface-border shadow-sm space-y-6 text-xs">
        {/* Section 1: Overview & Identification */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-forest-800 border-b border-surface-border pb-2.5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-tan-600" /> Trial Overview & Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Event Name</label>
              <input
                id="event-name-input"
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-bold text-forest-900"
                placeholder="e.g. Nite Hunt & Treeing Contest"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Competition Type</label>
              <select
                id="event-type-select"
                value={formData.type || 'Nite Hunt'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              >
                <option value="Nite Hunt">Nite Hunt</option>
                <option value="Championship Hunt">Championship Hunt</option>
                <option value="Water Race">Water Race</option>
                <option value="Bench Show">Bench Show</option>
                <option value="Field Trial">Field Trial</option>
                <option value="Treeing Contest">Treeing Contest</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Sanctioning Federation</label>
              <select
                id="event-federation-select"
                value={formData.federation || 'UKC (United Kennel Club)'}
                onChange={(e) => setFormData({ ...formData, federation: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              >
                <option value="UKC (United Kennel Club)">UKC (United Kennel Club)</option>
                <option value="PKC (Professional Kennel Club)">PKC (Professional Kennel Club)</option>
                <option value="AKC (American Kennel Club)">AKC (American Kennel Club)</option>
                <option value="Independent Sanctioned">Independent Sanctioned</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Sporting Hound Division</label>
              <input
                type="text"
                value={formData.sport || 'Coonhounds'}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                placeholder="e.g. Coonhounds, Beagles, Bird Dogs"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Host Club</label>
              <input
                type="text"
                value={formData.club || 'Oak Ridge Hunting Club'}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">State Association Charter</label>
              <input
                type="text"
                value={formData.state || 'Tennessee'}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Date, Deadlines & Capacity */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <h3 className="font-extrabold text-sm text-forest-800 border-b border-surface-border pb-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-tan-600" /> Date, Deadlines & Capacity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">Event Date</label>
              <input
                id="event-date-input"
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                placeholder="e.g. September 19, 2026"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Cast / Start Time</label>
              <input
                id="event-starttime-input"
                type="text"
                value={formData.startTime || '7:00 PM'}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                placeholder="e.g. 7:00 PM"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Bench Deadline</label>
              <input
                id="event-deadline-input"
                type="text"
                value={formData.deadline || ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                placeholder="e.g. Sep 18, 2026"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Max Dog Capacity</label>
              <input
                id="event-capacity-input"
                type="number"
                min="1"
                max="500"
                value={formData.maxCapacity || 50}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Entry Fee ($ USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light font-bold">$</span>
                <input
                  id="event-fee-input"
                  type="number"
                  step="0.50"
                  min="0"
                  value={formData.fee || 30}
                  onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                  className="w-full pl-7 pr-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Registration Status</label>
              <select
                id="event-status-select"
                value={formData.status || 'Registration Open'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              >
                <option value="Registration Open">Registration Open</option>
                <option value="Late Registration Open">Late Registration Open</option>
                <option value="Capacity Reached (Waitlist)">Capacity Reached (Waitlist)</option>
                <option value="Registration Closed">Registration Closed</option>
                <option value="Trial in Progress">Trial in Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Grounds & Clubhouse Address */}
        <div className="space-y-4 pt-4 border-t border-surface-border">
          <h3 className="font-extrabold text-sm text-forest-800 border-b border-surface-border pb-2.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-tan-600" /> Grounds & Clubhouse Address
          </h3>
          <div>
            <label className="block font-bold text-charcoal mb-1">Full Physical Address</label>
            <input
              id="event-address-input"
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
              placeholder="e.g. 1420 Hunting Ridge Rd, Knoxville, TN 37901"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-charcoal mb-1">City / Municipality</label>
              <input
                type="text"
                value={formData.city || 'Knoxville'}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium"
                placeholder="e.g. Knoxville"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal mb-1">GPS Coordinates / Field Directions</label>
              <input
                type="text"
                placeholder="Lat 35.9606, Lng -83.9207 (Turn right off Hwy 40 onto Ridge Rd)"
                className="w-full px-3.5 py-2 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium text-charcoal"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-charcoal">Official Contest Description & Special Rules</label>
              <button
                type="button"
                id="insert-official-rules-btn"
                onClick={() => setFormData({
                  ...formData,
                  description: 'Annual night coon hunt and treeing championship. UKC rules apply. Trophies for top 5 hounds. Mandatory tracking collars and valid state license required for all cast handlers.'
                })}
                className="text-[10px] text-forest-800 hover:text-forest-950 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-tan-600" />
                <span>Fill Sanctioned Rule Template</span>
              </button>
            </div>
            <textarea
              id="event-description-textarea"
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-low border border-surface-border rounded-lg focus:outline-none focus:border-forest-800 font-medium leading-relaxed"
              placeholder="Specify trial rules, casting order, trophy tiers, and mandatory hound collar requirements..."
              required
            />
          </div>
        </div>

        {/* Submit / Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-surface-border">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 border border-surface-border hover:bg-surface-low text-charcoal font-bold rounded-lg transition-colors text-xs"
          >
            Reset Form
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="save-event-config-btn"
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-extrabold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-tan-400" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-tan-400" />
                  <span>Save Event Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
