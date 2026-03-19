
/**
 * @file PlaceDetailsPage.jsx
 * @description Editorial hub for comprehensive city overviews.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Camera, Utensils, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { getCityIntel } from "@/api/tripApi";

const PlaceDetailsPage = ({ trip }) => {
  const navigate = useNavigate();

  // STEP 1: Manage loading state
  const [isLoading, setIsLoading] = useState(true);

  // STEP 2: Manage editorial data state
  const [editorialData, setEditorialData] = useState({
    overview: trip?.destinationInfo?.description || "Synchronizing city data...",
    attractions: trip?.landmarks?.length > 0 ? trip.landmarks : [
        { name: "Fetching Landmark...", desc: "Synchronizing data with hub." },
        { name: "Fetching Landmark...", desc: "Synchronizing data with hub." }
    ],
    cuisine: trip?.editorial?.localCuisine || "Synchronizing...",
    geography: trip?.editorial?.geography || "Synchronizing..."
  });

  // STEP 3: Fetch Data Logic
  useEffect(() => {
    const fetchIntel = async () => {
        // Only fetch if we don't already have landmarks saved in the DB
        if (trip && (!trip.landmarks || trip.landmarks.length === 0)) {
            setIsLoading(true);
            try {
                // This calls the backend to generate the data via AI/Wikipedia
                const data = await getCityIntel(trip._id);
                
                // Update local state with fresh data
                setEditorialData({
                    overview: data.destinationInfo.description,
                    attractions: data.editorial.topAttractions || data.landmarks, // Fallback if needed
                    cuisine: data.editorial.localCuisine,
                    geography: data.editorial.geography
                });
            } catch (err) {
                console.error("Failed to sync intel");
            } finally {
                setIsLoading(false);
            }
        } else {
            // Data exists, turn off the loading spinner!
            setIsLoading(false);
        }
    };
    
    if (trip) {
        fetchIntel();
    }
  }, [trip]);

  // STEP 4: Safety Guard Clause
  if (!trip) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-orange-500 rounded-full" />
      </div>
    );
  }

  // Update sections array (Removed modal/truncation logic)
  const sections = [
    { title: "Overview", icon: Info, content: editorialData.overview },
    { title: "Top Attractions", icon: Camera, content: editorialData.attractions },
    { title: "Local Cuisine", icon: Utensils, content: editorialData.cuisine },
    { title: "Geography", icon: Globe, content: editorialData.geography },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-orange-500/30">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(`/trip/${trip._id}`)}
        className="flex items-center gap-2 text-white/60 hover:text-orange-400 rounded-full p-2 md:p-3 my-3 uppercase font-black tracking-widest text-xs mb-12 transition-colors delay-100"
      >
        <ArrowLeft size={16} /> Back to Trip
      </button>

      {/* Hero Header */}
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-2">
          {trip.destinationCity}
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-lg">
            Information Hub
          </p>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group bg-[#161616]/60 hover:bg-gray-900 shadow-xl hover:shadow-orange-300/30 backdrop-blur-2xl border border-white/10 p-3 md:p-6 rounded-2xl hover:border-orange-500/70 transition-all flex flex-col min-h-[220px]"
          >
            {/* Bottom Glow Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl shadow-[0_0_15px_rgba(249,115,22,0.5)]" />

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500/10 border rounded-full border-orange-500/30 p-2">
                <sec.icon className="text-orange-500" size={24} />
              </div>
              <h2 className="text-xl md:text-2xl uppercase font-bold">
                {sec.title}
              </h2>
            </div>

            <div className="text-white leading-relaxed text-sm md:text-base mt-4 flex-1">
              {isLoading && i === 0 ? (
                <span className="animate-pulse">Synchronizing...</span>
              ) : (
                <>
                  {/* Is this the Top Attractions Array or Standard Text? */}
                  {Array.isArray(sec.content) ? (
                    /* --- RENDER ATTRACTIONS LIST --- */
                    <ul className="space-y-3 w-full">
                      {sec.content.slice(0, 4).map((place, idx) => (
                        <li 
                          key={idx} 
                          className="group/item flex justify-between items-center bg-[#0a0a0a]/50 p-4 rounded-xl border border-white/5 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer"
                        >
                          <div className="flex flex-col overflow-hidden pr-4">
                            <span className="font-black text-white text-xs tracking-widest uppercase truncate">
                              {place.name}
                            </span>
                            <span className="text-[10px] text-white/40 truncate mt-1">
                              {place.desc}
                            </span>
                          </div>
                          <div className="p-2 rounded-full bg-white/5 group-hover/item:bg-orange-500 group-hover/item:text-black transition-colors shrink-0">
                            <Globe size={14} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    /* --- RENDER STANDARD TEXT --- */
                    <p>{sec.content}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlaceDetailsPage;