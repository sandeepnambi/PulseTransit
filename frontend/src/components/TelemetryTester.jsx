import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { Cpu, Send, CheckCircle2, Radio, Terminal } from 'lucide-react';

export default function TelemetryTester() {
  const { allBuses, t } = useTransit();

  const [vehicleNumber, setVehicleNumber] = useState(allBuses[0]?.vehicleNumber || 'TN-01-N-9821');
  const [lat, setLat] = useState('12.9640');
  const [lng, setLng] = useState('80.2475');
  const [speed, setSpeed] = useState('48');
  const [heading, setHeading] = useState('180');
  const [batteryVoltage, setBatteryVoltage] = useState('12.6');
  const [logResponse, setLogResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendTelemetry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/telemetry/gps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: `ESP32-${vehicleNumber}`,
          vehicleNumber,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          speed: parseFloat(speed),
          heading: parseFloat(heading),
          batteryVoltage: parseFloat(batteryVoltage)
        })
      });
      const data = await response.json();
      setLogResponse(data);
    } catch (err) {
      setLogResponse({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-primary-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">{t.hardwareTesterTitle}</h3>
        </div>
        <p className="text-sm text-slate-500">
          Simulate ESP32 / SIM800L IoT GPS device telemetry ingestion into PulseTransit backend (`POST /api/telemetry/gps`)
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSendTelemetry} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Select Target Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
            >
              {allBuses.map((b) => (
                <option key={b.vehicleNumber} value={b.vehicleNumber}>
                  {b.vehicleNumber} ({b.agency} - Route {b.routeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Latitude (°N)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Longitude (°E)</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Speed (km/h)</label>
              <input
                type="text"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Heading (°)</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Battery (V)</label>
              <input
                type="text"
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Transmitting Ingestion Packet...' : t.sendTelemetry}</span>
          </button>
        </form>
      </div>

      {/* Response Terminal Log */}
      {logResponse && (
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-3 font-mono">
          <div className="flex items-center justify-between text-sm text-slate-400 border-b border-slate-700 pb-2">
            <span className="flex items-center gap-2 text-primary-400">
              <Terminal className="w-4 h-4" />
              <span>Ingestion Response Log</span>
            </span>
            <span className="text-xs text-success-400 font-bold">HTTP 200 OK</span>
          </div>
          <pre className="text-sm text-primary-300 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(logResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
