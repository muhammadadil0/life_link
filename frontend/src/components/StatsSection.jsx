import React from 'react';
import { HeartPulse, Clock, Users, HeartHandshake } from 'lucide-react';

export default function StatsSection({ stats = {} }) {
  const cards = [
    {
      title: 'Success Rate',
      value: stats.successRate || '98%',
      subtitle: 'Critical requests fulfilled',
      icon: HeartPulse,
      iconBg: 'bg-red-100 text-red-600'
    },
    {
      title: 'Emergency Support',
      value: stats.emergencySupport || '24/7',
      subtitle: 'Always available team',
      icon: Clock,
      iconBg: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'Active Donors',
      value: stats.activeDonors ? `${stats.activeDonors.toLocaleString()}+` : '1,250+',
      subtitle: 'Verified life-savers',
      icon: Users,
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Lives Saved',
      value: stats.livesSaved ? `${stats.livesSaved.toLocaleString()}+` : '2,840+',
      subtitle: 'Community impact',
      icon: HeartHandshake,
      iconBg: 'bg-emerald-100 text-emerald-600'
    }
  ];

  return (
    <section id="impact" className="py-8 sm:py-16 px-3 sm:px-6 bg-white/70 backdrop-blur-sm border-y border-red-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 font-display mb-1.5 sm:mb-3">
            Our Impact
          </h2>
          <p className="text-gray-600 text-xs sm:text-base max-w-xl mx-auto">
            Empowering communities and giving patients the emergency support they need when every second counts.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 text-center flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-5 ${c.iconBg}`}>
                  <Icon className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="text-2xl sm:text-4xl font-extrabold mb-0.5 sm:mb-1 text-gray-900 tracking-tight">
                  {c.value}
                </div>
                <div className="text-gray-900 font-bold text-xs sm:text-lg mb-0.5">
                  {c.title}
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs font-medium">
                  {c.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
