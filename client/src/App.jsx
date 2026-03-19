// /**
//  * @file App.jsx - Restored Stable Version with Integrated JWT Auth
//  */
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useParams,
//   useNavigate,
//   useLocation,
//   Navigate,
// } from "react-router-dom";
// import { motion } from "framer-motion";

// // --- AUTH INTEGRATION ---
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoutes";
// import ScrollToTop from "./components/ScrollToTop";

// import { getTrips } from "./api/tripApi";
// import TripForm from "./components/TripForm";
// import TripDetails from "./components/TripDetails";
// import FullMapPage from "./pages/FullMapPage";
// import AllTripsPage from "./pages/AllTripsPage";
// import PlaceDetailsPage from "./pages/PlaceDetailsPage";
// import { Toaster } from "@/components/ui/sonner";
// import TripCard from "./components/TripCard";
// import Navbar from "./components/Navbar";
// import SettingsPage from "./pages/SettingsPage";
// import ProfilePage from "./pages/ProfilePage";
// import AuthPage from "./pages/AuthPage";
// import VerifyEmailPage from "./pages/VerifyEmailPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import Home from "./pages/Home";
// import Landing from "./pages/Landing";

// // 1. Stable Navbar Helper
// const ConditionalNavbar = () => {
//   const location = useLocation();
//   const isTripPage = location.pathname.includes("/trip/");
//   const isSettingsPage = location.pathname === "/settings";
//   return isTripPage || isSettingsPage ? <Navbar /> : null;
// };

// // --- WRAPPED CONTENT COMPONENT ---
// // This allows useAuth to be called within the Provider's scope
// function AppContent() {
//   const [trips, setTrips] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { isAuthenticated, isCheckingAuth } = useAuth();

//   useEffect(() => {
//     const fetchTrips = async () => {
//       // Only fetch data if the user is authenticated
//       if (!isAuthenticated) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const data = await getTrips();
//         setTrips(data || []);
//       } catch (err) {
//         console.error("Load failed:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTrips();
//   }, [isAuthenticated]);

//   const handleNewTrip = (newTrip) => {
//     // Ensure we are adding the actual trip object, not the full response wrapper
//     setTrips((prev) => [newTrip, ...prev]);
//   };
//   const handleDeleteState = (id) =>
//     setTrips((prev) => prev.filter((t) => t._id !== id));

//   const today = new Date();
//   today.setHours(0, 0, 0, 0); //considering 0000 hrs as reference

//   const activeTrips = trips.filter((trip) => new Date(trip.endDate) >= today);

//   const sortedTrips = [...activeTrips].sort(
//     (a, b) => new Date(a.startDate) - new Date(b.startDate),
//   );
//   const upcomingTrips = sortedTrips.slice(0, 3);

//   // Show a blank screen or spinner while checking JWT validity on initial load
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-orange-500">
//         Initializing Session...
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <ScrollToTop />
//       {/* RESTORED: Fixed Dark Background */}
//       <div className="min-h-screen bg-[#0f0f0f] text-white w-full selection:bg-orange-500/30">
//         <ConditionalNavbar />

//         <Routes>
//           {/* SECURE DASHBOARD ROUTE */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <div className="w-full">
//                   <motion.section
//                     className="py-16 md:py-24 px-4 md:px-6 border-b border-white/5 bg-gradient-to-b from-orange-500/5 to-transparent"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                   >
//                     <div className="max-w-4xl mx-auto text-center space-y-4">
//                       <h1 className="text-5xl md:text-8xl font-bold uppercase text-white tracking-wide">
//                         Journeys
//                       </h1>
//                       <p className="text-[14px] md:text-[20px] text-orange-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">
//                         Your Personal Itineraries
//                       </p>
//                       <div className="h-0.5 w-16 md:w-24 bg-orange-500 mx-auto mt-6 md:mt-8" />
//                     </div>
//                   </motion.section>

