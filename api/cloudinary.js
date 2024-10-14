// api/cloudinary.js
'use strict';
const cloudinary = require('cloudinary').v2;

module.exports = {
    fetchList: async function (from, count) {
        // Fetch a subset of images from images.json
        const images = require("../images/images.json").images;
        return images.slice(from, from + count).map(img => img.file);
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
                title: publicId, // Adjust title as needed
                image: blob
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
