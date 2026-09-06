const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const { STOPS, ROUTES, BUSES, DRIVERS } = require('./data/seedData');
const BusSimulator = require('./services/simulator');
const createApiRouter = require('./routes/api');

const app = express();
const server = http.createServer(app);

// In-Memory Data Stores (Fallback & fast real-time state)
let stopStore = [...STOPS];
let routeStore = [...ROUTES];
let busStore = [...BUSES];
let driverStore = [...DRIVERS];
let telemetryStore = [];

// Enable CORS & JSON Parsing
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Setup Socket.io Server
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send initial snapshot of all active buses and routes upon connection
  socket.emit('initial_state', {
    buses: busStore,
    routes: routeStore,
    stops: stopStore
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Mount Auth & API Routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const apiRouter = createApiRouter(busStore, routeStore, stopStore, driverStore, telemetryStore, io);
app.use('/api', apiRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'PulseTransit Tamil Nadu Real-Time Logistics Engine',
    timestamp: new Date(),
    activeBuses: busStore.length,
    activeRoutes: routeStore.length,
    activeStops: stopStore.length
  });
});

// Start Real-Time Simulator
const simulator = new BusSimulator(io, busStore, routeStore, stopStore);

// Server Startup
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 PulseTransit Backend Server running on port ${PORT}`);
    console.log(`🚌 Transit Region: Tamil Nadu (MTC, TNSTC, SETC)`);
    console.log(`📡 WebSocket Real-Time Engine Active`);
    console.log(`=======================================================`);
    simulator.start();
  });
});
