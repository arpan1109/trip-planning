/**
 * @file TripDetails.jsx
 * @description Mobile-friendly Editorial Dashboard with responsive grids and fluid typography.
 */

import React, { useState, useEffect } from "react";
// TripDetails.jsx
import Sidebar from "./Sidebar"; // Ensure the path to your Sidebar.jsx is correct
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  SunIcon,
  Wallet,
  MapPin,
  Trash2,
  Plus,
  AlertTriangle,
  CalendarClockIcon,
  InfoIcon,
  Menu,
  X,
  LogOut,
  Settings,
  Briefcase,
  Home as HomeIcon,
  Coffee,
  Sparkles,
  Calendar,
  Bed,
  Plane,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  updatePackingItemStatus,
  removeItemFromList,
  addManualItem,
  deleteTrip,
  getCityCoords,
  generateTripItinerary,
} from "../api/tripApi";
import { AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useDestinationImage } from "../hooks/useDestinationImage";

// --- UTILITY LOGIC ---
const calculateDaysLeft = (startDate) => {
  const diff = new Date(startDate) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} Days` : "Starts Today";
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const TripHeader = ({ destination, dates, onMenuClick }) => {
  const { image } = useDestinationImage(destination);

  return (
    <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden bg-slate-900">
      <motion.img
        key={image?.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        src={
          image?.url ||
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828"
        }
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt={destination}
      />

      {/* LAYER 2: GRADIENT OVERLAY (Must be pointer-events-none to let clicks pass through) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0f0f0f] pointer-events-none z-10" />

      {/* LAYER 3: TEXT CONTENT (City & Dates) - Elevated to Z-20 so it is not hidden by gradient */}
      <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-end pb-16 md:pb-32 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-[8rem] font-extrabold text-white mb-2 md:mb-4 leading-tight md:leading-[0.9] uppercase tracking-normal drop-shadow-2xl">
            {destination}
          </h1>
          <p className="text-xl md:text-3xl font-bold text-orange-400/80 tracking-wider">
            {dates}
          </p>
        </motion.div>
      </div>

      {/* LAYER 4: THE TRIGGER BUTTON (Highest Z-index to ensure it is always clickable) */}
      <button
        type="button"
        onClick={onMenuClick}
        className=" hidden md:flex absolute top-8 left-6 z-[100] p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-orange-500 transition-all cursor-pointer shadow-2xl active:scale-95"
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

// Helper to pick the right icon based on activity type
const getActivityIcon = (type) => {
  switch (type) {
    case "Dining":
      return <Coffee size={16} />;
    case "Transit":
      return <Plane size={16} />;
    case "Accommodation":
      return <Bed size={16} />;
    default:
      return <MapPin size={16} />;
  }
};

// --- NEW COMPONENT: Handles individual activity state ---
// --- UPGRADED COMPONENT: Mobile-Optimized Activity Card ---
const ActivityCard = ({ activity, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 60; // Slightly shorter for mobile

  const needsReadMore =
    activity.description && activity.description.length > MAX_LENGTH;
  const displayText =
    needsReadMore && !isExpanded
      ? activity.description.slice(0, MAX_LENGTH).trim() + "..."
      : activity.description;

  return (
    <div
      onClick={() => needsReadMore && setIsExpanded(!isExpanded)}
      className="bg-white/5 p-3 md:p-5 rounded-2xl border border-white/5 flex gap-3 md:gap-4 hover:border-orange-500/30 hover:bg-white/10 transition-all group cursor-pointer"
    >
      {/* LEFT COLUMN: Icon */}
      <div className="shrink-0 mt-1">
        <div className="p-2.5 md:p-3 rounded-full bg-black/50 text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors border border-white/5 group-hover:border-orange-500/50">
          {icon}
        </div>
      </div>

      {/* RIGHT COLUMN: Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Title & Time Row (Stacks neatly on tiny screens, inline on desktop) */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4 mb-1.5">
          <span className="font-bold text-[15px] md:text-lg text-white leading-tight">
            {activity.title}
          </span>
          <span className="inline-block self-start sm:self-auto text-[10px] md:text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2 py-1 md:px-3 md:py-1.5 rounded-md shrink-0">
            {activity.time}
          </span>
        </div>

        {/* Description Row */}
        {activity.description && (
          <div className="mt-0.5">
            <span className="text-[11px] md:text-xs text-white/50 leading-relaxed transition-all">
              {displayText}
            </span>
            {needsReadMore && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 ml-2 hover:underline transition-all"
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- NEW COMPONENT: Collapsible Day Accordion ---
const DayBlock = ({ day, isFirst }) => {
  // First day is open by default, others are closed
  const [isOpen, setIsOpen] = useState(isFirst);

  return (
    <div className="relative">
      {/* Orange Line Dot */}
      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />

      <div className="pl-8">
        {/* Clickable Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center cursor-pointer mb-6 group bg-transparent hover:bg-white/5 p-2 -ml-2 rounded-xl transition-all"
        >
          <h3 className="text-xl md:text-2xl font-black text-white/60 uppercase tracking-widest group-hover:text-orange-400 transition-colors m-0">
            Day {day.dayNumber}{" "}
            <span className="text-sm font-normal text-white/30 ml-2">
              ({new Date(day.date).toLocaleDateString()})
            </span>
          </h3>
          <div className="text-white/30 group-hover:text-orange-400 transition-colors">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>

        {/* The Collapsible Activities */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {day.activities.map((activity, actIdx) => (
                <ActivityCard
                  key={actIdx}
                  activity={activity}
                  icon={getActivityIcon(activity.type)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- UPGRADED COMPONENT: Grid + Drawer Architecture ---
const ItinerarySection = ({ tripId, itinerary = [], onTripUpdated }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    toast.info("Planning your itinerary...");

    try {
      const updatedTrip = await generateTripItinerary(tripId);
      if (onTripUpdated) onTripUpdated(updatedTrip);
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="lg:col-span-8 bg-[#161616]/40 rounded-[1rem] border border-white/25 p-6 md:p-10 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white border-l-4 border-orange-500 pl-4 md:pl-8 uppercase">
          Itinerary
        </h2>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="bg-orange-500/10 hover:bg-orange-500 border border-orange-500/50 hover:border-orange-500 text-orange-400 hover:text-black transition-all text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {isGenerating ? "Planning..." : "Suggestions"}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {itinerary.length === 0 && !isGenerating && (
        <div className="text-white/40 text-sm font-medium uppercase tracking-widest border border-dashed border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <Sparkles size={24} className="text-orange-500/50 mb-3" />
          <p>No activities planned yet.</p>
          <p className="text-[10px] mt-2 opacity-60">
            Click Auto-Plan to generate a schedule based on your dates.
          </p>
        </div>
      )}

      {/* Loading Skeleton for Grid */}
      {isGenerating && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-white/5 rounded-2xl border border-white/5"
            ></div>
          ))}
        </div>
      )}

      {/* THE GRID DISPLAY */}
      {!isGenerating && itinerary.length > 0 && (
        // FIX 1: Added mt-12 for mobile to clear the floating navigation bar
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-12 md:mt-8 relative">
          {itinerary.map((day, dayIdx) => (
            <Drawer key={dayIdx}>
              <DrawerTrigger asChild>
                {/* FIX 2: Reduced padding on mobile (p-4) to give the text more room to breathe */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 transition-all rounded-2xl p-4 md:p-5 cursor-pointer flex flex-col items-start group shadow-lg">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                    <Calendar size={16} />
                  </div>
                  {/* FIX 3: Responsive typography so it doesn't wrap awkwardly on small phones */}
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest mb-1">
                    Day {day.dayNumber}
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/40 font-medium mb-3 md:mb-4 truncate w-full">
                    {new Date(day.date).toLocaleDateString()}
                  </p>
                  <div className="text-[9px] md:text-[14px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                    {day.activities.length} Activities
                  </div>
                </div>
              </DrawerTrigger>

              {/* THE DRAWER CONTENT */}
              {/* THE DRAWER CONTENT */}
              <DrawerContent className="bg-[#0a0a0a] border-t border-white/10 text-white max-h-[85vh] z-[9999] flex flex-col">
                {/* FIX 1: max-h-full and overflow-hidden prevent the wrapper from pushing past the screen */}
                <div className="mx-auto w-full max-w-3xl flex flex-col max-h-full overflow-hidden">
                  {/* FIX 2: shrink-0 guarantees the header never gets squished */}
                  <DrawerHeader className="text-left border-b border-white/10 pb-4 md:pb-6 pt-6 px-4 md:px-6 shrink-0">
                    <DrawerTitle className="text-3xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-lg">
                      Day {day.dayNumber}
                      <span className="text-orange-500">.</span>
                    </DrawerTitle>
                    <DrawerDescription className="text-orange-400 font-bold tracking-widest uppercase text-[10px] md:text-xs mt-2">
                      {new Date(day.date).toLocaleDateString()} •{" "}
                      {day.activities.length} Planned Activities
                    </DrawerDescription>
                  </DrawerHeader>

                  {/* FIX 3: min-h-0 is the magic flexbox trick. It forces the list to shrink and scroll instead of pushing the footer off the screen. Removed the hardcoded max-h-[60vh]. */}
                  <div
                    className="p-4 md:p-6 overflow-y-auto min-h-0 space-y-3 md:space-y-4
                     [&::-webkit-scrollbar]:w-1.5
                     [&::-webkit-scrollbar-track]:bg-white/5
                     [&::-webkit-scrollbar-thumb]:bg-orange-500
                     [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {day.activities.map((activity, actIdx) => (
                      <ActivityCard
                        key={actIdx}
                        activity={activity}
                        icon={getActivityIcon(activity.type)}
                      />
                    ))}
                  </div>

                  {/* FIX 4: shrink-0 keeps the footer perfectly anchored and fully visible at the bottom */}
                  <DrawerFooter className="border-t border-white/10 pt-4 pb-6 md:pb-8 px-4 md:px-6 shrink-0 mt-auto">
                    <DrawerClose asChild>
                      <button className="w-full py-3 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-[0.98]">
                        Close Schedule
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      )}
    </div>
  );
};

const StatsCards = ({ trip }) => {
  const navigate = useNavigate();
  
  // 1. Grab the user's unit preference from local storage (default to metric)
  const userUnits = localStorage.getItem("journeys_units") || "metric";

  const getCountdownData = (startDate, endDate) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = start - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (now >= start && now <= end) {
      return { value: "Live", sub: "Trip in Progress" };
    } else if (now > end) {
      return { value: "Past", sub: "Journey Completed" };
    } else if (diffDays === 0) {
      return { value: "Today", sub: "Starts Today" };
    } else if (diffDays === 1) {
      return { value: "1 Day", sub: "Starts Tomorrow" };
    } else {
      return { value: `${diffDays} Days`, sub: "Until Departure" };
    }
  };

  const countdown = getCountdownData(trip.startDate, trip.endDate);
  
  // 2. Weather & Unit Conversion Logic
  const weatherTemp = trip.destinationInfo?.currentTemp;
  const weatherSummary = trip.destinationInfo?.weatherSummary || "Moderate";
  
  let formattedTemp = "N/A";
  if (weatherTemp !== undefined) {
    if (userUnits === "imperial") {
      // Convert Celsius to Fahrenheit
      const tempF = Math.round((weatherTemp * 9) / 5 + 32);
      formattedTemp = `${tempF}°F`;
    } else {
      // Keep as Celsius
      formattedTemp = `${Math.round(weatherTemp)}°C`;
    }
  }

  const cards = [
    {
      label: "Weather",
      value: formattedTemp, // 3. Use the converted temperature here
      sub: weatherSummary,
      icon: SunIcon,
    },
    {
      label: "Information",
      value: "Details",
      sub: "Explore City",
      icon: InfoIcon,
    },
    {
      label: "Status",
      value: countdown.value,
      sub: countdown.sub,
      icon: CalendarClockIcon,
    },
    {
      label: "Location",
      value: trip.destinationCity,
      sub: "View Map Here",
      icon: MapPin,
    },
  ];

  const handleAction = (label) => {
    if (label === "Location") navigate(`/trip/${trip._id}/map`);
    if (label === "Information") navigate(`/trip/${trip._id}/details`);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#161616]/80 backdrop-blur-xl p-4 md:p-7 rounded-2xl border border-white/20 hover:border-orange-300/80 group shadow-2xl flex flex-col hover:shadow-orange-300/25 justify-between"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/60 text-[10px] md:text-[14px] font-medium uppercase tracking-[0.2em] md:tracking-[0.2em]">
              {card.label}
            </p>
            <card.icon className="size-5 md:size-8 text-orange-500 opacity-60 group-hover:opacity-100 transition-all" />
          </div>

          <div>
            <h3 className="text-lg md:text-[30px] text-orange-400 uppercase bold mb-1 tracking-wider leading-none">
              {card.value}
            </h3>

            <p
              onClick={() => handleAction(card.label)}
              className={`text-[10px] md:text-[14px] text-white uppercase font-bold tracking-wider md:tracking-widest transition-all truncate
                ${card.label === "Location" ? "cursor-pointer hover:text-white/50" : "cursor-default"}`}
            >
              {card.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TripDetails = ({ trip, onTripUpdated, onTripDeleted }) => {
  const navigate = useNavigate();
  const [newItemName, setNewItemName] = useState("");

  // STATE: Controls if the sidebar is visible
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!trip || !trip.packingList) return null;

  const packedCount = trip.packingList.filter((i) => i.isPacked).length;
  const progress =
    trip.packingList.length > 0
      ? Math.round((packedCount / trip.packingList.length) * 100)
      : 0;

  // --- NEW COMPONENT: Handles individual activity state ---

  const handleFullTripDeletion = async () => {
    try {
      await deleteTrip(trip._id);
      if (onTripDeleted) onTripDeleted(trip._id);
      toast.success("Journey Removed.");
      navigate("/");
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const updatedTrip = await addManualItem(trip._id, {
        name: newItemName,
        quantity: 1,
        category: "Personal",
      });

      onTripUpdated(updatedTrip);
      const addedItemName = newItemName;
      setNewItemName("");

      const newItem =
        updatedTrip.packingList[updatedTrip.packingList.length - 1];

      toast.success("Item Added", {
        description: `"${addedItemName}" added to packing list.`,
        action: {
          label: "Undo",
          onClick: () => {
            handleDeleteItem(newItem._id);
          },
        },
      });
    } catch (error) {
      toast.error("Failed to add.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const updatedTrip = await removeItemFromList(trip._id, itemId);
      onTripUpdated(updatedTrip);
      toast.info("Item removed");
    } catch (error) {
      toast.error("Failed to remove.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 w-full overflow-x-hidden">
      {/* 1. COMPONENT CALL: Added the Sidebar component at the top of the return */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navigate={navigate}
      />

      {/* 2. TRIGGER: Passed the onMenuClick function to the TripHeader */}
      <TripHeader
        onMenuClick={() => setIsSidebarOpen(true)}
        destination={trip.destinationCity}
        dates={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}
      />

      <main className="container mx-auto px-4 md:px-6 -mt-12 md:-mt-24 relative z-10 space-y-6 md:space-y-10">
        <StatsCards trip={trip} />

        {/* LAYOUT GRID: Stacked on mobile, side-by-side on lg screens */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          {/* ITINERARY COLUMN */}
          <ItinerarySection
            tripId={trip._id}
            itinerary={trip.itinerary}
            onTripUpdated={onTripUpdated}
          />

          {/* RIGHT COLUMN: PACKING & DANGER ZONE */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full max-w-full">
            {/* PACKING CARD */}
            <div className="bg-[#161616]/40 rounded-[1rem] border border-white/10 flex flex-col h-auto lg:max-h-[750px] shadow-2xl backdrop-blur-md w-full overflow-hidden">
              <div className="p-5 md:p-8 border-b border-white/10">
                <div className="flex justify-between items-baseline mb-5 md:mb-6">
                  <h2 className="text-xl md:text-3xl font-semibold text-white uppercase">
                    Packing
                  </h2>
                  <span className="text-2xl md:text-4xl font-semibold text-orange-500">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
              </div>

              <div
                className="divide-y divide-white/10 overflow-y-auto flex-1 
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-white/20
                  [&::-webkit-scrollbar-thumb]:bg-orange-400
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-orange-500/50
                  transition-all max-h-[400px] md:max-h-none w-full"
              >
                {trip.packingList.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-white/5 transition-colors group cursor-pointer w-full"
                  >
                    <input
                      type="checkbox"
                      checked={item.isPacked}
                      onChange={() =>
                        updatePackingItemStatus(
                          trip._id,
                          item._id,
                          !item.isPacked,
                        ).then(onTripUpdated)
                      }
                      className="h-4 w-4 rounded-full border-white/20 text-orange-500 focus:ring-orange-500 cursor-pointer shrink-0"
                    />

                    {/* The min-w-0 here is crucial! It prevents long text from breaking the mobile layout */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm md:text-base font-bold truncate ${
                          item.isPacked
                            ? "line-through text-white/30"
                            : "text-orange-300/90"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-[9px] md:text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                        {item.category}
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 md:p-3 bg-red-500/10 rounded-full text-white/70 hover:text-red-500 
                            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#0f0f0f] w-[92%] max-w-md border-white/30 shadow-orange-400/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl md:text-3xl font-medium text-white">
                            Remove Item?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-orange-400/90 text-base md:text-xl">
                            Discard "{item.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="bg-white/5 text-white border-white/40 uppercase rounded-lg w-full sm:w-auto">
                            Keep
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(item._id)}
                            className="bg-red-600 text-white rounded-lg uppercase hover:bg-red-800 w-full sm:w-auto"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>

              <div className="p-3 md:p-4 bg-white/5 border-t border-white/5 w-full">
                <form onSubmit={handleAddItem} className="flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add Item . . ."
                    className="flex-1 bg-transparent text-orange-400 text-sm outline-none placeholder:text-white/60 font-bold min-w-0"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 text-black p-2 rounded-xl hover:bg-black hover:text-white transition-all shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* DANGER ZONE: Remove Journey */}
            <div className="w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full py-4 px-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase text-[11px] md:text-xs tracking-wider flex items-center justify-center gap-2 transition-all">
                    <AlertTriangle size={16} className="shrink-0" />
                    <span className="truncate">Cancel Entire Journey</span>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-[#0a0a0a] border-red-500/30 shadow-2xl shadow-red-900/20 w-[92%] max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                      <AlertTriangle
                        className="text-red-500 shrink-0"
                        size={20}
                      />
                      Erase Journey?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-400/80 text-sm font-medium leading-relaxed mt-2">
                      Remove {"  "}
                      <span className="text-white font-bold">
                        {trip.destinationCity}
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="mt-4 flex-col gap-2">
                    <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-white/10 uppercase tracking-widest font-bold text-xs rounded-xl w-full">
                      Keep Trip
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleFullTripDeletion}
                      className="bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest font-bold text-xs rounded-xl w-full"
                    >
                      Delete Trip
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
