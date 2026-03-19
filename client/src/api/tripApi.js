

// import axios from 'axios';

// // IMPORTANT: This must match the port your Node.js server is running on (port 5000)
// const BASE_URL = 'http://localhost:5000/api/trips'; 

// // --- 1. CREATE Trip (POST) ---
// export const createTrip = async (tripData) => {
//   try {
//     const response = await axios.post(BASE_URL, tripData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error creating trip:", error.response || error);
//     throw error;
//   }
// };

// // --- 2. READ Trips (GET) ---
// export const getTrips = async () => {
//   try {
//     const response = await axios.get(BASE_URL); 
//     return response.data; // Array of trip objects
//   } catch (error) {
//     console.error("Error fetching trips:", error.response || error);
//     throw error;
//   }
// };

// // --- 3. UPDATE Item Status (PUT) ---
// export const updatePackingItemStatus = async (tripId, itemId, isPacked) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/${tripId}`, {
//       itemId,
//       isPacked
//     });
//     return response.data; 
//   } catch (error) {
//     console.error("Error updating packing item status:", error.response || error);
//     throw error;
//   }
// };

// // --- 4. DELETE Trip (DELETE) ---
// export const deleteTrip = async (tripId) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/${tripId}`);
//     return response.data; 
//   } catch (error) {
//     console.error("Error deleting trip:", error.response || error);
//     throw error;
//   }
// };

// export const addManualItem = async (tripId, itemData) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/${tripId}/items`, itemData);
//     return response.data; // Returns the updated trip object
//   } catch (error) {
//     console.error("Error adding manual item:", error.response || error);
//     throw error;
//   }
// };
// export const removeItemFromList = async (tripId, itemId) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/${tripId}/items/${itemId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error removing item:", error);
//     throw error;
//   }
// };
/**
 * @file tripApi.js
 * @description Secure API handler using the central Axios instance for authorized requests.
 */

import API from './axios'; // RECTIFIED: Use your custom instance instead of raw axios

const BASE_URL = '/trips'; // Simplified because API instance already has the base URL

// --- 1. GEOCODING (Keep as fetch, it's a public external API) ---
export const getCityCoords = async (cityName) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error("Geocoding failed:", error);
        return null;
    }
};

// --- 2. CREATE Trip (POST) ---
export const createTrip = async (tripData) => {
  try {
    // RECTIFIED: Now automatically sends cookies via API instance
    const response = await API.post(BASE_URL, tripData);
    return response.data; 
  } catch (error) {
    console.error("Error creating trip:", error.response || error);
    throw error;
  }
};

// --- 3. READ Trips (GET) ---
export const getTrips = async () => {
  try {
    const response = await API.get(BASE_URL); 
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error.response || error);
    throw error;
  }
};

// --- 4. UPDATE Item Status (PUT) ---
export const updatePackingItemStatus = async (tripId, itemId, isPacked) => {
  try {
    const response = await API.put(`${BASE_URL}/${tripId}`, {
      itemId,
      isPacked
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating packing item status:", error.response || error);
    throw error;
  }
};

// --- 5. DELETE Trip (DELETE) ---
export const deleteTrip = async (tripId) => {
  try {
    const response = await API.delete(`${BASE_URL}/${tripId}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting trip:", error.response || error);
    throw error;
  }
};

// --- 6. PACKING LIST UTILITIES ---
export const addManualItem = async (tripId, itemData) => {
  try {
    const response = await API.post(`${BASE_URL}/${tripId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error adding manual item:", error.response || error);
    throw error;
  }
};

// --- 7. GET CITY INTEL (Editorial & Landmarks) ---
export const getCityIntel = async (tripId) => {
  try {
    const response = await API.get(`${BASE_URL}/${tripId}/intel`);
    return response.data;
  } catch (error) {
    console.error("Error fetching city intel:", error);
    throw error;
  }
};

export const generateTripItinerary = async (tripId) => {
  try {
    const response = await API.post(`${BASE_URL}/${tripId}/itinerary`);
    return response.data;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

export const removeItemFromList = async (tripId, itemId) => {
  try {
    const response = await API.delete(`${BASE_URL}/${tripId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
};