import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BloodBallBackground from './components/BloodBallBackground';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import EmergencyPage from './pages/EmergencyPage';
import DonorsPage from './pages/DonorsPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './components/AdminDashboard';
import QuickSosModal from './components/QuickSosModal';
import MobileBottomNav from './components/MobileBottomNav';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // Automatically scroll to the top of the page whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.userType === 'admin') {
      setCurrentView('admin');
    } else if (user.userType === 'donor') {
      setCurrentView('donor_dashboard');
    } else if (user.userType === 'patient') {
      setCurrentView('patient_dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lifelink_user');
    setCurrentView('home');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Background Animated Floating Blood Droplets */}
      <BloodBallBackground />

      {/* Header Navigation */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSos={() => setIsSosModalOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1 pb-20 md:pb-0">
        {currentView === 'admin' ? (
          <AdminDashboard onBack={() => setCurrentView('home')} />
        ) : currentView === 'register' ? (
          <Register 
            onNavigateHome={() => setCurrentView('home')} 
            onNavigateLogin={() => setCurrentView('login')}
          />
        ) : currentView === 'login' ? (
          <Login 
            onNavigateHome={() => setCurrentView('home')}
            onNavigateRegister={() => setCurrentView('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : currentView === 'donor_dashboard' ? (
          <DonorDashboard 
            currentUser={currentUser}
            onNavigateHome={() => setCurrentView('home')}
            onNavigateEmergency={() => setCurrentView('emergency')}
          />
        ) : currentView === 'patient_dashboard' ? (
          <PatientDashboard 
            currentUser={currentUser}
            onNavigateHome={() => setCurrentView('home')}
          />
        ) : currentView === 'emergency' ? (
          <EmergencyPage 
            currentUser={currentUser}
            onNavigateHome={() => setCurrentView('home')}
            onNavigateDonorPortal={() => setCurrentView('donor_dashboard')}
          />
        ) : currentView === 'donors' ? (
          <DonorsPage 
            currentUser={currentUser}
            onNavigateRegister={() => setCurrentView('register')}
            onNavigateDonorPortal={() => setCurrentView('donor_dashboard')}
          />
        ) : currentView === 'contact' ? (
          <ContactPage 
            onNavigateHome={() => setCurrentView('home')}
          />
        ) : (
          <Home 
            onNavigateRegister={() => setCurrentView('register')} 
            onNavigateEmergency={() => setCurrentView('emergency')}
            onNavigateDonors={() => setCurrentView('donors')}
            onOpenSos={() => setIsSosModalOpen(true)}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== 'admin' && (
        <Footer 
          onNavigate={(view) => setCurrentView(view)} 
        />
      )}

      {/* 📱 Mobile Native-App Style Bottom Navigation Bar */}
      {currentView !== 'admin' && (
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          onOpenSos={() => setIsSosModalOpen(true)}
        />
      )}

      {/* 🚨 Global 10-Second Quick SOS Modal */}
      <QuickSosModal 
        isOpen={isSosModalOpen} 
        onClose={() => setIsSosModalOpen(false)} 
        onViewDonors={() => setCurrentView('donors')}
      />
    </div>
  );
}
