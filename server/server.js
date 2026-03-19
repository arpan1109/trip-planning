// // 1. Load environment variables FIRST
// // require('dotenv').config(); 
// import 'dotenv/config';
// import express, { json } from 'express';
// import cors from 'cors'; 
// import cookieParser from 'cookie-parser';
// import connectDB from './config/db.js';

// // 2. Import Routes
// import tripRoutes from './routes/tripRoutes.js';
// import cityInfoRoutes from './routes/cityInfo.js';
// import authRoutes from './routes/auth.js';

// // 3. Connect to Database
// connectDB();

// const app = express();

// // 4. --- Middleware Setup ---

// // CORS MUST be configured before all other middlewares/routes
// app.use(cors({
//     // Using a single string instead of an array is often more stable for local dev
//     origin: "http://localhost:5173", 
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Body parser and Cookie parser must be before routes
// app.use(json());
// app.use(cookieParser());

// // 5. --- Route Definitions ---
// // Important: city-info usually doesn't need auth, but trips does.
// app.use('/api/city-info', cityInfoRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/trips', tripRoutes); 

// // 6. --- Server Start ---
// const PORT = process.env.PORT || 5000; 
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`CORS allowed for: http://localhost:5173`);
// });

import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Import Routes - Ensure these files exist in your 'routes' folder
import tripRoutes from './routes/tripRoutes.js';
import authRoutes from './routes/auth.js';

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(json());
app.use(cookieParser());

// Route Definitions
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes); 

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});