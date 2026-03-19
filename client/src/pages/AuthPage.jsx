// /**
//  * @file AuthPage.jsx
//  * @description Editorial Split-Screen Auth Page with dynamic password visibility.
//  */
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Compass, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const[isloading, setIsLoading]=useState(false);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log(`Attempting ${isLogin ? "Login" : "Signup"} for:`, formData.email);
// //   };

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Choose the endpoint based on the current mode
//     const endpoint = isLogin
//       ? "http://localhost:5000/api/auth/login"
//       : "http://localhost:5000/api/auth/signup";

//     try {
//       const response = await axios.post(endpoint, formData);

//       if (response.data.status === "success") {
//         // 4. SESSION STORAGE: Store traveler profile
//         localStorage.setItem("atlas-user-profile", JSON.stringify(response.data.user));

//         // Success feedback and redirection
//         console.log("Welcome to Journeys!", response.data.user.name);
//         navigate("/");
//       }
//     } catch (err) {
//       // 5. ERROR HANDLING
//       const errorMsg = err.response?.data?.message || "Something went wrong";
//       alert(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (

//     <div className="min-h-screen bg-black flex flex-col lg:grid lg:grid-cols-2 selection:bg-orange-500/30">

//       {/* LEFT COLUMN: HERO SECTION */}
//       <section className="hidden lg:flex flex-col justify-center px-20 border-r border-white/5 relative overflow-hidden bg-[#0a0a0a]">
//         <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
//              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

//         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
//           <div className="bg-[#FA9B2E] size-16 rounded-3xl flex items-center shadow-md justify-center mb-10">
//             <Compass className="text-black size-12" />
//           </div>
//           <h1 className="text-7xl font-bold uppercase tracking-tighter leading-none mb-6">
//             The World <br /> <span className="text-[#FA9B2E] tracking-normal">Awaits.</span>
//           </h1>
//           <p className="text-white/70 text-lg leading-relaxed max-w-md mb-12">
//             Join a community of modern explorers.
//             <br />Make your <span className="text-[#FA9B2E] font-bold">Journeys</span>, discover hidden gems, and navigate the globe.
//           </p>
//         </motion.div>
//       </section>

//       {/* RIGHT COLUMN: FORM SECTION */}
//       <section className="flex-1 flex items-center justify-center p-6 md:p-12">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
//           <header className="mb-12">
//             <h2 className="text-4xl font-bold uppercase tracking-normal mb-2">
//               {isLogin ? "Welcome Back" : "Begin Journey"}
//             </h2>
//             <p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.1rem]">
//               {isLogin ? "Enter your credentials to continue" : "Create your explorer profile"}
//             </p>
//           </header>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <AnimatePresence mode="wait">
//               {!isLogin && (
//                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
//                   <AuthInput icon={User} placeholder="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <AuthInput icon={Mail} placeholder="name@atlas.com" type="email" label="Email Address" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />

//             <div className="space-y-2">
//               <div className="flex justify-between items-center px-1">
//                 <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">Password</label>
//                 {isLogin && <button type="button" className="text-[10px] font-black uppercase text-[#FA9B2E] hover:underline">Forgot Password?</button>}
//               </div>

//               {/* 2. BIND VISIBILITY TOGGLE */}
//               <AuthInput
//                 icon={Lock}
//                 placeholder="Enter Password"
//                 // Switch type dynamically
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={(v) => setFormData({...formData, password: v})}
//                 // Pass toggle logic
//                 isPassword={true}
//                 showPassword={showPassword}
//                 toggleVisibility={() => setShowPassword(!showPassword)}
//               />
//             </div>

//             <button className="w-full py-5 bg-[#FA9B2E] text-black rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95 group mt-8">
//               {isLogin ? "Sign In" : "Create Account"}
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </form>

//           <footer className="mt-12 text-center">
//             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
//               {isLogin ? "Don't have an account?" : "Already an explorer?"}
//               <button onClick={() => setIsLogin(!isLogin)} className="ml-3 text-white hover:text-[#FA9B2E] transition-colors">
//                 {isLogin ? "Sign Up" : "Sign In"}
//               </button>
//             </p>
//           </footer>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// const AuthInput = ({ icon: Icon, label, isPassword, showPassword, toggleVisibility, onChange, ...props }) => (
//   <div className="space-y-2">
//     {label && <label className="block text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">{label}</label>}
//     <div className="relative group">
//       <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FA9B2E] transition-colors" size={18} />

