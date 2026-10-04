import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Heart, Search, MapPin, Droplets, 
  Activity, Users, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LargeHeroCarousel({ onNavigateRegister, onNavigateDonors, onOpenSos }) {
  const { t, isUrdu } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Interactive Live Search states
  const [searchBloodType, setSearchBloodType] = useState('O-');
  const [searchCity, setSearchCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  // Live activity alerts ticker
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const liveAlerts = isUrdu ? [
    { text: 'فوری ضرورت: سٹی ہسپتال میں O- خون درکار ہے', time: 'ابھی' },
    { text: 'A+ بلڈ ایمرجنسی کیلئے تصدیق شدہ ڈونر دستیاب', time: '۲ منٹ قبل' },
    { text: 'علاقائی نیٹ ورک میں نیا رضاکار ڈونر شامل', time: '۷ منٹ قبل' },
    { text: 'ایمرجنسی مریض کیلئے B- خون کی بوتلیں روانہ', time: '۱۲ منٹ قبل' },
  ] : [
    { text: 'Urgent: O- needed at City General Hospital', time: 'Just now' },
    { text: 'Verified donor matched for urgent A+ transfusion request', time: '2m ago' },
    { text: 'New volunteer blood donor verified in regional network', time: '7m ago' },
    { text: '2 units of B- dispatched for emergency patient care', time: '12m ago' },
  ];

  const slides = [
    {
      id: 1,
      image: '/hero_slide_1.jpg',
      badge: t('hero_badge_1', 'HEROES AMONG US'),
      badgeColor: 'bg-red-600/90 text-white',
      title: t('hero_title_1', 'Save Lives Today'),
      subtitle: t('hero_sub_1', 'One blood donation can save up to 3 lives. Be a hero for someone in need.'),
      stat: t('hero_stat_1', '1,250+ Active Donors Ready'),
      ctaText: t('hero_cta_1', 'Become a Donor')
    },
    {
      id: 2,
      image: '/hero_slide_2.jpg',
      badge: t('hero_badge_2', 'RAPID EMERGENCY RESPONSE'),
      badgeColor: 'bg-emerald-600/90 text-white',
      title: t('hero_title_2', 'Connected in Minutes'),
      subtitle: t('hero_sub_2', 'Connecting families in distress with verified donors in your exact city.'),
      stat: t('hero_stat_2', '2.3 min Avg Match Time'),
      ctaText: t('hero_cta_2', 'Find Blood Urgently')
    },
    {
      id: 3,
      image: '/hero_slide_3.jpg',
      badge: t('hero_badge_3', 'COMMUNITY MOVEMENT'),
      badgeColor: 'bg-blue-600/90 text-white',
      title: t('hero_title_3', '18,000+ Lifesavers'),
      subtitle: t('hero_sub_3', 'A passionate nationwide network standing ready 24/7 for critical emergencies.'),
      stat: t('hero_stat_3', '98% Emergency Fulfillment'),
      ctaText: t('hero_cta_3', 'Join Our Community')
    },
    {
      id: 4,
      image: '/hero_slide_4.jpg',
      badge: t('hero_badge_4', 'DIRECT LIFE CONNECTION'),
      badgeColor: 'bg-rose-600/90 text-white',
      title: t('hero_title_4', 'Every Drop Counts'),
      subtitle: t('hero_sub_4', 'Direct hospital dispatch and peer-to-peer blood donation without middlemen.'),
      stat: t('hero_stat_4', '2,840+ Lives Saved'),
      ctaText: t('hero_cta_4', 'Check Compatibility')
    }
  ];

  // Continuous auto-play with smooth progress bar (every 5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40; // 40ms tick
    const duration = 5000;   // 5000ms per slide
    const step = (100 / (duration / intervalTime));

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Live alert ticker interval
  useEffect(() => {
    const alertTimer = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % liveAlerts.length);
    }, 3800);
    return () => clearInterval(alertTimer);
  }, [liveAlerts.length]);

  // Touch gestures for mobile swipe
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const minSwipeDistance = 45;

  const handlePrev = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const onTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const selectSlide = (idx) => {
    setProgress(0);
    setCurrentSlide(idx);
  };

  const handleLiveSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
        found: true,
        count: Math.floor(Math.random() * 8) + 4,
        bloodType: searchBloodType,
        city: searchCity || 'Nearby (within 5 km)',
        nearestHospital: 'City General Hospital (1.8 km)'
      });
    }, 1000);
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="w-full">
      {/* 🚀 EDGE-TO-EDGE FULL-WIDTH CAROUSEL (Directly under Navbar) */}
      <section 
        className="relative w-full h-[62vh] sm:h-[75vh] md:h-[84vh] min-h-[440px] max-h-[880px] overflow-hidden bg-black text-white select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 🌟 ULTRA-SMOOTH PROGRESS BAR (Spans 100% of top edge) */}
        <div className="absolute top-0 left-0 right-0 z-40 h-1 sm:h-1.5 bg-white/20 backdrop-blur-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(239,68,68,0.9)] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carousel Slides */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Full-bleed Edge-to-Edge Image with Cinematic Slow Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Subtle Cinematic Vignette & Gradient Overlays (Allows photo to shine while keeping text readable) */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/30 to-transparent max-w-3xl" />
              </div>

              {/* Minimalist, Clean Text Overlay */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-12 flex flex-col justify-end pb-14 sm:pb-24">
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                    <span className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-md ${slide.badgeColor}`}>
                      {slide.badge}
                    </span>
                    <span className="bg-black/50 backdrop-blur-md border border-white/20 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-200">
                      {slide.stat}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-5xl md:text-7xl font-extrabold font-display tracking-tight text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h1>

                  {/* Concise Subtitle */}
                  <p className="text-gray-200 text-xs sm:text-base font-light max-w-xl leading-relaxed mb-3 sm:mb-6 drop-shadow line-clamp-2 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button 
                      onClick={slide.id === 2 && onOpenSos ? onOpenSos : onNavigateRegister}
                      className="btn-medical text-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-base shadow-medical-lg flex items-center gap-1.5 sm:gap-2 group cursor-pointer active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current group-hover:scale-110 transition-transform" />
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {onOpenSos && (
                      <button
                        onClick={onOpenSos}
                        className="bg-red-600/90 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/50 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-base transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-lg cursor-pointer"
                        title="Instant Emergency Blood SOS"
                      >
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>🚨 10s Instant SOS</span>
                      </button>
                    )}
                    <a
                      href="#donor-search"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-base transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 shadow-lg"
                    >
                      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-300" />
                      <span>Find Donors</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows (Desktop Only, mobile users swipe) */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600/90 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-red-600/90 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Live Telemetry Pill in Bottom-Right Corner */}
        <div className="hidden md:flex absolute bottom-6 right-6 z-30 bg-black/70 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl items-center gap-3 shadow-2xl max-w-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
          <div className="text-xs">
            <span className="text-red-400 font-bold uppercase tracking-wider mr-1.5">LIVE:</span>
            <span className="text-gray-200 font-medium">{liveAlerts[activeAlertIndex].text}</span>
          </div>
        </div>

        {/* Bottom Slide Indicators & Thumbnails */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => selectSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-10 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 🔍 PEOPLE SEARCHING FOR BLOOD (Live Donor Radar) */}
      <div id="donor-search" className="container mx-auto max-w-6xl px-3 sm:px-6 -mt-6 sm:-mt-12 relative z-30 mb-8 sm:mb-16">
        <div className="glass-card bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-red-100 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-600">
                  {t('hero_search_title', 'Live Donor Radar & Hospital Finder')}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 font-display">
                {isUrdu ? 'اس وقت خون کے ضرورت مند افراد' : 'People Searching for Blood Right Now'}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">
                {isUrdu ? 'قریبی دستیاب بلڈ ڈونرز اور ہسپتالوں کے بلڈ بینکس کو فوری اسکین کرنے کیلئے بلڈ گروپ اور شہر کا انتخاب کریں۔' : 'Select your blood group and city to scan available life-savers and active blood banks immediately.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-red-700 text-xs sm:text-sm font-semibold shadow-xs self-start md:self-auto">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              <span>{isUrdu ? '۱۲۵۰+ ڈونرز آن لائن الرٹ' : '1,250 Donors Online Near You'}</span>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleLiveSearch} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5 sm:mb-2">
                {t('hero_search_group', 'Select Blood Group Needed:')}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                {bloodTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setSearchBloodType(type)}
                    className={`py-2 px-2 sm:py-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer active:scale-95 ${
                      searchBloodType === type
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/30 scale-102 sm:scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span>{type}</span>
                    <Droplets className={`w-3 h-3 ${searchBloodType === type ? 'text-white' : 'text-red-500'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="sm:col-span-2 relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder={t('hero_search_city', 'Enter City or Hospital (e.g., Lahore, General Hospital)')}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border border-gray-200 bg-white text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="btn-medical text-white py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-medical flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isUrdu ? 'ریڈار اسکین ہو رہا ہے...' : 'Scanning Radar...'}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{isUrdu ? `${searchBloodType} ڈونرز اسکین کریں` : `Scan For ${searchBloodType} Donors`}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Search Result Simulation Display */}
          {searchResult && (
            <div className="mt-6 p-5 bg-gradient-to-r from-red-50 via-white to-green-50 rounded-2xl border border-red-200 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">
                      {searchResult.count} Compatible {searchResult.bloodType} Donors Available Right Now!
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Location: <span className="font-semibold text-gray-800">{searchResult.city}</span> • Closest: <span className="text-red-600 font-semibold">{searchResult.nearestHospital}</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={onOpenSos || onNavigateRegister}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  Alert These Donors (Instant SOS)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
