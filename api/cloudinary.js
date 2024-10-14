'use strict';

const cloudinary = require('cloudinary').v2;

module.exports = {
    // Fetch a list of image URLs from images.json starting from 'from' index and fetch 'count' images
    fetchList: async function (from, count) {
        const images = require("../images/images.json").images;
        return images.slice(from, from + count).map(img => img.file);
    },
    // Fetch a specific image using Cloudinary transformations based on the advised resolution
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
                title: publicId, // You can adjust the title extraction as needed
                image: blob
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
