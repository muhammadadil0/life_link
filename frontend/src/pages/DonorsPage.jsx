import React, { useState, useEffect } from 'react';
import { 
  Users, Droplets, MapPin, Phone, MessageCircle, Navigation, 
  Search, Filter, CheckCircle2, Heart, X, Send, Sparkles 
} from 'lucide-react';
import { fetchDonors } from '../services/api';

export default function DonorsPage({ currentUser, onNavigateRegister, onNavigateDonorPortal }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlood, setSelectedBlood] = useState('all');
  const [searchCity, setSearchCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);

  // Chat modal
  const [chatModal, setChatModal] = useState({ open: false, donor: null, messages: [] });
  const [chatInput, setChatInput] = useState('');

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    loadDonorsData();
  }, []);

  async function loadDonorsData(bg = selectedBlood, city = searchCity, avail = availableOnly) {
    setLoading(true);
    try {
      const data = await fetchDonors({
        bloodGroup: bg !== 'all' ? bg : undefined,
        city: city.trim() || undefined,
        availableOnly: avail ? 'true' : undefined
      });
      setDonors(data);
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleGroupSelect = (bg) => {
    setSelectedBlood(bg);
    loadDonorsData(bg, searchCity, availableOnly);
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    loadDonorsData(selectedBlood, searchCity, availableOnly);
  };

  const handleToggleAvailable = () => {
    const newVal = !availableOnly;
    setAvailableOnly(newVal);
    loadDonorsData(selectedBlood, searchCity, newVal);
  };

  const openChatWithDonor = (donor) => {
    setChatModal({
      open: true,
      donor,
      messages: [
        {
          id: 1,
          sender: donor.name,
          text: `Hello! I am a registered ${donor.blood_type} donor in ${donor.city}. Feel free to message me if you require a blood donation.`,
          time: 'Just now',
          isMine: false
        }
      ]
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: currentUser ? currentUser.name : 'Recipient',
      text: chatInput.trim(),
      time: 'Just now',
      isMine: true
    };
    setChatModal((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));
    setChatInput('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto animate-fade-in">
      {/* Donor Role Notice */}
      {currentUser?.userType === 'donor' && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="font-bold">You are browsing as a registered Blood Donor ({currentUser.bloodGroup || 'Ready'})</span>
              <p className="text-emerald-700 text-xs mt-0.5">Your profile is visible below for patients in hospital emergencies.</p>
            </div>
          </div>
          {onNavigateDonorPortal && (
            <button
              onClick={onNavigateDonorPortal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              Open My Donor Portal →
            </button>
          )}
        </div>
      )}

      {/* 🩸 Hero Section */}
      <section className="glass-card bg-white/95 rounded-3xl p-8 sm:p-12 mb-10 border border-red-100 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Users className="w-3.5 h-3.5 text-red-600" />
            <span>Nationwide Lifesaver Registry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-gray-900 tracking-tight mb-3">
            Find Verified{' '}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Blood Donors
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            Search verified donors in your exact city and blood group. Connect directly by phone, hospital navigation, or chat.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-gray-700">
            <div className="bg-slate-100 px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-red-600 font-bold">1,250+</span> Registered Donors
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-emerald-600 font-bold">840+</span> Active Today
            </div>
            <div className="bg-slate-100 px-4 py-2 rounded-xl border border-gray-200">
              <span className="text-blue-600 font-bold">2.3 min</span> Match Time
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 Search & Filters Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Blood Group Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => handleGroupSelect(bg)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBlood === bg
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {bg === 'all' ? 'All Blood Types' : bg}
              </button>
            ))}
          </div>

          {/* City Search and Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleToggleAvailable}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                availableOnly 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              <span>Available Only</span>
            </button>

            <form onSubmit={handleCitySearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Filter city (e.g. Lahore)"
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 w-full sm:w-52"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 👥 Donors Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Searching donors...</p>
        </div>
      ) : donors.length === 0 ? (
        <div className="glass-card bg-white p-12 text-center rounded-3xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Donors Matching Your Filter</h3>
          <p className="text-gray-500 text-xs mt-1">Try selecting another blood group or clearing the city search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="glass-card bg-white rounded-2xl p-6 border-l-4 border-l-red-500 border border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                    {donor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{donor.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-700">
                        {donor.blood_type}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Ready to Donate</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-gray-100 text-xs text-gray-600 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{donor.address || donor.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{donor.phone || '03494996898'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-200">
                    <span>Age: {donor.age} yrs</span>
                    <span className="text-emerald-700 font-medium">{donor.total_donations || 4} Donations Given</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions: Call, WhatsApp, Map, Chat */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${donor.phone || '03494996898'}`}
                    className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href={`https://wa.me/${(donor.phone || '03494996898').replace(/[^0-9]/g, '').replace(/^0/, '92')}?text=${encodeURIComponent(
                      `Salam! I found your verified profile on LifeLink Blood Bank. We urgently need ${donor.blood_type} blood donation in ${donor.city || 'our city'}. Are you available to help?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-2 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donor.address || donor.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Directions</span>
                  </a>

                  <button
                    onClick={() => openChatWithDonor(donor)}
                    className="btn-medical text-white py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-medical cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Portal Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 💬 Real-Time Chat Modal with Donor */}
      {chatModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-red-100 overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 px-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {chatModal.donor?.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{chatModal.donor?.name}</h3>
                  <p className="text-[11px] text-gray-500">
                    Blood Group {chatModal.donor?.blood_type} • {chatModal.donor?.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatModal({ open: false, donor: null, messages: [] })}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatModal.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                      m.isMine
                        ? 'bg-red-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message to donor..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                className="btn-medical text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-medical flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
