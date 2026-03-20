// This utility signs a token containing the userId and attaches it to a secure, HTTP-only cookie.

import { sign } from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, userId) => {
    const token = sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

res.cookie("token", token, {
  httpOnly: true,
  // CRITICAL FOR VERCEL: Allows cookies to be sent across different domains
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (or whatever you currently have)
});

    return token;
};

export default { generateTokenAndSetCookie };