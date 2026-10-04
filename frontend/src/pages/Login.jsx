import React, { useState, useEffect } from 'react';
import { 
  Heart, Mail, Lock, Eye, EyeOff, AlertCircle, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, User, Activity 
} from 'lucide-react';
import { loginUser } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Login({ onNavigateHome, onNavigateRegister, onLoginSuccess }) {
  const { t, isUrdu } = useLanguage();
  const [selectedRole, setSelectedRole] = useState('donor'); // 'donor' or 'patient'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleRoleToggle = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    // Do NOT autofill any hardcoded credentials!
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg(isUrdu ? 'براہِ کرم اپنا ای میل ایڈریس اور پاس ورڈ دونوں درج کریں۔' : 'Please enter both your email address and password.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg(isUrdu ? 'براہِ کرم درست ای میل ایڈریس درج کریں۔' : 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginUser({ email: email.trim(), password });
    setIsSubmitting(false);

    if (res.success) {
      setLoggedInUser(res.user);
      if (rememberMe) {
        localStorage.setItem('lifelink_user', JSON.stringify(res.user));
      }
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
    } else {
      setErrorMsg(res.message || (isUrdu ? 'غلط ای میل یا پاس ورڈ۔ دوبارہ کوشش کریں۔' : 'Invalid email or password. Please try again.'));
    }
  };

  // Logged In Success Screen
  if (loggedInUser) {
    return (
      <div className="min-h-[80vh] py-16 px-4 flex items-center justify-center">
        <div className="glass-card max-w-md w-full p-8 text-center border border-red-100 shadow-2xl rounded-3xl animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 font-display mb-1">
            {isUrdu ? `خوش آمدید، ${loggedInUser.name}!` : `Welcome Back, ${loggedInUser.name}!`}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            {isUrdu ? (
              <>
                لائف لنک میں بطور{' '}
                <span className="font-bold text-red-600 uppercase tracking-wide">
                  {loggedInUser.userType === 'donor' ? 'خون کا عطیہ دہندہ (ڈونر)' : 'مریض'}
                </span>{' '}
                سائن ان ہوئے۔
              </>
            ) : (
              <>
                Signed into LifeLink as{' '}
                <span className="font-bold text-red-600 uppercase tracking-wide">
                  {loggedInUser.userType}
                </span>.
              </>
            )}
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-2 border border-gray-200 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'ای میل:' : 'Email:'}</span>
              <span className="font-semibold text-gray-900">{loggedInUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{isUrdu ? 'کردار:' : 'Role:'}</span>
              <span className="font-bold text-red-600 capitalize">
                {isUrdu ? (loggedInUser.userType === 'donor' ? 'ڈونر' : 'مریض') : loggedInUser.userType}
              </span>
            </div>
            {loggedInUser.bloodGroup && (
              <div className="flex justify-between">
                <span className="text-gray-500">{isUrdu ? 'بلڈ گروپ:' : 'Blood Group:'}</span>
                <span className="font-bold text-red-600 px-2 py-0.5 bg-red-100 rounded text-xs">
                  {loggedInUser.bloodGroup}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={onNavigateHome}
              className="btn-medical text-white w-full py-3.5 rounded-xl font-bold shadow-medical flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isUrdu ? 'ڈیش بورڈ پر جائیں' : 'Continue to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 flex items-center justify-center relative">
      <div className="w-full max-w-md z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-2 text-left group cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border-2 border-red-100 p-1">
              <img 
                src="/logo.jpg" 
                alt="LifeLink" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">L</div>';
                }}
              />
            </div>
            <div>
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LifeLink
              </span>
              <div className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                {t('brand_sub', 'Medical Network')}
              </div>
            </div>
          </button>
        </div>

        {/* Login Card */}
        <div className="glass-card bg-white/95 rounded-3xl p-7 sm:p-9 shadow-2xl border border-red-100 relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 tracking-tight mb-2">
              {isUrdu ? (
                <>
                  <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    لائف لنک
                  </span>{' '}
                  میں سائن ان کریں
                </>
              ) : (
                <>
                  Sign In to{' '}
                  <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    LifeLink
                  </span>
                </>
              )}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              {selectedRole === 'donor' 
                ? (isUrdu ? 'اپنے ڈونر پورٹل اور ہنگامی الرٹس تک رسائی کیلئے سائن ان کریں' : 'Sign in to access your Donor Portal and active emergency calls')
                : (isUrdu ? 'اپنے مریض پورٹل اور بلڈ درخواستوں کے انتظام کیلئے سائن ان کریں' : 'Sign in to access your Patient Portal and manage blood requests')}
            </p>
          </div>

          {/* Role Tabs: Donor and Patient Only (NO Admin Tab, NO Hardcoded Credentials) */}
          <div className="mb-6 p-1.5 bg-slate-100 rounded-2xl border border-gray-200 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleRoleToggle('donor')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'donor'
                  ? 'bg-white text-red-600 shadow-sm border border-red-100'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${selectedRole === 'donor' ? 'fill-current text-red-600' : 'text-gray-400'}`} />
              <span>{isUrdu ? 'خون کا عطیہ دہندہ (ڈونر)' : 'Blood Donor'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleToggle('patient')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedRole === 'patient'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'مریض / خاندان' : 'Patient / Family'}</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Clean Real Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                {isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  placeholder={isUrdu ? 'اپنا رجسٹرڈ ای میل درج کریں' : 'Enter your registered email'}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {isUrdu ? 'پاس ورڈ *' : 'Password *'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium cursor-pointer"
                >
                  {isUrdu ? 'پاس ورڈ بھول گئے؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                <span className="text-xs text-gray-600">
                  {isUrdu ? 'مجھے اس ڈیوائس پر یاد رکھیں' : 'Remember me on this device'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-medical text-white w-full py-3.5 rounded-xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isUrdu ? 'تصدیق کی جا رہی ہے...' : 'Verifying Credentials...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isUrdu 
                      ? `بطور ${selectedRole === 'donor' ? 'ڈونر' : 'مریض'} سائن ان کریں` 
                      : `Sign In as ${selectedRole === 'donor' ? 'Blood Donor' : 'Patient'}`}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-7 text-center pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {isUrdu ? 'ابھی تک اکاؤنٹ نہیں ہے؟ ' : "Don't have an account yet? "}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-red-600 font-bold hover:text-red-700 hover:underline cursor-pointer"
              >
                {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'واپس ہوم پیج' : 'Back to Home'}</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-red-100 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isUrdu ? 'پاس ورڈ دوبارہ ترتیب دیں' : 'Reset Password'}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              {isUrdu 
                ? 'اپنا رجسٹرڈ ای میل درج کریں، ہم آپ کو پاس ورڈ ری سیٹ کی ہدایات بھیجیں گے۔' 
                : 'Enter your registered email and we will send you password reset instructions.'}
            </p>
            <input
              type="email"
              placeholder={isUrdu ? 'اپنا رجسٹرڈ ای میل درج کریں' : 'Enter your registered email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                {isUrdu ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(isUrdu ? 'پاس ورڈ ری سیٹ کی ہدایات آپ کے ای میل پر بھیج دی گئی ہیں۔' : 'Password reset instructions have been sent to your email.');
                  setShowForgotModal(false);
                }}
                className="flex-1 btn-medical text-white py-2.5 rounded-xl text-xs font-bold shadow-medical cursor-pointer"
              >
                {isUrdu ? 'لنک بھیجیں' : 'Send Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
