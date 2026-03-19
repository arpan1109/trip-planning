// /**
//  * @file AllTripsPage.jsx
//  * @description Searchable, sorted trip management dashboard.
//  */
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, ArrowLeft } from "lucide-react";
// import TripCard from "../components/TripCard"; // Reusing your refined TripCard

// const AllTripsPage = ({ trips, onTripDeleted, isLoading }) => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   // 1. LOGIC: Sort by Departure Date (Ascending)
//   const sortedTrips = [...trips].sort((a, b) => 
//     new Date(a.startDate) - new Date(b.startDate)
//   );

//   // 2. LOGIC: Filter by Search Query
//   const filteredTrips = sortedTrips.filter((trip) =>
//     trip.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     trip.destinationCity.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] p-12">
//       <div className="max-w-7xl mx-auto space-y-16">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b  border-white pb-12">
//           <div className="space-y-4 ">
//             <button 
//               onClick={() => navigate("/")}
//               className="text-black p-3 hover:text-orange-400 hover:bg-black hover:border-2  hover:border-orange-400 rounded-full font-black uppercase bg-orange-500 tracking-wider text-[1rem]  transition-all"
//             >
//                Back to Dashboard
//             </button>
//             <h1 className="text-7xl text-white tracking-tighter leading-none">
//               Upcoming Journeys
//             </h1>
//           </div>

//           {/* SEARCH INPUT: Styled for Editorial theme */}
//           <div className="relative w-full md:w-96 group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white group-focus-within:text-orange-500 transition-colors" size={20} />
//             <input
//               type="text"
//               placeholder="Search by name or city..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-[#161616] border border-white/50 rounded-full py-4 pl-12 pr-6 text-white outline-none focus:border-orange-500 focus:border-4 transition-all placeholder:text-white/60 uppercase tracking-wider text-md"
//             />
//           </div>
//         </div>

//         {/* Dynamic Trip Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {filteredTrips.map((trip, idx) => (
//             <TripCard 
//               key={trip._id} 
//               trip={trip} 
//               idx={idx} 
//               onTripDeleted={onTripDeleted} 
//             />
//           ))}
//           {filteredTrips.length === 0 && !isLoading && (
//             <p className="text-white uppercase text-[1.5rem] tracking-wider">No matching journeys found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllTripsPage;
/**
 * @file AllTripsPage.jsx
 * @description Mobile-friendly, searchable trip management dashboard with 2x2 grid logic.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import TripCard from "../components/TripCard"; 

const AllTripsPage = ({ trips, onTripDeleted, isLoading }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 1. LOGIC: Sort by Departure Date (Ascending)
  const sortedTrips = [...trips].sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  );

  // 2. LOGIC: Filter by Search Query
  const filteredTrips = sortedTrips.filter((trip) =>
    trip.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destinationCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-16">
        
        {/* Header Section: Adjusted spacing and alignment for mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-white pb-8 md:pb-12">
          <div className="space-y-4 w-full md:w-auto">
            <button 
              onClick={() => navigate(-1)}
              className="w-full md:w-auto text-black p-3 hover:bg-transparent hover:text-orange-400 rounded-full font-bold uppercase bg-orange-500 tracking-wide text-sm md:text-[1rem] transition-all "
            >
               Back
            </button>
            <h1 className="text-4xl md:text-7xl text-white tracking-tighter leading-none uppercase font-bold">
              Journeys
            </h1>
          </div>

          {/* SEARCH INPUT: Scaled width and font for mobile */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white group-focus-within:text-orange-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-white/50 rounded-full py-3 md:py-4 pl-12 pr-6 text-white outline-none focus:border-orange-500 focus:border-2 md:focus:border-4 transition-all placeholder:text-white/40 uppercase tracking-wider text-xs md:text-md"
            />
          </div>
        </div>

        {/* Dynamic Trip Grid: 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {filteredTrips.map((trip, idx) => (
            <TripCard 
              key={trip._id} 
              trip={trip} 
              idx={idx} 
              onTripDeleted={onTripDeleted} 
            />
          ))}
        </div>

        {/* No Results Message: Responsive typography */}
        {filteredTrips.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-white/80 uppercase text-lg md:text-[1.5rem] tracking-wider">
              No matching journeys found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTripsPage;