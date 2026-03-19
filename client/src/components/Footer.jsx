import React from "react";
import { Link } from "react-router-dom";
import { Compass, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-4 md:px-8 mt-auto w-full z-20 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
        
        {/* BRANDING SECTION */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-white mb-4">
            <Compass className="text-orange-500" size={28} />
            <span className="text-xl font-black uppercase tracking-widest">
              Journeys<span className="text-orange-500">.</span>
            </span>
          </div>
          <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6">
            Stop planning and start exploring. Generate hyper-personalized itineraries, manage your packing lists, and map out your next adventure in seconds with AI intelligence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/30 hover:text-orange-500 transition-colors cursor-pointer"><Twitter size={20} /></a>
            <a href="#" className="text-white/30 hover:text-orange-500 transition-colors cursor-pointer"><Instagram size={20} /></a>
            <a href="#" className="text-white/30 hover:text-orange-500 transition-colors cursor-pointer"><Github size={20} /></a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Explore</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">Home</Link></li>
            <li><Link to="/dashboard" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">Dashboard</Link></li>
            <li><Link to="/my-trips" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">My Trips</Link></li>
          </ul>
        </div>

        {/* LEGAL / SUPPORT */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Support</h4>
          <ul className="space-y-4">
            <li><Link to="#" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="text-white/50 hover:text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} Journeys. All rights reserved.
        </p>
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          Built with <span className="text-orange-500 text-sm">♥</span> for Explorers
        </p>
      </div>
    </footer>
  );
};

export default Footer;