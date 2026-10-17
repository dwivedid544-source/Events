import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Dog, Plus, Trophy, Calendar, Trash2, Upload, Camera, Image as ImageIcon, X } from 'lucide-react';

export const MemberDogs = () => {
  const { dogs, saveDog, deleteDog, currentUser, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    callName: '',
    registeredName: '',
    breed: 'Treeing Walker Coonhound',
    gender: 'Male',
    age: '3 Years',
    dob: 'May 2023',
    regNo: '',
    photo: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be under 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData((prev) => ({ ...prev, photo: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDog(formData);
    setModalOpen(false);
    setFormData({
      callName: '',
      registeredName: '',
      breed: 'Treeing Walker Coonhound',
      gender: 'Male',
      age: '3 Years',
      dob: 'May 2023',
      regNo: '',
      photo: ''
    });
    setImagePreview('');
  };

  const myDogs = dogs.filter((d) => d.owner === currentUser.name || d.owner === 'John Walker');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-800 tracking-tight">My Dogs Registry</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Manage registered competition dogs for event entry</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-tan-500 hover:bg-tan-600 text-forest-900 font-extrabold text-xs rounded-lg shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Registered Dog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDogs.map((d) => (
          <div key={d.id} className="bg-surface-lowest rounded-xl border border-surface-border p-5 shadow-ambient flex flex-col justify-between space-y-4 hover:shadow-ambient-lg transition-all">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src={d.photo} alt={d.callName} className="w-16 h-16 rounded-xl object-cover border-2 border-tan-400 shadow-xs" />
                <div>
                  <h3 className="font-extrabold text-lg text-charcoal">{d.callName}</h3>
                  <div className="text-xs font-semibold text-forest-800">{d.registeredName}</div>
                  <div className="text-[10px] text-charcoal-light font-mono mt-0.5">Reg: {d.regNo}</div>
                </div>
              </div>

              <div className="bg-surface-low p-3 rounded-lg text-xs space-y-1 border">
                <div>Breed: <strong>{d.breed}</strong></div>
                <div>Gender: <strong>{d.gender}</strong> • Age: <strong>{d.age}</strong></div>
                <div>Owner: <strong>{d.owner}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-bold text-forest-800">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-tan-500" /> {d.eventsCount} Events</span>
                <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-tan-500" /> {d.winsCount} Wins</span>
              </div>
              <button
                onClick={() => deleteDog(d.id)}
                className="text-red-700 hover:text-red-900 p-1 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Dog Modal with Interactive Image Upload & Live Preview */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Dog">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Image Upload Input & Live Preview Area */}
          <div>
            <label className="block font-extrabold text-charcoal mb-1.5 flex items-center justify-between">
              <span>Dog Photo / Avatar</span>
              <span className="text-[10px] font-semibold text-charcoal-light">PNG, JPG, WEBP up to 5MB</span>
            </label>

            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-forest-800 shadow-md group">
                <img src={imagePreview} alt="Dog Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="px-3 py-1.5 bg-white text-charcoal font-bold text-xs rounded-lg cursor-pointer hover:bg-tan-100 shadow flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Change Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-forest-900/90 text-tan-300 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                  Image Ready
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-tan-400 hover:border-forest-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-surface-low hover:bg-tan-50/50 transition-all text-center group">
                <div className="w-10 h-10 rounded-full bg-tan-100 text-tan-700 flex items-center justify-center group-hover:bg-forest-800 group-hover:text-tan-400 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-forest-800 group-hover:underline">Click to upload photo</span>
                  <span className="text-charcoal-light block text-[11px]">or drag & drop image file here</span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1">Call Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ranger"
              value={formData.callName}
              onChange={(e) => setFormData({ ...formData, callName: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-charcoal mb-1">Registered Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Mountain Creek Ranger"
              value={formData.registeredName}
              onChange={(e) => setFormData({ ...formData, registeredName: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-charcoal mb-1">Breed</label>
            <select
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            >
              <option value="Treeing Walker Coonhound">Treeing Walker Coonhound</option>
              <option value="English Redtick Coonhound">English Redtick Coonhound</option>
              <option value="Bluetick Coonhound">Bluetick Coonhound</option>
              <option value="Black & Tan Coonhound">Black & Tan Coonhound</option>
              <option value="Plott Hound">Plott Hound</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-charcoal mb-1">UKC Registration Number</label>
            <input
              type="text"
              required
              placeholder="e.g. UKC-204815"
              value={formData.regNo}
              onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
              className="w-full px-3 py-2 bg-surface-low border rounded focus:border-forest-800 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
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
              Save Dog
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
