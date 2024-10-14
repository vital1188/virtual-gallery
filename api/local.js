'use strict';

// Import images from images.json and assign unique image IDs
const images = require("../images/images.json").images.map((img, i) => ({ ...img, image_id: i }));

module.exports = {
    // Fetch a list of images starting from 'from' index and fetch 'count' images
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    // Fetch a specific image using its Cloudinary URL
    fetchImage: async function (obj, advicedResolution) {
        const url = obj.file; // Cloudinary URL from images.json
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        return {
            title: obj.title,
            image: blob
        };
    }
};
