import React, { useState } from 'react';
import { 
  Heart, Droplets, MapPin, Phone, AlertCircle, 
  CheckCircle2, Clock, Shield, User, ArrowRight, 
  Activity, Calendar, Award, Check, Sparkles, Plus, ExternalLink, Mail
} from 'lucide-react';
import { updateUserProfile } from '../services/api';

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

export default function DonorDashboard({ currentUser, onNavigateHome, onNavigateEmergency }) {
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
                <span>Verified LifeLink Volunteer Donor</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-gray-900 mb-1">
                Welcome back, {donorData.name}!
              </h1>
              <p className="text-gray-500 text-sm max-w-xl">
                Your personal donor hub. Keep your availability updated so hospitals and coordinators can reach you during critical moments.
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
              <span>{isAvailable ? '🟢 Available to Donate' : '⚪ Temporarily Resting'}</span>
            </button>
            <span className="text-[11px] text-gray-400 text-center lg:text-right">
              {isAvailable ? 'Hospitals can see you on the active donor network' : 'You will not receive urgent emergency calls while resting'}
            </span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold border border-red-200">
            <Droplets className="w-4 h-4 text-red-600" />
            <span>Blood Group: {bloodGroup}</span>
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
              <span>National SOS Broadcast</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight mb-2">
              Looking to Respond to Hospital Emergencies?
            </h2>
            <p className="text-red-100 text-sm sm:text-base leading-relaxed">
              Explore the nationwide <strong>Patients In Need</strong> board. Filter by your blood group ({bloodGroup}) or city to connect with families and hospital blood banks right now.
            </p>
          </div>

          <button
            onClick={onNavigateEmergency}
            className="flex-shrink-0 bg-white text-red-600 hover:bg-red-50 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm cursor-pointer group"
          >
            <span>Open Patients In Need</span>
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
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">Your Blood Group</div>
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
            {isAvailable ? 'Ready' : 'Resting'}
          </div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">Current Availability</div>
          <div className="text-[11px] text-gray-400 mt-1">{isAvailable ? 'Standby for emergencies' : 'Temporarily paused'}</div>
        </div>

        {/* Total Donations Logged */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-purple-200 transition-all relative">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-display">{totalDonations}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">Verified Donations</div>
          <button
            onClick={() => setShowLogModal(true)}
            className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log a Donation</span>
          </button>
        </div>

        {/* 24/7 Helpline */}
        <div className="glass-card bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-xs hover:border-blue-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-gray-900 font-display truncate">03494996898</div>
          <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">LifeLink Helpline</div>
          <div className="text-[11px] text-gray-400 mt-1">Shergarh, Mardan HQ</div>
        </div>
      </div>

      {/* 🧪 Section 2: Blood Compatibility Matrix & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900">
                Blood Group Compatibility: {bloodGroup}
              </h2>
              <p className="text-xs text-gray-500">Transfusion matching rules according to WHO guidelines</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 block mb-2">
                🩸 Patients You Can Directly Save ({bloodGroup} Donates to):
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
                🛡️ In Case of Personal Emergency (You Can Receive From):
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
            <span>1 single whole blood donation can be separated to save up to 3 individual patients.</span>
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
                Donor Health Readiness Checklist
              </h2>
              <p className="text-xs text-gray-500">Ensure these pre-conditions before heading to donate</p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">Weight & Age:</strong> Minimum 50 kg (110 lbs) and aged between 18–60 years.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">Safe Donation Gap:</strong> Minimum 90 days (3 months) since your last whole blood donation.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">Health & Vitals:</strong> No fever, cough, flu, or active antibiotic intake in the last 7 days.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <strong className="text-gray-900">Hydration & Rest:</strong> Had at least 6 hours of sound sleep and drank plenty of water.
              </div>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need medical advice?</span>
            <a
              href="tel:03494996898"
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline 03494996898</span>
            </a>
          </div>
        </div>
      </div>

      {/* 📍 Central Operations & Support Info Card */}
      <div className="glass-card bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            LifeLink Central Operations
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Shergarh, Mardan, Khyber Pakhtunkhwa
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Official Email: <a href="mailto:adilraxiq64@gmail.com" className="text-red-600 hover:underline font-semibold">adilraxiq64@gmail.com</a> • Official Helpline: <span className="text-gray-900 font-semibold">03494996898</span>
          </p>
        </div>

        <button
          onClick={onNavigateEmergency}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>Find Patient in Need</span>
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
                  <span>Lifesaver Record</span>
                </div>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-white/80 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-xl font-bold font-display">Log a New Donation</h3>
              <p className="text-xs text-red-100 mt-1">
                Record your latest successful blood donation to update your profile.
              </p>
            </div>

            <form onSubmit={handleLogDonationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Donation Date
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
                  Hospital / Blood Center Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mardan Medical Complex, Shergarh Clinic"
                  value={logForm.hospital}
                  onChange={(e) => setLogForm({ ...logForm, hospital: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Patient name or general notes..."
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-medical text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-medical cursor-pointer"
                >
                  Save Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
