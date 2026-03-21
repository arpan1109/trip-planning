import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Import Routes
import tripRoutes from './routes/tripRoutes.js';
import authRoutes from './routes/auth.js';

// Connect to Database
connectDB();

const app = express();
app.set("trust proxy", 1)

// --- CRITICAL UPDATE: DYNAMIC CORS ---
// This allows localhost during development, but uses your live Vercel frontend URL in production
const allowedOrigins = [
  "http://localhost:5173", 
  "https://journeys-client.vercel.app" // Add this exact line! (No trailing slash)
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(json());
app.use(cookieParser());

// Route Definitions
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes); 

// --- CRITICAL UPDATE: VERCEL SERVERLESS LOGIC ---
// Only listen to the port if we are running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export the app for Vercel's serverless functions (ES Module format)
export default app;