//                   <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-16 md:space-y-24">
//                     <TripForm onTripCreated={handleNewTrip} />
//                     <div className="space-y-12 pb-20">
//                       <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-6 md:gap-4">
//                         <h2 className="text-2xl md:text-4xl px-4 border-l-4 border-r-4 rounded-full font-bold tracking-wider uppercase">
//                           Upcoming
//                         </h2>
//                         {trips.length > 3 && (
//                           <Link
//                             to="/journeys"
//                             className="text-black bg-orange-400 font-bold uppercase tracking-widest text-sm p-2 rounded-full hover:bg-white transition-colors"
//                           >
//                             View All ({trips.length})
//                           </Link>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
//                         {isLoading ? (
//                           <div className="animate-spin h-8 w-8 border-t-2 border-orange-500 rounded-full mx-auto" />
//                         ) : (
//                           upcomingTrips.map((trip, idx) => (
//                             <TripCard
//                               key={trip._id}
//                               trip={trip}
//                               idx={idx}
//                               onTripDeleted={handleDeleteState}
//                             />
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </main>
//                 </div>
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/verify-email" element={<VerifyEmailPage />} />

//           {/* PROTECTED ROUTES */}
//           <Route
//             path="/journeys"
//             element={
//               <ProtectedRoute>
//                 <AllTripsPage
//                   trips={sortedTrips}
//                   onTripDeleted={handleDeleteState}
//                   isLoading={isLoading}
//                 />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <SettingsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/trip/:id/details"
//             element={
//               <ProtectedRoute>
//                 <PlaceDetailsWrapper trips={trips} isLoading={isLoading} />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/trip/:id"
//             element={
//               <ProtectedRoute>
//                 <TripDetailsPage
//                   trips={trips}
//                   setTrips={setTrips}
//                   onTripDeleted={handleDeleteState}
//                   isLoading={isLoading}
//                 />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/trip/:id/map"
//             element={
//               <ProtectedRoute>
//                 <FullMapWrapper trips={trips} isLoading={isLoading} />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <ProfilePage trips={trips} />
//               </ProtectedRoute>
//             }
//           />
//           {/* PUBLIC AUTH ROUTE */}
//           <Route path="/auth" element={<AuthPage trips={trips} />} />
//           <Route path="/verify-email" element={<VerifyEmailPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/" element={<Landing />} />

//           {/* FALLBACK REDIRECT */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//       <Toaster position="top-center" theme="dark" richColors />
//     </Router>
//   );
// }

// // --- MAIN ENTRY POINT ---
// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// // --- RESTORED WRAPPERS ---
// function PlaceDetailsWrapper({ trips, isLoading }) {
//   const { id } = useParams();
//   if (isLoading) return <div className="min-h-screen bg-black" />;
//   const trip = trips.find((t) => t._id === id);
//   return trip ? (
//     <PlaceDetailsPage trip={trip} />
//   ) : (
//     <div className="text-white p-10">Data Not Found</div>
//   );
// }

// function FullMapWrapper({ trips, isLoading }) {
//   const { id } = useParams();
//   const trip = trips.find((t) => t._id === id);
//   return isLoading || !trip ? (
//     <div className="min-h-screen bg-[#0f0f0f]" />
//   ) : (
//     <FullMapPage trip={trip} />
//   );
// }

// function TripDetailsPage({ trips, setTrips, onTripDeleted, isLoading }) {
//   const { id } = useParams();
//   const trip = trips.find((t) => t._id === id);
//   if (isLoading || !trip) return <div className="min-h-screen bg-[#0f0f0f]" />;
//   return (
//     <TripDetails
//       trip={trip}
//       onTripUpdated={(u) =>
//         setTrips(trips.map((t) => (t._id === u._id ? u : t)))
//       }
//       onTripDeleted={onTripDeleted}
//     />
//   );
// }

// export default App;


/**
 * @file App.jsx - Final version with Public Landing and Secure Dashboard
 */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";

// --- AUTH INTEGRATION ---
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import ScrollToTop from "./components/ScrollToTop";
import { getTrips } from "./api/tripApi";
import { Toaster } from "@/components/ui/sonner";

// --- PAGES & COMPONENTS ---
import Navbar from "./components/Navbar";
import TripForm from "./components/TripForm";
import TripCard from "./components/TripCard";
import TripDetails from "./components/TripDetails";
import FullMapPage from "./pages/FullMapPage";
import AllTripsPage from "./pages/AllTripsPage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// 1. Stable Navbar Helper
const ConditionalNavbar = () => {
  const location = useLocation();
  const isTripPage = location.pathname.includes("/trip/");
  const isSettingsPage = location.pathname === "/settings";
  return isTripPage || isSettingsPage ? <Navbar /> : null;
};

