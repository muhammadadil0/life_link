import React, { useState } from 'react';
import { 
  AlertTriangle, Droplets, MapPin, Phone, CheckCircle2, 
  X, Send, ArrowRight, HeartPulse, Sparkles, Navigation 
} from 'lucide-react';
import { createEmergencyRequest } from '../services/api';

export default function QuickSosModal({ isOpen, onClose, onViewDonors }) {
  const [bloodType, setBloodType] = useState('O-');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState('Immediate (ICU/Surgery)');
  const [city, setCity] = useState('Lahore');
  const [hospital, setHospital] = useState('');
  const [contact, setContact] = useState('03494996898');
  const [patientName, setPatientName] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const bloodGroups = ['O-', 'O+', 'B-', 'B+', 'A-', 'A+', 'AB-', 'AB+'];
  const popularCities = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Rawalpindi'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hospital.trim() || !contact.trim()) {
      alert('Please provide the hospital name and contact number so donors can reach you.');
      return;
    }

    setSubmitting(true);
    const payload = {
      patient_name: patientName.trim() || `Emergency Patient (${bloodType})`,
      blood_type: bloodType,
      units_needed: unitsNeeded,
      urgency: urgency.includes('Immediate') ? 'Critical' : urgency.includes('6 Hours') ? 'High' : 'Moderate',
      hospital: hospital.trim(),
      contact: contact.trim(),
      city: city.trim()
    };

    const res = await createEmergencyRequest(payload);
    setSubmitting(false);

    if (res.success) {
      setSuccessData(res.data);
    } else {
      alert(res.message || 'Failed to broadcast SOS. Please call the emergency hotline directly: 03494996898');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          /* Success Screen */
          <div className="py-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SOS Alert Broadcasted</span>
            </div>

            <h3 className="text-2xl font-bold font-display text-gray-900 mb-1">
              Alert Broadcasted to Donors!
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm max-w-sm mx-auto mb-6">
              Verified <span className="font-bold text-red-600">{successData.blood_type}</span> donors in{' '}
              <span className="font-semibold text-gray-900">{successData.city}</span> have received your priority alert for{' '}
              <span className="font-semibold text-gray-900">{successData.hospital}</span>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-left text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-bold text-gray-900">{successData.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Units Needed:</span>
                <span className="font-bold text-gray-900">{successData.units_needed} Units ({successData.blood_type})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Response Team:</span>
                <span className="font-bold text-emerald-600">Dispatched & Matching</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onClose();
                  if (onViewDonors) onViewDonors();
                }}
                className="btn-medical text-white w-full py-3.5 rounded-xl font-bold text-xs shadow-medical flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Matching Donors Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${successData.contact}`}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Emergency Dispatch: 03494996898</span>
              </a>
            </div>
          </div>
        ) : (
          /* Instant SOS Form */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/90 text-red-700 text-xs font-bold mb-2">
                <HeartPulse className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span>10-Second Emergency SOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-900 tracking-tight">
                Request Urgent Blood
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Zero sign-up required. Instantly broadcasts your hospital emergency to verified donors.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Fast Blood Group Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Tap Required Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodGroups.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodType(bg)}
                      className={`py-2.5 px-2 rounded-xl font-bold text-sm transition-all duration-150 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        bloodType === bg
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105 ring-2 ring-red-300'
                          : 'bg-slate-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <span>{bg}</span>
                      <Droplets className={`w-3 h-3 ${bloodType === bg ? 'text-white' : 'text-red-500'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Units & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Units Needed
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setUnitsNeeded(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          unitsNeeded === num
                            ? 'bg-gray-900 text-white'
                            : 'bg-slate-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {num} {num === 4 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
                  >
                    <option value="Immediate (ICU/Surgery)">Immediate (ICU / Surgery)</option>
                    <option value="Within 6 Hours">Within 6 Hours</option>
                    <option value="Today">Today</option>
                  </select>
                </div>
              </div>

              {/* 3. Hospital Name & City Quick Pick */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  2. Hospital & Ward Location *
                </label>
                <div className="relative mb-2">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g., Mayo Hospital, ICU Emergency Ward 2"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                {/* Popular City Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex-shrink-0">City:</span>
                  {popularCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex-shrink-0 ${
                        city === c
                          ? 'bg-red-50 text-red-700 border border-red-200 font-bold'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Phone Number & Patient Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Attendant Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. 03494996898"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Patient Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g., Patient Full Name"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Broadcast Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-medical text-white w-full py-4 rounded-2xl font-bold text-sm shadow-medical flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting to Nearby Donors...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>🚨 Broadcast Emergency SOS Now</span>
                    </>
                  )}
                </button>
                <div className="text-center text-[10px] text-gray-400 mt-2">
                  Emergency helpline: 03494996898 • Response coordinated within minutes
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
