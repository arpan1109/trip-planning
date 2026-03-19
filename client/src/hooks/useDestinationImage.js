/**
 * @file useDestinationImage.js
 * @description Enhanced hook for high-quality, landmark-focused travel photography.
 */

import { useState, useEffect } from 'react';

export function useDestinationImage(destination) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) return;

    const fetchBestImage = async () => {
      try {
        setLoading(true);
        const accessKey = import.meta.env.VITE_UNSPLASH_KEY;
        
        // RECTIFIED: Improved query with specific descriptive keywords
        // Adding "landmark cityscape" forces Unsplash to ignore random street photos.
        const refinedQuery = `${destination} landmark monument landscape travel historic famous `;
        
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(refinedQuery)}&client_id=${accessKey}&per_page=15&orientation=landscape&content_filter=high`
        );
        
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        
        if (data.results.length === 0) {
          setError('No images found');
          return;
        }

        // IMPROVED SCORING: Focus on aspect ratio and relevance
        const bestImage = data.results
          .filter((img) => img.width > img.height) // Must be landscape orientation
          .sort((a, b) => {
            // Priority: Likes are a good indicator of cinematic quality
            return (b.likes || 0) - (a.likes || 0);
          })[0];

        if (bestImage) {
          setImage({
            url: bestImage.urls.regular, // Use full for high-end feel
            photographer: bestImage.user.name,
            link: bestImage.links.html
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestImage();
  }, [destination]);

  return { image, loading, error };
}