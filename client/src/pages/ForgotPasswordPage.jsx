/**
 * @file ForgotPasswordPage.jsx
 * @description Responsive, high-fidelity recovery interface with mobile-first scaling.
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSendLink = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     await API.post("/auth/forgot-password", { email });
  //     toast.success("Reset token sent.");
  //     navigate("/reset-password", { state: { email } });
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Communication failure.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSendLink = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 1. Backend generates the 6-digit code
    const response = await API.post("/auth/forgot-password", { email });
    
    if (response.status === 200) {
      toast.success("Security code generated.");
      
      // 2. RECTIFIED: Pass email in state so the unified page knows who you are
      navigate("/reset-password", { state: { email } });
    }
  } catch (err) {
    // If the email is wrong, stay here and show error
    toast.error(err.response?.data?.message || "User identification failed.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
      {/* BACK NAVIGATION - Adjusted for better touch targets on mobile */}
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-6 md:top-9 left-6 md:left-9 flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-xs md:text-[18px] font-bold z-50"
      >
        <ChevronLeft className="size-4 md:size-6" /> Back to Login
      </button>

      {/* CENTRAL AUTH CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl relative shadow-orange-500/10 overflow-hidden"
      >
        {/* ICON HEADER */}
        <div className="size-14 md:size-16 bg-orange-400/10 border border-orange-400/20 rounded-2xl flex items-center justify-center mb-8 md:mb-10">
          <Mail className="text-orange-400 size-6 md:size-7" />
        </div>

        {/* TYPOGRAPHY - Fluid scaling for mobile-to-desktop */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl text-white md:text-6xl font-black uppercase tracking-tight leading-1 mb-4">
            Reset <br />
            <span className="text-orange-400">Password</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-[300px]">
            Enter your email for regenerating password.
          </p>
        </header>

        {/* FORM SECTION */}
        <form onSubmit={handleSendLink} className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label className="md:text-[19px] text-[10px]  text-white/80 tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter recovery email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl outline-none focus:border-orange-400/80 focus:ring-1 focus:ring-orange-400/60 transition-all  placeholder:text-white/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 md:py-5 bg-orange-400 text-black rounded-2xl font-black uppercase text-[10px] md:text-lg tracking-widest flex items-center justify-center gap-3 hover:bg-white/70 transition-all shadow-[0_15px_40px_rgba(249,115,22,0.15)] active:scale-[0.98] disabled:opacity-50 "
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Send Reset Link</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
