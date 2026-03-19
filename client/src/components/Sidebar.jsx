/**
 * @file Sidebar.jsx
 * @description Slide-out navigation menu for the trip dashboard.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import {
  Home,
  PlusCircle,
  Briefcase,
  Settings,
  LogOut,
  X,
  User2,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, profileData, setProfileData } = useAuth();

  const menuItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Create Trip", icon: PlusCircle, path: "/my-trips" },
    { label: "All Trips", icon: Briefcase, path: "/journeys" },
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Profile", icon: User2, path: "/profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/600 backdrop-blur-sm z-[110]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 300 }}
            className=" md:flex fixed top-0 left-0 h-full w-72 bg-[#161616] border-r border-white/10 z-[120] p-6 flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase text-orange-500 tracking-tighter">
                Journeys
              </h2>
              <button
                onClick={onClose}
                className="text-white/40  hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <item.icon
                    size={20}
                    className="group-hover:text-orange-500  transition-colors"
                  />
                  <span className="font-bold uppercase text-sm tracking-widest">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Bottom Actions */}
            <span className="border-t  border-white pt-6">
              <div className="flex mb-1">
                <div className="size-8 md:size-10 rounded-full border-2 border-white/70 overflow-hidden bg-orange-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] shrink-0">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <User2
                      size={48}
                      className="md:size-[64px] text-orange-500"
                    />
                  )}
                </div>
                <div className="font-bold  px-4 py-3 uppercase text-sm tracking-widest">
                  {profileData.name}
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/20 transition-all"
              >
                <LogOut size={20} />
                <span className="font-bold uppercase text-sm tracking-widest">
                  Sign Out
                </span>
              </button>
            </span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
