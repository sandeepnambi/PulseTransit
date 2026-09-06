import React from 'react';
import { useTransit, TransitProvider } from './context/TransitContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import BottomSheet from './components/BottomSheet';
import TripPlanner from './components/TripPlanner';
import SavedRoutes from './components/SavedRoutes';
import FleetAdmin from './components/FleetAdmin';
import TelemetryTester from './components/TelemetryTester';
import EmergencySOSModal from './components/EmergencySOSModal';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';

function MainAppLayout() {
  const { activeTab } = useTransit();

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      {/* Top Header */}
      <Header />

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic View Area */}
        <main className="flex-1 h-full relative overflow-hidden">
          {/* Base Live Map View always mounted */}
          <div className="w-full h-full absolute inset-0 z-0">
            <MapView />
          </div>

          {/* Bottom Sheet Drawer for Live Map view */}
          {activeTab === 'live-map' && <BottomSheet />}

          {/* Tab Views Full-Screen Overlay Panels */}
          {activeTab !== 'live-map' && (
            <div className="absolute inset-0 z-20 bg-white p-3 sm:p-6 pb-20 md:pb-6 overflow-y-auto border-l border-slate-200">
              {activeTab === 'trip-planner' && <TripPlanner />}
              {activeTab === 'saved-routes' && <SavedRoutes />}
              {activeTab === 'fleet-admin' && <FleetAdmin />}
              {activeTab === 'hardware-tester' && <TelemetryTester />}
            </div>
          )}
        </main>
      </div>

      {/* Emergency SOS Trigger Modal */}
      <EmergencySOSModal />

      {/* Login & Register Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}

function AppContent() {
  const { currentUser } = useTransit();

  // Show landing page if not authenticated
  if (!currentUser) {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  // Show main app if authenticated
  return <MainAppLayout />;
}
