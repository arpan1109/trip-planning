/**
 * @file SettingsPage.jsx
 * @description Editorial Settings Hub with functional Avatar Upload and Travel Milestones.
 */
import React, { useState, useRef } from "react";
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

// FIXED: Component now receives 'trips' as a prop to drive the Milestones data
const SettingsPage = ({ trips = [] }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [units, setUnits] = useState("metric");
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
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-32 p-6 md:p-12 lg:p-20 selection:bg-orange-500/30 transition-colors duration-500">
      {/* 1. BACK NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors mb-4 group"
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase font-bold tracking-widest text-sm">
          Back
        </span>
      </button>

      {/* 2. EDITORIAL HEADER */}
      <header className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          System <span className="text-orange-400">Settings</span>
        </h1>
        <div className="h-1 w-24 bg-orange-500" />
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl"
      >
        {/* ACCOUNT PROFILE SECTION */}
        <SettingsCard
          variants={cardVariants}
          icon={User}
          title="Account Profile"
        >
          <div className="mt-8 flex flex-row items-start gap-6">
            <div className="size-28 md:size-40 rounded-full border-2 border-orange-500/50 overflow-hidden bg-orange-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] shrink-0">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <User size={48} className="md:size-[64px] text-orange-500" />
              )}
            </div>

            <div className="w-full space-y-4">
              {/* <input type="text" placeholder="Your Full Name" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-orange-500/50 transition-colors" /> */}
              <div className="text-3xl  sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 break-words">
                  {profileData.name}
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* TRAVEL MILESTONES (Replaced Security) */}
        <SettingsCard
          variants={cardVariants}
          icon={Compass}
          title="Travel Milestones"
          description="Visualize your journey progress and upcoming goals."
        >
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
                Total Trips
              </span>
              <span className="text-2xl font-black text-orange-500">
                {trips.length}
              </span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">
                Cities Visited
              </span>
              <span className="text-2xl font-black text-orange-500">
                {[...new Set(trips.map((t) => t.destinationCity))].length}
              </span>
            </div>

            <div className="col-span-2 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-between px-6">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">
                Rank: Explorer
              </span>
              <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
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
          <div className="flex items-center justify-between mt-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="font-bold uppercase text-[10px] tracking-widest text-white/60">
              Unit System
            </span>
            <div className="flex bg-black p-1 rounded-full border border-white/10">
              <button
                onClick={() => setUnits("metric")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${units === "metric" ? "bg-orange-500 text-black" : "text-white/40"}`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnits("imperial")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${units === "imperial" ? "bg-orange-500 text-black" : "text-white/40"}`}
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
          <button className="w-full mt-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase text-xs tracking-[0.2em] transition-all border border-red-500/20">
            delete account
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
    className={`bg-[#161616]/40 backdrop-blur-xl p-8 rounded-[2rem] border ${danger ? "border-red-500/20" : "border-white/10 hover:border-orange-500/30"} transition-all shadow-2xl`}
  >
    <div className="flex items-start gap-4 mb-2">
      <div
        className={`p-3 rounded-2xl ${danger ? "bg-red-500/10" : "bg-orange-500/10"}`}
      >
        <Icon
          className={danger ? "text-red-500" : "text-orange-500"}
          size={24}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
        <p className="text-white/40 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

export default SettingsPage;
