/**
 * @file tripController.js
 * @description Secure controller using JWT userId for authenticated CRUD operations.
 */

import Trip from '../models/Trip.js';
import axios from 'axios';
import apiService from '../logic/apiService.js';

const { getCoordinates, getForecastTemperature, getDestinationInfo } = apiService;

// --- Private Helper: Packing Logic ---
const getAutomaticPackingList = (temperature) => {
  const essentials = [];
  if (temperature < 10) {
    essentials.push({ name: "Heavy Winter Coat", quantity: 1, isPacked: false, category: "Clothing" });
    essentials.push({ name: "Winter Accessories (Cap, Gloves)", quantity: 1, isPacked: false, category: "Accessories" });
  } else if (temperature <= 35) {
    essentials.push({ name: "T-Shirt/Long-Sleeve Shirt", quantity: 3, isPacked: false, category: "Clothing" });
    essentials.push({ name: "Light Hoodie or Jacket", quantity: 1, isPacked: false, category: "Clothing" });
    essentials.push({ name: "Comfortable Jeans/Pants", quantity: 2, isPacked: false, category: "Clothing" });
  } else {
    essentials.push({ name: "Shorts", quantity: 2, isPacked: false, category: "Clothing" });
    essentials.push({ name: "Sunscreen", quantity: 1, isPacked: false, category: "Toiletries" });
    essentials.push({ name: "Swimsuit", quantity: 1, isPacked: false, category: "Clothing" });
  }
  essentials.push({ name: "Toothbrush & Paste", quantity: 1, isPacked: false, category: "Toiletries" });
  essentials.push({ name: "Phone Charger", quantity: 1, isPacked: false, category: "Electronics" });
  return essentials;
};

// --- 1. CREATE Trip ---
const createTrip = async (req, res) => {
  try {
    const { tripName, destinationCity, startDate, endDate } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const coords = await getCoordinates(destinationCity);
    if (!coords) return res.status(404).json({ success: false, message: "No Coordinates found." });

    const temp = await getForecastTemperature(coords.lat, coords.lon);
    const destinationDesc = await getDestinationInfo(destinationCity);

    let currency = "N/A";
    let language = "N/A";
    try {
      const cityName = destinationCity.split(',')[0].trim();
      const countryRes = await axios.get(`https://restcountries.com/v3.1/name/${cityName}`);
      if (countryRes.data && countryRes.data.length > 0) {
        const country = countryRes.data[0];
        currency = country.currencies ? Object.values(country.currencies)[0].name : "N/A";
        language = country.languages ? Object.values(country.languages)[0] : "N/A";
      }
    } catch (e) {
      console.warn("Country API Fetch failed.");
    }

    const packingList = temp !== null ? getAutomaticPackingList(temp) : [];

    // 'new Trip' is standard Mongoose instantiation, no change needed here
    const newTrip = new Trip({
      tripName,
      destinationCity,
      startDate,
      endDate,
      userId,
      packingList,
      destinationInfo: {
        description: destinationDesc,
        currentTemp: temp,
        weatherSummary: temp < 10 ? "Cold" : temp > 25 ? "Hot" : "Moderate",
        currency,
        language
      }
    });

    await newTrip.save();
    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during trip creation", error: error.message });
  }
};

// --- 2. READ User's Trips ---
const getTrips = async (req, res) => {
  try {
    // RECTIFIED: Call .find() directly on the Trip model
    const trips = await Trip.find({ userId: req.userId }).sort({ startDate: 1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// --- 3. UPDATE Trip/Items ---
const updateTrip = async (req, res) => {
  const tripId = req.params.id;
  const { itemId, isPacked } = req.body;
  try {
    if (itemId) {
      // RECTIFIED: Call .findOneAndUpdate() directly on the Trip model
      const trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId: req.userId, "packingList._id": itemId },
        { "$set": { "packingList.$.isPacked": isPacked } },
        { new: true }
      );
      if (!trip) return res.status(404).json({ message: 'Item or Trip not found.' });
      return res.status(200).json(trip);
    } else {
      const updatedTrip = await Trip.findOneAndUpdate(
        { _id: tripId, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!updatedTrip) return res.status(404).json({ message: 'Trip not found or unauthorized.' });
      return res.status(200).json(updatedTrip);
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// --- 4. DELETE Trip ---
const deleteTrip = async (req, res) => {
  try {
    // RECTIFIED: Call .findOneAndDelete() directly on the Trip model
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ message: 'Trip not found or unauthorized.' });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// --- 5. ADD Manual Item ---
const addManualItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category } = req.body;

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $push: { packingList: { name, quantity, category, isPacked: false } } },
      { new: true, runValidators: true } // Added runValidators to catch bad data
    );

    if (!updatedTrip) return res.status(404).json({ message: "Trip not found or unauthorized" });
    res.json(updatedTrip);
  } catch (error) {
    // RECTIFIED: Explicitly log the error to the backend terminal
    console.error("❌ ADD ITEM CRASH:", error); 
    res.status(500).json({ error: "Failed to add item", details: error.message });
  }
};

// --- 6. DELETE Item ---
const deleteItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $pull: { packingList: { _id: itemId } } },
      { new: true }
    );

    if (!updatedTrip) return res.status(404).json({ message: "Trip not found or unauthorized" });
    res.json(updatedTrip);
  } catch (error) {
    // RECTIFIED: Explicitly log the error to the backend terminal
    console.error("❌ DELETE ITEM CRASH:", error);
    res.status(500).json({ error: "Database deletion failed", details: error.message });
  }
};

export default { createTrip, getTrips, updateTrip, deleteTrip, addManualItem, deleteItem };