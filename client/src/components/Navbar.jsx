
/**
 * @file Navbar.jsx
 * @description Mobile-responsive persistent navigation with adaptive layout and high-priority stacking.
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  LayoutDashboard,
  Map as MapIcon,
  Compass,
  User,
  Settings,
  Info,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, profileData } = useAuth(); 

  const pathParts = location.pathname.split("/");
  const tripId = pathParts[2];
  const isTripContext = location.pathname.includes("/trip/") && tripId;

  return (
    // RECTIFIED: px-2 and top-4 for better mobile spacing. z-[9999] clears map layers.
    <div className="fixed top-4 md:top-8 left-0 w-full flex justify-center z-[9999] px-2 md:px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // RECTIFIED: max-w-full and overflow-x-auto handles small screen constraints
        className="flex items-center gap-1 bg-black/60 backdrop-blur-2xl border border-white/10 p-1.5 md:p-2 rounded-full shadow-2xl pointer-events-auto max-w-full md:max-w-none overflow-hidden"
      >
        {/* LOGO SECTION: Icon-only on mobile to save space */}
        <div
          onClick={() => navigate("/journeys")}
          className="flex items-center gap-2 bg-orange-500 p-2.5 md:px-5 md:py-2.5 rounded-full cursor-pointer hover:bg-white transition-all duration-500 group"
        >
          <Compass className="text-black size-5 md:size-5 group-hover:rotate-45 transition-transform" />
          <span className="text-black font-black uppercase text-[14px] tracking-tighter hidden md:block">
            Journeys
          </span>
        </div>

        <div className="w-px h-5 md:h-6  mx-1 md:mx-2" />

        {/* NAVIGATION SECTION: Uses adaptive NavButton */}
        <div className="flex items-center gap-0.5 md:gap-1">
          {!isTripContext ? (
            <NavButton
              icon={Briefcase}
              label="Journeys"
        
              onClick={() => navigate("/journeys")}
              active={location.pathname === "/journeys"}
            />
          ) : (
            <>
              <NavButton
                icon={Info}
                label="Explore"
                onClick={() => navigate(`/trip/${tripId}/details`)}
                active={location.pathname.includes("/details")}
              />
              <NavButton
                icon={LayoutDashboard}
                label="Dashboard"
                onClick={() => navigate(`/trip/${tripId}`)}
                active={location.pathname === `/trip/${tripId}`}
              />
              <NavButton
                icon={MapIcon}
                label="Map"
                onClick={() => navigate(`/trip/${tripId}/map`)}
                active={location.pathname.includes("/map")}
              />
            </>
          )}
        </div>

        <div className="w-px h-5 md:h-6 bg-white/10 mx-1 md:mx-2" />

        {/* USER ACTIONS SECTION */}
        <div className="flex items-center gap-2 md:gap-4 pr-1 md:pr-3">
          <Settings
            onClick={() => navigate("/settings")}
            className={`size-5 cursor-pointer transition-colors ${
              location.pathname === "/settings" ? "text-orange-500" : "text-white hover:text-white"
            }`}
          />

          <div
            onClick={() => navigate("/profile")}
            className={`rounded-full border cursor-pointer transition-all active:scale-90 flex items-center justify-center overflow-hidden size-8 md:size-9 ${
              location.pathname === "/profile"
                ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                : "border-white/10 hover:border-orange-500/50"
            }`}
          >
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className={`size-5 ${location.pathname === "/profile" ? "text-orange-500" : "text-white/40"}`} />
            )}
          </div>

          <button onClick={logout} className="hidden sm:flex items-center gap-2 text-white hover:text-red-500 transition-colors">
            <LogOut className="size-5" />
          </button>
        </div>
      </motion.nav>
    </div>
  );
};

const NavButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex  items-center gap-2 p-2.5 md:px-5 md:py-2.5 rounded-full transition-all duration-500 ${
      active ? "bg-white/20 text-white" : "text-white/70 hover:text-orange-400 hover:bg-white/10"
    }`}
  >
    <Icon size={15} className={active ? "text-orange-500" : ""} />
    {/* RECTIFIED: Labels are hidden on mobile to prevent overflow */}
    <span className=" md:text-[14px] uppercase font-bold hidden lg:block">
      {label}
    </span>
  </button>
);

export default Navbar;