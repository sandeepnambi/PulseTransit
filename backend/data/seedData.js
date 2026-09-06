/**
 * Seed Data for Tamil Nadu Transit Systems: MTC Chennai, TNSTC, SETC
 */

const STOPS = [
  // MTC 102K Stops (OMR Route)
  {
    code: 'STP-BDW',
    name: { en: 'Broadway Bus Terminus', ta: 'பிராட்வே பேருந்து நிலையம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2825, 13.0882] },
    amenities: ['Shelter', 'Digital Display', 'Wheelchair Ramp', 'Ticket Counter'],
    isTerminal: true
  },
  {
    code: 'STP-GND',
    name: { en: 'Guindy Railway Station', ta: 'கிண்டி இரயில் நிலையம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2070, 13.0067] },
    amenities: ['Shelter', 'Digital Display', 'Metro Connectivity'],
    isTerminal: false
  },
  {
    code: 'STP-SRP',
    name: { en: 'Taramani / SRP Tools', ta: 'தரமணி / எஸ்.ஆர்.பி டூல்ஸ்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2450, 12.9811] },
    amenities: ['Shelter', 'Digital Display'],
    isTerminal: false
  },
  {
    code: 'STP-KND',
    name: { en: 'Kandanchavadi IT Hub', ta: 'கந்தன்சாவடி ஐடி மையம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2475, 12.9640] },
    amenities: ['Shelter', 'Digital Display'],
    isTerminal: false
  },
  {
    code: 'STP-SLN',
    name: { en: 'Sholinganallur Junction', ta: 'சோழிங்கநல்லூர் சந்திப்பு' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2285, 12.9010] },
    amenities: ['Shelter', 'Digital Display', 'CCTV Security'],
    isTerminal: false
  },
  {
    code: 'STP-NAV',
    name: { en: 'Navalur Toll Plaza', ta: 'நாவலூர் சுங்கச்சாவடி' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2240, 12.8465] },
    amenities: ['Shelter'],
    isTerminal: false
  },
  {
    code: 'STP-SIP',
    name: { en: 'Siruseri SIPCOT IT Park', ta: 'சிறுசேரி சிப்காட் தகவல் தொழில் நுட்ப பூங்கா' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2210, 12.8280] },
    amenities: ['Shelter', 'Digital Display'],
    isTerminal: false
  },
  {
    code: 'STP-KLM',
    name: { en: 'Kelambakkam Bus Terminus', ta: 'கேளம்பாக்கம் பேருந்து நிலையம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2185, 12.7852] },
    amenities: ['Shelter', 'Digital Display', 'Restroom', 'Auto Stand'],
    isTerminal: true
  },

  // MTC 21G Stops (Tambaram - Broadway)
  {
    code: 'STP-TBM',
    name: { en: 'Tambaram Sanatorium BS', ta: 'தாம்பரம் சானடோரியம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.1250, 12.9275] },
    amenities: ['Shelter', 'Digital Display'],
    isTerminal: true
  },
  {
    code: 'STP-CMP',
    name: { en: 'Chromepet MIT Bus Stop', ta: 'குரோம்பேட்டை எம்.ஐ.டி' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.1412, 12.9520] },
    amenities: ['Shelter'],
    isTerminal: false
  },
  {
    code: 'STP-MYL',
    name: { en: 'Mylapore Tank', ta: 'மயிலாப்பூர் குளம்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2678, 13.0335] },
    amenities: ['Shelter', 'Temple Gate Access'],
    isTerminal: false
  },

  // MTC 29C Stops (Perambur - Besant Nagar)
  {
    code: 'STP-PRB',
    name: { en: 'Perambur Bus Depot', ta: 'பெரம்பூர் பேருந்து பணிமனை' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2330, 13.1090] },
    amenities: ['Shelter', 'Depot Workshop'],
    isTerminal: true
  },
  {
    code: 'STP-EGM',
    name: { en: 'Egmore North Railway Gate', ta: 'எழும்பூர் இரயில் நிலைய வடக்கு வாசல்' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2610, 13.0780] },
    amenities: ['Shelter', 'Train Integration'],
    isTerminal: false
  },
  {
    code: 'STP-BES',
    name: { en: 'Besant Nagar Elliot Beach', ta: 'பெசண்ட் நகர் எலியட்ஸ் கடற்கரை' },
    agency: 'MTC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.2700, 13.0002] },
    amenities: ['Shelter', 'Tourist Help Desk'],
    isTerminal: true
  },

  // TNSTC & SETC Long Distance Stops
  {
    code: 'STP-CMBT',
    name: { en: 'Chennai Koyambedu CMBT', ta: 'சென்னை கோயம்பேடு பேருந்து நிலைய முனையம்' },
    agency: 'SETC',
    city: 'Chennai',
    location: { type: 'Point', coordinates: [80.1915, 13.0694] },
    amenities: ['Food Court', 'Luggage Storage', 'AC Waiting Lounge', 'ATMs'],
    isTerminal: true
  },
  {
    code: 'STP-PDY',
    name: { en: 'Puducherry New Bus Stand', ta: 'புதுச்சேரி புதிய பேருந்து நிலையம்' },
    agency: 'TNSTC',
    city: 'Puducherry',
    location: { type: 'Point', coordinates: [79.8140, 11.9360] },
    amenities: ['Shelter', 'Tourism Information Center'],
    isTerminal: true
  },
  {
    code: 'STP-MDU',
    name: { en: 'Madurai Mattuthavani BS', ta: 'மதுரை மாட்டுத்தாவணி ஒருங்கிணைந்த பேருந்து நிலையம்' },
    agency: 'TNSTC',
    city: 'Madurai',
    location: { type: 'Point', coordinates: [78.1560, 9.9470] },
    amenities: ['24/7 Food Plaza', 'VIP Lounge', 'Medical Kiosk'],
    isTerminal: true
  },
  {
    code: 'STP-CBE',
    name: { en: 'Coimbatore Gandhipuram Central BS', ta: 'கோவை காந்திபுரம் மத்திய பேருந்து நிலையம்' },
    agency: 'TNSTC',
    city: 'Coimbatore',
    location: { type: 'Point', coordinates: [76.9630, 11.0180] },
    amenities: ['Shelter', 'Restrooms', 'Prepaid Taxi'],
    isTerminal: true
  },
  {
    code: 'STP-SLM',
    name: { en: 'Salem New Bus Stand', ta: 'சேலம் புதிய பேருந்து நிலையம்' },
    agency: 'TNSTC',
    city: 'Salem',
    location: { type: 'Point', coordinates: [78.1360, 11.6640] },
    amenities: ['Shelter', 'Digital Display'],
    isTerminal: true
  },
  {
    code: 'STP-TPJ',
    name: { en: 'Tiruchirappalli Central BS', ta: 'திருச்சிராப்பள்ளி மத்திய பேருந்து நிலையம்' },
    agency: 'SETC',
    city: 'Tiruchirappalli',
    location: { type: 'Point', coordinates: [78.6860, 10.8050] },
    amenities: ['Shelter', 'Digital Schedule'],
    isTerminal: true
  },
  {
    code: 'STP-KKI',
    name: { en: 'Kanyakumari Express Terminus', ta: 'கன்னியாகுமரி விரைவு பேருந்து நிலையம்' },
    agency: 'SETC',
    city: 'Kanyakumari',
    location: { type: 'Point', coordinates: [77.5530, 8.0880] },
    amenities: ['Coastal View Lounge', 'Tourist Desk'],
    isTerminal: true
  }
];

const ROUTES = [
  {
    code: '102K',
    name: { en: 'Broadway ↔ Kelambakkam (OMR IT Corridor)', ta: 'பிராட்வே ↔ கேளம்பாக்கம் (ஐடி பாதை)' },
    agency: 'MTC',
    origin: { en: 'Broadway Terminus', ta: 'பிராட்வே முனையம்' },
    destination: { en: 'Kelambakkam Terminus', ta: 'கேளம்பாக்கம் முனையம்' },
    totalDistanceKm: 34.5,
    avgDurationMins: 75,
    fareInINR: 32,
    color: '#06B6D4',
    stopCodes: ['STP-BDW', 'STP-GND', 'STP-SRP', 'STP-KND', 'STP-SLN', 'STP-NAV', 'STP-SIP', 'STP-KLM'],
    frequencyMins: 10,
    path: [
      [80.2825, 13.0882],
      [80.2720, 13.0600],
      [80.2480, 13.0300],
      [80.2070, 13.0067],
      [80.2220, 12.9900],
      [80.2450, 12.9811],
      [80.2475, 12.9640],
      [80.2380, 12.9300],
      [80.2285, 12.9010],
      [80.2250, 12.8700],
      [80.2240, 12.8465],
      [80.2210, 12.8280],
      [80.2185, 12.7852]
    ]
  },
  {
    code: '21G',
    name: { en: 'Tambaram ↔ Broadway Express', ta: 'தாம்பரம் ↔ பிராட்வே எக்ஸ்பிரஸ்' },
    agency: 'MTC',
    origin: { en: 'Tambaram Sanatorium', ta: 'தாம்பரம் சானடோரியம்' },
    destination: { en: 'Broadway Terminus', ta: 'பிராட்வே முனையம்' },
    totalDistanceKm: 28.0,
    avgDurationMins: 60,
    fareInINR: 26,
    color: '#6366F1',
    stopCodes: ['STP-TBM', 'STP-CMP', 'STP-GND', 'STP-MYL', 'STP-BDW'],
    frequencyMins: 8,
    path: [
      [80.1250, 12.9275],
      [80.1412, 12.9520],
      [80.1700, 12.9800],
      [80.2070, 13.0067],
      [80.2400, 13.0200],
      [80.2678, 13.0335],
      [80.2750, 13.0600],
      [80.2825, 13.0882]
    ]
  },
  {
    code: '29C',
    name: { en: 'Perambur ↔ Besant Nagar Beach', ta: 'பெரம்பூர் ↔ பெசண்ட் நகர் கடற்கரை' },
    agency: 'MTC',
    origin: { en: 'Perambur Depot', ta: 'பெரம்பூர் பணிமனை' },
    destination: { en: 'Besant Nagar', ta: 'பெசண்ட் நகர்' },
    totalDistanceKm: 18.2,
    avgDurationMins: 50,
    fareInINR: 20,
    color: '#10B981',
    stopCodes: ['STP-PRB', 'STP-EGM', 'STP-GND', 'STP-BES'],
    frequencyMins: 12,
    path: [
      [80.2330, 13.1090],
      [80.2500, 13.0900],
      [80.2610, 13.0780],
      [80.2550, 13.0400],
      [80.2400, 13.0150],
      [80.2700, 13.0002]
    ]
  },
  {
    code: '453-EXP',
    name: { en: 'Chennai ↔ Puducherry ↔ Madurai Express', ta: 'சென்னை ↔ புதுச்சேரி ↔ மதுரை எக்ஸ்பிரஸ்' },
    agency: 'TNSTC',
    origin: { en: 'Chennai CMBT', ta: 'சென்னை கோயம்பேடு' },
    destination: { en: 'Madurai Mattuthavani', ta: 'மதுரை மாட்டுத்தாவணி' },
    totalDistanceKm: 450.0,
    avgDurationMins: 480,
    fareInINR: 420,
    color: '#F59E0B',
    stopCodes: ['STP-CMBT', 'STP-PDY', 'STP-TPJ', 'STP-MDU'],
    frequencyMins: 30,
    path: [
      [80.1915, 13.0694],
      [79.9500, 12.6800],
      [79.8140, 11.9360],
      [79.4800, 11.3500],
      [78.6860, 10.8050],
      [78.4000, 10.2000],
      [78.1560, 9.9470]
    ]
  },
  {
    code: 'TN-701',
    name: { en: 'Salem ↔ Erode ↔ Coimbatore Link', ta: 'சேலம் ↔ ஈரோடு ↔ கோவை இணைப்பு' },
    agency: 'TNSTC',
    origin: { en: 'Salem New BS', ta: 'சேலம் புதிய பே.நி' },
    destination: { en: 'Coimbatore Gandhipuram', ta: 'கோவை காந்திபுரம்' },
    totalDistanceKm: 165.0,
    avgDurationMins: 210,
    fareInINR: 175,
    color: '#EC4899',
    stopCodes: ['STP-SLM', 'STP-CBE'],
    frequencyMins: 20,
    path: [
      [78.1360, 11.6640],
      [77.7200, 11.3400],
      [77.2600, 11.1100],
      [76.9630, 11.0180]
    ]
  },
  {
    code: 'SETC-184',
    name: { en: 'Chennai ↔ Kanyakumari Ultra Deluxe AC Sleeper', ta: 'சென்னை ↔ கன்னியாகுமரி ஏசி ஸ்லீப்பர்' },
    agency: 'SETC',
    origin: { en: 'Chennai CMBT', ta: 'சென்னை கோயம்பேடு' },
    destination: { en: 'Kanyakumari Terminus', ta: 'கன்னியாகுமரி முனையம்' },
    totalDistanceKm: 705.0,
    avgDurationMins: 720,
    fareInINR: 890,
    color: '#8B5CF6',
    stopCodes: ['STP-CMBT', 'STP-TPJ', 'STP-MDU', 'STP-KKI'],
    frequencyMins: 60,
    path: [
      [80.1915, 13.0694],
      [78.6860, 10.8050],
      [78.1560, 9.9470],
      [77.7000, 8.7300],
      [77.5530, 8.0880]
    ]
  }
];

const BUSES = [
  {
    vehicleNumber: 'TN-01-N-9821',
    agency: 'MTC',
    routeCode: '102K',
    currentLocation: { type: 'Point', coordinates: [80.2475, 12.9640] },
    heading: 185,
    speed: 42,
    status: 'ON_TIME',
    delayMinutes: 0,
    occupancy: 'MODERATE',
    acType: 'DELUXE_AC',
    driverName: 'Thiru. K. Senthil Nathan',
    driverPhone: '+91 94441 87210',
    nextStopCode: 'STP-SLN',
    etaNextStopMins: 4,
    pathIndex: 6,
    direction: 1
  },
  {
    vehicleNumber: 'TN-01-N-4512',
    agency: 'MTC',
    routeCode: '102K',
    currentLocation: { type: 'Point', coordinates: [80.2825, 13.0882] },
    heading: 190,
    speed: 30,
    status: 'ON_TIME',
    delayMinutes: 1,
    occupancy: 'LOW',
    acType: 'NON_AC',
    driverName: 'Thiru. M. Arumugam',
    driverPhone: '+91 98402 11982',
    nextStopCode: 'STP-GND',
    etaNextStopMins: 6,
    pathIndex: 0,
    direction: 1
  },
  {
    vehicleNumber: 'TN-01-N-3304',
    agency: 'MTC',
    routeCode: '21G',
    currentLocation: { type: 'Point', coordinates: [80.1700, 12.9800] },
    heading: 45,
    speed: 48,
    status: 'ON_TIME',
    delayMinutes: 0,
    occupancy: 'HIGH',
    acType: 'NON_AC',
    driverName: 'Thiru. V. Pandian',
    driverPhone: '+91 97908 33211',
    nextStopCode: 'STP-GND',
    etaNextStopMins: 3,
    pathIndex: 2,
    direction: 1
  },
  {
    vehicleNumber: 'TN-01-N-8819',
    agency: 'MTC',
    routeCode: '29C',
    currentLocation: { type: 'Point', coordinates: [80.2610, 13.0780] },
    heading: 170,
    speed: 25,
    status: 'DELAYED',
    delayMinutes: 7,
    occupancy: 'FULL',
    acType: 'NON_AC',
    driverName: 'Thiru. S. Ramanathan',
    driverPhone: '+91 99403 76210',
    nextStopCode: 'STP-BES',
    etaNextStopMins: 12,
    pathIndex: 2,
    direction: 1
  },
  {
    vehicleNumber: 'TN-58-N-2290',
    agency: 'TNSTC',
    routeCode: '453-EXP',
    currentLocation: { type: 'Point', coordinates: [79.8140, 11.9360] },
    heading: 200,
    speed: 65,
    status: 'ON_TIME',
    delayMinutes: 0,
    occupancy: 'MODERATE',
    acType: 'ULTRA_DELUXE',
    driverName: 'Thiru. P. Velusamy',
    driverPhone: '+91 94432 90182',
    nextStopCode: 'STP-TPJ',
    etaNextStopMins: 85,
    pathIndex: 2,
    direction: 1
  },
  {
    vehicleNumber: 'TN-38-N-1102',
    agency: 'TNSTC',
    routeCode: 'TN-701',
    currentLocation: { type: 'Point', coordinates: [77.7200, 11.3400] },
    heading: 240,
    speed: 58,
    status: 'ON_TIME',
    delayMinutes: 2,
    occupancy: 'LOW',
    acType: 'ULTRA_DELUXE',
    driverName: 'Thiru. A. Palanisamy',
    driverPhone: '+91 98421 66540',
    nextStopCode: 'STP-CBE',
    etaNextStopMins: 45,
    pathIndex: 1,
    direction: 1
  },
  {
    vehicleNumber: 'TN-01-AN-9900',
    agency: 'SETC',
    routeCode: 'SETC-184',
    currentLocation: { type: 'Point', coordinates: [78.6860, 10.8050] },
    heading: 195,
    speed: 72,
    status: 'ON_TIME',
    delayMinutes: 0,
    occupancy: 'MODERATE',
    acType: 'SLEEPER_AC',
    driverName: 'Thiru. G. Elangovan',
    driverPhone: '+91 94440 12890',
    nextStopCode: 'STP-MDU',
    etaNextStopMins: 90,
    pathIndex: 1,
    direction: 1
  }
];

const DRIVERS = [
  { driverId: 'DRV-101', name: 'Thiru. K. Senthil Nathan', phone: '+91 94441 87210', licenseNumber: 'TN01201500982', agency: 'MTC', rating: 4.9, assignedVehicle: 'TN-01-N-9821' },
  { driverId: 'DRV-102', name: 'Thiru. M. Arumugam', phone: '+91 98402 11982', licenseNumber: 'TN01201200451', agency: 'MTC', rating: 4.7, assignedVehicle: 'TN-01-N-4512' },
  { driverId: 'DRV-103', name: 'Thiru. V. Pandian', phone: '+91 97908 33211', licenseNumber: 'TN01201800330', agency: 'MTC', rating: 4.8, assignedVehicle: 'TN-01-N-3304' },
  { driverId: 'DRV-104', name: 'Thiru. S. Ramanathan', phone: '+91 99403 76210', licenseNumber: 'TN01201000881', agency: 'MTC', rating: 4.5, assignedVehicle: 'TN-01-N-8819' },
  { driverId: 'DRV-201', name: 'Thiru. P. Velusamy', phone: '+91 94432 90182', licenseNumber: 'TN58201400229', agency: 'TNSTC', rating: 4.9, assignedVehicle: 'TN-58-N-2290' },
  { driverId: 'DRV-202', name: 'Thiru. A. Palanisamy', phone: '+91 98421 66540', licenseNumber: 'TN38201600110', agency: 'TNSTC', rating: 4.8, assignedVehicle: 'TN-38-N-1102' },
  { driverId: 'DRV-301', name: 'Thiru. G. Elangovan', phone: '+91 94440 12890', licenseNumber: 'TN01201100990', agency: 'SETC', rating: 5.0, assignedVehicle: 'TN-01-AN-9900' }
];

module.exports = { STOPS, ROUTES, BUSES, DRIVERS };
