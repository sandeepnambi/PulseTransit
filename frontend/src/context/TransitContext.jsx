import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { translations } from '../i18n/translations';

const TransitContext = createContext();

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

export const TransitProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('live-map');
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedRouteCode, setSelectedRouteCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRouteCodes, setSavedRouteCodes] = useState(['102K', '21G']);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState([80.2475, 12.9640]); // Default OMR IT Corridor

  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pulsetransit_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const t = translations[lang] || translations.en;

  // Initialize Auth Check
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCurrentUser(data.user);
          } else {
            logoutUser();
          }
        })
        .catch(() => logoutUser());
    }
  }, [token]);

  // Login Handler
  const loginUser = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('pulsetransit_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Network error during login' };
    }
  };

  // Register Handler
  const registerUser = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('pulsetransit_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Network error during registration' };
    }
  };

  // Logout Handler
  const logoutUser = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('pulsetransit_token');
  };

  // Initialize Socket.io connection and listeners
  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      timeout: 10000
    });
    setSocket(socketIo);

    socketIo.on('connect', () => {
      console.log('[Socket.io Client] Connected to PulseTransit real-time backend');
    });

    socketIo.on('connect_error', () => {
      // Quietly allow Socket.io auto-retry without unhandled browser console error dumps
    });

    socketIo.on('initial_state', (data) => {
      if (data.buses) setBuses(data.buses);
      if (data.routes) setRoutes(data.routes);
      if (data.stops) setStops(data.stops);
    });

    // Real-time bus movement update
    socketIo.on('bus_location_update', (updatedBus) => {
      setBuses((prevBuses) => {
        const index = prevBuses.findIndex((b) => b.vehicleNumber === updatedBus.vehicleNumber);
        if (index !== -1) {
          const updated = [...prevBuses];
          updated[index] = {
            ...updated[index],
            ...updatedBus,
            currentLocation: { type: 'Point', coordinates: updatedBus.location }
          };
          return updated;
        } else {
          return [
            ...prevBuses,
            {
              ...updatedBus,
              currentLocation: { type: 'Point', coordinates: updatedBus.location }
            }
          ];
        }
      });
    });

    // Real-time SOS alert
    socketIo.on('emergency_sos_alert', (alert) => {
      setEmergencyAlerts((prev) => [alert, ...prev]);
    });

    // Fetch initial REST fallback data
    fetch('/api/routes')
      .then((res) => res.json())
      .then((data) => data.success && setRoutes(data.data))
      .catch((err) => console.log('REST routes fetch fallback:', err));

    fetch('/api/stops')
      .then((res) => res.json())
      .then((data) => data.success && setStops(data.data))
      .catch((err) => console.log('REST stops fetch fallback:', err));

    fetch('/api/buses')
      .then((res) => res.json())
      .then((data) => data.success && setBuses(data.data))
      .catch((err) => console.log('REST buses fetch fallback:', err));

    return () => {
      socketIo.off('connect');
      socketIo.off('connect_error');
      socketIo.off('initial_state');
      socketIo.off('bus_location_update');
      socketIo.off('emergency_sos_alert');
      socketIo.disconnect();
    };
  }, []);

  // Filter buses according to agency and selected route
  const filteredBuses = buses.filter((b) => {
    const matchesAgency = selectedAgency === 'ALL' || b.agency.toUpperCase() === selectedAgency.toUpperCase();
    const matchesRoute = !selectedRouteCode || b.routeCode === selectedRouteCode;
    return matchesAgency && matchesRoute;
  });

  // Filter routes according to agency
  const filteredRoutes = routes.filter((r) => {
    return selectedAgency === 'ALL' || r.agency.toUpperCase() === selectedAgency.toUpperCase();
  });

  // Bookmark toggle
  const toggleSaveRoute = (code) => {
    setSavedRouteCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <TransitContext.Provider
      value={{
        socket,
        buses: filteredBuses,
        allBuses: buses,
        routes: filteredRoutes,
        allRoutes: routes,
        stops,
        selectedAgency,
        setSelectedAgency,
        lang,
        setLang,
        t,
        activeTab,
        setActiveTab,
        selectedStop,
        setSelectedStop,
        selectedRouteCode,
        setSelectedRouteCode,
        searchQuery,
        setSearchQuery,
        savedRouteCodes,
        toggleSaveRoute,
        emergencyAlerts,
        isSosModalOpen,
        setIsSosModalOpen,
        userLocation,
        setUserLocation,
        currentUser,
        token,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => useContext(TransitContext);
