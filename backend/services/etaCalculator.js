/**
 * Haversine Distance & ETA Calculation Engine for PulseTransit
 */

// Calculate spherical distance between 2 points in kilometers
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

// Calculate bearing/heading in degrees (0 to 360)
function calculateHeading(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// Estimate ETA in minutes given distance in km and speed in km/h
function estimateETAMinutes(distanceKm, speedKmh = 35) {
  const effectiveSpeed = Math.max(speedKmh, 10); // Minimum 10 km/h accounting for traffic
  const timeHours = distanceKm / effectiveSpeed;
  return Math.ceil(timeHours * 60);
}

// Calculate walking time in minutes (assumes 4.5 km/h walking speed)
function estimateWalkingMinutes(distanceKm) {
  const walkingSpeedKmh = 4.5;
  return Math.ceil((distanceKm / walkingSpeedKmh) * 60);
}

module.exports = {
  getHaversineDistance,
  calculateHeading,
  estimateETAMinutes,
  estimateWalkingMinutes
};
