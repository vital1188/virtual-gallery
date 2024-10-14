'use strict';

// Environment variables for security
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

// Define resolutions for dynamic quality
const resolutions = { "low": 400, "mid": 843, "high": 1686 };

module.exports = {
    fetchList: async function(from, count) {
        const images = require("../images/images.json").images;
        return images.slice(from, from + count);
    },
    fetchImage: async function(obj, advisedResolution) {
        const width = resolutions[advisedResolution] || resolutions['low'];
        // Construct Cloudinary URL with transformations
        const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_${width}/${obj.file}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            return {
                title: obj.title,
                image: blob
            };
        } catch(e) {
            console.error(`Error fetching image ${url}:`, e);
            return null;
        }
    }
};
