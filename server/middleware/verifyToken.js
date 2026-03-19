/**
 * @file verifyToken.js
 * @description Middleware to protect routes by validating the JWT stored in cookies.
 */

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    console.log("token" ,req.cookies)
    const token = req.cookies.token;

    if (!token) {
        // MUST return a response, otherwise the frontend stays "pending"
        return res.status(401).json({ success: false, message: "Unauthorized - No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
export default verifyToken;