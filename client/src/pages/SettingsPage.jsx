
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User,
  Globe,
  Trash2,
  ChevronLeft,
  Camera,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SettingsPage = ({ trips = [] }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

// 1. Check local storage first on load; default to metric if nothing is there
  const [units, setUnits] = useState(() => {
    return localStorage.getItem("journeys_units") || "metric";
  });

  // 2. Handle the click, update the state, and save to the browser
  const handleUnitToggle = (newUnit) => {
    setUnits(newUnit);
    localStorage.setItem("journeys_units", newUnit);
    
    // Give the user a premium feedback pop-up
    toast.success(`Units updated to ${newUnit === 'metric' ? 'Metric (°C, km)' : 'Imperial (°F, mi)'}`);
  };
  const { profileData } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 md:pt-32 p-4 sm:p-6 md:p-12 lg:p-20 selection:bg-orange-500/30 transition-colors duration-500">
      
      {/* 1. BACK NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors mb-4 md:mb-8 group"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase font-bold tracking-widest text-sm">
          Back
        </span>
      </button>

      {/* 2. EDITORIAL HEADER */}
      <header className="mb-10 md:mb-16">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
          System <br className="block sm:hidden" /><span className="text-orange-400">Settings</span>
        </h1>
        <div className="h-1 w-16 md:w-24 bg-orange-500" />
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl"
      >
        {/* ACCOUNT PROFILE SECTION */}
        <SettingsCard
          variants={cardVariants}
          icon={User}
          title="Account Profile"
        >
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="size-24 sm:size-28 md:size-40 rounded-full border-2 border-orange-500/50 overflow-hidden bg-orange-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] shrink-0">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <User size={40} className="md:size-[64px] text-orange-500" />
              )}
            </div>

            <div className="w-full space-y-4 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 break-words">
                  {profileData.name}
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* TRAVEL MILESTONES */}
        <SettingsCard
          variants={cardVariants}
          icon={Compass}
          title="Travel Milestones"
          description="Visualize your journey progress and upcoming goals."
        >
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* FIX: Turned into a clickable button navigating to /journeys */}
            <button 
              onClick={() => navigate('/journeys')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-orange-500/30 flex flex-col items-center transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white/70 tracking-widest mb-1 text-center transition-colors">
                Total Trips
              </span>
              <span className="text-2xl md:text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform">
                {trips.length}
              </span>
            </button>

            {/* FIX: Turned into a clickable button navigating to /journeys */}
            <button 
              onClick={() => navigate('/journeys')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-orange-500/30 flex flex-col items-center transition-all cursor-pointer active:scale-95 group"
            >
              <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white/70 tracking-widest mb-1 text-center transition-colors">
                Cities Visited
              </span>
              <span className="text-2xl md:text-3xl font-black text-orange-500 group-hover:scale-110 transition-transform">
                {[...new Set(trips.map((t) => t.destinationCity))].length}
              </span>
            </button>

            <div className="col-span-1 sm:col-span-2 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 flex flex-col sm:flex-row items-center sm:justify-between gap-3 px-6 mt-2">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em] text-center">
                Rank: Explorer
              </span>
              <div className="h-1.5 w-full sm:w-32 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[60%]" />
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* REGIONAL PREFERENCES */}
        <SettingsCard
          variants={cardVariants}
          icon={Globe}
          title="Regional Defaults"
          description="Set your global units for weather and currency."
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 w-full">
            <span className="font-bold uppercase text-[10px] tracking-widest text-white/60 text-center sm:text-left">
              Unit System
            </span>
            <div className="flex bg-black p-1 rounded-full border border-white/10 w-full sm:w-auto justify-center">
              <button
                onClick={() => handleUnitToggle("metric")}
                className={`px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all flex-1 sm:flex-none ${units === "metric" ? "bg-orange-500 text-black" : "text-white/40"}`}
              >
                Metric
              </button>
              <button
                onClick={() => handleUnitToggle("imperial")}
                className={`px-4 md:px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all flex-1 sm:flex-none ${units === "imperial" ? "bg-orange-500 text-black" : "text-white/40"}`}
              >
                Imperial
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* DANGER ZONE */}
        <SettingsCard
          variants={cardVariants}
          icon={Trash2}
          title="Danger Zone"
          description="Irreversible actions for your travel account."
          danger
        >
          <button className="w-full mt-6 py-3 md:py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all border border-red-500/20 active:scale-95">
            Delete Account
          </button>
        </SettingsCard>
      </motion.main>
    </div>
  );
};

const SettingsCard = ({
  icon: Icon,
  title,
  description,
  children,
  danger = false,
  variants,
}) => (
  <motion.div
    variants={variants}
    className={`bg-[#161616]/40 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border ${danger ? "border-red-500/20" : "border-white/10 hover:border-orange-500/30"} transition-all shadow-2xl flex flex-col`}
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
      <div
        className={`p-3 rounded-2xl shrink-0 ${danger ? "bg-red-500/10" : "bg-orange-500/10"}`}
      >
        <Icon
          className={danger ? "text-red-500" : "text-orange-500"}
          size={24}
        />
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">{title}</h3>
        {description && <p className="text-white/40 text-[10px] md:text-xs leading-relaxed mt-1">{description}</p>}
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-end">
        {children}
    </div>
  </motion.div>
);

export default SettingsPage;