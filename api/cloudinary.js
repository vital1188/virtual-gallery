'use strict';

const API_ENDPOINT = '/.netlify/functions/getArtworks'; // Add this line



module.exports = {
    /**
     * Fetch a list of artworks with pagination.
     * @param {number} from - Starting index.
     * @param {number} count - Number of artworks to fetch.
     * @returns {Promise<Array>} - Array of artwork objects.
     */
    fetchList: async function (from, count) {
        try {
            const response = await fetch(`${API_ENDPOINT}?from=${from}&count=${count}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(`Fetched ${data.length} artworks from index ${from}`);
            return data;
        } catch (error) {
            console.error('Error fetching artworks list:', error);
            return [];
        }
    },

    /**
     * Fetch an artwork image blob based on resolution.
     * @param {Object} obj - Artwork object containing title and URL.
     * @param {string} advicedResolution - Desired resolution ('low', 'mid', 'high').
     * @returns {Promise<Object>} - Object containing title and image blob.
     */
    fetchImage: async function (obj, advicedResolution) {
        const resolutions = {
            "low": 400,
            "mid": 843,
            "high": 1686
        };
        const width = resolutions[advicedResolution] || resolutions["mid"];

        // Modify the Cloudinary URL to include width transformation
        const transformedUrl = obj.url.replace("/upload/", `/upload/w_${width}/`);

        try {
            const response = await fetch(transformedUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            return {
                id: obj.id,
                title: obj.title,
                image: blob
            };
        } catch (error) {
            console.error(`Error fetching image for "${obj.title}":`, error);
            throw error;
        }
    }
};
