import React from 'react';
import { Heart, AlertTriangle, Users, LogIn, UserPlus, Sparkles, Activity, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ currentView, setCurrentView, currentUser, onLogout, onOpenSos }) {
  const { language, toggleLanguage, isUrdu, t } = useLanguage();

  const isDonor = currentUser && currentUser.userType === 'donor';
  const isPatient = currentUser && currentUser.userType === 'patient';
  const isAdmin = currentUser && currentUser.userType === 'admin';

  return (
    <nav className="glass-effect sticky top-0 z-40 border-b border-white/20 select-none">
      <div className="container mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center space-x-2.5 sm:space-x-4 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-13 sm:h-13 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md border-2 border-red-100 group-hover:border-red-300 transition-all overflow-hidden p-0.5 sm:p-1 flex-shrink-0">
              <img 
                src="/logo.jpg" 
                alt="LifeLink Logo" 
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>';
                }}
              />
            </div>
            <div className="transition-all duration-300 group-hover:scale-105">
              <span className="text-xl sm:text-2xl font-bold font-display bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                LifeLink
              </span>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase">
                {isDonor ? t('brand_donor_sub') : isPatient ? t('brand_patient_sub') : t('brand_sub')}
              </div>
            </div>
          </button>

          {/* ============================================================== */}
          {/* DESKTOP NAVIGATION LINKS: ROLE-AWARE DIFFERENTIATION           */}
          {/* ============================================================== */}
          <div className="hidden md:flex items-center space-x-1.5">
            {/* Common Home */}
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentView === 'home'
                  ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              {t('nav_home')}
            </button>

            {/* --- 🩸 DONOR PERSONA NAVIGATION --- */}
            {isDonor && (
              <>
                <button
                  onClick={() => setCurrentView('donor_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'donor_dashboard'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{t('nav_donor_portal')}</span>
                </button>

                <button
                  onClick={() => setCurrentView('emergency')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'emergency'
                      ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                  title="View patients in hospital emergencies who need your blood"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{t('nav_patients_need')}</span>
                </button>
              </>
            )}

            {/* --- 🏥 PATIENT PERSONA NAVIGATION --- */}
            {isPatient && (
              <>
                <button
                  onClick={() => setCurrentView('patient_dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'patient_dashboard'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{t('nav_patient_portal')}</span>
                </button>

                <button
                  onClick={() => setCurrentView('donors')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'donors'
                      ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav_find_donors')}</span>
                </button>

                {/* 🚨 Quick SOS Blood Button for Patients */}
                <button
                  onClick={onOpenSos}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/90 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                  title="Quick SOS: Broadcast urgent blood request in 10 seconds"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span>{t('nav_sos_btn')}</span>
                </button>
              </>
            )}

            {/* --- 🌐 GUEST / VISITOR NAVIGATION (When not logged in) --- */}
            {!currentUser && (
              <>
                <button
                  onClick={() => setCurrentView('emergency')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'emergency'
                      ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>{t('nav_emergency')}</span>
                </button>

                {/* 🚨 10-Second Quick SOS Blood Button */}
                <button
                  onClick={onOpenSos}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/90 shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                  title="Quick SOS: Broadcast blood request in 10 seconds without sign-up"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span>{t('nav_sos_btn')}</span>
                </button>

                <button
                  onClick={() => setCurrentView('donors')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    currentView === 'donors'
                      ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  {t('nav_find_donors')}
                </button>
              </>
            )}

            {/* Common Contact */}
            <button
              onClick={() => setCurrentView('contact')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                currentView === 'contact'
                  ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              {t('nav_contact')}
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* 🌐 Desktop Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-slate-50 text-gray-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:border-red-300"
              title={isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
            >
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Profile Pill & Role Indicator */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer"
                  >
                    {t('nav_admin')}
                  </button>
                )}

                {/* Personalized User Card */}
                <div className={`flex items-center gap-2.5 py-1 px-3 rounded-xl border ${
                  isDonor 
                    ? 'bg-emerald-50/80 border-emerald-200' 
                    : isPatient 
                    ? 'bg-red-50/80 border-red-200' 
                    : 'bg-slate-100 border-gray-200'
                }`}>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                    isDonor ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-800 block truncate max-w-[110px] leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isDonor ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {isDonor 
                        ? (isUrdu ? `ڈونر • ${currentUser.bloodGroup || 'تیار'}` : `Donor • ${currentUser.bloodGroup || 'Ready'}`) 
                        : isPatient 
                        ? (isUrdu ? `مریض • ${currentUser.bloodGroup || 'درکار'}` : `Patient • ${currentUser.bloodGroup || 'Needed'}`) 
                        : (isUrdu ? 'ایڈمن' : 'Admin')}
                    </span>
                  </div>

                  <button
                    onClick={onLogout}
                    className="ml-1 text-[11px] text-gray-400 hover:text-red-600 font-medium cursor-pointer transition-colors"
                    title="Sign Out"
                  >
                    {t('nav_signout')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView('login')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center cursor-pointer ${
                    currentView === 'login'
                      ? 'text-red-600 bg-red-50/80 font-bold shadow-xs'
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span>{t('nav_login')}</span>
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-200 cursor-pointer ${
                    currentView === 'register'
                      ? 'btn-medical text-white ring-2 ring-red-400 ring-offset-2'
                      : 'btn-medical text-white shadow-medical hover:shadow-lg'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  <span>{t('nav_register')}</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Element: Language Switcher & Compact User Badge/Sign Out */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-slate-50 text-gray-800 flex items-center gap-1 shadow-xs cursor-pointer"
              title={isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
            >
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <span>{isUrdu ? 'EN' : 'اردو'}</span>
            </button>

            {currentUser && (
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                  isDonor ? 'bg-emerald-600' : 'bg-red-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-600 font-bold px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                >
                  {t('nav_signout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
