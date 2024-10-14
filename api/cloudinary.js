'use strict';
const cloudinary = require('cloudinary').v2;

module.exports = {
    fetchList: async function (from, count) {
        // Implement logic to fetch list from Cloudinary if necessary
        // For static lists, continue using images.json
        return []; // Placeholder
    },
    fetchImage: async function (publicId, advicedResolution) {
        try {
            const url = cloudinary.url(publicId, {
                width: advicedResolution === 'high' ? 1686 :
                       advicedResolution === 'mid' ? 843 : 400,
                height: 'auto',
                fetch_format: 'auto',
                quality: 'auto'
            });
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            return {
                title: publicId, // Adjust as needed
                image: blob
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
