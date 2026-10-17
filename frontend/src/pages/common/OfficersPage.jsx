import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Plus, User, Phone, Mail, Award, Calendar, Vote, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const OfficersPage = () => {
  const { officers = [], addOfficer, currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'elections'
  const [modalOpen, setModalOpen] = useState(false);

  // Mock Active Officer Elections State
  const [elections, setElections] = useState([
    {
      id: 'elec-1',
      title: '2026 - 2028 Club President Election',
      scope: currentUser?.club || 'Oak Ridge Hunting Club',
      deadline: 'Oct 15, 2026',
      totalVotes: 64,
      userHasVoted: false,
      candidates: [
        { id: 'c-1', name: 'Robert Miller', currentTitle: 'Incumbent President', votes: 41, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
        { id: 'c-2', name: 'Cody Campbell', currentTitle: 'Vice President', votes: 23, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
      ]
    },
    {
      id: 'elec-2',
      title: 'Master of Hounds & Chief Bench Judge Ballot',
      scope: currentUser?.club || 'Oak Ridge Hunting Club',
      deadline: 'Nov 01, 2026',
      totalVotes: 52,
      userHasVoted: true,
      candidates: [
        { id: 'c-3', name: 'Sarah Jenkins', currentTitle: 'Senior Field Judge', votes: 34, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
        { id: 'c-4', name: 'Marcus Vance', currentTitle: 'Master Huntsman', votes: 18, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    title: 'Club President',
    phone: '',
    email: '',
    term: '2026 - 2028',
    photo: ''
  });

  const handleCastVote = (electionId, candidateId) => {
    setElections(prev =>
      prev.map(e => {
        if (e.id === electionId) {
          return {
            ...e,
            userHasVoted: true,
            totalVotes: e.totalVotes + 1,
            candidates: e.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
          };
        }
        return e;
      })
    );
    showToast('Your official digital ballot vote has been recorded securely!', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addOfficer({ ...formData, club: currentUser?.club || 'Oak Ridge Hunting Club' });
    setModalOpen(false);
    setFormData({ name: '', title: 'Club President', phone: '', email: '', term: '2026 - 2028', photo: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">Officers & Elections Governance</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Elected leadership roster, officer voting system & digital ballots</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-low border border-surface-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeTab === 'roster' ? 'bg-forest-900 text-white shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Officers Directory ({officers.length})
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'elections' ? 'bg-forest-900 text-white shadow-sm' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Vote className="w-3.5 h-3.5 text-tan-400" />
              <span>Officer Voting System ({elections.length})</span>
            </button>
          </div>
          {activeTab === 'roster' && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Appoint Officer
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: OFFICERS DIRECTORY */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {officers.map((off) => (
            <div key={off.id} className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-4 flex flex-col justify-between hover:shadow-xl transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={off.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={off.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-tan-400 shadow-md"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-100 text-tan-900 border border-tan-300">
                      {off.title}
                    </span>
                    <h3 className="font-black text-lg text-forest-950 mt-1">{off.name}</h3>
                    <div className="text-xs text-forest-800 font-bold">{off.club}</div>
                  </div>
                </div>

                <div className="bg-surface-low p-3.5 rounded-xl text-xs space-y-2 border border-surface-border font-medium">
                  <div className="flex items-center gap-2 text-charcoal">
                    <Phone className="w-3.5 h-3.5 text-tan-600" /> {off.phone || '(865) 555-0199'}
                  </div>
                  <div className="flex items-center gap-2 text-charcoal">
                    <Mail className="w-3.5 h-3.5 text-tan-600" /> {off.email}
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-muted text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-tan-600" /> Elected Term: <strong className="text-forest-950">{off.term}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Verified Governance Officer
                </span>
                <span className="text-[11px] font-bold text-tan-700">Official Roster</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFICER VOTING & DIGITAL BALLOT SYSTEM */}
      {activeTab === 'elections' && (
        <div className="space-y-6">
          <div className="bg-forest-950 text-white p-6 rounded-2xl border border-forest-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-tan-500 text-forest-950 tracking-wider">
                Digital Ballot System
              </span>
              <h2 className="text-xl font-black text-white">Official Officer Elections & Democratic Voting</h2>
              <p className="text-xs text-tan-200">
                Active registered members can cast 1 verified vote per officer election. All results are cryptographically tallied in real time.
              </p>
            </div>
            <div className="px-4 py-2 bg-forest-900 border border-forest-700 rounded-xl text-xs font-bold text-tan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1 Member = 1 Verified Vote</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {elections.map((elec) => (
              <div key={elec.id} className="bg-surface-lowest p-6 rounded-2xl border border-surface-border shadow-ambient space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2 border-b border-surface-border pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-tan-700">{elec.scope}</span>
                      <h3 className="text-lg font-black text-forest-950">{elec.title}</h3>
                      <span className="text-xs text-charcoal-muted font-medium">Voting Closes: {elec.deadline} • Total Ballots Cast: {elec.totalVotes}</span>
                    </div>
                    {elec.userHasVoted ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ballot Submitted
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black shrink-0">
                        Vote Open
                      </span>
                    )}
                  </div>

                  {/* Candidate List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-charcoal-muted tracking-wider">Official Candidates</h4>
                    {elec.candidates.map((cand) => {
                      const percentage = Math.round((cand.votes / (elec.totalVotes || 1)) * 100);

                      return (
                        <div key={cand.id} className="p-4 bg-surface-low rounded-xl border border-surface-border space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={cand.photo} alt={cand.name} className="w-12 h-12 rounded-xl object-cover border border-tan-400" />
                              <div>
                                <h5 className="font-black text-sm text-forest-950">{cand.name}</h5>
                                <span className="text-xs text-charcoal-muted font-medium">{cand.currentTitle}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-forest-800">{cand.votes} Votes</span>
                              <span className="block text-[10px] text-charcoal-muted font-bold">{percentage}% of Ballots</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
                            <div className="bg-forest-800 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>

                          {!elec.userHasVoted && (
                            <button
                              onClick={() => handleCastVote(elec.id, cand.id)}
                              className="w-full py-2 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Vote className="w-3.5 h-3.5" />
                              <span>Vote for {cand.name}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center text-xs text-charcoal-muted font-medium pt-2 border-t border-surface-border">
                  Election supervised by State Charter Governance Board
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appoint Officer Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Appoint Club Officer">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal mb-1">Officer Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Robert Miller"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg focus:border-forest-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Position / Title</label>
            <select
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg focus:border-forest-800 font-medium"
            >
              <option value="Club President">Club President</option>
              <option value="Vice President & Master of Hounds">Vice President & Master of Hounds</option>
              <option value="Treasurer & Secretary">Treasurer & Secretary</option>
              <option value="Bench Show Judge">Bench Show Judge</option>
              <option value="Field Marshal">Field Marshal</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="(865) 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg focus:border-forest-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              placeholder="officer@huntingclub.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border border-surface-border rounded-lg focus:border-forest-800 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-charcoal font-bold hover:bg-surface-low rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white font-extrabold rounded-lg shadow"
            >
              Save Officer Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

