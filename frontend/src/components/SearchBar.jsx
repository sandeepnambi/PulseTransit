import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { Search, Bus, MapPin, X } from 'lucide-react';

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    routes,
    stops,
    setSelectedRouteCode,
    setSelectedStop,
    t
  } = useTransit();
  const [isOpen, setIsOpen] = useState(false);

  const matchedRoutes = searchQuery.trim()
    ? routes.filter(
        (r) =>
          r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.name.ta.includes(searchQuery)
      )
    : [];

  const matchedStops = searchQuery.trim()
    ? stops.filter(
        (s) =>
          s.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.ta.includes(searchQuery) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400 bg-white border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && searchQuery.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-72 overflow-y-auto z-50 p-2 space-y-2">
          {/* Routes Section */}
          {matchedRoutes.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Bus Routes
              </div>
              {matchedRoutes.map((route) => (
                <button
                  key={route.code}
                  onClick={() => {
                    setSelectedRouteCode(route.code);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: route.color || '#6366F1' }}
                    >
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary-600">
                        {route.code} - {route.name.en}
                      </div>
                      <div className="text-xs text-primary-600 font-tamil">{route.name.ta}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-600">
                    ₹{route.fareInINR}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Stops Section */}
          {matchedStops.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Bus Stops
              </div>
              {matchedStops.map((stop) => (
                <button
                  key={stop.code}
                  onClick={() => {
                    setSelectedStop(stop);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary-600">
                        {stop.name.en}
                      </div>
                      <div className="text-xs text-primary-600 font-tamil">{stop.name.ta}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{stop.agency}</span>
                </button>
              ))}
            </div>
          )}

          {matchedRoutes.length === 0 && matchedStops.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No matching bus routes or stops found in Tamil Nadu.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
