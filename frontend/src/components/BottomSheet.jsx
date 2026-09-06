import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import NearestStopsCarousel from './NearestStopsCarousel';
import LiveArrivalTimeline from './LiveArrivalTimeline';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

export default function BottomSheet() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed z-30 bg-white border-t md:border border-slate-200 shadow-2xl transition-all duration-300 ${
        isExpanded
          ? 'bottom-0 left-0 right-0 h-[88vh] rounded-t-3xl md:left-72 md:bottom-6 md:right-auto md:w-[420px] md:h-[82vh] md:rounded-2xl'
          : 'bottom-16 left-0 right-0 h-[300px] rounded-t-2xl md:left-72 md:bottom-6 md:right-auto md:w-[420px] md:h-[460px] md:rounded-2xl'
      }`}
    >
      {/* Drag handle / snap toggle bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 flex flex-col items-center justify-center cursor-pointer group border-b border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-400 transition-colors mb-1"></div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>{isExpanded ? 'Collapse Drawer' : 'Expand Transit Panel'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Sheet Content Container */}
      <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-52px)]">
        {/* Search Bar */}
        <SearchBar />

        {/* Nearest Bus Stops Carousel */}
        <NearestStopsCarousel />

        {/* Live Arrival Countdown Timeline */}
        <LiveArrivalTimeline />
      </div>
    </motion.div>
  );
}
