// api/cloudinary.js
'use strict';

module.exports = {
    fetchList: async function (from, count) {
        const response = await fetch(`/api/fetchImages?from=${from}&count=${count}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch image list: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    fetchImage: async function (imageUrl, advicedResolution) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            return {
                title: imageUrl, // Adjust as needed
                image: blob
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
