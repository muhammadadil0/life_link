import React, { useState } from 'react';
import { 
  Heart, Droplets, MapPin, Phone, AlertCircle, 
  CheckCircle2, Clock, Shield, User, ArrowRight, 
  Activity, Calendar, Award, Check, Sparkles, Plus, ExternalLink, Mail, BookOpen
} from 'lucide-react';
import { updateUserProfile } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const COMPATIBILITY_MAP = {
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'], label: 'Vital Platelet & RBC Donor' },
  'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'], label: 'Rare Universal Platelet Donor' },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'], label: 'High Demand Blood Group' },
  'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'], label: 'Extremely Rare & Precious' },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['All Blood Types (Universal Recipient)'], label: 'Universal Plasma Donor' },
  'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'], label: 'Rarest Blood Group' },
  'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'], label: 'Most Common & Needed' },
  'O-': { canDonateTo: ['All Blood Types (Universal Donor)'], canReceiveFrom: ['O- only'], label: 'Universal Emergency Lifesaver' }
};

const DONOR_HADITHS = [
  {
    id: 1,
    title: "Relieving a Believer's Hardship",
    theme: "Divine Relief on the Day of Judgment",
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ، يَسَّرَ اللهُ عَلَيْهِ فِي الدُّنْيَا وَالْآخِرَةِ، وَاللهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ",
    urdu: "جو شخص کسی مومن کی دنیاوی تکلیفوں میں سے کوئی تکلیف دور کرے گا، اللہ قیامت کے دن اس کی تکلیفوں میں سے ایک بڑی تکلیف دور فرمائے گا، اور اللہ اپنے بندے کی مدد میں رہتا ہے جب تک بندہ اپنے بھائی کی مدد میں لگا رہتا ہے۔",
    english: "Whoever relieves a believer of a distress from the distresses of this world, Allah will relieve him of a distress from the distresses of the Day of Resurrection... And Allah remains in aid of His servant as long as the servant remains in aid of his brother.",
    source: "Sahih Muslim 2699",
    grade: "صحیح مسلم — Sahih",
    donorTakeaway: "Donating your blood frees a critical patient from intense agony, ensuring Allah's direct divine assistance for you when you need it most.",
    donorTakeawayUrdu: "آپ کا خون کسی تکلیف میں مبتلا مریض کو نئی زندگی دیتا ہے، جس کے بدلے اللہ تعالیٰ قیامت کے دن آپ کی مشکل دور فرمائے گا۔"
  },
  {
    id: 2,
    title: "The Most Beloved People to Allah",
    theme: "Greatest Benefit to Humanity",
    arabic: "أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ، وَأَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ سُرُورٌ تُدْخِلُهُ عَلَى مُسْلِمٍ، أَوْ تَكْشِفُ عَنْهُ كُرْبَةً",
    urdu: "اللہ تعالیٰ کے نزدیک تمام لوگوں میں سب سے زیادہ محبوب وہ انسان ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے، اور سب سے پسندیدہ عمل یہ ہے کہ تم کسی مسلمان کے دل میں خوشی داخل کرو یا اس کی کوئی پریشانی دور کرو۔",
    english: "The most beloved of people to Allah are those who bring greatest benefit to people. And the most beloved deed to Allah is to bring happiness to a fellow human, or to remove a distress from them.",
    source: "Al-Mu'jam Al-Awsat (Tabarani 6026) • Sahih Al-Jami' 176",
    grade: "حدیث صحیح — Sahih / Hasan",
    donorTakeaway: "Your selfless blood donation turns tears of anguish into tears of relief for suffering families, elevating you among the beloved servants of Allah.",
    donorTakeawayUrdu: "آپ کا بے لوث عطیہ پریشان کنبوں کے آنسوؤں کو مسکراہٹ میں بدل دیتا ہے، اور آپ کو اللہ کا محبوب بندہ بناتا ہے۔"
  },
  {
    id: 3,
    title: "Saving One Life Equals All Humanity",
    theme: "Supreme Sanctity of Human Life",
    arabic: "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
    urdu: "اور جس نے کسی ایک انسان کی جان بچائی، گویا اس نے تمام انسانوں کی جان بچا لی۔",
    english: "And whoever saves one life, it is as if he had saved the whole of humanity.",
    source: "Al-Qur'an — Surah Al-Ma'idah (5:32)",
    grade: "قرآن مجید — Surah 5:32",
    donorTakeaway: "A 15-minute blood donation can restart a patient's failing heart, earning you the immense reward of preserving all human lives on earth.",
    donorTakeawayUrdu: "آپ کے خون کی ایک بوتل کسی مرتے ہوئے انسان کی جان بچا سکتی ہے، اور قرآن کے مطابق یہ پوری انسانیت کو بچانے کے برابر ہے۔"
  },
  {
    id: 4,
    title: "Continuous Bodily Charity (Sadaqah)",
    theme: "Charity of Good Health & Physical Strength",
    arabic: "كُلُّ مَعْرُوفٍ صَدَقَةٌ",
    urdu: "ہر نیکی اور بھلائی کا کام صدقہ ہے، اور اچھی صحت میں ضرورت مند کو خون دینا ایک عظیم جسمانی صدقہ اور صدقۂ جاریہ ہے۔",
    english: "Every act of goodness is an ongoing charity (Sadaqah). Donating blood without monetary return is one of the purest forms of voluntary bodily charity.",
    source: "Sahih Al-Bukhari 6021 • Sahih Muslim 1005",
    grade: "متفق علیہ — Agreed Upon",
    donorTakeaway: "You do not need wealth to give noble charity; giving the gift of life from the good health Allah blessed you with is supreme, ongoing Sadaqah.",
    donorTakeawayUrdu: "صدقے کیلئے صرف مال کی ضرورت نہیں۔ اللہ کی دی ہوئی صحت میں سے کسی ضرورت مند کو خون دینا عظیم جسمانی صدقۂ جاریہ ہے۔"
  }
];

