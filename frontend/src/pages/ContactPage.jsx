import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Clock, 
  MessageSquare, AlertCircle, Heart 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage({ onNavigateHome }) {
  const { t, isUrdu } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-red-600" />
          <span>{t('contact_badge', 'Get in Touch')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-gray-900 tracking-tight mb-3">
          {isUrdu ? (
            <>
              رابطہ کریں{' '}
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                لائف لنک
              </span>
            </>
          ) : (
            <>
              Contact{' '}
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                LifeLink
              </span>
            </>
          )}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          {t('contact_subtitle', "We'd love to hear your feedback, hospital partnership inquiries, or emergency coordination questions.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Emergency Hotlines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card bg-white p-7 rounded-3xl border border-red-100 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span>{t('contact_hotlines_title', 'Emergency Hotlines')}</span>
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              {t('contact_hotlines_sub', 'For immediate critical blood needs or hospital dispatch, contact our rapid coordination center directly:')}
            </p>

            <div className="space-y-4 text-xs">
              <a
                href="tel:03494996898"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-red-50 text-red-700 font-bold border border-red-200 hover:bg-red-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-red-500 uppercase font-semibold">{t('contact_helpline_label', 'Priority 24/7 Helpline')}</div>
                  <div className="text-base text-gray-900">03494996898</div>
                </div>
              </a>

              <a
                href="mailto:adilraxiq64@gmail.com"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">{t('contact_email_label', 'Official Email')}</div>
                  <div className="text-sm font-bold text-gray-900">adilraxiq64@gmail.com</div>
                </div>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Shergarh,+Mardan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">{t('contact_hq_label', 'Central Operations')}</div>
                  <div className="text-sm font-bold text-gray-900">{t('contact_hq_val', 'Shergarh, Mardan')}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="glass-card bg-white p-6 rounded-3xl border border-gray-200 shadow-xs text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Clock className="w-4 h-4" />
              <span>{isUrdu ? 'اوسط رابطہ وقت: ۲.۳ منٹ' : 'Average Response Time: 2.3 Minutes'}</span>
            </div>
            <p>{isUrdu ? 'ہماری کوآرڈینیشن ٹیم ۲۴ گھنٹے الرٹ ہے اور ہسپتالوں میں فوری خون پہنچانے کیلئے سرگرم رہتی ہے۔' : 'Our rapid matching algorithm runs continuously 24/7 across participating hospitals and registered donors.'}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card bg-white/95 rounded-3xl p-7 sm:p-10 shadow-xl border border-red-100">
            <h3 className="text-xl font-bold font-display text-gray-900 mb-2">{t('contact_form_title', 'Send Us a Message')}</h3>
            <p className="text-xs text-gray-500 mb-6">{isUrdu ? 'درج ذیل فارم پُر کریں، ہماری ٹیم جلد رابطہ کرے گی۔' : 'Fill in the fields below and our medical team will reply within 24 hours.'}</p>

            {submitted ? (
              <div className="py-12 text-center animate-fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-gray-900">{isUrdu ? 'شکریہ!' : 'Thank You!'}</h4>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
                  {t('contact_form_success', 'Thank you! Your message has been sent to our coordination team.')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  {isUrdu ? 'ایک اور پیغام بھیجیں' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{t('contact_form_name', 'Your Full Name *')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Muhammad Adil"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{t('contact_form_email', 'Email Address *')}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., adil@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{t('contact_form_subject', 'Subject')}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Hospital Blood Bank Integration"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 uppercase mb-1">{t('contact_form_message', 'Message *')}</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isUrdu ? 'اپنا سوال یا تفصیل درج کریں...' : 'Describe your inquiry or requirement...'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-medical text-white w-full py-3.5 rounded-xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isUrdu ? 'بھیجا جا رہا ہے...' : 'Sending Message...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('contact_form_submit', 'Send Message')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
