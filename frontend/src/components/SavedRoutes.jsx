import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { Heart, Bus, ArrowRight, Trash2, Plus, MapPin, Clock, DollarSign } from 'lucide-react';

export default function SavedRoutes() {
  const { routes, savedRouteCodes, toggleSaveRoute, setSelectedRouteCode, setActiveTab, t } = useTransit();
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  const savedRoutesList = routes.filter((r) => savedRouteCodes.includes(r.code));
  const availableRoutes = routes.filter((r) => !savedRouteCodes.includes(r.code));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t.bookmarked}</h3>
            <p className="text-sm text-slate-500">{savedRoutesList.length} routes saved</p>
          </div>
        </div>
        <button
          onClick={() => setShowAllRoutes(!showAllRoutes)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showAllRoutes ? 'View Saved' : 'Add Routes'}
        </button>
      </div>

      {/* Saved Routes */}
      {!showAllRoutes && (
        <div className="space-y-3">
          {savedRoutesList.length > 0 ? (
            savedRoutesList.map((route) => (
              <div
                key={route.code}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: route.color || '#6366F1' }}
                    >
                      {route.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-slate-900 mb-1">{route.name.en}</h4>
                      <p className="text-sm text-primary-600 font-tamil mb-2">{route.name.ta}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{route.origin.en} → {route.destination.en}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{route.avgDurationMins} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>₹{route.fareInINR}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedRouteCode(route.code);
                        setActiveTab('live-map');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      View on Map
                    </button>
                    <button
                      onClick={() => toggleSaveRoute(route.code)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">{t.noSavedRoutes}</p>
              <button
                onClick={() => setShowAllRoutes(true)}
                className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Browse Routes
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Available Routes */}
      {showAllRoutes && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Bus className="w-5 h-5 text-primary-500" />
            <h4 className="font-bold text-slate-900">All Available Routes</h4>
          </div>
          {routes.map((route) => {
            const isSaved = savedRouteCodes.includes(route.code);
            return (
              <div
                key={route.code}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                      style={{ backgroundColor: route.color || '#6366F1' }}
                    >
                      {route.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900">{route.name.en}</h4>
                      <p className="text-xs text-slate-500 truncate">
                        {route.origin.en} → {route.destination.en} • {route.totalDistanceKm} km
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedRouteCode(route.code);
                        setActiveTab('live-map');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => toggleSaveRoute(route.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSaved
                          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      }`}
                    >
                      {isSaved ? <Trash2 className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                      {isSaved ? 'Remove' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
