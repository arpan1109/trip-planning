// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// RECTIFIED: Destructure from the default imports to avoid ESM conflicts
const { Schema, model } = mongoose;
const { genSalt, hash, compare } = bcrypt;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    avatar: { type: String, default: null }, 
    bio: { type: String, default: "Passionate explorer." },
    location: { type: String, default: "Global Citizen" },
    phone: { type: String, default: "" },
    continent: { type: String, default: "Asia" },
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    since: { type: String, default: () => new Date().getFullYear().toString() }
}, { timestamps: true });

/**
 * RECTIFIED: Async Pre-Save Hook
 * Removed 'next' to fix the TypeError: next is not a function.
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await compare(candidatePassword, this.password);
};

export default model('User', userSchema);