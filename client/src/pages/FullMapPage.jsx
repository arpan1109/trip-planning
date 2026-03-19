// /**
//  * @file FullMapPage.jsx
//  * @description Smooth, non-jerky responsive layout with optimized Framer Motion transitions.
//  */
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Compass,
//   MapPin,
//   Info,
//   ChevronRight,
//   Menu,
//   X,
//   Navigation,
// } from "lucide-react";
// import DestinationMap from "../components/DestinationMap";
// import { getCityCoords } from "../api/tripApi";

// export default function FullMapPage({ trip }) {
//   const [coords, setCoords] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeLocation, setActiveLocation] = useState(null); // Tracks the clicked landmark

//   const landmarks = trip?.landmarks || [];

//   useEffect(() => {
//     const fetchCoords = async () => {
//       const result = await getCityCoords(trip.destinationCity);
//       setCoords(result);
//     };
//     fetchCoords();
//   }, [trip.destinationCity]);

//   return (
//     <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative flex flex-col lg:flex-row">
//       {/* MOBILE TOGGLE */}
//       <button
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         className="lg:hidden fixed top-24 right-6 z-[2000] bg-orange-500 text-black p-4 rounded-2xl shadow-2xl active:scale-90 transition-transform"
//       >
//         {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* MAP SECTION */}
//       <motion.main
//         layout
//         className="relative flex-1 h-full w-full overflow-hidden"
//       >
//         {/* Pass landmarks and activeLocation to the map component */}
//         <DestinationMap
//           coords={coords}
//           landmarks={landmarks}
//           activeLocation={activeLocation}
//           className="h-full w-full"
//         />

//         {/* HERO TYPOGRAPHY */}
// {/* HERO TYPOGRAPHY */}
//         <div className="absolute bottom-0 left-0 w-full pb-10 px-6 md:px-12 z-[1000] pointer-events-none bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
            
//             <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
//               {trip.destinationCity}<span className="text-orange-500">.</span>
//             </h1>
//           </motion.div>
//         </div>
//       </motion.main>

//       {/* SIDEBAR */}
//       <AnimatePresence mode="wait">
//         {(isSidebarOpen || window.innerWidth >= 1024) && (
//           <motion.aside
//             key="sidebar"
//             initial={{ x: "100%", opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: "100%", opacity: 0 }}
//             transition={{ type: "spring", damping: 30, stiffness: 300 }}
//             className="fixed inset-y-0 right-0 w-full sm:w-[400px] lg:relative lg:w-[420px] bg-[#0a0a0a]/95 lg:bg-[#0a0a0a] backdrop-blur-3xl border-l border-white/10 flex flex-col p-8 md:p-12 z-[1500]"
//           >
//             <header className="mb-10 pt-20 lg:pt-0">
//               <div className="flex items-center gap-3 mb-2">
//                 <Compass className="text-orange-500" size={20} />
//                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">
//                   Trip Intel
//                 </h3>
//               </div>
//               <p className="text-white/40 text-sm font-medium">
//                 Synchronizing data for{" "}
//                 <span className="text-white uppercase font-black">
//                   {trip.destinationCity}
//                 </span>
//                 .
//               </p>
//             </header>

//             <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
//               {landmarks.length === 0 ? (
//                 <div className="p-10 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-30">
//                   <Info size={24} className="mb-4 text-orange-500" />
//                   <span className="text-[10px] font-black uppercase tracking-widest">
//                     No Itinerary Detected
//                   </span>
//                 </div>
//               ) : (
//                 landmarks.map((place, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     onClick={() => setActiveLocation([place.lat, place.lng])}
//                     className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:border-orange-500/30 transition-all cursor-pointer hover:bg-white/10"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-sm font-black uppercase tracking-tight text-orange-400">
//                         {index + 1}. {place.name}
//                       </span>
//                       <Navigation
//                         size={14}
//                         className="text-white/30 group-hover:text-orange-500 transition-colors shrink-0"
//                       />
//                     </div>
//                     <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
//                       {place.desc}
//                     </p>
//                   </motion.div>
//                 ))
//               )}
//             </div>

//             <footer className="mt-10">
//               <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-500 transition-all active:scale-95 shadow-2xl">
//                 Download Map Data <ChevronRight size={16} />
//               </button>
//             </footer>
//           </motion.aside>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


/**
 * @file FullMapPage.jsx
 * @description Smooth responsive layout with an AI Location Sanitizer to prevent ocean drops.
 */
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, MapPin, Info, ChevronRight, Menu, X, Navigation } from "lucide-react";
import DestinationMap from "../components/DestinationMap";
import { getCityCoords } from "../api/tripApi";

