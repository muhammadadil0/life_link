import React, { useState } from 'react';
import { 
  Heart, Phone, Mail, Clock, Github, Linkedin, ArrowUp, 
  MapPin, Droplets, Send, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t, isUrdu } = useLanguage();
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 4000);
  };

  const bloodCompatibility = [
    { type: 'O-', desc: 'Universal Donor' },
    { type: 'O+', desc: 'Most Common' },
    { type: 'A-', desc: 'Rare Type' },
    { type: 'A+', desc: 'High Demand' },
    { type: 'B-', desc: 'Critical Need' },
    { type: 'B+', desc: 'Regular Supply' },
    { type: 'AB-', desc: 'Extremely Rare' },
    { type: 'AB+', desc: 'Universal Recipient' },
  ];

  return (
    <footer className="relative bg-slate-50 text-gray-700 pt-16 pb-10 border-t-2 border-red-600">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* ✉️ NEWSLETTER / EMERGENCY ALERTS CARD */}
        <div className="mb-14 rounded-3xl bg-white p-8 sm:p-10 shadow-lg border border-red-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-gray-900 mb-2">
                {t('footer_news_title', 'Be The First To Know When A Life Is In Need')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {t('footer_news_desc', 'Subscribe for instant urgent blood donor calls in your hospital area. Zero spam, 100% life-saving priority alerts.')}
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={t('footer_news_placeholder', 'Enter your email address')}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 whitespace-nowrap transition-all group cursor-pointer"
                  >
                    <span>{t('footer_news_btn', 'Subscribe')}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                {subscribed ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('footer_news_success', 'You are enrolled in emergency community notifications!')}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400">
                    {isUrdu ? 'محفوظ و نجی ڈیٹا • کسی بھی وقت ان سبسکرائب کریں' : 'End-to-end encrypted • Unsubscribe anytime'}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* 🩸 BLOOD GROUP QUICK REFERENCE MATRIX */}
        <div className="mb-14 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
              <Droplets className="w-4 h-4 text-red-600" />
              <span>{t('footer_compat_title', 'Blood Group Quick Reference Matrix')}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{t('footer_compat_sub', 'Click any blood group to jump to donor search')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {bloodCompatibility.map((b) => (
              <a
                key={b.type}
                href="#donor-search"
                className="group p-3 rounded-xl bg-slate-50 hover:bg-red-600 text-center border border-gray-200 hover:border-red-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-xl font-extrabold font-display text-gray-900 group-hover:text-white transition-colors">
                  {b.type}
                </div>
                <div className="text-[11px] text-gray-500 group-hover:text-red-100 truncate transition-colors">
                  {b.desc}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 🏢 MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={scrollToTop}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md overflow-hidden p-1 border border-red-200">
                <img src="/logo.jpg" alt="LifeLink Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display tracking-tight text-gray-900">
                  LifeLink
                </span>
                <div className="text-xs text-red-600 font-semibold tracking-wider uppercase">
                  {t('brand_sub', 'National Blood Network')}
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm font-light max-w-md">
              {t('footer_about_desc', "Pakistan's premier rapid-response emergency blood donation network connecting patients directly with verified volunteer donors.")}
            </p>

            {/* Social Profile Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com/muhammadadil0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white hover:bg-red-600 border border-gray-200 hover:border-red-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 text-gray-600 hover:text-white shadow-sm"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammad-adil-42677b307"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white hover:bg-blue-600 border border-gray-200 hover:border-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 text-gray-600 hover:text-white shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              {t('footer_quick_links', 'Explore Platform')}
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('home')} 
                  className="hover:text-red-600 transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{t('nav_home', 'Home Overview')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('emergency')} 
                  className="hover:text-red-600 transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{t('nav_emergency', 'Emergency Requests')}</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('donors')} 
                  className="hover:text-red-600 transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{t('nav_find_donors', 'Find Donors')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('contact')} 
                  className="hover:text-red-600 transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{t('nav_contact', 'Contact Us')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('register')} 
                  className="hover:text-red-600 transition-colors flex items-center gap-1.5 group cursor-pointer text-left font-semibold text-red-600"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{t('hero_cta_1', 'Become a LifeSaver')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Guidelines */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              {isUrdu ? 'ہدایات و ضوابط' : 'Guidelines & Legal'}
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{isUrdu ? 'ڈونر اہلیت کے معیارات' : 'Donor Eligibility Criteria'}</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{isUrdu ? 'خون کی حفاظت کے پروٹوکولز' : 'Blood Safety Protocols'}</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{isUrdu ? 'ہسپتال پارٹنر نیٹ ورک' : 'Hospital Partner Network'}</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  <span>{isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Response */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
              {isUrdu ? 'ہنگامی ردعمل سنٹر' : 'Emergency Response'}
            </h3>

            <div className="space-y-3.5 text-sm text-gray-600">
              {/* Direct Hotline Link */}
              <div>
                <div className="text-xs text-red-600 font-semibold uppercase tracking-wider mb-1">
                  {isUrdu ? '۲۴/۷ ترجیحی ہیلپ لائن' : '24/7 Rapid Hotline'}
                </div>
                <a
                  href="tel:03494996898"
                  className="inline-flex items-center gap-2 text-xl font-extrabold font-mono text-gray-900 hover:text-red-600 transition-colors"
                >
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>03494996898</span>
                </a>
              </div>

              {/* Email */}
              <div className="pt-1">
                <a
                  href="mailto:adilraxiq64@gmail.com"
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="truncate">adilraxiq64@gmail.com</span>
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{isUrdu ? '۲۴ گھنٹے بلا تعطل خدمات' : '24/7/365 Non-stop Operations'}</span>
              </div>

              {/* Coverage / Operations */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{isUrdu ? 'شیرگڑھ، مردان (ملک گیر نیٹ ورک)' : 'Shergarh, Mardan (Nationwide Network)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 BOTTOM BAR */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-800">LifeLink Blood Bank</span>. {isUrdu ? 'جملہ حقوق محفوظ ہیں۔ از محمد عادل' : 'Built with compassion by Muhammad Adil.'}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 hidden sm:inline">{isUrdu ? 'ایک قطرہ، ایک نئی زندگی' : 'Saving lives one drop at a time'}</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-red-600 border border-gray-200 hover:border-red-600 text-gray-600 hover:text-white shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center font-bold cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
