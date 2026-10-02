import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Heart, Activity, Shield, MapPin, 
  Phone, MessageCircle, AlertTriangle, Droplets, Sparkles 
} from 'lucide-react';

export default function PatientsCarousel({ patients = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Touch swipe handling for mobile
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const minSwipeDistance = 45;

  const items = patients;

  // Auto-advance slide every 6 seconds if multiple items and not paused
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
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
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  if (!items || items.length === 0) {
    return (
      <section id="emergencies" className="py-6 sm:py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-12 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl text-white">
            <div className="max-w-xl mx-auto space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold font-display">LifeLink Emergency Network Active</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                All recent emergency blood requests have verified donors responding. In case of an urgent need at any hospital, post an SOS alert immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentPatient = items[currentIndex] || items[0];
  const Icon = currentPatient.Icon || Heart;

  return (
    <section id="emergencies" className="py-6 sm:py-10 px-3 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6 px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>LIVE HOSPITAL BROADCAST</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 font-display">
              Critical Patients Needing Blood
            </h2>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Case {currentIndex + 1} of {items.length}</span>
            <span className="hidden sm:inline">• Auto-refreshing</span>
          </div>
        </div>

        {/* Carousel Card Container */}
        <div 
          className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Subtle dotted background grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          {/* Active Card Body with Animated Keyframe */}
          <div 
            key={currentPatient.id || currentIndex}
            className="animate-fade-in p-5 sm:p-10 lg:p-14 relative z-10"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
              
              {/* Left Column: Patient Medical Details */}
              <div className="w-full lg:w-3/5">
                <div className="glass-card bg-white/95 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-gray-900 shadow-2xl border border-white/80">
                  
                  {/* Top Bar: Avatar + Name + Urgency Pill */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      {currentPatient.avatar ? (
                        <img
                          src={currentPatient.avatar}
                          alt={currentPatient.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-red-200 shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center border-2 border-red-200 shadow-sm flex-shrink-0">
                          {currentPatient.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg sm:text-2xl font-extrabold text-gray-950 leading-tight">
                          {currentPatient.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {currentPatient.condition || 'Emergency Transfusion Required'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase border flex items-center gap-1 shadow-xs flex-shrink-0 ${
                      currentPatient.urgency === 'Critical'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      <span>{currentPatient.urgency || 'Critical'}</span>
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm">
                    {/* Blood Group */}
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                        {currentPatient.bloodType}
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-500 block uppercase font-semibold">Blood Type</span>
                        <span className="font-bold text-gray-900">{currentPatient.bloodType} Required</span>
                      </div>
                    </div>

                    {/* Units Needed */}
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                        {currentPatient.units || '2'}
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-500 block uppercase font-semibold">Quantity</span>
                        <span className="font-bold text-gray-900">{currentPatient.units || '2'} Unit(s) Needed</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-gray-200/70">
                      <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-gray-900">{currentPatient.hospital}</span>
                        {currentPatient.city && (
                          <span className="text-gray-500 text-xs ml-1 font-medium">({currentPatient.city})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Patient Story / Request Note */}
                  <p className="text-gray-600 italic text-xs sm:text-sm leading-relaxed mb-5 bg-white p-3 rounded-xl border border-gray-100">
                    "{currentPatient.story || `Urgent blood required for patient at ${currentPatient.hospital}. Please contact immediately if you can donate.`}"
                  </p>

                  {/* Action Buttons: Phone & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${currentPatient.contact || '03494996898'}`}
                      className="btn-medical text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-medical flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Hospital / Family</span>
                    </a>

                    <a
                      href={`https://wa.me/${(currentPatient.contact || '03494996898').replace(/[^0-9]/g, '').replace(/^0/, '92')}?text=${encodeURIComponent(
                        `Salam! I saw the emergency request on LifeLink for ${currentPatient.name} needing ${currentPatient.bloodType} at ${currentPatient.hospital}. Can I assist with blood donation?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Coordinator</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Photo & Life-Saving Emblem (Visible on Desktop, sleek on Mobile) */}
              <div className="w-full lg:w-2/5 flex flex-col items-center justify-center">
                <div className="relative group max-w-xs sm:max-w-sm">
                  <img
                    src={currentPatient.heroImage || '/hero_slide_2.jpg'}
                    alt={currentPatient.name}
                    className="w-full h-48 sm:h-72 lg:h-96 object-cover rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/20 transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Pulsing Emblem */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 medical-gradient rounded-2xl flex items-center justify-center shadow-medical-lg glow-effect">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white pulse-heart" />
                  </div>

                  {/* Caption on Photo */}
                  <div className="absolute bottom-3 left-3 right-3 text-center sm:text-left">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest block">
                      VERIFIED EMERGENCY CASE
                    </span>
                    <span className="text-xs sm:text-sm text-white font-semibold drop-shadow">
                      {currentPatient.hospital} • {currentPatient.city || 'Emergency Unit'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Desktop Navigation Arrows (Comfortably positioned on sides) */}
          {items.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 text-white items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 z-20 backdrop-blur-md border border-white/20 cursor-pointer"
                aria-label="Previous patient"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 text-white items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 z-20 backdrop-blur-md border border-white/20 cursor-pointer"
                aria-label="Next patient"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Bar: Touch Indicator Dots & Mobile Arrow Controls */}
          {items.length > 1 && (
            <div className="flex items-center justify-between px-6 pb-4 pt-1 border-t border-white/10 relative z-20">
              <button
                onClick={prevSlide}
                className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px]">Prev</span>
              </button>

              {/* Indicator Dots */}
              <div className="flex justify-center items-center gap-2 mx-auto">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === index
                        ? 'w-7 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-[11px]">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
