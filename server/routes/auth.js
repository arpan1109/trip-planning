/**
 * @file auth.js
 * @description Cleaned and updated with forgot-password logic.
 */
import { Router } from 'express';
import crypto from 'crypto'; 
import multer from 'multer'; // 1. RECTIFIED: Imported multer natively for ES Modules

import { signup, verifyEmail, login, logout, checkAuth } from '../mcp/controllers/authController.js';
import User from '../mcp/models/User.js'; 
import verifyToken from '../middleware/verifyToken.js'; 
import { sendPasswordResetEmail } from '../mcp/logic/emailService.js';

// 2. RECTIFIED: Imported the default config object, then destructured storage
import cloudinaryConfig from '../config/cloudinary.js';
const { storage } = cloudinaryConfig;

const router = Router();
const upload = multer({ storage }); // 3. RECTIFIED: Used the imported multer instance

// --- PUBLIC ROUTES (No Token Required) ---
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode; 
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

        await user.save(); // Triggers the fixed async pre-save hook

        // Send real email
        await sendPasswordResetEmail(user.email, resetCode);

        res.status(200).json({ 
            success: true, 
            message: "Verification code sent to your email." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during email dispatch." });
    }
});

router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // 1. Find the user first
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code." });
    }

    // 2. Assign the new plain-text password to the user object
    user.password = newPassword; 
    
    // 3. Clear the reset fields
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    // 4. IMPORTANT: Use .save() so the pre-save hook in User.js hashes it!
    await user.save(); 

    res.status(200).json({ success: true, message: "Password updated and hashed." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during reset." });
  }
});

// --- PROTECTED ROUTES (Token Required) ---
router.post('/logout', logout);
router.get('/check-auth', verifyToken, checkAuth);

// Kept only the latest Cloudinary-enabled profile route
router.put('/profile', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, phone, location, continent, bio } = req.body;
    const updateData = { name, email, phone, location, continent, bio };

    if (req.file) {
      updateData.avatar = req.file.path; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
});

export default router;