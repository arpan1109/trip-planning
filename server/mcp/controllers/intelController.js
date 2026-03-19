/**
 * @file intelController.js
 * @description AI generation integrated with high-precision POI geocoding sequentially.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import Trip from "../models/Trip.js";
import axios from "axios";
import apiService from "../logic/apiService.js";

const { getCoordinates } = apiService;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- 1. HIGH-PRECISION POI GEOCODER HELPER ---
const getLandmarkCoordinates = async (placeName, cityName, baseLat, baseLng) => {
  try {
    const query = encodeURIComponent(`${placeName} ${cityName}`);
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'User-Agent': 'MERN-Trip-Planner/1.0' }
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    // Safe Fallback: Anchors to the city center if the specific monument isn't found
    return {
      lat: baseLat + (Math.random() - 0.5) * 0.04,
      lng: baseLng + (Math.random() - 0.5) * 0.04
    };
  } catch (error) {
    return {
      lat: baseLat + (Math.random() - 0.5) * 0.04,
      lng: baseLng + (Math.random() - 0.5) * 0.04
    };
  }
};

// --- 2. MAIN AI CONTROLLER ---
export const getCityIntel = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Establish absolute baseline coordinates for the city first
    const cityCoords = await getCoordinates(trip.destinationCity);
    const baseLat = cityCoords?.lat || 0;
    const baseLng = cityCoords?.lon || 0;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `As a travel expert, provide JSON for ${trip.destinationCity}: {"description": "3-sentence overview", "cuisine": "2 sentences", "geography": "2 sentences", "attractions": [{"name": "Landmark", "desc": "Short bio"}]}. Exactly 5 attractions.`;

    const result = await model.generateContent(prompt);
    
    // Data is officially defined here
    const data = JSON.parse(result.response.text());

    // SEQUENTIAL GEOCODING LOOP
    const landmarksWithCoords = [];
    
    for (const item of data.attractions) {
      // Lowercase 'trip' to reference the database document
      const coords = await getLandmarkCoordinates(item.name, trip.destinationCity, baseLat, baseLng);
      
      landmarksWithCoords.push({
          name: item.name,
          desc: item.desc,
          lat: coords.lat,
          lng: coords.lng
      });

      // MANDATORY DELAY: Pause for 1 second so OpenStreetMap does not block us
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    trip.destinationInfo.description = data.description;
    trip.editorial = { localCuisine: data.cuisine, geography: data.geography };
    trip.landmarks = landmarksWithCoords;

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate AI intelligence" });
  }
};

export const generateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Calculate total days of the trip
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

// The hyper-constrained engineered prompt
    const prompt = `Act as an expert travel planner. Create a realistic, logical ${totalDays}-day itinerary for a trip to ${trip.destinationCity}.
    Return strictly in this JSON array format:
    [
      {
        "dayNumber": 1,
        "activities": [
          { "time": "09:00 AM", "title": "Morning Activity", "description": "Brief detail", "type": "Sightseeing" },
          { "time": "01:00 PM", "title": "Lunch", "description": "Brief detail", "type": "Dining" },
          { "time": "04:00 PM", "title": "Evening Activity", "description": "Brief detail", "type": "Sightseeing" }
        ]
      }
    ]
    CRITICAL RULES:
    1. 'type' MUST be exactly one of: 'Transit', 'Accommodation', 'Sightseeing', 'Dining'.
    2. You MUST provide EXACTLY 3 activities per day. NO MORE, NO LESS. If you provide 4 activities, the system will crash.
    3. Ensure times are sequential.`;

    const result = await model.generateContent(prompt);
    const itineraryData = JSON.parse(result.response.text());

    // Map the dates to each day number
    const mappedItinerary = itineraryData.map((day, index) => {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + index);
        return {
            ...day,
            date: currentDate,
        };
    });

    trip.itinerary = mappedItinerary;
    await trip.save();
    
    res.json(trip);
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
};