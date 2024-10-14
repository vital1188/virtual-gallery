'use strict';

// Cloudinary API
const cloudinaryURL = 'https://res.cloudinary.com/dlqfawszf/image/upload/';
const defaultResolution = 'w_1686'; // You can adjust this based on your needs

module.exports = {
    fetchList: async function (from, count) {
        const response = await fetch('/images/images.json');
        const data = await response.json();
        return data.images.slice(from, from + count);
    },
    fetchImage: async function (obj, advisedResolution) {
        try {
            // Construct the Cloudinary URL with the desired resolution
            const res = advisedResolution === 'high' ? 'w_1686' : advisedResolution === 'mid' ? 'w_843' : 'w_400';
            const url = `${cloudinaryURL}${res}/${obj.file}`;
            
            // Fetch the image as a blob
            const blob = await fetch(url).then(res => res.blob());
            
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
