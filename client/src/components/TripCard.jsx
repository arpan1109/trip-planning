// /**
//  * @file TripCard.jsx
//  */
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Card } from "@/components/ui/card";
// import { useDestinationImage } from "../hooks/useDestinationImage";
// import { ArrowRight } from "lucide-react";

// const TripCard = ({ trip, idx, onTripDeleted }) => {
//   const { image } = useDestinationImage(trip.destinationCity);
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: idx * 0.1 }}
//       className="group"
//     >
//       <Card className="relative overflow-hidden border-white/30 bg-[#161616] hover:border-orange-500/50 shadow-xl hover:shadow-orange-400/30 transition-all duration-500 rounded-[10px] h-full flex flex-col">
//         <Link to={`/trip/${trip._id}`} className="flex-1">
//           <div className="relative h-44 overflow-hidden">
//             <img
//               src={image?.url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828"}
//               alt={trip.destinationCity}
//               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
//           </div>
//           <div className="p-5 space-y-4">
//             <h3 className="text-3xl font-bold text-white uppercase group-hover:text-orange-400 transition-colors">
//               {trip.tripName}
//             </h3>
//             <p className="text-orange-500/80 group-hover:text-white transition-colors text-[1.5rem] font-bold mt-1 flex items-center gap-2">
//               <span className="w-0.5 h-5 rounded-full bg-gray-300" />
//               {trip.destinationCity}
//             </p>
//                       <p className="text-white/70 text-[15px] uppercase tracking-widest">
//              {new Date(trip.startDate).toLocaleDateString("en-GB", { month: "short", day: "numeric" })} —
//              {new Date(trip.endDate).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
//             </p>
//           </div>
//         </Link>
//         <div className="px-5 pb-5 pt-4 border-t border-white/10 flex items-center gap-3">
//           <motion.button
//             whileHover={{ x: 5 }}
//             onClick={() => navigate(`/trip/${trip._id}`)}
//             className="flex-1 flex items-center justify-between px-4 py-2.5 bg-orange-500/20 border border-orange-500/40 text-white font-bold text-md rounded-[4px] uppercase hover:bg-orange-500/40 transition-colors"
//           >
//             View Journey
//             <ArrowRight className="h-4 w-4" />
//           </motion.button>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default TripCard;
/**
 * @file TripCard.jsx
 * @description Responsive Editorial Card with Fluid Typography and Touch-Friendly targets.
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useDestinationImage } from "../hooks/useDestinationImage";
import { ArrowRight } from "lucide-react";

const TripCard = ({ trip, idx, onTripDeleted }) => {
  const { image } = useDestinationImage(trip.destinationCity);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-white/30 bg-[#161616] hover:border-orange-500/50 shadow-xl hover:shadow-orange-400/30 transition-all duration-500 rounded-[10px] h-full flex flex-col">
        {/* Navigation Area Wrapper */}
        <Link to={`/trip/${trip._id}`} className="flex-1">
          {/* IMAGE CONTAINER: Fluid height adjustment for aspect ratio */}
          <div className="relative h-28 md:h-44 overflow-hidden">
            <img
              src={
                image?.url ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828"
              }
              alt={trip.destinationCity}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
          </div>

          {/* CONTENT: Optimized internal padding for mobile */}
          <div className="p-3 md:p-5 space-y-3 md:space-y-4">
            <div>
              {/* FLUID TITLE: Prevents overflow on narrow viewports */}
              <h3 className="text-sm md:text-2xl font-bold text-white uppercase group-hover:text-orange-400 transition-colors">
                {trip.tripName}
              </h3>

              {/* FLUID SUBHEADING: Scaled for mobile readability */}
              <p className="text-orange-500/80 group-hover:text-white transition-colors uppercase text-xl md:text-[1.5rem] font-bold mt-1 flex items-center gap-2">
                <span className="w-0.5 h-4 md:h-5 rounded-full bg-gray-300" />
                {trip.destinationCity}
              </p>
            </div>

            {/* DATES: Scaled font size */}
            <p className="text-white/70 text-xs md:text-[15px] uppercase tracking-widest">
              {new Date(trip.startDate).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              })}{" "}
              —
              {new Date(trip.endDate).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </Link>

        {/* ACTIONS: Standardized touch-target height (min 44px) */}
        <div className="px-3 pb-3 pt-2 md:px-5 md:pb-5 md:pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => navigate(`/trip/${trip._id}`)}
            className="w-full flex items-center justify-between px-2 py-2 md:px-4 md:py-2.5 bg-orange-500/20 border border-orange-500/40 text-white font-bold text-[10px] md:text-md rounded-[4px] uppercase tracking-wider hover:bg-orange-500/40 transition-colors"
          >
            <span className="hidden md:inline">View Journey</span>
            <span className="md:hidden">View</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TripCard;
