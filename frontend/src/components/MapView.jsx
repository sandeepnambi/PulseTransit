import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTransit } from '../context/TransitContext';
import { Bus, Navigation, Clock, ShieldAlert } from 'lucide-react';

// Controller component to dynamically change map view bounds or center
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

// Generate Leaflet SVG DivIcon for Live Buses with smooth rotation arrow
function createBusDivIcon(bus, isSelected) {
  const agencyColor =
    bus.agency === 'MTC' ? '#6366F1' : bus.agency === 'TNSTC' ? '#10B981' : '#8B5CF6';
  const heading = bus.heading || 0;

  const html = `
    <div class="relative group cursor-pointer">
      <!-- Bus Marker Body -->
      <div class="relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border-2 shadow-lg transition-transform hover:scale-110 ${
        isSelected ? 'border-primary-500 scale-110' : 'border-slate-200'
      }" style="border-color: ${isSelected ? agencyColor : '#E2E8F0'}">
        <!-- Heading Direction Arrow -->
        <div style="transform: rotate(${heading}deg)" class="transition-transform duration-500 ease-out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${agencyColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"/>
          </svg>
        </div>

        <!-- Route Code Badge -->
        <span class="font-extrabold text-[11px] text-slate-800 font-mono tracking-tight">${bus.routeCode}</span>
        
        <!-- Speed indicator -->
        <span class="text-[9px] px-1 rounded bg-slate-100 text-slate-600 font-mono">${bus.speed}km/h</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [85, 30],
    iconAnchor: [42, 15]
  });
}

// Generate Leaflet SVG DivIcon for Bus Stops
function createStopDivIcon(stop, isSelected) {
  const html = `
    <div class="relative cursor-pointer group">
      <div class="w-4 h-4 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
        isSelected ? 'scale-125 ring-2 ring-primary-300' : ''
      }">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-stop-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

export default function MapView() {
  const {
    buses,
    routes,
    stops,
    selectedStop,
    setSelectedStop,
    selectedRouteCode,
    setSelectedRouteCode,
    userLocation
  } = useTransit();

  // Determine initial center
  const mapCenter = selectedStop
    ? [selectedStop.location.coordinates[1], selectedStop.location.coordinates[0]]
    : userLocation
    ? [userLocation[1], userLocation[0]]
    : [13.0827, 80.2707]; // Chennai default

  const mapZoom = selectedStop ? 15 : 12;

  // Selected route polyline
  const activeRoute = routes.find((r) => r.code === selectedRouteCode);
  const routePolyline = activeRoute
    ? activeRoute.path.map((coord) => [coord[1], coord[0]])
    : [];

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Route Polyline Overlay */}
        {routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: activeRoute.color || '#6366F1',
              weight: 5,
              opacity: 0.85,
              dashArray: '1, 10',
              lineCap: 'round'
            }}
          />
        )}

        {/* Bus Stop Markers */}
        {stops.map((stop) => {
          const isSelected = selectedStop && selectedStop.code === stop.code;
          return (
            <Marker
              key={stop.code}
              position={[stop.location.coordinates[1], stop.location.coordinates[0]]}
              icon={createStopDivIcon(stop, isSelected)}
              eventHandlers={{
                click: () => setSelectedStop(stop)
              }}
            >
              <Popup>
                <div className="p-2 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 font-bold">
                      {stop.code}
                    </span>
                    <span className="text-[10px] text-slate-500">{stop.agency}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{stop.name.en}</h4>
                  <p className="text-xs text-primary-600 font-tamil">{stop.name.ta}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                    <Clock className="w-3 h-3 text-success-500" />
                    <span>Live Arrivals: Active</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Animated Live Bus Markers */}
        {buses.map((bus) => {
          const lat = bus.currentLocation?.coordinates[1] || 13.0827;
          const lng = bus.currentLocation?.coordinates[0] || 80.2707;
          const isSelected = selectedRouteCode === bus.routeCode;

          return (
            <Marker
              key={bus.vehicleNumber}
              position={[lat, lng]}
              icon={createBusDivIcon(bus, isSelected)}
              eventHandlers={{
                click: () => setSelectedRouteCode(bus.routeCode)
              }}
            >
              <Popup>
                <div className="p-2 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-sm text-primary-600 font-mono">
                      {bus.vehicleNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bus.status === 'ON_TIME'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Route:</span>
                      <span className="font-bold text-slate-900">{bus.routeCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Speed:</span>
                      <span className="font-bold text-slate-900">{bus.speed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Crowd:</span>
                      <span className="font-bold text-primary-600">{bus.occupancy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Driver:</span>
                      <span className="font-medium text-slate-700 truncate block">
                        {bus.driverName}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls Legend */}
      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-xl text-xs flex items-center gap-3 border border-slate-200 z-[400] shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
          <span className="text-slate-700 font-medium text-[11px]">MTC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success-500"></span>
          <span className="text-slate-700 font-medium text-[11px]">TNSTC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span className="text-slate-700 font-medium text-[11px]">SETC</span>
        </div>
      </div>
    </div>
  );
}
