// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1]; // Expected: Bearer <token>
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userData = decoded; // Attach user info to the request [cite: 2025-12-12]
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Authentication failed" });
//   }
// };
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // 1. SIGNUP ROUTE: Creates a new user [cite: 2025-12-12]
// router.post('/signup', authController.signup);

// // 2. LOGIN ROUTE: Verifies credentials and issues JWT [cite: 2025-12-12]
// router.post('/login', authController.login);

// module.exports = router;