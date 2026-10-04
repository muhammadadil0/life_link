import React, { useState, useEffect } from 'react';
import { 
  Heart, User, CheckCircle2, ArrowRight, ArrowLeft, 
  MapPin, Shield, Droplets, Lock, Mail, Phone, Eye, EyeOff,
  AlertCircle, Sparkles, Navigation, Zap, Plus, Minus, AlertTriangle
} from 'lucide-react';
import { registerUser, detectIpLocation, reverseGeocode, createEmergencyRequest } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Register({ onNavigateHome, onNavigateLogin }) {
  const { t, isUrdu } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    userType: 'donor', // 'donor' or 'patient'
    fullName: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    address: '',
    latitude: '',
    longitude: '',
    medicalConditions: '',
    emergencyContact: '',
    agreePrivacy: false,
    agreeTerms: false,
  });

  // Emergency patient-specific states
  const [patientUnits, setPatientUnits] = useState(2);
  const [patientUrgency, setPatientUrgency] = useState('Critical (ICU / Emergency)');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Scroll to top when Register mounts or when switching view / step
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep, formData.userType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMsg('');
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      userType: role,
    }));
    setErrorMsg('');
    setCurrentStep(1);
  };

  const handleGetLocation = async () => {
    setLocating(true);
    setLocationStatus(null);
    setErrorMsg('');

    // Strategy 1: Attempt HTML5 browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
          }));

          // Reverse geocode to get human-readable location address
          try {
            const geoRes = await reverseGeocode(lat, lon);
            if (geoRes && geoRes.success && geoRes.displayName) {
              setFormData((prev) => ({
                ...prev,
                address: prev.address ? prev.address : geoRes.displayName,
              }));
              setLocationStatus({
                type: 'success',
                message: `Location detected: ${geoRes.displayName}`,
                coords: `${lat}, ${lon}`
              });
            } else {
              setLocationStatus({
                type: 'success',
                message: 'GPS coordinates detected successfully.',
                coords: `${lat}, ${lon}`
              });
            }
          } catch (e) {
            setLocationStatus({
              type: 'success',
              message: 'GPS coordinates detected successfully.',
              coords: `${lat}, ${lon}`
            });
          }
          setLocating(false);
        },
        async (err) => {
          console.warn('Browser GPS unavailable or denied, falling back to network IP location:', err);
          await tryNetworkLocationFallback(err);
        },
        {
          enableHighAccuracy: false, // Essential for desktops without hardware GPS
          timeout: 6000,
          maximumAge: 60000,
        }
      );
    } else {
      await tryNetworkLocationFallback(null);
    }
  };

  const tryNetworkLocationFallback = async (browserErr) => {
    try {
      const ipRes = await detectIpLocation();
      if (ipRes && ipRes.success) {
        setFormData((prev) => ({
          ...prev,
          latitude: ipRes.latitude,
          longitude: ipRes.longitude,
          address: prev.address ? prev.address : ipRes.formattedAddress,
        }));
        setLocationStatus({
          type: 'fallback',
          message: `Network location detected: ${ipRes.formattedAddress}`,
          coords: `${ipRes.latitude}, ${ipRes.longitude}`,
          hint: browserErr && browserErr.code === 1 
            ? 'Browser GPS permission was denied. Address was auto-filled using your network IP location.' 
            : 'Detected via network service.'
        });
      } else {
        let reason = 'Unable to auto-detect location.';
        if (browserErr) {
          if (browserErr.code === 1) reason = 'Location permission was denied in your browser settings.';
          else if (browserErr.code === 3) reason = 'Location lookup timed out.';
        }
        setLocationStatus({
          type: 'error',
          message: reason,
          hint: 'Please enter your city and hospital / area manually in the field above.'
        });
      }
    } catch (e) {
      setLocationStatus({
        type: 'error',
        message: 'Could not auto-detect location.',
        hint: 'Please type your city and hospital / area manually in the field above.'
      });
    } finally {
      setLocating(false);
    }
  };

  // Validation for Multi-Step Donor Flow
  const validateDonorStep = (step) => {
    setErrorMsg('');
    if (step === 1) {
      return true;
    } else if (step === 2) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg('Please enter your phone number.');
        return false;
      }
      const ageNum = parseInt(formData.age, 10);
      if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        setErrorMsg('Donors must be between 18 and 65 years old for medical safety.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.bloodGroup) {
        setErrorMsg('Please select your blood group.');
        return false;
      }
      if (!formData.address.trim()) {
        setErrorMsg('Please provide your residential address or city.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.agreePrivacy) {
        setErrorMsg('You must agree to the Privacy Policy.');
        return false;
      }
      if (!formData.agreeTerms) {
        setErrorMsg('You must agree to the Terms of Service.');
        return false;
      }
    }
    return true;
  };

  // Validation for 1-Step Fast-Track Patient Flow
  const validatePatientForm = () => {
    setErrorMsg('');
    if (!formData.bloodGroup) {
      setErrorMsg('Please select the blood group required.');
      return false;
    }
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter the patient or requester name.');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter a direct phone number so donors can reach you.');
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Please specify the hospital or medical clinic name and city.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address for your patient account.');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateDonorStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Donor Registration
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    if (!validateDonorStep(4)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await registerUser(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessData(res.user);
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  // Submit Streamlined 1-Step Patient Registration & Broadcast SOS
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (!validatePatientForm()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const patientPayload = {
      ...formData,
      age: formData.age || '30',
      agreePrivacy: true,
      agreeTerms: true,
      medicalConditions: `Urgent Request: ${patientUnits} units needed (${patientUrgency})`
    };

    // 1. Create Patient User Account
    const res = await registerUser(patientPayload);

    if (res.success) {
      // 2. Also automatically broadcast emergency blood request so donors are notified instantly!
      try {
        await createEmergencyRequest({
          patient_name: formData.fullName.trim(),
          blood_type: formData.bloodGroup,
          units_needed: patientUnits,
          urgency: 'Critical',
          hospital: formData.address.trim(),
          contact: formData.phone.trim(),
          city: formData.address.includes(',') ? formData.address.split(',').pop().trim() : 'Lahore'
        });
      } catch (e) {
        console.warn('Auto emergency broadcast error:', e);
      }

      setIsSubmitting(false);
      setSuccessData({
        ...res.user,
        isEmergencyPatient: true,
        unitsNeeded: patientUnits,
        hospital: formData.address.trim(),
        phone: formData.phone.trim()
      });
    } else {
      setIsSubmitting(false);
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Success view
  if (successData) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <div className="glass-card max-w-xl w-full p-8 sm:p-12 text-center border border-red-100 shadow-2xl rounded-3xl animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{isUrdu ? 'اکاؤنٹ فعال اور تیار ہے' : 'Account Active & Ready'}</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 font-display mb-2">
            {isUrdu ? 'لائف لنک میں خوش آمدید!' : 'Welcome to LifeLink!'}
          </h2>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            {successData.isEmergencyPatient
              ? (isUrdu 
                  ? 'آپ کا مریض ایمرجنسی اکاؤنٹ فعال ہو گیا ہے اور آپ کے علاقے کے تصدیق شدہ ڈونرز کو فوری الرٹ نشر کر دیا گیا ہے۔' 
                  : 'Your patient emergency account is active, and your urgent blood request has been broadcasted to verified donors in your area.')
              : (isUrdu 
                  ? 'آپ کا ڈونر اکاؤنٹ کامیابی سے بن گیا ہے۔ اب آپ ہمارے ملک گیر لائف سیور نیٹ ورک کا حصہ ہیں۔' 
                  : 'Your donor account has been successfully created. You are now part of our nationwide lifesaver network.')}
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-2.5 border border-gray-200 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'نام:' : 'Name:'}</span>
              <span className="font-semibold text-gray-900">{successData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'کردار:' : 'Role:'}</span>
              <span className="font-bold text-red-600 capitalize">
                {isUrdu ? (successData.userType === 'donor' ? 'ڈونر' : 'مریض') : successData.userType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'بلڈ گروپ:' : 'Blood Group:'}</span>
              <span className="font-bold text-red-600 px-2.5 py-0.5 bg-red-100 rounded-md">
                {successData.bloodGroup}
              </span>
            </div>
            {successData.hospital && (
              <div className="flex justify-between">
                <span className="text-gray-500">{isUrdu ? 'ہسپتال:' : 'Hospital:'}</span>
                <span className="font-semibold text-gray-900">{successData.hospital}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'ایمرجنسی ہیلپ لائن:' : 'Emergency Helpline:'}</span>
              <span className="font-bold text-gray-900">03494996898</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onNavigateLogin}
              className="btn-medical text-white w-full py-3.5 rounded-xl font-bold shadow-medical flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isUrdu ? 'اپنے ڈیش بورڈ کیلئے لاگ ان کریں' : 'Login to Access Your Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold"
            >
              {isUrdu ? 'ہوم پیج پر واپس جائیں' : 'Return to Homepage'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-red-50">
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100/80 border border-red-200 text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Droplets className="w-4 h-4 text-red-600" />
            <span>{isUrdu ? 'آفیشل لائف لنک میڈیکل نیٹ ورک' : 'Official LifeLink Medical Network'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-gray-900 tracking-tight mb-2">
            {isUrdu ? (
              <>
                اپنا{' '}
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  لائف لنک اکاؤنٹ
                </span>{' '}
                بنائیں
              </>
            ) : (
              <>
                Create Your{' '}
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  LifeLink Account
                </span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-light">
            {isUrdu 
              ? 'پورے پاکستان میں ہنگامی صورتحال کے شکار مریضوں کو تصدیق شدہ رضاکار بلڈ ڈونرز سے جوڑنا۔' 
              : 'Connecting patients in emergency distress with verified blood donors across Pakistan.'}
          </p>

          {/* Role Switcher Tabs */}
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-gray-200 mt-6 max-w-md w-full">
            <button
              type="button"
              onClick={() => handleRoleChange('donor')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                formData.userType === 'donor'
                  ? 'bg-white text-red-600 shadow-sm border border-red-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${formData.userType === 'donor' ? 'fill-current text-red-600' : 'text-gray-400'}`} />
              <span>{isUrdu ? 'خون کا عطیہ دہندہ (ڈونر)' : 'Blood Donor'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('patient')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                formData.userType === 'patient'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isUrdu ? 'مریض (فوری طریقہ)' : 'Patient (1-Step Fast Track)'}</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW A: STREAMLINED 1-STEP EMERGENCY PATIENT REGISTRATION FORM */}
        {/* ============================================================== */}
        {formData.userType === 'patient' ? (
          <div className="glass-card bg-white/95 rounded-3xl p-6 sm:p-10 shadow-2xl border border-red-100 max-w-3xl mx-auto relative overflow-hidden animate-fade-in">
            {/* Urgent Notice Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-red-900 text-sm">
                    {isUrdu ? 'ہنگامی فاسٹ ٹریک طریقہ' : 'Emergency Fast-Track Flow'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-200/80 text-red-800 text-[10px] font-extrabold uppercase">
                    {isUrdu ? 'بغیر کسی اضافی سوال کے' : 'Zero Redundant Questions'}
                  </span>
                </div>
                <p className="text-red-800/90 leading-relaxed">
                  {isUrdu 
                    ? 'ہم جانتے ہیں کہ آپ ایمرجنسی میں ہیں۔ نیچے صرف اپنی فوری مطلوبہ معلومات درج کریں — ہمارا خودکار نظام قریبی ڈونرز کو فوراً الرٹ بھیج دے گا۔' 
                    : 'We know you are in a rush. Fill in only your urgent transfusion requirements below — our matching engine will alert active donors nearby instantly.'}
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePatientSubmit} className="space-y-5">
              {/* 1. Blood Group Needed (1-Tap Selection) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-red-600" />
                  <span>{isUrdu ? 'مطلوبہ بلڈ گروپ منتخب کریں *' : 'Select Blood Group Needed *'}</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodGroups.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => { setFormData(prev => ({ ...prev, bloodGroup: bg })); setErrorMsg(''); }}
                      className={`py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        formData.bloodGroup === bg
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105 ring-2 ring-red-300'
                          : 'bg-slate-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <span>{bg}</span>
                      <Droplets className={`w-3 h-3 ${formData.bloodGroup === bg ? 'text-white' : 'text-red-500'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Patient Name & Direct Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'مریض یا درخواست گزار کا نام *' : 'Patient / Requester Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={isUrdu ? 'مثلاً علی احمد (مریض)' : 'e.g., Ali Ahmed (Patient)'}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'رابطہ فون نمبر (ڈونرز کے رابطہ کیلئے) *' : 'Contact Phone Number (for Donors to Call) *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 03494996898"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Hospital Name & City with Auto-Detect Location */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {isUrdu ? 'ہسپتال یا کلینک اور شہر *' : 'Hospital / Clinic & City *'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>
                      {locating 
                        ? (isUrdu ? 'مقام تلاش کیا جا رہا ہے...' : 'Detecting Location...') 
                        : (isUrdu ? 'ہسپتال کا مقام خودکار تلاش کریں' : 'Auto-Detect Hospital Location')}
                    </span>
                  </button>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={isUrdu ? 'مثلاً سروسز ہسپتال، جیل روڈ، لاہور' : 'e.g., Services Hospital, Jail Road, Lahore'}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                {locationStatus && (
                  <div className={`mt-2 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    locationStatus.type === 'success' || locationStatus.type === 'fallback'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{locationStatus.message}</span>
                  </div>
                )}
              </div>

              {/* 4. Units Needed Stepper & Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'خون کی درکار بوتلیں' : 'Units of Blood Needed'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPatientUnits(prev => Math.max(1, prev - 1))}
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center py-2.5 px-4 rounded-xl bg-slate-50 border border-gray-200 font-bold text-gray-900 text-sm">
                      {isUrdu ? `${patientUnits} بوتل (یونٹ)` : `${patientUnits} ${patientUnits === 1 ? 'Unit' : 'Units'} (Bag)`}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPatientUnits(prev => Math.min(8, prev + 1))}
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'ہنگامی نوعیت' : 'Urgency Level'}
                  </label>
                  <select
                    value={patientUrgency}
                    onChange={(e) => setPatientUrgency(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                  >
                    <option value="Critical (ICU / Emergency)">
                      {isUrdu ? '🚨 فوری درکار (آئی سی یو / آپریشن)' : '🚨 Immediate (ICU / Surgery)'}
                    </option>
                    <option value="Urgent (Within 6 Hours)">
                      {isUrdu ? '⏱️ فوری (۶ گھنٹوں کے اندر)' : '⏱️ Urgent (Within 6 Hours)'}
                    </option>
                    <option value="Planned (Within 24 Hours)">
                      {isUrdu ? '📅 منصوبہ بند (۲۴ گھنٹوں میں)' : '📅 Planned (Within 24 Hours)'}
                    </option>
                  </select>
                </div>
              </div>

              {/* 5. Account Access: Email & Password (so patient can manage responses) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'اکاؤنٹ ای میل (پورٹل لاگ ان کیلئے) *' : 'Account Email (for Portal Login) *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., patient@gmail.com"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {isUrdu ? 'پاس ورڈ *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-medical text-white py-4 rounded-2xl font-bold text-sm sm:text-base shadow-medical-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{isUrdu ? 'ڈونرز کو فوری الرٹ بھیجا جا رہا ہے...' : 'Broadcasting Urgent Request to Donors...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>{isUrdu ? '🚨 رجسٹر کریں اور ڈونرز کو فوری الرٹ بھیجیں' : '🚨 Register & Broadcast Urgent Request to Donors'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  {isUrdu ? 'فون پر فوری رابطہ ترجیح ہے؟ ہماری ۲۴ گھنٹے ہیلپ لائن پر ابھی کال کریں:' : 'Prefer direct phone coordination? Call our 24/7 helpline immediately:'}{' '}
                  <a href="tel:03494996898" className="font-bold text-red-600 hover:underline">
                    03494996898
                  </a>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW B: COMPREHENSIVE 4-STEP MEDICAL BLOOD DONOR REGISTRATION  */
          /* ============================================================== */
          <>
            {/* Multi-Step Stepper & Progress Bar for Donors */}
            <div className="mb-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                <span>
                  {isUrdu 
                    ? `مرحلہ ${currentStep} از ${totalSteps}: ${
                        currentStep === 1 ? 'ڈونر پروفائل' :
                        currentStep === 2 ? 'ذاتی معلومات' :
                        currentStep === 3 ? 'بلڈ گروپ اور مقام' : 'شرائط و تصدیق'
                      }`
                    : `Step ${currentStep} of ${totalSteps}: ${
                        currentStep === 1 ? 'Donor Profile' :
                        currentStep === 2 ? 'Personal Info' :
                        currentStep === 3 ? 'Blood & Location' : 'Terms & Verification'
                      }`}
                </span>
                <span className="text-red-600 font-bold">{progressPercent}% {isUrdu ? 'مکمل' : 'Complete'}</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="glass-card bg-white/95 rounded-3xl p-6 sm:p-10 shadow-2xl border border-red-100 max-w-3xl mx-auto relative overflow-hidden animate-fade-in">
              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleDonorSubmit}>
                {/* STEP 1: DONOR ROLE OVERVIEW */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-display">
                        {isUrdu ? 'رضاکار بلڈ ڈونر بنیں' : 'Become a Volunteer Blood Donor'}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {isUrdu ? 'تصدیق شدہ ہیروز میں شامل ہوں جو ہنگامی کالز پر مدد کیلئے تیار رہتے ہیں' : 'Join verified heroes ready to answer emergency requests'}
                      </p>
                    </div>

                    <div className="rounded-2xl p-6 sm:p-8 border-2 border-red-500 bg-red-50/40 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
                        <Heart className="w-8 h-8 fill-current" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {isUrdu ? 'تصدیق شدہ بلڈ ڈونر نیٹ ورک' : 'Verified Blood Donor Network'}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                        {isUrdu 
                          ? 'خون کا ہر عطیہ ۳ انسانی جانیں بچا سکتا ہے۔ اپنا ڈونر پروفائل مکمل کرنے پر آپ کو اپنے شہر میں خون کے فوری کیسز کے الرٹس موصول ہوں گے۔' 
                          : 'Every donation saves up to 3 human lives. By completing your donor profile, you will be notified whenever a compatible patient in your city requires urgent blood.'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
                        <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                          <span className="font-bold text-gray-900 block">
                            {isUrdu ? 'ہنگامی الرٹس' : 'Emergency Alerts'}
                          </span>
                          <span className="text-gray-500">
                            {isUrdu ? 'مریض کی ضرورت پر فوری لائیو الرٹ' : 'Real-time alerts when matched'}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                          <span className="font-bold text-gray-900 block">
                            {isUrdu ? 'طبی حفاظت' : 'Medical Safety'}
                          </span>
                          <span className="text-gray-500">
                            {isUrdu ? 'عطیات کا معیاری ۹۰ دن کا وقفہ' : 'Standard 90-day donation interval'}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-red-100 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                          <span className="font-bold text-gray-900 block">
                            {isUrdu ? 'براہِ راست چیٹ' : 'Direct Chat'}
                          </span>
                          <span className="text-gray-500">
                            {isUrdu ? 'ہسپتال اور مریض سے فوری رابطہ' : 'Coordinate directly with hospitals'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PERSONAL INFORMATION & AGE ELIGIBILITY */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-display">
                        {isUrdu ? 'ذاتی معلومات' : 'Personal Details'}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {isUrdu ? 'اپنی شناخت اور بنیادی تفصیلات درج کریں' : 'Enter your donor identification details'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'مکمل نام *' : 'Full Name *'}
                        </label>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g., Muhammad Adil"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}
                        </label>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g., donor@example.com"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'موبائل نمبر *' : 'Phone Number *'}
                        </label>
                        <div className="relative">
                          <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03494996898"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'عمر (۱۸ سے ۶۵ سال) *' : 'Age (Must be 18 - 65) *'}
                        </label>
                        <input
                          type="number"
                          name="age"
                          min="18"
                          max="65"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g., 28"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'پاس ورڈ (کم از کم ۶ حروف) *' : 'Password (min 6 characters) *'}
                        </label>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                          {isUrdu ? 'پاس ورڈ کی تصدیق کریں *' : 'Confirm Password *'}
                        </label>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: BLOOD GROUP & RESIDENTIAL LOCATION */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-display">
                        {isUrdu ? 'بلڈ گروپ اور مقام' : 'Blood Group & Location'}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {isUrdu ? 'ہنگامی ضرورت کیلئے اپنا بلڈ گروپ اور رہائشی علاقہ منتخب کریں' : 'Set your donor blood type and area for emergency matching'}
                      </p>
                    </div>

                    {/* Blood Group Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        {isUrdu ? 'اپنا بلڈ گروپ منتخب کریں *' : 'Select Your Blood Group *'}
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {bloodGroups.map((bg) => (
                          <button
                            key={bg}
                            type="button"
                            onClick={() => { setFormData(prev => ({ ...prev, bloodGroup: bg })); setErrorMsg(''); }}
                            className={`py-3 px-2 rounded-xl font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                              formData.bloodGroup === bg
                                ? 'bg-red-600 text-white shadow-md shadow-red-500/30 scale-105'
                                : 'bg-slate-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                            }`}
                          >
                            <span>{bg}</span>
                            <Droplets className={`w-3 h-3 ${formData.bloodGroup === bg ? 'text-white' : 'text-red-500'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {isUrdu ? 'پتہ (شہر اور علاقہ) *' : 'Address (City & Area) *'}
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3" />
                        <textarea
                          name="address"
                          rows="2"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder={isUrdu ? 'مثلاً گلبرگ، لاہور' : 'e.g., Gulberg III, Lahore'}
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    {/* GPS Coordinates Button */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                            <span>{isUrdu ? 'میرا مقام خودکار تلاش کریں (GPS / انٹرنیٹ)' : 'Auto-Detect My Location (GPS / Network)'}</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {isUrdu ? 'آپ کو قریبی مریضوں کے ساتھ درست طور پر ملاتا ہے' : 'Matches you accurately with nearby patients'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={locating}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0 ${
                            locating
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : formData.latitude
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                              : 'btn-medical text-white shadow-medical'
                          }`}
                        >
                          {locating ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span>{isUrdu ? 'تلاش جاری ہے...' : 'Detecting...'}</span>
                            </>
                          ) : formData.latitude ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{isUrdu ? 'مقام محفوظ ہو گیا' : 'Location Saved'}</span>
                            </>
                          ) : (
                            <>
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{isUrdu ? 'مقام تلاش کریں' : 'Detect Location'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {locationStatus && (
                        <div className={`mt-3 p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                          locationStatus.type === 'success' || locationStatus.type === 'fallback'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-amber-50 border border-amber-200 text-amber-900'
                        }`}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>{locationStatus.message}</div>
                        </div>
                      )}
                    </div>

                    {/* Medical Conditions */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {isUrdu ? 'طبی معلومات یا نوٹس (اختیاری)' : 'Medical Notes (Optional)'}
                      </label>
                      <input
                        type="text"
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        placeholder={isUrdu ? 'مثلاً بالکل تندرست، آخری بار ۴ ماہ پہلے خون دیا تھا' : 'e.g., None, healthy, last donated 4 months ago'}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: TERMS & SUBMISSION */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 font-display">
                        {isUrdu ? 'شرائط اور حتمی توثیق' : 'Terms & Verification'}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {isUrdu ? 'اپنی رضاکارانہ رجسٹریشن مکمل کریں' : 'Finalize your volunteer registration'}
                      </p>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {isUrdu ? 'ہنگامی رابطہ نمبر (اختیاری)' : 'Emergency Contact (Optional)'}
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder={isUrdu ? 'مثلاً بھائی - 03001234567' : 'e.g., Brother - 03001234567'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3.5 pt-2">
                      <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-gray-200 cursor-pointer hover:bg-red-50/40 transition-colors">
                        <input
                          type="checkbox"
                          name="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <div className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-900 block mb-0.5">
                            {isUrdu ? 'رازداری اور طبی تحفظ' : 'Privacy & Medical Protection'}
                          </span>
                          {isUrdu 
                            ? 'آپ کی معلومات محفوظ رکھی جائیں گی اور صرف خون کی اشد ضرورت کے وقت ہسپتال یا مریض کے ساتھ شیئر کی جائیں گی۔' 
                            : 'Your personal information will be stored securely and only shared with hospitals and patients in immediate distress.'}
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-gray-200 cursor-pointer hover:bg-red-50/40 transition-colors">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <div className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-900 block mb-0.5">
                            {isUrdu ? 'لائف لنک نیٹ ورک کی شرائط' : 'Terms of LifeLink Network'}
                          </span>
                          {isUrdu 
                            ? 'میں تصدیق کرتا ہوں کہ میری عمر ۱۸ سے ۶۵ سال کے درمیان ہے اور میں انسانی جانیں بچانے کیلئے رضاکارانہ خون کا عطیہ دینے کو تیار ہوں۔' 
                            : 'I certify that I am between 18 and 65 years of age and willing to donate blood voluntarily to save lives.'}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{isUrdu ? 'پچھلا مرحلہ' : 'Previous'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onNavigateHome}
                      className="text-gray-500 hover:text-gray-800 text-xs sm:text-sm font-medium cursor-pointer"
                    >
                      {isUrdu ? '← واپس ہوم پیج' : '← Back to Home'}
                    </button>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-medical text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-medical flex items-center gap-2 cursor-pointer"
                    >
                      <span>{isUrdu ? 'اگلا مرحلہ' : 'Next Step'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>{isUrdu ? 'ڈونر اکاؤنٹ بنایا جا رہا ہے...' : 'Creating Donor Account...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isUrdu ? 'ڈونر رجسٹریشن مکمل کریں' : 'Complete Donor Registration'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* Switch to Login */}
        {onNavigateLogin && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              {isUrdu ? 'پہلے سے لائف لنک پر رجسٹرڈ ہیں؟ ' : 'Already registered on LifeLink? '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-red-600 font-bold hover:text-red-700 hover:underline cursor-pointer"
              >
                {isUrdu ? 'یہاں سائن ان کریں' : 'Sign in here'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
