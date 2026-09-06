import React from 'react';
import { useTransit } from '../context/TransitContext';
import { MapPin, Navigation, Footprints, ChevronRight } from 'lucide-react';

export default function NearestStopsCarousel() {
  const { stops, setSelectedStop, selectedStop, userLocation, t } = useTransit();

  // Calculate distance for all stops
  const stopsWithDist = stops.map((stop) => {
    const lat1 = userLocation ? userLocation[1] : 13.0827;
    const lon1 = userLocation ? userLocation[0] : 80.2707;
    const lat2 = stop.location.coordinates[1];
    const lon2 = stop.location.coordinates[0];

    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = R * c;
    const walkMins = Math.ceil((distKm / 4.5) * 60);

    return { ...stop, distKm, walkMins };
  });

  const sortedStops = stopsWithDist.sort((a, b) => a.distKm - b.distKm).slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" />
          {t.nearestStops}
        </h3>
        <span className="text-xs text-primary-600 font-medium">Near You</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {sortedStops.map((stop) => {
          const isSelected = selectedStop && selectedStop.code === stop.code;
          return (
            <div
              key={stop.code}
              onClick={() => setSelectedStop(stop)}
              className={`snap-start min-w-[220px] max-w-[240px] p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200'
                  : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono px-2 py-1 rounded bg-primary-100 text-primary-700 font-bold">
                  {stop.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{stop.agency}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 truncate mb-1">{stop.name.en}</h4>
              <p className="text-xs text-primary-600 font-tamil truncate mb-3">{stop.name.ta}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Navigation className="w-3.5 h-3.5 text-primary-500" />
                  <span>{stop.distKm.toFixed(1)} {t.distanceKm}</span>
                </div>
                <div className="flex items-center gap-1.5 text-success-600 font-semibold">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{stop.walkMins}m walk</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
