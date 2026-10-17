import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, MapPin, Award, CheckCircle2, Dog, User, ShieldCheck } from 'lucide-react';

export const PreSignUpModal = ({ event, onClose }) => {
  const { dogs, currentUser, enterEvent, showToast } = useApp();

  const [selectedDogId, setSelectedDogId] = useState(dogs[0]?.id || '');
  const [handlerName, setHandlerName] = useState(currentUser?.name || 'Lalit Panchole');
  const [handlerPhone, setHandlerPhone] = useState('(865) 555-0192');
  const [handlerEmail, setHandlerEmail] = useState(currentUser?.email || 'pancholelalit52@gmail.com');
  const [division, setDivision] = useState('Open Division');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [regConfirmationCode, setRegConfirmationCode] = useState('');

  if (!event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDog = dogs.find((d) => d.id === selectedDogId) || dogs[0] || { callName: 'Ranger', id: 'dog-1' };

    const confCode = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
    setRegConfirmationCode(confCode);

    // Call enterEvent with correct (eventId, dogId, participantName) signature
    enterEvent(event.id, selectedDog.id, handlerName);

    setIsSubmitted(true);
    showToast(`Pre-Sign Up Confirmed! Code: ${confCode}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-lowest rounded-3xl border border-surface-border shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-forest-950 text-white p-6 border-b border-forest-800 flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-tan-500 text-forest-950">
              Online Pre-Sign Up
            </span>
            <h3 className="text-xl font-black text-white mt-1">{event.name}</h3>
            <p className="text-xs text-tan-200">{event.date} • {event.club} ({event.state})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-tan-200 hover:text-white rounded-xl bg-forest-900 border border-forest-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-forest-950">Pre-Registration Confirmed!</h4>
              <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
                Your entry has been recorded and submitted to <strong>{event.club}</strong>.
              </p>
            </div>

            <div className="p-4 bg-surface-low rounded-2xl border border-surface-border text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted font-bold">Confirmation Code:</span>
                <span className="font-black text-forest-800">{regConfirmationCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted font-bold">Event Fee Paid:</span>
                <span className="font-black text-emerald-700">${event.fee}.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-charcoal-muted font-bold">Division:</span>
                <span className="font-extrabold text-charcoal">{division}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-forest-900 hover:bg-forest-950 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-tan-600" /> Handler / Participant Name
                </label>
                <input
                  type="text"
                  required
                  value={handlerName}
                  onChange={(e) => setHandlerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-medium focus:border-tan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={handlerEmail}
                    onChange={(e) => setHandlerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-medium focus:border-tan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={handlerPhone}
                    onChange={(e) => setHandlerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-medium focus:border-tan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <Dog className="w-4 h-4 text-tan-600" /> Select Registered Dog
                </label>
                <select
                  value={selectedDogId}
                  onChange={(e) => setSelectedDogId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-bold focus:border-tan-500"
                >
                  {dogs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.callName} ({d.registeredName} - {d.regNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-tan-600" /> Competition Division
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-low border border-surface-border rounded-xl font-bold focus:border-tan-500"
                >
                  <option value="Open Division">Open Division</option>
                  <option value="Grand Champion Division">Grand Champion Division</option>
                  <option value="Senior Hounds">Senior Hounds</option>
                  <option value="Youth Division">Youth Division</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-tan-50 rounded-2xl border border-tan-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-forest-950">Pre-Registration Fee</div>
                <div className="text-[11px] text-charcoal-muted font-medium">Instant online confirmation</div>
              </div>
              <div className="text-xl font-black text-forest-800">${event.fee}.00</div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Pre-Sign Up (${event.fee}.00)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