export default function DonorDashboard({ currentUser, onNavigateHome, onNavigateEmergency }) {
  const { t, isUrdu } = useLanguage();
  const donorData = currentUser || {
    name: 'Muhammad Adil',
    email: 'adilraxiq64@gmail.com',
    bloodGroup: 'B+',
    age: 26,
    phone: '03494996898',
    address: 'Shergarh, Mardan',
    isAvailable: true,
    totalDonations: 1
  };

  const [isAvailable, setIsAvailable] = useState(
    donorData.isAvailable !== undefined ? donorData.isAvailable : true
  );
  const [totalDonations, setTotalDonations] = useState(donorData.totalDonations || 0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    hospital: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const bloodGroup = donorData.bloodGroup || 'B+';
  const compatibility = COMPATIBILITY_MAP[bloodGroup] || COMPATIBILITY_MAP['B+'];

  // Toggle availability in backend and local state
  const handleToggleAvailability = async () => {
    const nextStatus = !isAvailable;
    setUpdatingStatus(true);
    setIsAvailable(nextStatus);

    try {
      const userId = donorData.id || donorData._id;
      if (userId) {
        await updateUserProfile(userId, { isAvailable: nextStatus });
        // Update stored user in localStorage if exists
        const stored = localStorage.getItem('lifelink_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem('lifelink_user', JSON.stringify({ ...parsed, isAvailable: nextStatus }));
        }
      }
      setStatusMessage({
        type: 'success',
        text: nextStatus ? 'Status updated: You are marked as AVAILABLE for urgent requests.' : 'Status updated: You are temporarily resting.'
      });
    } catch (err) {
      console.error('Failed to update availability:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to sync with cloud database, but local status changed.'
      });
    } finally {
      setUpdatingStatus(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Log a completed blood donation
  const handleLogDonationSubmit = async (e) => {
    e.preventDefault();
    const newTotal = totalDonations + 1;
    setTotalDonations(newTotal);
    setShowLogModal(false);

    try {
      const userId = donorData.id || donorData._id;
      if (userId) {
        await updateUserProfile(userId, { totalDonations: newTotal });
        const stored = localStorage.getItem('lifelink_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem('lifelink_user', JSON.stringify({ ...parsed, totalDonations: newTotal }));
        }
      }
      setStatusMessage({
        type: 'success',
        text: `Donation logged! Congratulations on reaching ${newTotal} blood donation${newTotal > 1 ? 's' : ''}! 🩸`
      });
    } catch (err) {
      console.error('Failed to persist donation count:', err);
    } finally {
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto animate-fade-in space-y-8">
      
      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all shadow-md ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 🩸 Welcome Donor Hero Banner */}
      <div className="glass-card bg-white rounded-3xl p-6 sm:p-10 border border-red-100 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 flex-shrink-0">
                <User className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{t('badge_verified', 'Verified LifeLink Volunteer Donor')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-gray-900 mb-1">
                {t('donor_welcome', 'Welcome back')}, {donorData.name}!
              </h1>
              <p className="text-gray-500 text-sm max-w-xl">
                {t('donor_subtitle', 'Your personal donor hub. Keep your availability updated so hospitals and coordinators can reach you during critical moments.')}
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-2 bg-slate-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl border lg:border-none border-gray-200">
            <button
              onClick={handleToggleAvailability}
              disabled={updatingStatus}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
                isAvailable
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              <span>{isAvailable ? `🟢 ${t('status_available', 'Available to Donate')}` : `⚪ ${t('status_resting', 'Temporarily Resting')}`}</span>
            </button>
            <span className="text-[11px] text-gray-400 text-center lg:text-right">
              {isAvailable ? t('donor_available_msg') : t('donor_resting_msg')}
            </span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold border border-red-200">
            <Droplets className="w-4 h-4 text-red-600" />
            <span>{isUrdu ? 'بلڈ گروپ' : 'Blood Group'}: {bloodGroup}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{donorData.phone || '03494996898'}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{donorData.address || 'Shergarh, Mardan'}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{donorData.email || 'adilraxiq64@gmail.com'}</span>
          </div>
        </div>
      </div>

      {/* 🚀 PATIENTS IN NEED JUMP BANNER (Clear Separation) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Droplets className="w-64 h-64 -mr-16" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ملک گیر ہنگامی براڈکاسٹ' : 'National SOS Broadcast'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight mb-2">
              {t('donor_cta_title', 'Looking to Respond to Hospital Emergencies?')}
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">
              {t('donor_cta_desc', 'Explore the nationwide Patients In Need board. Filter by your blood group or city to connect with families and hospital blood banks right now.')}
            </p>
          </div>

          <button
            onClick={onNavigateEmergency}
            className="flex-shrink-0 bg-white text-red-600 hover:bg-red-50 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm cursor-pointer group"
          >
            <span>{t('donor_cta_btn', 'Open Patients In Need')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 📊 Personal Donor Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Blood Group */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-red-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-display">{bloodGroup}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">
            {isUrdu ? 'آپ کا بلڈ گروپ' : 'Your Blood Group'}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">{compatibility.label}</div>
        </div>

        {/* Readiness Status */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-emerald-200 transition-all">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
            isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Activity className="w-6 h-6" />
          </div>
          <div className={`text-2xl font-extrabold font-display ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isAvailable ? (isUrdu ? 'دستیاب' : 'Ready') : (isUrdu ? 'آرام پر' : 'Resting')}
          </div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">
            {isUrdu ? 'موجودہ دستیابی' : 'Current Availability'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {isAvailable 
              ? (isUrdu ? 'ایمرجنسی کیلئے تیار' : 'Standby for emergencies') 
              : (isUrdu ? 'عارضی طور پر موقوف' : 'Temporarily paused')}
          </div>
        </div>

        {/* Total Donations Logged */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-purple-200 transition-all relative">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-display">{totalDonations}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">
            {isUrdu ? 'تصدیق شدہ عطیات' : 'Verified Donations'}
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'عطیہ درج کریں' : 'Log a Donation'}</span>
          </button>
        </div>

        {/* 24/7 Helpline */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-blue-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-gray-900 font-display truncate">03494996898</div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">
            {isUrdu ? 'لائف لنک ہیلپ لائن' : 'LifeLink Helpline'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {isUrdu ? 'مرکزی دفتر: شیرگڑھ، مردان' : 'Shergarh, Mardan HQ'}
          </div>
        </div>
      </div>

      {/* 📖 Virtues of Saving Lives & Authentic Hadiths for Donors */}
      <section className="glass-card bg-gradient-to-br from-amber-50/70 via-white to-red-50/50 rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-md relative overflow-hidden">
        {/* Subtle Calligraphy Watermark */}
        <div className="absolute -top-4 -right-4 text-red-900/5 text-9xl font-urdu select-none pointer-events-none">
          ﷺ
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              <span>{isUrdu ? 'فضائل و برکات • خون کے عطیہ کی دینی فضیلت' : 'فضائل و برکات • Spiritual Virtues of Blood Donation'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900">
              {isUrdu ? 'اسلام میں خون کا عطیہ دینے کا عظیم الشان اجر' : 'The Divine Honor of Donating Blood in Islam'}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {isUrdu 
                ? 'کسی پریشان حال انسان کی جان بچانے کیلئے خون کا عطیہ دینا افضل ترین صدقۂ جاریہ اور اللہ تعالیٰ کی خصوصی رحمت و مغفرت کا ذریعہ ہے۔'
                : "Donating a portion of your healthy blood to save a fellow human in critical distress is one of the highest acts of voluntary physical charity (صدقۂ جاریہ) and a direct means of earning Allah's mercy."}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-300 px-4 py-2 rounded-2xl shadow-xs">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>{isUrdu ? 'صحیح احادیث مبارکہ' : 'صحیح احادیث مبارکہ (Authentic References)'}</span>
          </div>
        </div>

        {/* 2x2 Grid of Authentic Hadiths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {DONOR_HADITHS.map((item) => (
            <div
              key={item.id}
              className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 sm:p-7 border border-amber-200/70 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag & Hadith Grade */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    {item.theme}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {item.grade}
                  </span>
                </div>

                {/* Arabic Text */}
                <div 
                  className="bg-amber-50/50 border-r-4 border-r-amber-500 rounded-xl p-4 my-3 text-right text-gray-900 font-serif text-base sm:text-lg leading-loose select-text shadow-inner" 
                  dir="rtl"
                >
                  «{item.arabic}»
                </div>

                {/* Urdu Translation */}
                <p 
                  className="text-right text-gray-800 text-sm font-urdu leading-loose my-2.5 select-text" 
                  dir="rtl"
                >
                  "{item.urdu}"
                </p>

                {/* English Translation */}
                <blockquote className="text-xs sm:text-sm italic text-gray-600 mt-2.5 pl-3 border-l-2 border-red-400 leading-relaxed">
                  "{item.english}"
                </blockquote>

                <div className="text-right text-[11px] font-bold text-gray-400 mt-2 tracking-wider">
                  — {item.source}
                </div>
              </div>

              {/* Donor Motivational Connection */}
              <div className="mt-5 pt-3 border-t border-amber-100 bg-gradient-to-r from-red-50/80 to-amber-50/40 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 sm:p-5 rounded-b-2xl">
                <div className="flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5 fill-red-600 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    <strong className="text-red-700">{isUrdu ? 'ڈونرز کیلئے ترغیب:' : 'Motivation for Donors:'}</strong>{' '}
                    {isUrdu ? (item.donorTakeawayUrdu || item.donorTakeaway) : item.donorTakeaway}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧪 Section 2: Blood Compatibility Matrix & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900">
                {isUrdu ? `بلڈ گروپ کی مطابقت: ${bloodGroup}` : `Blood Group Compatibility: ${bloodGroup}`}
              </h2>
              <p className="text-xs text-gray-500">
                {isUrdu ? 'عالمی ادارہ صحت (WHO) کے مطابق محفوظ خون کی منتقلی کے اصول' : 'Transfusion matching rules according to WHO guidelines'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 block mb-2">
                {isUrdu ? `🩸 جن مریضوں کو آپ براہِ راست خون دے سکتے ہیں (${bloodGroup}):` : `🩸 Patients You Can Directly Save (${bloodGroup} Donates to):`}
              </span>
              <div className="flex flex-wrap gap-2">
                {compatibility.canDonateTo.map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-700 font-bold text-xs shadow-xs"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                {isUrdu ? '🛡️ ذاتی ایمرجنسی کی صورت میں (آپ ان سے خون لے سکتے ہیں):' : '🛡️ In Case of Personal Emergency (You Can Receive From):'}
              </span>
              <div className="flex flex-wrap gap-2">
                {compatibility.canReceiveFrom.map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs shadow-xs"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{isUrdu ? 'خون کا صرف ۱ عطیہ ۳ مختلف مریضوں کی جانیں بچانے کیلئے کافی ہوتا ہے۔' : '1 single whole blood donation can be separated to save up to 3 individual patients.'}</span>
          </div>
        </div>

        {/* 🩺 Section 3: Safe Donation & Eligibility Checklist */}
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900">
                {isUrdu ? 'ڈونر کی صحت اور اہلیت کا جائزہ' : 'Donor Health Readiness Checklist'}
              </h2>
              <p className="text-xs text-gray-500">
                {isUrdu ? 'خون دینے جانے سے پہلے ان بنیادی شرائط کی تصدیق کر لیں' : 'Ensure these pre-conditions before heading to donate'}
              </p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">{isUrdu ? 'وزن اور عمر:' : 'Weight & Age:'}</strong>{' '}
                {isUrdu ? 'کم از کم وزن ۵۰ کلوگرام اور عمر ۱۸ سے ۶۰ سال کے درمیان ہو۔' : 'Minimum 50 kg (110 lbs) and aged between 18–60 years.'}
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">{isUrdu ? 'عطیات کا درمیانی وقفہ:' : 'Safe Donation Gap:'}</strong>{' '}
                {isUrdu ? 'پچھلے عطیہ سے کم از کم ۹۰ دن (۳ ماہ) کا وقفہ گزر چکا ہو۔' : 'Minimum 90 days (3 months) since your last whole blood donation.'}
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">{isUrdu ? 'صحت اور ادویات:' : 'Health & Vitals:'}</strong>{' '}
                {isUrdu ? 'گزشتہ ۷ دنوں میں بخار، کھانسی، نزلہ یا کوئی اینٹی بائیوٹک دوا نہ لی ہو۔' : 'No fever, cough, flu, or active antibiotic intake in the last 7 days.'}
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">{isUrdu ? 'آرام اور پانی:' : 'Hydration & Rest:'}</strong>{' '}
                {isUrdu ? 'کم از کم ۶ گھنٹے پرسکون نیند لی ہو اور وافر مقدار میں پانی پیا ہو۔' : 'Had at least 6 hours of sound sleep and drank plenty of water.'}
              </div>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">{isUrdu ? 'طبی رہنمائی درکار ہے؟' : 'Need medical advice?'}</span>
            <a
              href="tel:03494996898"
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ہیلپ لائن: 03494996898' : 'Call Helpline 03494996898'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 📍 Central Operations & Support Info Card */}
      <div className="glass-card bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            {isUrdu ? 'لائف لنک مرکزی رابطہ دفتر' : 'LifeLink Central Operations'}
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            {isUrdu ? 'شیرگڑھ، مردان، خیبر پختونخوا' : 'Shergarh, Mardan, Khyber Pakhtunkhwa'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isUrdu ? 'سرکاری ای میل:' : 'Official Email:'} <a href="mailto:adilraxiq64@gmail.com" className="text-red-600 hover:underline font-semibold">adilraxiq64@gmail.com</a> • {isUrdu ? 'ہیلپ لائن:' : 'Official Helpline:'} <span className="text-gray-900 font-semibold">03494996898</span>
          </p>
        </div>

        <button
          onClick={onNavigateEmergency}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>{isUrdu ? 'ضرورت مند مریض تلاش کریں' : 'Find Patient in Need'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 📝 Log Donation Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-red-100 overflow-hidden">
            <div className="p-6 bg-red-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'زندگی بچانے کا ریکارڈ' : 'Lifesaver Record'}</span>
                </div>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-white/80 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-xl font-bold font-display">{isUrdu ? 'نیا عطیہ درج کریں' : 'Log a New Donation'}</h3>
              <p className="text-xs text-red-100 mt-1">
                {isUrdu ? 'اپنے پروفائل کو اپ ڈیٹ کرنے کیلئے اپنے حالیہ کامیاب خون کے عطیہ کا اندراج کریں۔' : 'Record your latest successful blood donation to update your profile.'}
              </p>
            </div>

            <form onSubmit={handleLogDonationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {isUrdu ? 'عطیہ کی تاریخ' : 'Donation Date'}
                </label>
                <input
                  type="date"
                  required
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {isUrdu ? 'ہسپتال / بلڈ سنٹر کا نام' : 'Hospital / Blood Center Name'}
                </label>
                <input
                  type="text"
                  placeholder={isUrdu ? 'مثلاً مردان میڈیکل کمپلیکس، شیرگڑھ کلینک' : 'e.g. Mardan Medical Complex, Shergarh Clinic'}
                  value={logForm.hospital}
                  onChange={(e) => setLogForm({ ...logForm, hospital: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {isUrdu ? 'نوٹس (اختیاری)' : 'Notes (Optional)'}
                </label>
                <textarea
                  rows="2"
                  placeholder={isUrdu ? 'مریض کا نام یا اضافی تفصیل...' : 'Patient name or general notes...'}
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-medical text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-medical cursor-pointer"
                >
                  {isUrdu ? 'عطیہ محفوظ کریں' : 'Save Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
