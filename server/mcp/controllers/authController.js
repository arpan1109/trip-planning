/**
 * @file authController.js
 * @description Controllers for JWT authentication, email verification, and profile management.
 */

// RECTIFIED: Import the default User model
import User from '../models/User.js';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../logic/emailService.js';

export async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // RECTIFIED: Call findOne on the User model
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // RECTIFIED: Call create on the User model
        const user = await User.create({
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours
            bio: "Passionate explorer.",
            location: "Global Citizen"
        });

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send Email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({ 
            success: true, 
            message: "User created. Verification email sent!",
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } 
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- 2. LOGIN ---
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        
        // RECTIFIED: Call findOne on the User model
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ 
            success: true, 
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// --- 3. VERIFY EMAIL (Upgraded with Diagnostics) ---
export async function verifyEmail(req, res) {
    const { code } = req.body;
    
    try {
        // 1. Diagnostic Logging: See exactly what the frontend sent
        console.log("--- EMAIL VERIFICATION INITIATED ---");
        console.log(`Raw Code Received: '${code}'`);
        console.log(`Type of Code: ${typeof code}`);

        // 2. Data Sanitization: Force to string and strip invisible spaces
        const cleanCode = String(code).trim();
        
        // 3. Robust Database Query: Use 'new Date()' for safer Mongoose casting
        const user = await User.findOne({
            verificationToken: cleanCode,
            verificationTokenExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            // 4. Diagnostic Logging: Point out exactly why it failed
            console.log("❌ FAILED: Database rejected the code.");
            console.log("Reason: Either the code doesn't exist, has a typo, or the expiration time has passed.");
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }

        // 5. Success State
        console.log("✅ SUCCESS: User verified.");
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Server Error in verifyEmail:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
// --- 4. CHECK AUTH ---
export async function checkAuth(req, res) {
    try {
        // RECTIFIED: Call findById on the User model
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// --- 5. LOGOUT ---
export async function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
}

// --- 6. UPDATE PROFILE ---
export async function updateProfile(req, res) {
    try {
        const updates = req.body;
        if (req.file) updates.avatar = req.file.path;

        // RECTIFIED: Call findByIdAndUpdate on the User model
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
}