// --- THE AI LOCATION SANITIZER ---
// Fixes Gemini's tendency to swap axes or put landmarks in the ocean
const sanitizeCoordinates = (cityCoords, placeLat, placeLng) => {
  let lat = parseFloat(placeLat);
  let lng = parseFloat(placeLng);
  const cityLat = parseFloat(cityCoords[0]);
  const cityLng = parseFloat(cityCoords[1]);

  // Fallback if AI gave text instead of numbers
  if (isNaN(lat)) lat = cityLat;
  if (isNaN(lng)) lng = cityLng;

  // 1. Swapped Axes (AI swapped Latitude and Longitude)
  if (Math.abs(lat - cityLng) < 5 && Math.abs(lng - cityLat) < 5) {
    return [lng, lat]; // Flip them back
  }

  // 2. The Pacific Ocean Bug (AI flipped the East/West sign)
  if (Math.abs((lng * -1) - cityLng) < 5) {
    lng = lng * -1;
  }

  // 3. The Antarctica Bug (AI flipped the North/South sign)
  if (Math.abs((lat * -1) - cityLat) < 5) {
    lat = lat * -1;
  }

  // 4. Pure Hallucination (AI generated coordinates thousands of miles away)
  if (Math.abs(lat - cityLat) > 2 || Math.abs(lng - cityLng) > 2) {
    // Anchor them safely near the city center with a tiny random offset
    lat = cityLat + (Math.random() - 0.5) * 0.03;
    lng = cityLng + (Math.random() - 0.5) * 0.03;
  }

  return [lat, lng];
};

export default function FullMapPage({ trip }) {
  const [coords, setCoords] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);

  const rawLandmarks = trip?.landmarks || [];

  useEffect(() => {
    const fetchCoords = async () => {
      const result = await getCityCoords(trip.destinationCity);
      setCoords(result);
    };
    fetchCoords();
  }, [trip.destinationCity]);

  // --- INTERCEPT AND CLEAN AI DATA ---
  const safeLandmarks = useMemo(() => {
    if (!coords || coords[0] === 0) return [];
    
    return rawLandmarks.map(place => {
      const [safeLat, safeLng] = sanitizeCoordinates(coords, place.lat, place.lng);
      return { ...place, lat: safeLat, lng: safeLng };
    });
  }, [rawLandmarks, coords]);

  return (
    <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative flex flex-col lg:flex-row selection:bg-orange-500/30">
      
      {/* MOBILE TOGGLE */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-24 right-6 z-[2000] bg-orange-500 text-black p-2 rounded-2xl shadow-2xl active:scale-60 transition-transform"
      >
        {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
      </button>

      {/* MAP SECTION */}
      <motion.main 
        layout
        className="relative flex-1 h-full w-full overflow-hidden"
      >
        {/* Pass the CLEANED landmarks down to the map */}
        <DestinationMap 
            coords={coords} 
            landmarks={safeLandmarks} 
            activeLocation={activeLocation} 
            className="h-full w-full" 
        />
        
        {/* HERO TYPOGRAPHY WITH VIGNETTE SHADOW */}
        <div className="absolute bottom-0 left-0 w-full pt-48 pb-10 px-6 md:px-12 z-[1000] pointer-events-none bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-16 h-2 bg-orange-500 mb-6 shadow-[0_0_15px_rgba(249,115,22,0.6)] rounded-full" />
            <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              {trip.destinationCity}<span className="text-orange-500">.</span>
            </h1>
          </motion.div>
        </div>
      </motion.main>

      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            key="sidebar"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] lg:relative lg:w-[420px] bg-[#0a0a0a]/95 lg:bg-[#0a0a0a] backdrop-blur-3xl border-l border-white/10 flex flex-col p-8 md:p-12 z-[1500]"
          >
            <header className="mb-10 pt-20 lg:pt-0">
              <div className="flex items-center gap-3 mb-2">
                <Compass className="text-orange-500" size={20} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Trip Intel</h3>
              </div>
              <p className="text-white/40 text-sm font-medium">
                Synchronizing data for <span className="text-white uppercase font-black">{trip.destinationCity}</span>.
              </p>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
              {/* Mapping over the CLEANED landmarks */}
              {safeLandmarks.length === 0 ? (
                <div className="p-10 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-30">
                  <Info size={24} className="mb-4 text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">No Itinerary Detected</span>
                </div>
              ) : (
                safeLandmarks.map((place, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveLocation([place.lat, place.lng])}
                    className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:border-orange-500/30 transition-all cursor-pointer hover:bg-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-black uppercase tracking-tight text-orange-400 pr-4">
                        {index + 1}. {place.name}
                      </span>
                      <Navigation size={14} className="text-white/30 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                    </div>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      {place.desc}
                    </p>
                  </motion.div>
                ))
              )}
            </div>

            <footer className="mt-10">
              {/* <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-500 transition-all active:scale-95 shadow-2xl">
                Download Map Data <ChevronRight size={16} />
              </button> */}
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}