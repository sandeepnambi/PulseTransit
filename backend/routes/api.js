const express = require('express');
const router = express.Router();
const { getHaversineDistance, estimateWalkingMinutes, estimateETAMinutes } = require('../services/etaCalculator');
const { sendEmergencySMS } = require('../services/smsService');

module.exports = (busStore, routeStore, stopStore, driverStore, telemetryStore, io) => {

  // 1. GET /api/stops - Get all stops with optional agency or city filter
  router.get('/stops', (req, res) => {
    const { agency, city, search } = req.query;
    let results = [...stopStore];

    if (agency && agency !== 'ALL') {
      results = results.filter(s => s.agency.toUpperCase() === agency.toUpperCase());
    }
    if (city) {
      results = results.filter(s => s.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.ta.includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: results.length, data: results });
  });

  // 2. GET /api/stops/nearby - Find stops near given coordinates
  router.get('/stops/nearby', (req, res) => {
    const lat = parseFloat(req.query.lat) || 13.0827; // Default Chennai Central
    const lng = parseFloat(req.query.lng) || 80.2707;
    const radiusKm = parseFloat(req.query.radiusKm) || 10;

    const nearby = stopStore
      .map(stop => {
        const distKm = getHaversineDistance(lat, lng, stop.location.coordinates[1], stop.location.coordinates[0]);
        return {
          ...stop,
          distanceKm: parseFloat(distKm.toFixed(2)),
          walkingMins: estimateWalkingMinutes(distKm)
        };
      })
      .filter(s => s.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ success: true, count: nearby.length, data: nearby });
  });

  // 3. GET /api/routes - List all routes
  router.get('/routes', (req, res) => {
    const { agency, search } = req.query;
    let results = [...routeStore];

    if (agency && agency !== 'ALL') {
      results = results.filter(r => r.agency.toUpperCase() === agency.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(r =>
        r.code.toLowerCase().includes(q) ||
        r.name.en.toLowerCase().includes(q) ||
        r.name.ta.includes(q) ||
        r.origin.en.toLowerCase().includes(q) ||
        r.destination.en.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: results.length, data: results });
  });

  // 4. GET /api/routes/:code/eta - Get live arrival timeline for a specific route or stop
  router.get('/routes/:code/eta', (req, res) => {
    const routeCode = req.params.code;
    const route = routeStore.find(r => r.code === routeCode);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const activeBuses = busStore.filter(b => b.routeCode === routeCode);
    const routeStops = stopStore.filter(s => route.stopCodes.includes(s.code));

    const timeline = routeStops.map(stop => {
      const busesApproaching = activeBuses.map(bus => {
        const dist = getHaversineDistance(
          bus.currentLocation.coordinates[1],
          bus.currentLocation.coordinates[0],
          stop.location.coordinates[1],
          stop.location.coordinates[0]
        );
        const etaMins = estimateETAMinutes(dist, bus.speed);
        return {
          vehicleNumber: bus.vehicleNumber,
          agency: bus.agency,
          speed: bus.speed,
          occupancy: bus.occupancy,
          status: bus.status,
          driverName: bus.driverName,
          distanceKm: parseFloat(dist.toFixed(2)),
          etaMins
        };
      }).sort((a, b) => a.etaMins - b.etaMins);

      return {
        stop,
        approachingBuses: busesApproaching
      };
    });

    res.json({ success: true, route, timeline });
  });

  // 5. GET /api/buses - Active buses with live telemetry
  router.get('/buses', (req, res) => {
    const { agency, routeCode } = req.query;
    let results = [...busStore];

    if (agency && agency !== 'ALL') {
      results = results.filter(b => b.agency.toUpperCase() === agency.toUpperCase());
    }
    if (routeCode) {
      results = results.filter(b => b.routeCode === routeCode);
    }

    res.json({ success: true, count: results.length, data: results });
  });

  // 6. POST /api/telemetry/gps - Hardware ingestion endpoint for ESP32 / SIM800L devices
  router.post('/telemetry/gps', (req, res) => {
    const { deviceId, vehicleNumber, lat, lng, speed, heading, batteryVoltage } = req.body;

    if (!vehicleNumber || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GPS payload. Missing vehicleNumber, lat, or lng.'
      });
    }

    const bus = busStore.find(b => b.vehicleNumber.replace(/-/g, '').toLowerCase() === vehicleNumber.replace(/-/g, '').toLowerCase() || b.vehicleNumber === vehicleNumber);

    if (bus) {
      bus.currentLocation = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
      if (speed !== undefined) bus.speed = parseFloat(speed);
      if (heading !== undefined) bus.heading = parseFloat(heading);
      bus.lastUpdated = new Date();

      // Emit hardware update over WebSockets
      io.emit('bus_location_update', {
        vehicleNumber: bus.vehicleNumber,
        routeCode: bus.routeCode,
        agency: bus.agency,
        location: [parseFloat(lng), parseFloat(lat)],
        heading: bus.heading,
        speed: bus.speed,
        status: bus.status,
        occupancy: bus.occupancy,
        isHardwareTelemetry: true,
        lastUpdated: bus.lastUpdated
      });
    }

    // Log telemetry packet
    const logEntry = {
      deviceId: deviceId || `ESP32-${vehicleNumber}`,
      vehicleNumber,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      speed: speed || 0,
      heading: heading || 0,
      batteryVoltage: batteryVoltage || 12.4,
      timestamp: new Date()
    };
    telemetryStore.push(logEntry);

    res.json({
      success: true,
      message: 'Hardware telemetry packet processed successfully',
      packet: logEntry,
      busUpdated: !!bus
    });
  });

  // 7. POST /api/trip-planner - Multi-Modal Transit Trip Planner across Tamil Nadu
  router.post('/trip-planner', (req, res) => {
    const { originCode, destinationCode, originName, destinationName } = req.body;

    // Find origin & destination stops
    const originStop = stopStore.find(s => s.code === originCode || s.name.en.toLowerCase().includes((originName || '').toLowerCase()));
    const destStop = stopStore.find(s => s.code === destinationCode || s.name.en.toLowerCase().includes((destinationName || '').toLowerCase()));

    if (!originStop || !destStop) {
      return res.status(404).json({
        success: false,
        message: 'Origin or Destination stop not found in Tamil Nadu transit database.'
      });
    }

    // Direct matching routes
    const directRoutes = routeStore.filter(r =>
      r.stopCodes.includes(originStop.code) && r.stopCodes.includes(destStop.code)
    );

    const tripOptions = [];

    if (directRoutes.length > 0) {
      directRoutes.forEach(route => {
        const distKm = getHaversineDistance(
          originStop.location.coordinates[1], originStop.location.coordinates[0],
          destStop.location.coordinates[1], destStop.location.coordinates[0]
        );
        const durationMins = estimateETAMinutes(distKm, 32);

        tripOptions.push({
          id: `TRIP-DIRECT-${route.code}`,
          type: 'DIRECT',
          agency: route.agency,
          routeCode: route.code,
          routeName: route.name,
          color: route.color,
          originStop,
          destStop,
          fareInINR: route.fareInINR,
          totalDistanceKm: parseFloat(distKm.toFixed(1)),
          estimatedDurationMins: durationMins,
          transfers: 0,
          steps: [
            {
              mode: 'BUS',
              routeCode: route.code,
              routeName: route.name.en,
              from: originStop.name.en,
              to: destStop.name.en,
              durationMins,
              color: route.color
            }
          ]
        });
      });
    }

    // Fallback connecting / transfer options if no direct route or to provide alternatives
    routeStore.forEach(route1 => {
      if (route1.stopCodes.includes(originStop.code)) {
        routeStore.forEach(route2 => {
          if (route1.code !== route2.code && route2.stopCodes.includes(destStop.code)) {
            // Find transfer stop common to both
            const transferCode = route1.stopCodes.find(c => route2.stopCodes.includes(c));
            if (transferCode && transferCode !== originStop.code && transferCode !== destStop.code) {
              const transferStop = stopStore.find(s => s.code === transferCode);
              if (transferStop) {
                const dist1 = getHaversineDistance(originStop.location.coordinates[1], originStop.location.coordinates[0], transferStop.location.coordinates[1], transferStop.location.coordinates[0]);
                const dist2 = getHaversineDistance(transferStop.location.coordinates[1], transferStop.location.coordinates[0], destStop.location.coordinates[1], destStop.location.coordinates[0]);
                const totalDist = dist1 + dist2;
                const totalMins = estimateETAMinutes(totalDist, 30) + 8; // +8 mins layover

                tripOptions.push({
                  id: `TRIP-XFER-${route1.code}-${route2.code}`,
                  type: 'TRANSFER',
                  agency: `${route1.agency} + ${route2.agency}`,
                  routeCode: `${route1.code} → ${route2.code}`,
                  routeName: { en: `Transfer via ${transferStop.name.en}`, ta: `${transferStop.name.ta} வழியாக மாற்றம்` },
                  color: '#6366F1',
                  originStop,
                  destStop,
                  transferStop,
                  fareInINR: route1.fareInINR + route2.fareInINR,
                  totalDistanceKm: parseFloat(totalDist.toFixed(1)),
                  estimatedDurationMins: totalMins,
                  transfers: 1,
                  steps: [
                    {
                      mode: 'BUS',
                      routeCode: route1.code,
                      routeName: route1.name.en,
                      from: originStop.name.en,
                      to: transferStop.name.en,
                      durationMins: estimateETAMinutes(dist1, 30),
                      color: route1.color
                    },
                    {
                      mode: 'TRANSFER_WALK',
                      transferStopName: transferStop.name.en,
                      durationMins: 5
                    },
                    {
                      mode: 'BUS',
                      routeCode: route2.code,
                      routeName: route2.name.en,
                      from: transferStop.name.en,
                      to: destStop.name.en,
                      durationMins: estimateETAMinutes(dist2, 30),
                      color: route2.color
                    }
                  ]
                });
              }
            }
          }
        });
      }
    });

    res.json({
      success: true,
      origin: originStop,
      destination: destStop,
      optionsCount: tripOptions.length,
      options: tripOptions.slice(0, 5) // Top 5 choices
    });
  });

  // 8. GET /api/drivers - Drivers list
  router.get('/drivers', (req, res) => {
    res.json({ success: true, count: driverStore.length, data: driverStore });
  });

  // 9. POST /api/sos/trigger - Emergency SOS dispatch
  router.post('/sos/trigger', async (req, res) => {
    const { vehicleNumber, passengerPhone, location, emergencyType, details } = req.body;

    const alertLog = {
      id: `SOS-${Date.now()}`,
      vehicleNumber: vehicleNumber || 'GENERAL-PASSENGER-SOS',
      passengerPhone: passengerPhone || '+91 98765 43210',
      location: location || [80.2707, 13.0827],
      emergencyType: emergencyType || 'MEDICAL_ACCIDENT',
      details: details || 'Emergency alert triggered by passenger.',
      timestamp: new Date().toISOString(),
      status: 'DISPATCHED_TO_CONTROL_ROOM'
    };

    // Broadcast emergency SOS alert over socket to all connected clients & admin dashboards
    io.emit('emergency_sos_alert', alertLog);

    // Send Live SMS via Twilio (or simulated fallback)
    const smsResult = await sendEmergencySMS({
      toPhone: alertLog.passengerPhone,
      vehicleNumber: alertLog.vehicleNumber,
      emergencyType: alertLog.emergencyType,
      details: alertLog.details,
      location: alertLog.location
    });

    res.json({
      success: true,
      message: 'Emergency SOS alert received and dispatched to Tamil Nadu Transport Control Room & local emergency services.',
      alert: alertLog,
      smsDispatched: smsResult.success,
      smsDetails: smsResult
    });
  });

  return router;
};
