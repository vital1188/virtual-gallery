'use strict';

const images = require("../images/images.json").images;
module.exports = {
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    fetchImage: async function (obj, advicedResolution) {
        let url = obj.url;

        // Apply Cloudinary transformations based on resolution
        // For example, adjust width (w) parameter
        if (advicedResolution === 'low') {
            // Width 400px
            url = url.replace('/upload/', '/upload/w_400/');
        } else if (advicedResolution === 'mid') {
            // Width 843px
            url = url.replace('/upload/', '/upload/w_843/');
        } else if (advicedResolution === 'high') {
            // Width 1686px
            url = url.replace('/upload/', '/upload/w_1686/');
        }

        try {
            const response = await fetch(url);
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
            // Fallback to a placeholder or handle error as needed
            return {
                title: obj.title,
                image: null
            };
        }
    }
};
