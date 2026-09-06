import React, { useState, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import { Navigation, MapPin, ArrowRight, Clock, IndianRupee, Layers, Bus, Footprints, CheckCircle2 } from 'lucide-react';

export default function TripPlanner() {
  const { stops, routes, t } = useTransit();

  const [originCode, setOriginCode] = useState('STP-BDW'); // Broadway
  const [destCode, setDestCode] = useState('STP-KLM'); // Kelambakkam
  const [tripResults, setTripResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlanTrip = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originCode, destinationCode: destCode })
      });
      const data = await response.json();
      if (data.success) {
        setTripResults(data);
      }
    } catch (err) {
      console.error('Trip planner fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-update routes when origin or destination changes
  useEffect(() => {
    if (originCode && destCode && originCode !== destCode) {
      handlePlanTrip();
    }
  }, [originCode, destCode]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Form Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{t.planTrip}</h3>
            <p className="text-sm text-slate-500">Multi-Modal Transit Routing across MTC, TNSTC & SETC</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Origin Stop Selection */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              {t.fromOrigin}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-success-500 absolute left-3 top-3" />
              <select
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white"
              >
                {stops.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name.en} ({s.agency} - {s.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Stop Selection */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              {t.toDestination}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-primary-500 absolute left-3 top-3" />
              <select
                value={destCode}
                onChange={(e) => setDestCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white"
              >
                {stops.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name.en} ({s.agency} - {s.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handlePlanTrip}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span>Calculating Optimal Route...</span>
            ) : (
              <>
                <span>{t.findRoutes}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results List */}
      {tripResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Recommended Route Choices</h4>
            <span className="text-sm text-primary-600 font-medium">{tripResults.optionsCount} Options Found</span>
          </div>

          {tripResults.options.map((option, idx) => (
            <div
              key={option.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Option Top Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full font-medium ${
                      option.type === 'DIRECT'
                        ? 'bg-success-100 text-success-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {option.type === 'DIRECT' ? t.directRoute : t.connectingRoute}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{option.routeCode}</span>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center text-primary-600">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{option.estimatedDurationMins} mins</span>
                  </div>
                  <div className="flex items-center text-success-600 font-bold">
                    <IndianRupee className="w-4 h-4" />
                    <span>{option.fareInINR}</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 relative pl-4 border-l-2 border-primary-200 ml-2">
                {option.steps.map((step, sIdx) => (
                  <div key={sIdx} className="text-sm space-y-1 relative">
                    <span className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-primary-500 border-2 border-white"></span>
                    {step.mode === 'BUS' ? (
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-primary-500" />
                          <span>Board {step.routeCode} ({step.routeName})</span>
                        </div>
                        <p className="text-sm text-slate-500">
                          From <strong className="text-slate-700">{step.from}</strong> to <strong className="text-slate-700">{step.to}</strong> ({step.durationMins} mins)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-warning-600 flex items-center gap-2">
                          <Footprints className="w-4 h-4 text-warning-500" />
                          <span>Walk to platform at {step.transferStopName}</span>
                        </div>
                        <p className="text-sm text-slate-500">Transfer layover (~{step.durationMins} mins)</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
