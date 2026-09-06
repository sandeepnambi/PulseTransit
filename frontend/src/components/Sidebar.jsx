import React from 'react';
import { useTransit } from '../context/TransitContext';
import { Map, Navigation, Heart, Shield, Cpu, AlertCircle, Radio } from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, t, setIsSosModalOpen } = useTransit();

  const navItems = [
    { id: 'live-map', label: t.liveTracking, icon: Map },
    { id: 'trip-planner', label: t.tripPlanner, icon: Navigation },
    { id: 'saved-routes', label: t.savedRoutes, icon: Heart },
    { id: 'fleet-admin', label: t.fleetAdmin, icon: Shield },
    { id: 'hardware-tester', label: t.hardwareIngestion, icon: Cpu }
  ];

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-3 z-20 transition-all duration-300">
      {/* Navigation Links */}
      <div className="space-y-2 mt-2">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:block">
          Transit Services
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-slate-400 group-hover:text-primary-600 group-hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="hidden md:inline truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SOS Quick Trigger Card at bottom of Sidebar */}
      <div className="space-y-3">
        <div className="hidden md:block bg-white p-3 rounded-xl border border-danger-200 shadow-sm">
          <div className="flex items-center gap-2 text-danger-600 text-xs font-bold mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>TN Transit Safety</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            24/7 Direct link to Transport Control Room & PCR Patrol
          </p>
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="w-full py-1.5 rounded-lg bg-danger-600 hover:bg-danger-700 text-white border border-danger-700 text-xs font-bold transition-all text-center"
          >
            Emergency Assist
          </button>
        </div>

        {/* Footer Credit */}
        <div className="text-[10px] text-slate-400 text-center font-mono hidden md:block">
          PulseTransit • Tamil Nadu MERN
        </div>
      </div>
    </aside>
  );
}
