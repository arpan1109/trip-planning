import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  Map,
  Sparkles,
  ArrowRight,
  Globe2,
  Backpack,
} from "lucide-react";

import mountainsbg from "../assets/mountains.jpg";

const Landing = () => {
  const navigate = useNavigate();

  // const handleStartPlanning = () => {
  //   navigate("/dashboard");
  // };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
      {/* NAVIGATION */}
      <nav className="absolute bg-gray-700/30 top-0 w-full p-4 md:p-8 flex justify-between items-center z-50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-white">
          <Compass className="  text-orange-500 size={24} md:w-7 md:h-7" />
          <span className=" text-lg md:text-xl font-bold uppercase tracking-widest">
            Journeys<span className="text-orange-500">.</span>
          </span>
        </div>
        <div className="flex gap-2 md:gap-4 items-center shrink-0">
          <button
            onClick={() => navigate("/auth")}
            // FIX: Added whitespace-nowrap and removed the chance of crushing
            className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors px-2 md:px-3 py-2 whitespace-nowrap shrink-0"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/auth")}
            // FIX: Removed sm:text-[5px], added whitespace-nowrap
            className="text-[10px] text-black  md:text-sm font-bold uppercase tracking-widest bg-[#c8c203] hover:bg-[#fff700] border border-white/10 px-4 py-2 md:px-5 md:py-2 rounded-full transition-all whitespace-nowrap shrink-0"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center px-4 pt-24 md:pt-10">
        <img 
        
          src={mountainsbg} 
          alt="mountains" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent z-10"></div>

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-orange-500/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-normal leading-[1.1] md:leading-[0.9] mb-4 md:mb-6 drop-shadow-2xl"
          >
            Stop Planning.
            <br className="hidden sm:block" />
            <span className="font-bold text-[#d4ff00] block sm:inline mt-2 sm:mt-0">
              Start Exploring.
            </span>
          </motion.h1>
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent z-10"></div> */}

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block text-sm md:text-lg max-w-xl mx-auto mb-8 md:mb-10 font-medium leading-relaxed px-2"
          >
            Generate personalized itineraries, manage your packing lists, and
            map out your next adventure in seconds.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => navigate("/auth")}
            className="bg-[#fff700] hover:bg-[#e4dd00] text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] text-xs md:text-base"
          >
            Create a Journey
            <ArrowRight size={18} className="md:w-5 md:h-5 stroke-[3]" />
          </motion.button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-4 py-16 md:py-24 bg-[#34282874] relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-bold uppercase tracking-widest mb-4">
              How It Works
            </h2>
            <div className="h-1 w-16 md:w-20 bg-orange-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1f0f0f] border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:border-orange-500/30 transition-colors group">
              <div className="h-12 w-12 md:h-14 md:w-14 bg-white/5 group-hover:bg-orange-500/20 text-white/60 group-hover:text-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-all">
                <Globe2 size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl text-orange-400 font-bold uppercase tracking-widest mb-2 md:mb-3">
                1. Pick a Destination
              </h3>
              <p className="text-white text-xs md:text-sm leading-relaxed font-medium">
                Select any city in the world and set your travel dates and get local weather, map, cuisines and tourist attractions
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:border-orange-500/30 transition-colors group">
              <div className="h-12 w-12 md:h-14 md:w-14 bg-white/5 group-hover:bg-orange-500/20 text-white/60 group-hover:text-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-all">
                <Sparkles size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl text-orange-400 font-bold uppercase tracking-widest mb-2 md:mb-3">
                2. Plan your itinerary
              </h3>
              <p className="text-white text-xs md:text-sm leading-relaxed font-medium">
                Get perfectly paced day-by-day according to
                location on just tap for your location.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:border-orange-500/30 transition-colors group">
              <div className="h-12 w-12 md:h-14 md:w-14 bg-white/5 group-hover:bg-orange-500/20 text-white/60 group-hover:text-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-all">
                <Backpack size={24} className="md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl text-orange-400 font-bold uppercase tracking-widest mb-2 md:mb-3">
                3. Pack & Track
              </h3>
              <p className="text-white text-xs md:text-sm leading-relaxed font-medium">
                Interactive checklist to manage your gears and Track your
                progress with the progess packing bar before you fly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
