import React from 'react';
import { useTransit } from '../context/TransitContext';
import { Bus, Clock, Users, ShieldCheck, AlertTriangle, ArrowRight, User } from 'lucide-react';

export default function LiveArrivalTimeline() {
  const { selectedStop, buses, routes, t, toggleSaveRoute, savedRouteCodes } = useTransit();

  if (!selectedStop) {
    return (
      <div className="p-6 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
        <Bus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        Select any bus stop on the map or search above to view live arrival timelines & upcoming vehicles.
      </div>
    );
  }

  // Filter buses that service this stop or pass near it
  const incomingBuses = buses.map((bus) => {
    const busRoute = routes.find((r) => r.code === bus.routeCode);
    const passesStop = busRoute && busRoute.stopCodes && busRoute.stopCodes.includes(selectedStop.code);

    // Approximate distance
    const lat1 = bus.currentLocation?.coordinates[1] || 13.0827;
    const lon1 = bus.currentLocation?.coordinates[0] || 80.2707;
    const lat2 = selectedStop.location.coordinates[1];
    const lon2 = selectedStop.location.coordinates[0];

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
    const etaMins = Math.max(Math.ceil((distKm / Math.max(bus.speed, 20)) * 60), 1);

    return {
      ...bus,
      busRoute,
      passesStop,
      distKm: parseFloat(distKm.toFixed(1)),
      etaMins
    };
  }).filter((b) => b.passesStop || b.distKm < 15).sort((a, b) => a.etaMins - b.etaMins);

  return (
    <div className="space-y-4">
      {/* Stop Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-primary-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-primary-100 text-primary-700 font-bold">
              {selectedStop.code}
            </span>
            <span className="text-sm text-slate-500 font-medium">{selectedStop.agency} • {selectedStop.city}</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-success-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-ping"></span>
            LIVE RADAR
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900">{selectedStop.name.en}</h3>
        <p className="text-sm text-primary-600 font-tamil mb-3">{selectedStop.name.ta}</p>

        {/* Amenities pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
          {selectedStop.amenities.map((amenity, idx) => (
            <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Incoming Buses Timeline List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span>{t.approachingBuses}</span>
          <span className="text-xs text-slate-500 font-mono">{incomingBuses.length} Vehicles tracked</span>
        </h4>

        {incomingBuses.length > 0 ? (
          incomingBuses.map((bus) => {
            const isBookmarked = savedRouteCodes.includes(bus.routeCode);
            return (
              <div
                key={bus.vehicleNumber}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                {/* Top Row: Route & ETA Countdown */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-md"
                      style={{ backgroundColor: bus.busRoute?.color || '#6366F1' }}
                    >
                      {bus.routeCode}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{bus.vehicleNumber}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary-100 text-primary-700">
                          {bus.acType}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {bus.busRoute?.origin?.en} → {bus.busRoute?.destination?.en}
                      </div>
                    </div>
                  </div>

                  {/* ETA Badge */}
                  <div className="text-right">
                    <div className="text-base font-extrabold text-primary-600 font-mono flex items-center gap-1.5 justify-end">
                      <Clock className="w-4 h-4 text-primary-500 animate-pulse" />
                      <span>{bus.etaNextStopMins} min</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{bus.distKm} km away</div>
                  </div>
                </div>

                {/* Bottom Row: Status, Occupancy, Driver */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold ${
                        bus.status === 'ON_TIME'
                          ? 'bg-success-100 text-slate-900'
                          : 'bg-warning-100 text-slate-900'
                      }`}
                    >
                      {bus.status === 'ON_TIME' ? t.onTime : `${t.delayed} (+${bus.delayMinutes}m)`}
                    </span>

                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span>{bus.occupancy}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{bus.driverName}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
            No live vehicles currently approaching this stop. Check back shortly.
          </div>
        )}
      </div>
    </div>
  );
}
