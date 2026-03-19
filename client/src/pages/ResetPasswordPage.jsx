/**
 * @file ResetPasswordPage.jsx
 * @description Unified portal for security code verification and credential update.
 */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // RECTIFIED: Extracting the email from the navigation state passed from ForgotPasswordPage
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please re-enter your email.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const [formData, setFormData] = useState({
    code: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Credentials do not match.");
    }

    setLoading(true);
    try {
      // RECTIFIED: Using the correctly identified 'email' variable
      const response = await API.post("/auth/reset-password", {
        email: email,
        code: formData.code,
        newPassword: formData.password
      });

      if (response.status === 200) {
        toast.success("Security vault updated.");
        // Delay navigation to allow the user to see the success message
        setTimeout(() => navigate("/auth"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#111]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative shadow-orange-500/10"
      >
        <div className="size-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-10">
          <ShieldAlert className="text-orange-500" size={32} />
        </div>

        <header className="mb-3">
          <h1 className="text-4xl md:text-5xl tracking-tighter">
            Reset <span className="text-orange-400">Access</span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">
            {/* RECTIFIED: Displaying the correctly identified email */}
            {/* Identity: <span className="text-white">{email || "Initializing..."}</span> */}
          </p>
        </header>

        <form onSubmit={handleReset} className="space-y-6">
          {/* 6-DIGIT CODE FIELD */}
          <div className="space-y-2">
            <label className="md:text-[16px] text-[12px] text-white tracking-widest ml-1">
              Security Code
            </label>
            <input
              type="text"
              required
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-xl font-black tracking-[0.5em] outline-none focus:border-orange-500/50 transition-all"
            />
          </div>

          {/* NEW PASSWORD FIELD */}
          <div className="space-y-2">
            <label className="md:text-[16px] text-[12px] text-white tracking-widest ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="******"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-400 transition-all font-bold"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="space-y-2">
            <label className="md:text-[16px] text-[12px] text-white tracking-widest ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="******"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-400 transition-all font-bold"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 md:text-[18px] bg-orange-400 font-black uppercase text-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_15px_40px_rgba(249,115,22,0.15)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>Finalize Sync <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;