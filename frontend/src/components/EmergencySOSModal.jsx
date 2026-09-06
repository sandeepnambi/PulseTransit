import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { AlertTriangle, ShieldAlert, X, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function EmergencySOSModal() {
  const { isSosModalOpen, setIsSosModalOpen, allBuses, t } = useTransit();

  const [vehicleNumber, setVehicleNumber] = useState(allBuses[0]?.vehicleNumber || 'TN-01-N-9821');
  const [passengerPhone, setPassengerPhone] = useState('+91 98401 55443');
  const [emergencyType, setEmergencyType] = useState('MEDICAL_ACCIDENT');
  const [details, setDetails] = useState('Medical distress / Emergency assistance required immediately.');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSosModalOpen) return null;

  const handleTriggerSos = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber,
          passengerPhone,
          location: [80.2475, 12.9640],
          emergencyType,
          details
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('SOS trigger error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-danger-200 shadow-xl p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsSosModalOpen(false);
            setIsSuccess(false);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-danger-100 text-danger-600 border border-danger-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{t.sosModalTitle}</h3>
            <p className="text-sm text-slate-500">{t.sosSubtitle}</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4 bg-success-50 rounded-xl border border-success-200">
            <CheckCircle2 className="w-12 h-12 text-success-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">{t.sosSuccess}</h4>
            <p className="text-sm text-slate-600 font-mono">
              Fast2SMS / Twilio Gateway: Dispatch SMS Sent to PCR Patrol Van & Control Room.
            </p>
            <button
              onClick={() => {
                setIsSosModalOpen(false);
                setIsSuccess(false);
              }}
              className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition"
            >
              Close Dialog
            </button>
          </div>
        ) : (
          <form onSubmit={handleTriggerSos} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Target Bus / Vehicle Number</label>
              <select
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-danger-500 focus:ring-2 focus:ring-danger-100 outline-none text-slate-900 bg-white font-mono"
              >
                {allBuses.map((b) => (
                  <option key={b.vehicleNumber} value={b.vehicleNumber}>
                    {b.vehicleNumber} ({b.agency} - {b.routeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Passenger Contact Phone Number</label>
              <input
                type="text"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-danger-500 focus:ring-2 focus:ring-danger-100 outline-none text-slate-900 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Emergency Category</label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-danger-500 focus:ring-2 focus:ring-danger-100 outline-none text-slate-900 bg-white"
              >
                <option value="MEDICAL_ACCIDENT">Medical Emergency / Injury</option>
                <option value="WOMEN_SAFETY">Women / Passenger Safety SOS</option>
                <option value="VEHICLE_BREAKDOWN">Bus Breakdown / Fire Hazard</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Emergency Details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-sm border border-slate-300 focus:border-danger-500 focus:ring-2 focus:ring-danger-100 outline-none text-slate-900 bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-danger-600 hover:bg-danger-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>{loading ? 'DISPATCHING SOS SIGNAL...' : t.triggerSosButton}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
