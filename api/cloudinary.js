'use strict';

// List of artworks with Cloudinary URLs
const artworks = [
    {
        "title": "Sunset Overdrive",
        "url": "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884280/IMG_4008_jm4odm.png"
    },
    {
        "title": "Abstract Thoughts",
        "url": "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884278/IMG_3776_t6yog9.png"
    },
    {
        "title": "Modern Landscape",
        "url": "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884276/IMG_3311_mblyqk.jpg"
    },
    // Add more artworks as needed
];

module.exports = {
    /**
     * Fetch a list of artworks.
     * @param {number} from - Starting index.
     * @param {number} count - Number of artworks to fetch.
     * @returns {Promise<Array>} - Array of artwork objects.
     */
    fetchList: async function (from, count) {
        return artworks.slice(from, from + count);
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
                title: obj.title,
                image: blob
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
