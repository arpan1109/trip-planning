
// /**
//  * @file TripForm.jsx
//  * @description Editorial form with 2x2 grid layout for mobile devices.
//  */

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { createTrip } from "../api/tripApi";
// import { toast } from "sonner";

// import API from "../api/axios"; 

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { MapIcon } from "lucide-react";

// const TripForm = ({ onTripCreated }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     tripName: "",
//     destinationCity: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // const handleSubmit = async (e) => {
//   //     e.preventDefault();
//   //     setLoading(true);
//   //     try {
//   //         const newTrip = await createTrip(formData);
//   //         if (onTripCreated) onTripCreated(newTrip);
//   //         navigate(`/trip/${newTrip._id}`);
//   //     } catch (err) {
//   //         console.error("Redirection Error:", err);
//   //         alert("Execution failed: Backend server connectivity issue.");
//   //     } finally {
//   //         setLoading(false);
//   //     }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // 1. Data Preparation: Ensure field names match your Trip model
//     const formData = {
//       tripName: title, // Mapping 'title' state to 'tripName' in model
//       destinationCity: city, // Mapping 'city' state to 'destinationCity'
//       startDate: dates.start,
//       endDate: dates.end,
//     };

//     try {
//       // 2. API Call: Must use an Axios instance with 'withCredentials: true'
//       const response = await API.post("/trips", formData);

//       // 3. Success Handling: Check for 201 Created status
//       if (response.status === 201) {
//         toast.success("Journey Generated!");

//         // Navigate using the ID returned from the database
//         // Using response.data._id based on your controller's res.status(201).json(newTrip)
//         navigate(`/trip/${response.data._id}`);
//       }
//     } catch (err) {
//       // 4. Error Handling: Catch 401 (Unauthorized) or 500 (Server Error)
//       console.error("Trip Creation Failed:", err);

//       if (err.response?.status === 401) {
//         toast.error("Session expired. Please log in again.");
//         // Optional: force redirect to login if unauthorized
//       } else {
//         toast.error(
//           err.response?.data?.message || "Failed to start the journey.",
//         );
//       }

//       // RECTIFIED: This 'Redirection Error' you saw happens if you
//       // try to navigate() outside of the successful 'if' block.
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7 }}
//       className="w-full"
//     >
//       <Card className="shadow-2xl shadow-white/10 border-orange-300 bg-[#161616]/80 backdrop-blur-xl overflow-hidden rounded-[1rem]">
//         <CardHeader className="border-b border-white/10 p-5 md:p-10 bg-gradient-to-r from-orange-400/15 to-transparent">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
//             <div className="p-3 md:p-4 rounded-2xl bg-orange-500/20 border border-white shadow-[0_0_50px_rgba(249,115,22,0.45)]">
//               <MapIcon className="h-7 w-7 md:h-10 md:w-10 text-white" />
//             </div>
//             <div>
//               <CardTitle className="text-lg md:text-[2rem] uppercase tracking-wider leading-none">
//                 <span className="text-orange-500">Create</span> New Trip
//               </CardTitle>
//               <p className="text-[10px] md:text-[1rem] text-white/70 uppercase tracking-widest mt-1 md:mt-2">
//                 Enter details
//               </p>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-5 md:p-10">
//           <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
//             {/* ROW 1: Title & Destination (2x2 Grid on Mobile) */}
//             <div className="grid grid-cols-2 gap-3 md:gap-6">
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//               >
//                 <label className="block text-[10px] md:text-[1rem] font-black text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.tripName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, tripName: e.target.value })
//                   }
//                   placeholder="e.g., Summer"
//                   className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-3 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-xs md:text-base transition-all placeholder:text-white/30"
//                 />
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: 10 }}
//                 animate={{ opacity: 1, x: 0 }}
//               >
//                 <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.destinationCity}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       destinationCity: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., Tokyo"
//                   className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-3 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-xs md:text-base transition-all placeholder:text-white/30"
//                 />
//               </motion.div>
//             </div>

