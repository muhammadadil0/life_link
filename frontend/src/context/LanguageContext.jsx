import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand
    brand_sub: 'Medical Network',
    brand_donor_sub: 'Donor Network',
    brand_patient_sub: 'Patient Care',

    // Navigation
    nav_home: 'Home',
    nav_donor_portal: 'My Donor Portal',
    nav_patients_need: 'Patients In Need',
    nav_patient_portal: 'My Patient Portal',
    nav_find_donors: 'Find Donors',
    nav_sos_btn: '10s SOS Blood',
    nav_emergency: 'Emergency',
    nav_contact: 'Contact Us',
    nav_login: 'Login',
    nav_register: 'Register',
    nav_signout: 'Sign Out',
    nav_admin: 'Admin Console',

    // Mobile Bottom Nav
    mob_home: 'Home',
    mob_patients: 'Patients',
    mob_donors: 'Donors',
    mob_sos: '10s SOS',
    mob_my_portal: 'My Portal',
    mob_support: 'Support',
    mob_urgent: 'Urgent',
    mob_signin: 'Sign In',

    // Common Actions
    btn_call_now: 'Call Now',
    btn_call_donor: 'Call Donor',
    btn_whatsapp: 'WhatsApp',
    btn_directions: 'Hospital Directions',
    btn_chat: 'Direct Chat',
    btn_portal_chat: 'Portal Chat',
    btn_search: 'Search',
    btn_view_map: 'Live Radar Map',
    btn_view_grid: 'Directory Cards',
    btn_broadcast_whatsapp: 'Broadcast on WhatsApp',
    btn_copy_link: 'Copy Link',
    btn_share_sos: 'Share SOS Alert',

    // Status & Badges
    status_available: 'Available to Donate',
    status_resting: 'Temporarily Resting',
    badge_verified: 'Verified Lifesaver',
    badge_critical: 'Critical',
    badge_high: 'High Urgency',
    badge_moderate: 'Urgent',
    badge_units: 'Units Needed',
    badge_donations: 'Donations Given',

    // Donor Dashboard
    donor_welcome: 'Welcome back',
    donor_subtitle: 'Your personal donor hub. Keep your availability updated so hospitals and coordinators can reach you during critical moments.',
    donor_cta_title: 'Looking to Respond to Hospital Emergencies?',
    donor_cta_desc: 'Explore the nationwide Patients In Need board. Filter by your blood group or city to connect with families and hospital blood banks right now.',
    donor_cta_btn: 'Open Patients In Need',
    donor_hadith_badge: 'Spiritual Virtues of Blood Donation',
    donor_hadith_title: 'The Divine Honor of Donating Blood in Islam',
    donor_readiness_title: 'Donor Health Readiness Checklist',
    donor_compat_title: 'Blood Group Compatibility',
    donor_log_btn: 'Log a Donation',

    // Emergency & Patients
    sos_broadcast_title: 'Real-Time Hospital SOS Broadcast',
    sos_broadcast_subtitle: 'Urgent blood transfusions needed right now across Pakistan',
    filter_all_blood: 'All Blood Types',
    filter_city_placeholder: 'Filter city (e.g. Lahore, Mardan)',
    post_emergency_btn: 'Post Emergency SOS',

    // WhatsApp Message Templates
    wa_sos_header: '🚨 *URGENT BLOOD REQUIRED — LIFELINK EMERGENCY SOS*',
    wa_patient: '👤 *Patient:*',
    wa_blood_needed: '🩸 *Required Blood Group:*',
    wa_units: '📦 *Units Needed:*',
    wa_hospital: '🏥 *Hospital:*',
    wa_city: '📍 *City:*',
    wa_contact: '📞 *Direct Urgent Contact:*',
    wa_respond_link: '👉 *Open on LifeLink & Respond Immediately:*',
    wa_footer: '_Whoever saves one life, it is as if he had saved mankind entirely. Please share in your groups!_'
  },

  ur: {
    // Brand
    brand_sub: 'میڈیکل نیٹ ورک',
    brand_donor_sub: 'ڈونر نیٹ ورک',
    brand_patient_sub: 'مریض نگہداشت',

    // Navigation
    nav_home: 'ہوم',
    nav_donor_portal: 'میرا ڈونر پورٹل',
    nav_patients_need: 'ضرورت مند مریض',
    nav_patient_portal: 'میرا مریض پورٹل',
    nav_find_donors: 'ڈونرز تلاش کریں',
    nav_sos_btn: '۱۰ سیکنڈ فوری خون',
    nav_emergency: 'ایمرجنسی',
    nav_contact: 'رابطہ کریں',
    nav_login: 'لاگ ان',
    nav_register: 'رجسٹر',
    nav_signout: 'سائن آؤٹ',
    nav_admin: 'ایڈمن کنسول',

    // Mobile Bottom Nav
    mob_home: 'ہوم',
    mob_patients: 'مریض',
    mob_donors: 'ڈونرز',
    mob_sos: 'فوری خون',
    mob_my_portal: 'میرا پورٹل',
    mob_support: 'رابطہ',
    mob_urgent: 'فوری ضرورت',
    mob_signin: 'سائن ان',

    // Common Actions
    btn_call_now: 'کال کریں',
    btn_call_donor: 'ڈونر کو کال کریں',
    btn_whatsapp: 'واٹس ایپ',
    btn_directions: 'ہسپتال کا راستہ',
    btn_chat: 'براہِ راست چیٹ',
    btn_portal_chat: 'پورٹل چیٹ',
    btn_search: 'تلاش کریں',
    btn_view_map: 'لائیو ریڈار نقشہ',
    btn_view_grid: 'ڈائریکٹری فہرست',
    btn_broadcast_whatsapp: 'واٹس ایپ پر شیئر کریں',
    btn_copy_link: 'لنک کاپی کریں',
    btn_share_sos: 'ایمرجنسی شیئر کریں',

    // Status & Badges
    status_available: 'خون دینے کیلئے دستیاب',
    status_resting: 'عارضی آرام پر',
    badge_verified: 'تصدیق شدہ لائف سیور',
    badge_critical: 'انتہائی نازک',
    badge_high: 'فوری ضرورت',
    badge_moderate: 'ضروری',
    badge_units: 'بوتلیں درکار ہیں',
    badge_donations: 'عطیات دیے',

    // Donor Dashboard
    donor_welcome: 'خوش آمدید',
    donor_subtitle: 'آپ کا ذاتی ڈونر پورٹل۔ اپنی دستیابی اپ ڈیٹ رکھیں تاکہ ایمرجنسی میں ہسپتال اور مریض آپ سے فوری رابطہ کر سکیں۔',
    donor_cta_title: 'کیا آپ ہسپتال ایمرجنسی میں کسی کی جان بچانا چاہتے ہیں؟',
    donor_cta_desc: 'ملک بھر کے ضرورت مند مریضوں کا براڈکاسٹ بورڈ دیکھیں۔ اپنے بلڈ گروپ یا شہر کے مطابق فلٹر کر کے فوری رابطہ کریں۔',
    donor_cta_btn: 'ضرورت مند مریض دیکھیں',
    donor_hadith_badge: 'خون کے عطیہ کے فضائل و برکات',
    donor_hadith_title: 'اسلام میں خون کا عطیہ دینے کا عظیم اجر',
    donor_readiness_title: 'خون دینے سے قبل صحت کا جائزہ',
    donor_compat_title: 'بلڈ گروپ کی مطابقت',
    donor_log_btn: 'عطیہ درج کریں',

    // Emergency & Patients
    sos_broadcast_title: 'ہسپتالوں کی لائیو ایمرجنسی براڈکاسٹ',
    sos_broadcast_subtitle: 'اس وقت پاکستان بھر کے ہسپتالوں میں خون کی فوری ضرورت ہے',
    filter_all_blood: 'تمام بلڈ گروپس',
    filter_city_placeholder: 'شہر منتخب کریں (مثلاً پشاور، مردان، لاہور)',
    post_emergency_btn: 'ایمرجنسی درخواست پوسٹ کریں',

    // WhatsApp Message Templates
    wa_sos_header: '🚨 *خون کی فوری ضرورت ہے — لائف لنک ایمرجنسی SOS*',
    wa_patient: '👤 *مریض کا نام:*',
    wa_blood_needed: '🩸 *مطلوبہ بلڈ گروپ:*',
    wa_units: '📦 *کتنی بوتلیں درکار ہیں:*',
    wa_hospital: '🏥 *ہسپتال:*',
    wa_city: '📍 *شہر:*',
    wa_contact: '📞 *فوری رابطہ نمبر:*',
    wa_respond_link: '👉 *لائف لنک پر کھولیں اور فوری مدد کریں:*',
    wa_footer: '«جس نے ایک جان کو بچایا، گویا اس نے پوری انسانیت کو بچایا۔» برائے مہربانی واٹس ایپ گروپس میں شیئر کریں!'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lifelink_lang') || 'en';
  });

  const isUrdu = language === 'ur';

  useEffect(() => {
    localStorage.setItem('lifelink_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
    
    // Toggle Urdu font helper class on body
    if (isUrdu) {
      document.body.classList.add('lang-urdu');
    } else {
      document.body.classList.remove('lang-urdu');
    }
  }, [language, isUrdu]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    return translations.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isUrdu, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
