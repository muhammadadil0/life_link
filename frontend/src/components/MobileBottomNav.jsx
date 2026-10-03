import React from 'react';
import { Home, Users, AlertTriangle, Heart, Activity, Droplets, LogIn, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav({ currentView, setCurrentView, currentUser, onOpenSos }) {
  const { t } = useLanguage();
  const isDonor = currentUser && currentUser.userType === 'donor';
  const isPatient = currentUser && currentUser.userType === 'patient';

  // Construct 4 surrounding tabs based on user persona (tab 3 is always the center SOS FAB)
  const getTabs = () => {
    if (isDonor) {
      return [
        { id: 'home', label: t('mob_home', 'Home'), icon: Home },
        { id: 'emergency', label: t('mob_patients', 'Patients'), icon: AlertTriangle },
        // Center FAB handled separately
        { id: 'donor_dashboard', label: t('mob_my_portal', 'My Portal'), icon: Heart },
        { id: 'contact', label: t('mob_support', 'Support'), icon: PhoneCall },
      ];
    }

    if (isPatient) {
      return [
        { id: 'home', label: t('mob_home', 'Home'), icon: Home },
        { id: 'donors', label: t('mob_donors', 'Donors'), icon: Users },
        // Center FAB handled separately
        { id: 'patient_dashboard', label: t('mob_my_portal', 'My Portal'), icon: Activity },
        { id: 'contact', label: t('mob_support', 'Support'), icon: PhoneCall },
      ];
    }

    // Guest visitor tabs
    return [
      { id: 'home', label: t('mob_home', 'Home'), icon: Home },
      { id: 'donors', label: t('mob_donors', 'Donors'), icon: Users },
      // Center FAB handled separately
      { id: 'emergency', label: t('mob_urgent', 'Urgent'), icon: AlertTriangle },
      { id: 'login', label: t('mob_signin', 'Sign In'), icon: LogIn },
    ];
  };

  const tabs = getTabs();
  const leftTabs = [tabs[0], tabs[1]];
  const rightTabs = [tabs[2], tabs[3]];

  return (
    <nav 
      aria-label="Mobile Bottom App Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] select-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2 relative">
        {/* Left 2 Tabs */}
        {leftTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-red-600' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-red-600' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Center Floating SOS Button (Elevated FAB) */}
        <div className="flex flex-col items-center justify-center -mt-5 relative z-10">
          <button
            onClick={onOpenSos}
            aria-label="Instant 10-Second Emergency Blood SOS"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-rose-600 text-white shadow-[0_6px_20px_rgba(239,68,68,0.5)] border-4 border-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative group"
          >
            {/* Animated pulsating halo */}
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-40 animate-ping pointer-events-none group-hover:opacity-75" />
            <Droplets className="w-6 h-6 fill-current relative z-10" />
          </button>
          <span className="text-[10px] font-black text-red-600 tracking-wider uppercase mt-1">
            {t('mob_sos', '10s SOS')}
          </span>
        </div>

        {/* Right 2 Tabs */}
        {rightTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive ? 'text-red-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-red-600' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-red-600' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
