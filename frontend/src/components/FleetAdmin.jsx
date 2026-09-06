import React from 'react';
import { useTransit } from '../context/TransitContext';
import { Shield, Activity, AlertTriangle, CheckCircle, Clock, Zap, User, AlertOctagon } from 'lucide-react';

export default function FleetAdmin() {
  const { allBuses, emergencyAlerts, t } = useTransit();

  const activeCount = allBuses.length;
  const onTimeCount = allBuses.filter((b) => b.status === 'ON_TIME').length;
  const delayedCount = allBuses.filter((b) => b.status === 'DELAYED').length;
  const onTimePercentage = activeCount > 0 ? Math.round((onTimeCount / activeCount) * 100) : 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <span>{t.fleetOverview}</span>
          </h2>
          <p className="text-sm text-slate-500">
            Real-time logistics monitoring center for MTC Chennai, TNSTC & SETC fleet vehicles
          </p>
        </div>
        <span className="text-sm font-mono px-4 py-2 rounded-full bg-primary-100 text-primary-700 border border-primary-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-500 animate-ping"></span>
          Control Room Live
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Buses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
            <span>{t.activeVehicles}</span>
            <Activity className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{activeCount}</div>
          <div className="text-xs text-primary-600 font-mono">100% Telemetry Active</div>
        </div>

        {/* Schedule Adherence */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
            <span>{t.onTimePercentage}</span>
            <CheckCircle className="w-5 h-5 text-success-500" />
          </div>
          <div className="text-3xl font-black text-success-600 font-mono">{onTimePercentage}%</div>
          <div className="text-xs text-slate-500">{onTimeCount} On Time • {delayedCount} Delayed</div>
        </div>

        {/* Speed Violations / Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
            <span>Speed Compliance</span>
            <Zap className="w-5 h-5 text-warning-500" />
          </div>
          <div className="text-3xl font-black text-warning-600 font-mono">98.4%</div>
          <div className="text-xs text-slate-500">Avg Speed: 42 km/h</div>
        </div>

        {/* Active Emergency SOS Alerts */}
        <div className="bg-white p-5 rounded-xl border border-danger-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-danger-600 text-sm font-medium">
            <span>{t.sosAlertsCount}</span>
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-danger-600 font-mono">{emergencyAlerts.length}</div>
          <div className="text-xs text-danger-500 font-mono">Fast2SMS/Twilio Alert Active</div>
        </div>
      </div>

      {/* Emergency SOS Log Table */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-danger-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-danger-600 uppercase tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            <span>Emergency SOS Dispatch History</span>
          </h3>
          <div className="space-y-3">
            {emergencyAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-lg bg-danger-50 border border-danger-200 flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-mono text-danger-700 font-bold">{alert.vehicleNumber}</span>
                  <p className="text-sm text-slate-600">{alert.details}</p>
                  <span className="text-xs text-slate-500 font-mono">
                    Phone: {alert.passengerPhone} • Lat/Lng: {alert.location?.join(', ')}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-danger-100 text-danger-700 text-xs font-bold">
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Vehicles Monitoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
            Live Fleet Operations Matrix
          </h3>
          <span className="text-xs font-mono text-slate-500">Sorted by Agency</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
                <th className="p-4 font-semibold">Vehicle #</th>
                <th className="p-4 font-semibold">Agency</th>
                <th className="p-4 font-semibold">Route</th>
                <th className="p-4 font-semibold">Speed</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Occupancy</th>
                <th className="p-4 font-semibold">Assigned Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allBuses.map((bus) => (
                <tr key={bus.vehicleNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold font-mono text-slate-900">{bus.vehicleNumber}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold ${
                        bus.agency === 'MTC'
                          ? 'bg-primary-100 text-primary-700'
                          : bus.agency === 'TNSTC'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {bus.agency}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-900 font-bold">{bus.routeCode}</td>
                  <td className="p-4 font-mono text-slate-600">{bus.speed} km/h</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        bus.status === 'ON_TIME'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                  <td className="p-4 text-primary-600 font-medium">{bus.occupancy}</td>
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{bus.driverName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
