import React from 'react';
import { Heart, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HeroSection({ activeDonorsCount }) {
  return (
    <section className="pt-16 pb-12 px-6 text-center">
      <div className="container mx-auto max-w-5xl">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span>{activeDonorsCount ? `${activeDonorsCount} Active Donors Available` : '24/7 Rapid Emergency Response Active'}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent tracking-tight">
          Save Lives Today
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
          Every donation matters. Connect with patients in urgent need of blood and become a hero in someone's story.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-medical text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-medical-lg inline-flex items-center justify-center w-full sm:w-auto">
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Become a Donor
          </button>
          <a
            href="#emergencies"
            className="bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-red-50 hover:shadow-md transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Cases
          </a>
        </div>
      </div>
    </section>
  );
}
