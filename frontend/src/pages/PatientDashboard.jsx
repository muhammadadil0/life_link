import React, { useState, useEffect } from 'react';
import { 
  Heart, AlertTriangle, Users, Phone, MapPin, MessageCircle, 
  CheckCircle2, Plus, Search, Filter, Navigation, X, Send, ArrowRight, Droplets, Sparkles, Map, LayoutGrid
} from 'lucide-react';
import { fetchDonors, createEmergencyRequest } from '../services/api';
import LiveDonorMap from '../components/LiveDonorMap';

export default function PatientDashboard({ currentUser, onNavigateHome }) {
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterCity, setFilterCity] = useState('');
  const [viewMode, setViewMode] = useState('map');
  
  // Emergency Request Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestForm, setRequestForm] = useState({
    patient_name: currentUser ? currentUser.name : '',
    blood_type: 'O-',
    units_needed: 2,
    urgency: 'Critical',
    hospital: '',
    contact: currentUser ? currentUser.phone || '03494996898' : '03494996898',
    city: 'Lahore'
  });

  // Chat modal
  const [chatModal, setChatModal] = useState({ open: false, donor: null, messages: [] });
  const [chatInput, setChatInput] = useState('');

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    loadDonors();
  }, []);

  async function loadDonors(group = filterGroup, city = filterCity) {
    setLoadingDonors(true);
    try {
      const data = await fetchDonors({
        bloodGroup: group !== 'all' ? group : undefined,
        city: city.trim() || undefined,
        availableOnly: 'true'
      });
      setDonors(data);
    } catch (err) {
      console.error('Error loading donors:', err);
    } finally {
      setLoadingDonors(false);
    }
  }

  const handleFilterChange = (group) => {
    setFilterGroup(group);
    loadDonors(group, filterCity);
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    loadDonors(filterGroup, filterCity);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);
    const res = await createEmergencyRequest(requestForm);
    setRequestSubmitting(false);

    if (res.success) {
      setRequestSuccess(true);
      setTimeout(() => {
        setRequestSuccess(false);
        setShowRequestModal(false);
      }, 2500);
    } else {
      alert(res.message || 'Failed to submit emergency request.');
    }
  };

  const openChatWithDonor = (donor) => {
    setChatModal({
      open: true,
      donor,
      messages: [
        {
          id: 1,
          sender: donor.name,
          text: `Hello! I am a verified ${donor.blood_type} donor in ${donor.city}. How can I assist you with your patient requirement?`,
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
      sender: currentUser ? currentUser.name : 'Patient Family',
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
      {/* 🏥 Welcome Patient Portal Hero */}
      <section className="glass-card bg-white/95 rounded-3xl p-8 sm:p-12 mb-10 border border-red-100 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Emergency Patient Care Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-gray-900 tracking-tight mb-4">
            Welcome to the{' '}
            <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Patient Portal
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Your health and hope matter. Here you can request blood in emergencies, find compatible donors across your city, and coordinate rapid hospital transfusions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => setShowRequestModal(true)}
              className="btn-medical text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Blood Now</span>
            </button>
            <a
              href="#active-donors"
              className="bg-slate-100 hover:bg-slate-200 text-gray-800 border border-gray-200 px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Users className="w-4 h-4 text-red-600" />
              <span>Browse Active Donors</span>
            </a>
          </div>
        </div>
      </section>

      {/* 📖 Bilingual Guidance: How LifeLink Helps Patients */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 sm:p-8 border-l-8 border-red-600 mb-12 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-red-600 font-display flex items-center gap-2">
          <span>How LifeLink Helps Patients</span>
          <span className="text-sm font-normal text-gray-400">| مریضوں کی رہنمائی</span>
        </h2>
        <ul className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-gray-900">Request blood easily and quickly in critical emergencies</span>
              <span dir="rtl" className="block text-xs sm:text-sm text-gray-500 font-urdu mt-0.5">
                ہنگامی صورتحال میں آسانی اور تیزی سے خون کی درخواست کریں
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-gray-900">Directly connect with verified donors nearby</span>
              <span dir="rtl" className="block text-xs sm:text-sm text-gray-500 font-urdu mt-0.5">
                اپنے قریب تصدیق شدہ اور دستیاب ڈونرز سے براہ راست رابطہ کریں
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold text-gray-900">Track and coordinate urgent hospital transfusions in real-time</span>
              <span dir="rtl" className="block text-xs sm:text-sm text-gray-500 font-urdu mt-0.5">
                ہسپتال میں خون کی فوری ترسیل کو بروقت مانیٹر کریں
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* 📊 Metrics Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display mb-1">
            {donors.length}+ Ready
          </div>
          <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Active Verified Donors</div>
        </div>
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-red-600 font-display mb-1">98%</div>
          <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Emergency Fulfillment</div>
        </div>
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-display mb-1">24/7</div>
          <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Direct Hospital Support</div>
        </div>
      </div>

      {/* 🩸 Active Donors Directory Section */}
      <section id="active-donors" className="mb-14 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-red-600" />
              <span>Available Blood Donors</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Connect with volunteer donors ready to help in your area
            </p>
          </div>

          {/* City Search Bar */}
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                placeholder="Search city (e.g. Lahore)"
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 w-44 sm:w-56"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Blood Group Filter Bar */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => handleFilterChange(bg)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterGroup === bg
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {bg === 'all' ? 'All Blood Types' : bg}
            </button>
          ))}
        </div>

        {/* View Switcher: Live Radar Map vs Directory Grid */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>🗺️ Live Donor Radar Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>📋 List Grid ({donors.length})</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {viewMode === 'map' ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Tap any circular donor pin to connect or chat</span>
              </span>
            ) : (
              <span>Showing {donors.length} nearby donors</span>
            )}
          </div>
        </div>

        {/* 🗺️ Live Radar Map View */}
        {viewMode === 'map' && (
          <div className="mb-10 animate-fade-in">
            <LiveDonorMap 
              donors={donors} 
              selectedCity={filterCity} 
              onOpenChat={openChatWithDonor} 
              height="520px" 
            />
          </div>
        )}

        {/* Donors Cards Grid */}
        {loadingDonors ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Finding active donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="glass-card bg-white p-12 text-center rounded-3xl border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Donors Found</h3>
            <p className="text-gray-500 text-xs mt-1">
              Try choosing another blood group or clearing your city filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <span>Available</span>
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

                {/* Direct Action Buttons: Call, WhatsApp, Map, Chat */}
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
                        `Salam! I am reaching out from LifeLink Patient Portal. We urgently need ${donor.blood_type} blood donation. Are you available to help?`
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
      </section>

      {/* 🚨 Create Emergency Blood Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-100 relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute right-5 top-5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900">Post Emergency Blood Request</h3>
              <p className="text-xs text-gray-500 mt-1">
                Broadcasts an urgent alert to verified donors in your exact city
              </p>
            </div>

            {requestSuccess ? (
              <div className="py-8 text-center animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900">Emergency Broadcast Published!</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Donors matching this blood group have been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={requestForm.patient_name}
                    onChange={(e) => setRequestForm({ ...requestForm, patient_name: e.target.value })}
                    placeholder="e.g., Patient Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">Blood Group *</label>
                    <select
                      value={requestForm.blood_type}
                      onChange={(e) => setRequestForm({ ...requestForm, blood_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">Units Needed *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={requestForm.units_needed}
                      onChange={(e) => setRequestForm({ ...requestForm, units_needed: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">Urgency Level *</label>
                    <select
                      value={requestForm.urgency}
                      onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="Critical">Critical (Immediate)</option>
                      <option value="High">High (Within 6 hours)</option>
                      <option value="Moderate">Moderate (Today)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={requestForm.city}
                      onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })}
                      placeholder="e.g. Lahore"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Hospital Name & Ward *</label>
                  <input
                    type="text"
                    required
                    value={requestForm.hospital}
                    onChange={(e) => setRequestForm({ ...requestForm, hospital: e.target.value })}
                    placeholder="e.g., Mayo Hospital, Emergency ICU Ward 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={requestForm.contact}
                    onChange={(e) => setRequestForm({ ...requestForm, contact: e.target.value })}
                    placeholder="e.g., 03494996898"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="btn-medical text-white w-full py-3.5 rounded-xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {requestSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Broadcasting Alert...</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Broadcast Emergency Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
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
