import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Droplets, MapPin, Phone, MessageCircle, 
  Navigation, Plus, Search, Filter, CheckCircle2, Clock, X, Send, Heart, Share2 
} from 'lucide-react';
import { fetchEmergencyRequests, createEmergencyRequest } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function EmergencyPage({ currentUser, onNavigateHome, onNavigateDonorPortal }) {
  const { t, isUrdu } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBlood, setFilterBlood] = useState('all');
  const [searchCity, setSearchCity] = useState('');
  
  const isDonor = currentUser && currentUser.userType === 'donor';

  const handleWhatsAppBroadcast = (req) => {
    const text = `${t('wa_sos_header')}\n\n` +
      `${t('wa_patient')} ${req.patient_name}\n` +
      `${t('wa_blood_needed')} ${req.blood_type}\n` +
      `${t('wa_units')} ${req.units_needed}\n` +
      `${t('wa_hospital')} ${req.hospital}, ${req.city}\n` +
      `${t('wa_contact')} ${req.contact || '03494996898'}\n\n` +
      `${t('wa_respond_link')}\n${window.location.origin}\n\n` +
      `${t('wa_footer')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  
  // Post Emergency Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    blood_type: 'O-',
    units_needed: 2,
    urgency: 'Critical',
    hospital: '',
    contact: '03494996898',
    city: 'Lahore'
  });

  // Chat modal
  const [chatModal, setChatModal] = useState({ open: false, req: null, messages: [] });
  const [chatInput, setChatInput] = useState('');

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    loadEmergencyData();
  }, []);

  async function loadEmergencyData(blood = filterBlood, city = searchCity) {
    setLoading(true);
    try {
      const data = await fetchEmergencyRequests({
        bloodType: blood !== 'all' ? blood : undefined,
        city: city.trim() || undefined
      });
      setRequests(data);
    } catch (err) {
      console.error('Error loading emergency requests:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleBloodFilter = (bg) => {
    setFilterBlood(bg);
    loadEmergencyData(bg, searchCity);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEmergencyData(filterBlood, searchCity);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createEmergencyRequest(formData);
    setSubmitting(false);

    if (res.success) {
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
        loadEmergencyData();
      }, 2000);
    } else {
      alert(res.message || 'Failed to submit emergency request.');
    }
  };

  const openChat = (req) => {
    setChatModal({
      open: true,
      req,
      messages: [
        {
          id: 1,
          sender: req.patient_name,
          text: `Emergency alert: We urgently need ${req.units_needed} units of ${req.blood_type} at ${req.hospital}, ${req.city}. Can you donate or connect us?`,
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
      sender: currentUser ? currentUser.name : 'Lifesaver',
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
      {/* 🚨 Emergency Hero Header */}
      <section className="glass-card bg-white/95 rounded-3xl p-8 sm:p-12 mb-10 border border-red-100 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          {/* Role badge */}
          {isDonor ? (
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-emerald-200">
              <Heart className="w-3.5 h-3.5 fill-current text-emerald-600" />
              <span>{isUrdu ? `رضاکار ڈونر ویو (${currentUser.bloodGroup || 'تیار'})` : `Volunteer Donor View (${currentUser.bloodGroup || 'Ready'})`}</span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-gray-900 tracking-tight mb-3">
            {isDonor ? (
              <>
                {isUrdu ? 'خون کے ضرورت مند ' : 'Patients In Need of '}
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {isUrdu ? 'مریض' : 'Blood Transfusions'}
                </span>
              </>
            ) : (
              <>
                {isUrdu ? 'خون کی ' : 'Emergency '}
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {isUrdu ? 'ہنگامی درخواستیں' : 'Blood Requests'}
                </span>
              </>
            )}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6">
            {isDonor
              ? (isUrdu 
                  ? `آئی سی یو اور ایمرجنسی وارڈز میں زیرِ علاج مریض جنہیں فوری خون درکار ہے۔ آپ کے بلڈ گروپ (${currentUser.bloodGroup || 'تمام'}) کے مطابق کیسز نمایاں ہیں۔`
                  : `Review patients in intensive care needing urgent blood. Cases matching your blood group (${currentUser.bloodGroup || 'all'}) are highlighted for your response.`)
              : (isUrdu 
                  ? 'ملک بھر کے ہسپتالوں اور انتہائی نگہداشت کے شعبوں کی تصدیق شدہ ایمرجنسی کالز۔ ہر سیکنڈ قیمتی ہے۔' 
                  : 'Urgent blood transfusion calls verified across intensive care units and hospitals nationwide. Every second counts.')}
          </p>

          <div className="italic text-sm sm:text-base text-red-600 font-semibold mb-6">
            {isUrdu 
              ? '«خون کا ایک قطرہ کسی کی جان بچا سکتا ہے، کسی کی مسکراہٹ کی وجہ بنیں۔»' 
              : '"A single drop can save a life. Be the reason for someone\'s tomorrow."'}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {isDonor ? (
              <>
                {currentUser?.bloodGroup && (
                  <button
                    onClick={() => handleBloodFilter(currentUser.bloodGroup)}
                    className="btn-medical text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Droplets className="w-4 h-4 fill-current" />
                    <span>{isUrdu ? `میرا بلڈ گروپ فلٹر کریں (${currentUser.bloodGroup})` : `Filter My Blood Group (${currentUser.bloodGroup})`}</span>
                  </button>
                )}
                {onNavigateDonorPortal && (
                  <button
                    onClick={onNavigateDonorPortal}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Heart className="w-4 h-4 text-emerald-600 fill-current" />
                    <span>{isUrdu ? 'میرا ڈونر پورٹل' : 'My Donor Portal'}</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-medical text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isUrdu ? 'خون کی ہنگامی درخواست پوسٹ کریں' : 'Post Emergency Request'}</span>
              </button>
            )}
            <a
              href="tel:03494996898"
              className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>{isUrdu ? '۲۴/۷ ہاٹ لائن: 03494996898' : '24/7 Hotline: 03494996898'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 🔍 Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Blood Group Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => handleBloodFilter(bg)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterBlood === bg
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {bg === 'all' ? (isUrdu ? 'تمام بلڈ گروپس' : 'All Blood Groups') : bg}
            </button>
          ))}
        </div>

        {/* City Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={isUrdu ? 'شہر تلاش کریں (مثلاً لاہور، مردان)' : 'Search by city (e.g. Lahore)'}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 w-44 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {isUrdu ? 'فلٹر کریں' : 'Filter'}
          </button>
        </form>
      </div>

      {/* 📋 Active Requests Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{isUrdu ? 'ہنگامی درخواستیں لوڈ ہو رہی ہیں...' : 'Loading urgent requests...'}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-card bg-white p-12 text-center rounded-3xl border border-gray-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">{isUrdu ? 'اس وقت کوئی ہنگامی کال نہیں ہے' : 'No Emergency Calls Currently'}</h3>
          <p className="text-gray-500 text-xs mt-1">{isUrdu ? 'آپ کے منتخب کردہ فلٹر کے مطابق کوئی ہنگامی درخواست نہیں ملی۔' : 'There are no urgent blood requests matching your active filter.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {requests.map((req) => (
            <div
              key={req.id}
              className="glass-card bg-white rounded-2xl p-6 border-l-4 border-l-red-600 border border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{req.patient_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{req.hospital}, {req.city}</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    req.urgency === 'Critical'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : req.urgency === 'High'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {isUrdu
                      ? (req.urgency === 'Critical' ? 'انتہائی نازک' : req.urgency === 'High' ? 'اہم (فوری)' : 'معمول')
                      : req.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-gray-100 text-xs mb-5">
                  <div>
                    <span className="text-gray-500 block">{isUrdu ? 'مطلوبہ گروپ:' : 'Required Group:'}</span>
                    <span className="font-bold text-red-600 text-sm flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" />
                      {req.blood_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{isUrdu ? 'کتنی بوتلیں درکار ہیں:' : 'Units Needed:'}</span>
                    <span className="font-bold text-gray-800 text-sm">{req.units_needed} {isUrdu ? 'بوتلیں' : 'Units'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">{isUrdu ? 'ہنگامی رابطہ:' : 'Emergency Contact:'}</span>
                    <span className="font-bold text-gray-800">{req.contact || '03494996898'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${req.contact || '03494996898'}`}
                  className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('btn_call_now', 'Call')}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.hospital + ' ' + req.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('btn_directions', 'Map')}</span>
                </a>
                <button
                  onClick={() => openChat(req)}
                  className="btn-medical text-white py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-medical cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('btn_chat', 'Chat')}</span>
                </button>
              </div>

              {/* 1-Click WhatsApp Emergency Broadcast */}
              <button
                onClick={() => handleWhatsAppBroadcast(req)}
                className="mt-2.5 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                title="Broadcast this urgent blood request instantly to WhatsApp contacts and groups"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('btn_broadcast_whatsapp', 'Broadcast on WhatsApp')}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🚨 Post Emergency Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-100 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900">{isUrdu ? 'ہنگامی خون کی درخواست پوسٹ کریں' : 'Post Emergency Blood Request'}</h3>
              <p className="text-xs text-gray-500 mt-1">{isUrdu ? 'ہمارے پورے نیٹ ورک میں عطیہ دہندگان کو فوری الرٹ جاری کریں' : 'Broadcasts an urgent alert to donors across our network'}</p>
            </div>

            {createSuccess ? (
              <div className="py-8 text-center animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900">{isUrdu ? 'ہنگامی الرٹ جاری کر دیا گیا!' : 'Emergency Alert Published!'}</h4>
                <p className="text-xs text-gray-600 mt-1">{isUrdu ? 'آپ کے شہر میں عطیہ دہندگان کو فوری طور پر مطلع کیا جا رہا ہے۔' : 'Donors in your city are being notified right away.'}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'مریض کا نام *' : 'Patient Name *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    placeholder={isUrdu ? 'مثال کے طور پر: محمد عادل' : 'e.g., Patient Full Name'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'خون کا گروپ *' : 'Blood Group *'}</label>
                    <select
                      value={formData.blood_type}
                      onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'کتنی بوتلیں درکار ہیں *' : 'Units Needed *'}</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.units_needed}
                      onChange={(e) => setFormData({ ...formData, units_needed: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'فوری ضرورت کی سطح *' : 'Urgency Level *'}</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="Critical">{isUrdu ? 'انتہائی نازک (فوری)' : 'Critical (Immediate)'}</option>
                      <option value="High">{isUrdu ? 'اہم (۶ گھنٹوں کے اندر)' : 'High (Within 6 hrs)'}</option>
                      <option value="Moderate">{isUrdu ? 'معمول (آج کے دن میں)' : 'Moderate (Today)'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'شہر *' : 'City *'}</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={isUrdu ? 'مثلاً لاہور، مردان' : 'e.g. Lahore'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'ہسپتال اور وارڈ نمبر *' : 'Hospital & Ward *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder={isUrdu ? 'مثلاً جناح ہسپتال، آئی سی یو وارڈ' : 'e.g. City General Hospital, ICU Ward 2'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{isUrdu ? 'رابطہ نمبر *' : 'Contact Phone *'}</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="03494996898"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-medical text-white w-full py-3.5 rounded-xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isUrdu ? 'الرٹ جاری ہو رہا ہے...' : 'Publishing Alert...'}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>{isUrdu ? 'ہنگامی درخواست جمع کروائیں' : 'Submit Emergency Request'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 💬 Real-Time Chat Modal */}
      {chatModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-red-100 overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 px-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {chatModal.req?.patient_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{chatModal.req?.patient_name}</h3>
                  <p className="text-[11px] text-gray-500">
                    {chatModal.req?.hospital} • {isUrdu ? 'بلڈ گروپ' : 'Blood Group'} {chatModal.req?.blood_type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatModal({ open: false, req: null, messages: [] })}
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
                placeholder={isUrdu ? 'مریض کو پیغام لکھیں...' : 'Type your message to patient...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                className="btn-medical text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-medical flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isUrdu ? 'بھیجیں' : 'Send'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
