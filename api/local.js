// api/local.js
'use strict';

// Local images from Cloudinary
const images = require("../images/images.json").images.map((img, i) => ({ ...img, image_id: i }));

module.exports = {
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    fetchList: async function (from, count) {
        const list = images.slice(from, from + count);
        console.log('Fetching list from local (Cloudinary):', list);
        return list;
    },
    fetchImage: async function (obj, advicedResolution) {
        console.log('Fetching image:', obj.file);
        const url = obj.file; // Cloudinary URL
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
