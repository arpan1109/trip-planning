/**
 * @file ProfilePage.jsx
 * @description Persistent Editorial Profile connected to global AuthContext.
 */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import API from "../api/axios";
import {
  User,
  MapPin,
  ChevronLeft,
  Edit3,
  Briefcase,
  Heart,
  X,
  Check,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // IMPORT CONTEXT

const ProfilePage = ({ trips = [] }) => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 md:pt-22 p-4 md:p-12 lg:px-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors mb-4 md:mb-6 group"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="uppercase font-bold tracking-[0.2em] text-xs md:text-sm">
          Back
        </span>
      </button>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-6 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="size-28 md:size-40 rounded-full border-2 border-orange-500/50 overflow-hidden bg-orange-500/10 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] shrink-0">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                className="w-full h-full object-cover"
                alt="Profile"
          
              />
            ) : (
              <User size={48} className="md:size-[64px] text-orange-500" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter mb-2 break-words">
              {profileData.name}
            </h1>
            <p className="text-[15px] text-white/70 uppercase font-semibold tracking-wide">
              Explorer rank
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10 md:space-y-12">
          <section>
            <h3 className="text-xl md:text-2xl text-orange-400 font-black uppercase tracking-wider mb-3">
              Personal Information
            </h3>
            <div className="bg-white/20 h-1 w-12 rounded-full mb-6"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 md:gap-y-10 gap-x-12">
              <InfoField label="Email Address" value={profileData.email} />
              <InfoField label="Phone Number" value={profileData.phone} />
              <InfoField label="Location" value={profileData.location} />
              <InfoField
                label="Favorite Continent"
                value={profileData.continent}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl md:text-2xl text-orange-400 font-semibold uppercase mb-3">
              Bio
            </h3>
            <p className="leading-relaxed max-w-2xl text-base md:text-lg text-white/70">
              {profileData.bio || "No bio added yet."}
            </p>
          </section>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            user={profileData}
            onClose={() => setIsEditModalOpen(false)}
            onSave={async (updatedForm, file) => {
              // Accept the file object
              try {
                const formData = new FormData();

                // 2. Append all text fields
                formData.append("name", updatedForm.name);
                formData.append("email", updatedForm.email);
                formData.append("phone", updatedForm.phone);
                formData.append("location", updatedForm.location);
                formData.append("continent", updatedForm.continent);
                formData.append("bio", updatedForm.bio);
                if (file) {
                  formData.append("avatar", file);
                }

                // 4. API Call with Multipart Headers
                const response = await API.put("/auth/profile", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.status === 200) {
                  setProfileData((prev) => ({
                    ...prev,
                    ...response.data.user, // The backend returns new Cloudinary URL
                  }));
                  setIsEditModalOpen(false);
                  toast.success("Profile Synchronized");
                }
              } catch (err) {
                console.error("Upload Error:", err);
                toast.error("Failed to sync profile imagery");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS (Modal remains mostly same, using internal form state) ---
const EditProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState(user);
  //Store the actual file object here
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-[#161616] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Edit Profile
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-center mb-10">
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative group size-28 rounded-full border-2 border-dashed border-orange-500/30 flex items-center justify-center bg-orange-500/5 cursor-pointer overflow-hidden"
          >
            {form.avatar ? (
              <img
                src={form.avatar}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <User size={32} className="text-orange-500/50" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ModalInput
            label="Display Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <ModalInput
            label="Email Address"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <ModalInput
            label="Phone Number"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <ModalInput
            label="Location"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />
          <ModalInput
            label="Favorite Continent"
            value={form.continent}
            onChange={(v) => setForm({ ...form, continent: v })}
          />

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-2 ml-1">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl h-24 outline-none focus:border-orange-500/50 transition-colors resize-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="py-4 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form, selectedFile)}
            className="py-4 bg-orange-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg"
          >
            <Check size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// (MetricCard, InfoField, ModalInput helpers stay same as your original)
const ModalInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-2 ml-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500/50 transition-colors text-sm"
    />
  </div>
);

const MetricCard = ({ icon: Icon, label, value }) => (
  // RECTIFIED: Reduced padding for mobile (p-5 vs p-8)
  <div className="bg-[#161616]/40 border border-white/5 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center text-center">
    <Icon className="text-orange-500 mb-2 md:mb-4" size={24} md:size={28} />
    <span className="text-2xl md:text-4xl font-black mb-1 tracking-tighter">
      {value}
    </span>
    <span className="text-[8px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">
      {label}
    </span>
  </div>
);
const InfoField = ({ label, value }) => (
  <div className="border-l border-white/5 pl-4">
    <span className="block text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-1 md:mb-2">
      {label}
    </span>
    <span className="text-sm md:text-lg font-bold break-all">
      {value || "N/A"}
    </span>
  </div>
);

export default ProfilePage;