//             {/* ROW 2: Dates (2x2 Grid on Mobile) */}
//             <div className="grid grid-cols-2 gap-3 md:gap-10">
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
//                   Start
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={formData.startDate}
//                   onChange={(e) =>
//                     setFormData({ ...formData, startDate: e.target.value })
//                   }
//                   className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-2 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-[10px] md:text-base transition-all"
//                 />
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//               >
//                 <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
//                   End
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={formData.endDate}
//                   onChange={(e) =>
//                     setFormData({ ...formData, endDate: e.target.value })
//                   }
//                   className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-2 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-[10px] md:text-base transition-all"
//                 />
//               </motion.div>
//             </div>

//             {/* SUBMIT BUTTON: Maintained full width for impact */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: 1.01 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full h-10 md:h-12 bg-orange-500 text-sm md:text-[1.5rem] hover:bg-[rgb(31,31,31)] hover:text-white text-black font-extrabold uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-xl transition-all mt-2 md:mt-4 ease-in-out"
//             >
//               {loading ? "Synchronizing..." : "Generate Journey"}
//             </motion.button>
//           </form>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// export default TripForm;

/**
 * @file TripForm.jsx
 * @description Editorial form with 2x2 grid layout for mobile devices.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import API from "../api/axios"; 

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapIcon } from "lucide-react";



const TripForm = ({ onTripCreated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tripName: "",
    destinationCity: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  // RECTIFIED: logic now correctly uses the 'formData' state object
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await API.post("/trips", formData);

    // RECTIFIED: Check for 201 and extract the nested 'data' object
    if (response.status === 201) {
      const actualTripData = response.data.data; // Access the nested trip object
      
      toast.success("Journey Generated!");

      // 1. Update the global trips list in App.jsx immediately
      if (onTripCreated) onTripCreated(actualTripData);

      // 2. Navigate using the extracted ID (prevents /trip/undefined)
      navigate(`/trip/${actualTripData._id}`);
    }
  } catch (err) {
    console.error("Trip Creation Failed:", err);
    toast.error(err.response?.data?.message || "Failed to start the journey.");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full"
    >
      <Card className="shadow-2xl shadow-white/10 border-orange-300 bg-[#161616]/80 backdrop-blur-xl overflow-hidden rounded-[1rem]">
        <CardHeader className="border-b border-white/10 p-5 md:p-10 bg-gradient-to-r from-orange-400/15 to-transparent">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
            <div className="p-3 md:p-4 rounded-2xl bg-orange-500/20 border border-white shadow-[0_0_50px_rgba(249,115,22,0.45)]">
              <MapIcon className="h-7 w-7 md:h-10 md:w-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg md:text-[2rem] uppercase tracking-wider leading-none">
                <span className="text-orange-500">Create</span> New Trip
              </CardTitle>
              <p className="text-[10px] md:text-[1rem] text-white/70 uppercase tracking-widest mt-1 md:mt-2">
                Enter details
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            {/* ROW 1: Title & Destination (2x2 Grid on Mobile) */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="block text-[10px] md:text-[1rem] font-black text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.tripName}
                  onChange={(e) =>
                    setFormData({ ...formData, tripName: e.target.value })
                  }
                  placeholder="e.g., Summer"
                  className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-3 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-xs md:text-base transition-all placeholder:text-white/30"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.destinationCity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationCity: e.target.value,
                    })
                  }
                  placeholder="e.g., Tokyo"
                  className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-3 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-xs md:text-base transition-all placeholder:text-white/30"
                />
              </motion.div>
            </div>

            {/* ROW 2: Dates (2x2 Grid on Mobile) */}
            <div className="grid grid-cols-2 gap-3 md:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
                  Start
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-2 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-[10px] md:text-base transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-[10px] md:text-[1rem] font-bold text-orange-500/80 mb-2 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.3em]">
                  End
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/10 rounded-xl text-white px-2 md:px-6 h-11 md:h-14 focus:border-orange-500/50 outline-none text-[10px] md:text-base transition-all"
                />
              </motion.div>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-10 md:h-12 bg-orange-500 text-sm md:text-[1.5rem] hover:bg-[rgb(31,31,31)] hover:text-white text-black font-extrabold uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-xl transition-all mt-2 md:mt-4 ease-in-out"
            >
              {loading ? "Synchronizing..." : "Generate Journey"}
            </motion.button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TripForm;