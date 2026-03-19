import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  PlaneTakeoff,
  X
} from "lucide-react";

// --- MOCK DATA (Replace with your actual API call fetching User's Trips) ---
const mockTrips = [
  {
    _id: "1",
    destinationCity: "Tokyo, Japan",
    startDate: "2026-10-12",
    endDate: "2026-10-20",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
    status: "Upcoming"
  },
  {
    _id: "2",
    destinationCity: "Paris, France",
    startDate: "2026-05-15",
    endDate: "2026-05-22",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    status: "Upcoming"
  }
];

// --- SUB-COMPONENT: Trip Card ---
const TripCard = ({ trip, navigate }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/trip/${trip._id}`)}
      className="group relative h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 shadow-2xl"
    >
      {/* Background Image & Gradient */}
      <img 
        src={trip.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"} 
        alt={trip.destinationCity}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

      {/* Card Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
            {trip.status}
          </span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-2 leading-none drop-shadow-lg">
          {trip.destinationCity.split(',')[0]}
          <span className="text-orange-500">.</span>
        </h3>
        
        <div className="flex items-center gap-4 text-white/60 text-xs md:text-sm font-medium uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-orange-500" />
            {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight size={14} className="text-white/30" />
          </span>
          <span>
            {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT: Homepage ---
const Home = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form State for New Trip
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreateTrip = (e) => {
    e.preventDefault();
    // TODO: Wire up to your backend API (e.g., createTrip(destination, startDate, endDate))
    console.log("Creating trip to:", destination);
    setIsCreateModalOpen(false);
    // navigate(`/trip/${newTripId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4 md:px-8 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest leading-[0.9] mb-4">
            Your <br/><span className="text-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Journeys</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base font-medium uppercase tracking-widest">
            Design, manage, and explore your upcoming adventures.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 text-white hover:text-black transition-all group px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl active:scale-95"
        >
          <div className="bg-orange-500 group-hover:bg-black text-black group-hover:text-orange-500 p-2 rounded-full transition-colors">
            <Plus size={20} className="stroke-[3]" />
          </div>
          <span className="font-black uppercase tracking-widest text-sm">Plan New Trip</span>
        </motion.button>
      </div>

      {/* TRIPS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {mockTrips.map((trip, idx) => (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <TripCard trip={trip} navigate={navigate} />
          </motion.div>
        ))}

        {/* Empty State / Add New Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mockTrips.length * 0.1 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="h-[300px] md:h-[400px] rounded-[2rem] border-2 border-dashed border-white/10 hover:border-orange-500/50 bg-white/[0.02] hover:bg-orange-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
        >
          <div className="h-16 w-16 rounded-full bg-white/5 group-hover:bg-orange-500/20 flex items-center justify-center text-white/30 group-hover:text-orange-500 transition-colors">
            <Sparkles size={28} />
          </div>
          <span className="font-black uppercase tracking-widest text-white/40 group-hover:text-orange-400 transition-colors text-sm">
            Draft New Journey
          </span>
        </motion.div>
      </div>

      {/* CREATION MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                  <PlaneTakeoff size={24} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white">Initialize</h2>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">Destination</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="text" 
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Kyoto, Japan"
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-white/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">Departure</label>
                    <input 
                      type="date" 
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500 text-white rounded-xl py-4 px-4 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">Return</label>
                    <input 
                      type="date" 
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500 text-white rounded-xl py-4 px-4 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Generate Journey
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;