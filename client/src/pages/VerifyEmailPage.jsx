import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "sonner";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await API.post("/auth/verify-email", { code });
      if (data.success) {
        toast.success("Account Verified!");
        await checkAuth(); // Refresh the isVerified state in context
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111] p-10 rounded-3xl border border-white/5 text-center">
        <h2 className="text-3xl font-bold uppercase text-white mb-2">Verify Your Email</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Enter the 6-digit code sent to your inbox</p>
        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-black border border-white/10 p-5 rounded-2xl text-center text-2xl tracking-[1em] text-orange-500 outline-none focus:border-orange-500/50"
            placeholder="000000"
            required
          />
          <button 
            disabled={isLoading}
            className="w-full py-5 bg-orange-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Confirm Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;