// --- WRAPPED CONTENT COMPONENT ---
function AppContent() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isCheckingAuth } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getTrips();
        setTrips(data || []);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, [isAuthenticated]);

  const handleNewTrip = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };
  
  const handleDeleteState = (id) =>
    setTrips((prev) => prev.filter((t) => t._id !== id));

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const activeTrips = trips.filter((trip) => new Date(trip.endDate) >= today);
  const sortedTrips = [...activeTrips].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate),
  );
  const upcomingTrips = sortedTrips.slice(0, 3);

  // Show a blank screen while checking JWT validity
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-orange-500 font-bold tracking-widest uppercase">
        Initializing Session...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0f0f0f] text-white w-full selection:bg-orange-500/30">
        <ConditionalNavbar />

        <Routes>
          {/* ==========================================
              PUBLIC ROUTES (No login required)
              ========================================== */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage trips={trips} />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ==========================================
              PROTECTED ROUTES (Must be logged in)
              ========================================== */}
        

          {/* THE OLD INLINE DASHBOARD (Preserved just in case) */}
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <div className="w-full">
                  <motion.section
                    className="py-16 md:py-24 px-4 md:px-6 border-b border-white/5 bg-gradient-to-b from-orange-500/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                      <h1 className="text-5xl md:text-8xl font-bold uppercase text-white tracking-wide">Journeys</h1>
                      <p className="text-[14px] md:text-[20px] text-orange-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">Your Personal Itineraries</p>
                      <div className="h-0.5 w-16 md:w-24 bg-orange-500 mx-auto mt-6 md:mt-8" />
                    </div>
                  </motion.section>

                  <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-16 md:space-y-24">
                    <TripForm onTripCreated={handleNewTrip} />
                    <div className="space-y-12 pb-20">
                      <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-6 md:gap-4">
                        <h2 className="text-2xl md:text-4xl px-4 border-l-4 border-r-4 rounded-full font-bold tracking-wider uppercase">Upcoming</h2>
                        {trips.length > 3 && (
                          <Link to="/journeys" className="text-black bg-orange-400 font-bold uppercase tracking-widest text-sm p-2 rounded-full hover:bg-white transition-colors">
                            View All ({trips.length})
                          </Link>
                        )}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {isLoading ? (
                          <div className="animate-spin h-8 w-8 border-t-2 border-orange-500 rounded-full mx-auto" />
                        ) : (
                          upcomingTrips.map((trip, idx) => (
                            <TripCard key={trip._id} trip={trip} idx={idx} onTripDeleted={handleDeleteState} />
                          ))
                        )}
                      </div>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/journeys"
            element={
              <ProtectedRoute>
                <AllTripsPage trips={sortedTrips} onTripDeleted={handleDeleteState} isLoading={isLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:id/details"
            element={
              <ProtectedRoute>
                <PlaceDetailsWrapper trips={trips} isLoading={isLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <TripDetailsPage trips={trips} setTrips={setTrips} onTripDeleted={handleDeleteState} isLoading={isLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:id/map"
            element={
              <ProtectedRoute>
                <FullMapWrapper trips={trips} isLoading={isLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage trips={trips} />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster position="top-center" theme="dark" richColors />
    </Router>
  );
}

// --- MAIN ENTRY POINT ---
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// --- RESTORED WRAPPERS ---
function PlaceDetailsWrapper({ trips, isLoading }) {
  const { id } = useParams();
  if (isLoading) return <div className="min-h-screen bg-black" />;
  const trip = trips.find((t) => t._id === id);
  return trip ? <PlaceDetailsPage trip={trip} /> : <div className="text-white p-10">Data Not Found</div>;
}

function FullMapWrapper({ trips, isLoading }) {
  const { id } = useParams();
  const trip = trips.find((t) => t._id === id);
  return isLoading || !trip ? <div className="min-h-screen bg-[#0f0f0f]" /> : <FullMapPage trip={trip} />;
}

function TripDetailsPage({ trips, setTrips, onTripDeleted, isLoading }) {
  const { id } = useParams();
  const trip = trips.find((t) => t._id === id);
  if (isLoading || !trip) return <div className="min-h-screen bg-[#0f0f0f]" />;
  return (
    <TripDetails
      trip={trip}
      onTripUpdated={(u) => setTrips(trips.map((t) => (t._id === u._id ? u : t)))}
      onTripDeleted={onTripDeleted}
    />
  );
}

export default App;