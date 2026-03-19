// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// router.get('/:cityName', async (req, res) => {
//   try {
//     const { cityName } = req.params;

//     // 1. Wikipedia Action API URL with the required parameters
//     const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&explaintext&pithumbsize=500&titles=${encodeURIComponent(cityName)}&origin=*&redirects=1`;

//     const response = await axios.get(url);
//     const pages = response.data.query.pages;
//     const pageId = Object.keys(pages)[0]; // Extract the dynamic PageID

//     // 2. If the city is not found
//     if (pageId === "-1") {
//       return res.json({ 
//         summary: `Explore the vibrant culture and history of ${cityName}.`,
//         image: null 
//       });
//     }

//     // 3. Return the clean summary and image URL
//     res.json({
//       summary: pages[pageId].extract,
//       image: pages[pageId].thumbnail?.source || null
//     });

//   } catch (error) {
//     res.json({ 
//       summary: `Welcome to ${req.params.cityName}! Information Hub is currently syncing.` 
//     });
//   }
// });

// module.exports = router;
// --- routes/cityInfo.js ---const express = require('express');
/**
//  * @file cityInfo.js
//  * @description Robust Wikipedia proxy with proper string formatting and fallback.
//  */
// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// router.get('/:cityName', async (req, res) => {
//     try {
//         const { cityName } = req.params;

//         // 1. FORMATTING: Ensure the first letter is capitalized for Wikipedia
//         const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

//         // 2. URL CONSTRUCTION: Using the formatted variable
//         const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(formattedCity)}&origin=*&redirects=1`;

//         // 3. FETCH: Adding a User-Agent header (Recommended by MediaWiki)
//         const response = await axios.get(wikiUrl, {
//             headers: { 'User-Agent': 'TravelAppProject/1.0 (your-email@example.com)' }
//         });

//         const pages = response.data.query.pages;
//         const pageId = Object.keys(pages)[0];

//         // 4. LOGIC: If PageID is -1, it means Wikipedia found no match
//         if (pageId === "-1") {
//             return res.json({
//                 summary: `Welcome to ${formattedCity}! Explore the unique culture and landmarks of this destination.`
//             });
//         }

//         // 5. SUCCESS: Send exactly what the frontend 'setWikiSummary' expects
//         res.json({ summary: pages[pageId].extract });

//     } catch (error) {
//         console.error("Internal Wiki Proxy Error:", error.message);
//         // 6. FALLBACK: Always return a valid 'summary' key to prevent frontend crashes
//         res.json({
//             summary: "Information hub is currently synchronizing local data. Please check back shortly."
//         });
//     }
// });

// module.exports = router;
import { Router } from 'express';
import { get } from 'axios';
const router = Router();


router.get('/:cityName', async (req, res) => {
    try {
        const { cityName } = req.params;
        const formattedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

        // Switch to mobile-sections to get the full article structure
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(formattedCity)}`;

        const response = await get(wikiUrl, {
            headers: { 'User-Agent': 'TravelAppProject/1.0' }
        });

        // 1. Extract the Lead (Summary)
        const leadSection = response.data.lead.sections[0].text;
        const cleanSummary = leadSection.replace(/<[^>]*>/g, ""); // Strip HTML tags

        // 2. Locate specific sections in the 'remaining' array
        const remainingSections = response.data.remaining.sections;
        
        // Use .find() to locate sections by their heading title
        const geoSection = remainingSections.find(s => s.line === "Geography" || s.line === "Topography");
        const cultureSection = remainingSections.find(s => s.line === "Culture" || s.line === "Cuisine" || s.line === "Gastronomy");

        // 3. Construct the full JSON response
        res.json({
            summary: cleanSummary,
            geography: geoSection ? geoSection.text.replace(/<[^>]*>/g, "").slice(0, 800) : "Geography data synchronizing...",
            cuisine: cultureSection ? cultureSection.text.replace(/<[^>]*>/g, "").slice(0, 800) : "Local flavor data synchronizing..."
        });

    } catch (error) {
        res.json({ 
            summary: "Hub is synchronizing data...", 
            geography: null, 
            cuisine: null 
        });
    }
});
export default router;