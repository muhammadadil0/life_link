import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, AlertTriangle, MapPin, UserPlus, FileText, ArrowUpRight, Activity } from 'lucide-react';
import { fetchEmergencyRequests } from '../services/api';

export default function AdminDashboard({ onBack }) {
  const [recentEmergencies, setRecentEmergencies] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchEmergencyRequests();
        setRecentEmergencies(data);
      } catch (err) {
        console.error('Failed to load admin emergencies:', err);
      }
    }
    load();
  }, []);

  const stats = [
    { label: 'Total Donors', value: '25,847', change: '+12% this month', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Active Donors', value: '18,392', change: 'Available now', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Active Emergencies', value: recentEmergencies.length.toString(), change: 'Critical attention', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'Cities Covered', value: '256', change: 'Nationwide network', icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-gray-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                Admin Console
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display">System Overview & Management</h1>
            <p className="text-gray-400 text-sm">Real-time telemetry and life-saving request tracking.</p>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/10"
          >
            ← Back to Public Dashboard
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.bg}`}>
                    <Icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <span className="text-xs text-gray-400">{s.change}</span>
                </div>
                <div className="text-3xl font-bold tracking-tight mb-1">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Emergencies Table */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" />
                Live Urgent Blood Requests
              </h2>
              <span className="text-xs text-gray-400">Auto-refreshing</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Blood Type</th>
                    <th className="pb-3">Urgency</th>
                    <th className="pb-3">Hospital</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {recentEmergencies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                        No active emergencies pending in system.
                      </td>
                    </tr>
                  ) : (
                    recentEmergencies.map((e) => (
                      <tr key={e.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-medium">{e.patient_name || e.patient}</td>
                        <td className="py-4">
                          <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded text-xs">
                            {e.blood_type || e.blood}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            e.urgency === 'Critical' ? 'bg-red-500/30 text-red-300' :
                            e.urgency === 'High' ? 'bg-orange-500/30 text-orange-300' :
                            'bg-emerald-500/30 text-emerald-300'
                          }`}>
                            {e.urgency || 'Urgent'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{e.hospital} {e.city ? `(${e.city})` : ''}</td>
                        <td className="py-4">
                          <span className="text-xs text-blue-400 font-medium">{e.status || 'Active'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6">Quick Admin Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 font-medium text-sm flex items-center justify-between transition-colors shadow-lg shadow-red-600/30">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Create Emergency Alert
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 font-medium text-sm flex items-center justify-between transition-colors border border-white/5">
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-green-400" />
                    Verify New Donors
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 font-medium text-sm flex items-center justify-between transition-colors border border-white/5">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    Generate Monthly Audit
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-400">
              <p>LifeLink Admin Node v1.0.0 • Connected to Node.js Backend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
