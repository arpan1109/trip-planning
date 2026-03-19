import { connect } from 'mongoose';

// The URI is read from your .env file
const CONNECTION_URL = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    const conn = await connect(CONNECTION_URL);
    
    // Success log
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Failure log
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit with a failure code if DB connection is crucial
    process.exit(1); 
  }
};

export default connectDB;