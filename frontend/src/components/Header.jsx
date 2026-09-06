import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { Bus, Globe, AlertTriangle, ChevronDown, Activity, User, LogIn, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const {
    selectedAgency,
    setSelectedAgency,
    lang,
    setLang,
    t,
    setIsSosModalOpen,
    allBuses,
    currentUser,
    setIsAuthModalOpen,
    logoutUser
  } = useTransit();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between z-30 relative shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-md">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
              {t.appTitle}
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-primary-100 text-primary-700 border border-primary-200 uppercase tracking-widest hidden sm:inline-block">
              TN Transit v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block font-medium">
            {t.subTitle}
          </p>
        </div>
      </div>

      {/* Controls & Switchers */}
      <div className="flex items-center gap-2.5">
        {/* Agency Switcher Dropdown */}
        <div className="relative group hidden sm:block">
          <div className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span className="text-slate-600">Agency:</span>
            <span className="text-primary-600 font-bold">
              {selectedAgency === 'ALL'
                ? t.allAgencies
                : selectedAgency === 'MTC'
                ? t.mtcChennai
                : selectedAgency === 'TNSTC'
                ? t.tnstc
                : t.setc}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>

          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-slate-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
            <button
              onClick={() => setSelectedAgency('ALL')}
              className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                selectedAgency === 'ALL' ? 'text-primary-600 font-bold bg-primary-50' : 'text-slate-600'
              }`}
            >
              <span>{t.allAgencies}</span>
              <span className="text-[10px] text-slate-400 font-mono">ALL</span>
            </button>
            <button
              onClick={() => setSelectedAgency('MTC')}
              className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                selectedAgency === 'MTC' ? 'text-primary-600 font-bold bg-primary-50' : 'text-slate-600'
              }`}
            >
              <span>{t.mtcChennai}</span>
              <span className="text-[10px] text-primary-500 font-mono">Chennai</span>
            </button>
            <button
              onClick={() => setSelectedAgency('TNSTC')}
              className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                selectedAgency === 'TNSTC' ? 'text-success-600 font-bold bg-success-50' : 'text-slate-600'
              }`}
            >
              <span>{t.tnstc}</span>
              <span className="text-[10px] text-success-500 font-mono">Regional</span>
            </button>
            <button
              onClick={() => setSelectedAgency('SETC')}
              className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                selectedAgency === 'SETC' ? 'text-purple-600 font-bold bg-purple-50' : 'text-slate-600'
              }`}
            >
              <span>{t.setc}</span>
              <span className="text-[10px] text-purple-500 font-mono">Express</span>
            </button>
          </div>
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 transition-colors shadow-sm"
          title="Toggle Language / மொழி மாற்றம்"
        >
          <Globe className="w-3.5 h-3.5 text-primary-500" />
          <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* User Authentication Pill / Menu */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <span className="font-bold text-slate-700 hidden md:inline truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-primary-100 text-primary-600 hidden lg:inline">
                {currentUser.role === 'FLEET_ADMIN' ? 'ADMIN' : 'PASSENGER'}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg p-3 border border-slate-200 z-50 space-y-2">
                <div className="border-b border-slate-200 pb-2">
                  <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-primary-600 font-mono mt-1">
                    Role: {currentUser.role || 'PASSENGER'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logoutUser();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-danger-600 hover:bg-danger-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all transform hover:scale-105"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.login}</span>
          </button>
        )}

        {/* Emergency SOS Button */}
        <button
          onClick={() => setIsSosModalOpen(true)}
          className="flex items-center gap-1.5 bg-danger-600 hover:bg-danger-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">SOS</span>
        </button>
      </div>
    </header>
  );
}