//       <input
//         {...props}
//         /* FIXED: Explicitly handle the string conversion here */
//         onChange={(e) => onChange(e.target.value)}
//         className={`w-full bg-[#111] border border-white/5 p-5 pl-14 ${isPassword ? 'pr-14' : ''} rounded-2xl outline-none focus:border-[#FA9B2E]/50 transition-all text-sm text-white placeholder:text-white/10 font-medium`}
//       />

//       {isPassword && (
//         <button
//           type="button"
//           onClick={toggleVisibility}
//           className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       )}
//     </div>
//   </div>
// );
// export default AuthPage;

/**
 * @file AuthPage.jsx
 * @description Editorial Split-Screen Auth Page tuned for JWT backend integration.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. IMPORT AUTH CONTEXT
import API from "../api/axios"; // 2. IMPORT CUSTOM AXIOS INSTANCE
import { toast } from "sonner"; // Assuming you use Sonner for editorial-style alerts
import ForgotPasswordPage from "./ForgotPasswordPage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // 3. GRAB SESSION HYDRATION FUNCTION

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Choose endpoint based on mode
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";

    try {
      const response = await API.post(endpoint, formData);

      if (response.data.success) {
        // Matching our backend's "success" boolean
        // 4. HYDRATE SESSION: This pulls the full profile from MongoDB
        await checkAuth();

        toast.success(isLogin ? "Welcome Back!" : "Journey Started!");
        navigate("/my-trips");
      }
    } catch (err) {
      // 5. IMPROVED ERROR HANDLING
      const errorMsg = err.response?.data?.message || "Authentication failed";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:grid lg:grid-cols-2 selection:bg-orange-500/30">
      {/* LEFT COLUMN: HERO SECTION */}
      <section className="hidden lg:flex flex-col justify-center px-20 border-r border-white/5 relative overflow-hidden bg-[#0a0a0a]">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-[#FA9B2E] size-16 rounded-3xl flex items-center shadow-md justify-center mb-10">
            <Compass className="text-black size-12" />
          </div>
          <h1 className="text-7xl font-bold uppercase tracking-tighter leading-none mb-6">
            The World <br />{" "}
            <span className="text-[#FA9B2E] tracking-normal">Awaits.</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-md mb-12">
            Join a community of modern explorers.
            <br />
            Make your <span className="text-[#FA9B2E] font-bold">Journeys</span>
            , discover hidden gems, and navigate the globe.
          </p>
        </motion.div>
      </section>

      {/* RIGHT COLUMN: FORM SECTION */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <header className="mb-12">
            <h2 className="text-4xl font-bold uppercase tracking-normal mb-2">
              {isLogin ? "Welcome Back" : "Begin Journey"}
            </h2>
            <p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.1rem]">
              {isLogin
                ? "Enter your credentials to continue"
                : "Create your explorer profile"}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AuthInput
                    icon={User}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AuthInput
              icon={Mail}
              placeholder="name@atlas.com"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[10px] font-black uppercase text-[#FA9B2E] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <AuthInput
                icon={Lock}
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(v) => setFormData({ ...formData, password: v })}
                isPassword={true}
                showPassword={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-5 bg-[#FA9B2E] text-black rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl active:scale-95 group mt-8 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              {isLogin ? "Don't have an account?" : "Already an explorer?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-3 text-white hover:text-[#FA9B2E] transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </footer>
        </motion.div>
      </section>
    </div>
  );
};

const AuthInput = ({
  icon: Icon,
  label,
  isPassword,
  showPassword,
  toggleVisibility,
  onChange,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      <Icon
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FA9B2E] transition-colors"
        size={18}
      />

      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#111] border border-white/5 p-5 pl-14 ${isPassword ? "pr-14" : ""} rounded-2xl outline-none focus:border-[#FA9B2E]/50 transition-all text-sm text-white placeholder:text-white/10 font-medium`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  </div>
);

export default AuthPage;
