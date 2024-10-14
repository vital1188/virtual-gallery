'use strict';
require('dotenv').config();

// Local images from Cloudinary
const images = require("../images/images.json").images.map(image => ({
    title: image.title,
    url: `${process.env.CLOUDINARY_URL}${image.public_id}.${image.format}`
}));

module.exports = {
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    fetchImage: async function (obj, advicedResolution) {
        try {
            // Apply transformations if needed, e.g., resizing
            const transformedUrl = `${obj.url}`;
            const response = await fetch(transformedUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            return {
                title: obj.title,
                image: blob
            };
        } catch (error) {
            console.error('Error fetching image from Cloudinary:', error);
            return {
                title: obj.title,
                image: null
            };
        }
    }
};
