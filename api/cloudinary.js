'use strict';

// Import the list of artworks from cloudinary.json
const images = require('./cloudinary.json').images.map((img, i) => ({
    ...img,
    image_id: img.image_id || i // Ensure each image has a unique ID
}));

module.exports = {
    // Fetch a list of artworks with pagination
    fetchList: async function(from, count) {
        return images.slice(from, from + count).filter(d => d.file);
    },
    
    // Fetch a single artwork image as a blob
    fetchImage: async function(obj, advisedResolution) {
        const url = obj.file;
        const blob = await fetch(url).then(res => res.blob());
        return {
            title: `${obj.title} - ${obj.artist_title}`,
            image: blob
        };
    }
};
