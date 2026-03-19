// import axios from 'axios';

// const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// // OpenWeatherMap 
// const OWM_GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
// const OWM_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';



// // City Coordinates
// const getCoordinates = async (city) => {
//   try {
//     const response = await get(OWM_GEO_URL, {
//       params: {
//         q: city,
//         limit: 1,
//         appid: WEATHER_API_KEY 
//       }
//     });

//     if (response.data.length === 0) return null;

//     const { lat, lon } = response.data[0];
//     return { lat, lon };
//   } catch (error) {
//     console.error(`Geocoding failed for ${city}:`, error.message);
//     return null; 
//   }
// };

// // --- 2.  Current Temperature for Coordinates.
// const getForecastTemperature = async (lat, lon) => {
//   try {
//     const response = await get(OWM_WEATHER_URL, {
//       params: {
//         lat: lat,
//         lon: lon,
//         units: 'metric', 
//         appid: WEATHER_API_KEY
//       }
//     });
   
//     return response.data.main.temp; 

//   } catch (error) {
//     console.error("Weather forecast failed:", error.message);
//     return null;
//   }
// };


// // --- 3. Destination Info Service: Fetching Facts (using Wikipedia) ---
// const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

// const getDestinationInfo = async (city) => {
//   try {
//     // 1. URL-encode the city name to handle spaces and special characters
//     const encodedCity = encodeURIComponent(city); 
    
//     const response = await get(WIKI_API_URL, {
//       params: {
//         action: 'query',
//         format: 'json',
//         prop: 'extracts',
//         exintro: true,
//         explaintext: true,
//         titles: encodedCity // Use the encoded name
//       }, 
//      headers: {
//         'User-Agent': 'InteractiveTripPlanner/1.0 (https://your-app-domain.com)',
//       },
//     });

//     const pages = response.data.query.pages;
    
//     // Check if the query returned any pages and if the first page key is valid
//     const pageId = Object.keys(pages)[0];
    
//     // Check for "missing" property which means no article was found
//     if (pages[pageId].missing !== undefined) {
//       return "No detailed information found for this destination on Wikipedia.";
//     }

//     const extract = pages[pageId].extract; 

//     return extract || "No detailed information found for this destination.";
//   } catch (error) {
//     // Return a console error, but allow the rest of the application to function
//     console.error("Destination Info API error:", error.message);
//     return "Failed to fetch destination information due to an internal API error.";
//   }
// };

// export default { 
//   getCoordinates, 
//   getForecastTemperature, 
//   getDestinationInfo 
// };
import axios from 'axios'; // RECTIFIED: Using default import for Axios

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// OpenWeatherMap 
const OWM_GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const OWM_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

// City Coordinates
const getCoordinates = async (city) => {
  try {
    // RECTIFIED: Used axios.get()
    const response = await axios.get(OWM_GEO_URL, {
      params: {
        q: city,
        limit: 1,
        appid: WEATHER_API_KEY 
      }
    });

    if (response.data.length === 0) return null;

    const { lat, lon } = response.data[0];
    return { lat, lon };
  } catch (error) {
    console.error(`Geocoding failed for ${city}:`, error.message);
    return null; 
  }
};

// --- 2.  Current Temperature for Coordinates.
const getForecastTemperature = async (lat, lon) => {
  try {
    // RECTIFIED: Used axios.get()
    const response = await axios.get(OWM_WEATHER_URL, {
      params: {
        lat: lat,
        lon: lon,
        units: 'metric', 
        appid: WEATHER_API_KEY
      }
    });
    
    return response.data.main.temp; 

  } catch (error) {
    console.error("Weather forecast failed:", error.message);
    return null;
  }
};

// --- 3. Destination Info Service: Fetching Facts (using Wikipedia) ---
const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

const getDestinationInfo = async (city) => {
  try {
    // 1. URL-encode the city name to handle spaces and special characters
    const encodedCity = encodeURIComponent(city); 
    
    // RECTIFIED: Used axios.get()
    const response = await axios.get(WIKI_API_URL, {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        titles: encodedCity // Use the encoded name
      }, 
     headers: {
       'User-Agent': 'InteractiveTripPlanner/1.0 (https://your-app-domain.com)',
     },
    });

    const pages = response.data.query.pages;
    
    // Check if the query returned any pages and if the first page key is valid
    const pageId = Object.keys(pages)[0];
    
    // Check for "missing" property which means no article was found
    if (pages[pageId].missing !== undefined) {
      return "No detailed information found for this destination on Wikipedia.";
    }

    const extract = pages[pageId].extract; 

    return extract || "No detailed information found for this destination.";
  } catch (error) {
    // Return a console error, but allow the rest of the application to function
    console.error("Destination Info API error:", error.message);
    return "Failed to fetch destination information due to an internal API error.";
  }
};

export default { 
  getCoordinates, 
  getForecastTemperature, 
  getDestinationInfo 
};