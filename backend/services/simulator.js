const { calculateHeading, estimateETAMinutes, getHaversineDistance } = require('./etaCalculator');

class BusSimulator {
  constructor(io, busStore, routeStore, stopStore) {
    this.io = io;
    this.buses = busStore;
    this.routes = routeStore;
    this.stops = stopStore;
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    console.log('[Simulator] Starting real-time bus telemetry simulation loop...');
    this.timer = setInterval(() => this.step(), 2500);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  step() {
    this.buses.forEach((bus) => {
      const route = this.routes.find((r) => r.code === bus.routeCode);
      if (!route || !route.path || route.path.length < 2) return;

      let { pathIndex = 0, direction = 1 } = bus;
      let currentCoord = route.path[pathIndex];
      let nextIndex = pathIndex + direction;

      // Handle terminal bounces or loops
      if (nextIndex >= route.path.length) {
        direction = -1;
        nextIndex = route.path.length - 2;
      } else if (nextIndex < 0) {
        direction = 1;
        nextIndex = 1;
      }

      let targetCoord = route.path[nextIndex];

      // Interpolate 10% step towards target coordinate for ultra-smooth movement
      const stepFactor = 0.12;
      const newLng = currentCoord[0] + (targetCoord[0] - currentCoord[0]) * stepFactor;
      const newLat = currentCoord[1] + (targetCoord[1] - currentCoord[1]) * stepFactor;

      // Calculate speed and heading
      const distKm = getHaversineDistance(currentCoord[1], currentCoord[0], newLat, newLng);
      const heading = Math.round(calculateHeading(currentCoord[1], currentCoord[0], targetCoord[1], targetCoord[0]));

      // Update bus state
      bus.currentLocation = { type: 'Point', coordinates: [newLng, newLat] };
      bus.heading = heading;
      bus.speed = Math.min(Math.round(25 + Math.random() * 25), 65); // 25 - 65 km/h
      bus.direction = direction;
      bus.lastUpdated = new Date();

      // Check if close to target point to advance index
      const remainingDistToNode = getHaversineDistance(newLat, newLng, targetCoord[1], targetCoord[0]);
      if (remainingDistToNode < 0.05) {
        bus.pathIndex = nextIndex;
      }

      // Calculate ETA to nearest upcoming stop
      if (route.stopCodes && route.stopCodes.length > 0) {
        const routeStops = this.stops.filter((s) => route.stopCodes.includes(s.code));
        let closestStop = null;
        let minStopDist = Infinity;

        routeStops.forEach((stop) => {
          const d = getHaversineDistance(
            newLat,
            newLng,
            stop.location.coordinates[1],
            stop.location.coordinates[0]
          );
          if (d < minStopDist) {
            minStopDist = d;
            closestStop = stop;
          }
        });

        if (closestStop) {
          bus.nextStopCode = closestStop.code;
          bus.etaNextStopMins = estimateETAMinutes(minStopDist, bus.speed);
        }
      }

      // Broadcast real-time location update event over WebSockets
      this.io.emit('bus_location_update', {
        vehicleNumber: bus.vehicleNumber,
        routeCode: bus.routeCode,
        agency: bus.agency,
        location: [newLng, newLat],
        heading: bus.heading,
        speed: bus.speed,
        status: bus.status,
        delayMinutes: bus.delayMinutes,
        occupancy: bus.occupancy,
        nextStopCode: bus.nextStopCode,
        etaNextStopMins: bus.etaNextStopMins,
        lastUpdated: bus.lastUpdated
      });
    });
  }
}

module.exports = BusSimulator;
