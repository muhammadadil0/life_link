import React, { useState, useEffect } from 'react';
import LargeHeroCarousel from '../components/LargeHeroCarousel';
import PatientsCarousel from '../components/PatientsCarousel';
import WhyLifeLink from '../components/WhyLifeLink';
import HadithSection from '../components/HadithSection';
import StatsSection from '../components/StatsSection';
import { fetchStats, fetchCarouselPatients, fetchQuotes } from '../services/api';

export default function Home({ 
  onNavigateRegister, 
  onNavigateEmergency, 
  onNavigateDonors, 
  onOpenSos,
  currentUser 
}) {
  const [stats, setStats] = useState({
    activeDonors: 1250,
    emergencySupport: '24/7',
    successRate: '98%',
    livesSaved: 2847,
  });
  const [patients, setPatients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, patientsData, quotesData] = await Promise.all([
          fetchStats(),
          fetchCarouselPatients(),
          fetchQuotes(),
        ]);
        if (statsData) setStats(statsData);
        if (patientsData && patientsData.length > 0) setPatients(patientsData);
        if (quotesData && quotesData.length > 0) setQuotes(quotesData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="relative z-10">
      {/* 🚀 Edge-to-Edge Hero Showcase Carousel directly below Navbar */}
      <LargeHeroCarousel 
        onNavigateRegister={onNavigateRegister} 
        onNavigateDonors={onNavigateDonors}
        onOpenSos={onOpenSos}
      />

      {/* Emergency Cases Patient Cards Carousel */}
      <PatientsCarousel patients={patients} />

      {/* Why LifeLink Motivational Story */}
      <WhyLifeLink />

      {/* Quran & Hadith Snap Cards */}
      <HadithSection quotes={quotes} />

      {/* Impact Stats Grid */}
      <StatsSection stats={stats} />
    </main>
  );
}
