'use strict';

// Local images replaced with Cloudinary URLs
const images = require("../images/images.json").images.map((img, i) => ({ ...img, image_id: i }));
module.exports = {
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    fetchImage: async function (obj, advicedResolution) {
        // Use the full Cloudinary URL from images.json
        const url = obj.file;
        const blob = await fetch(url).then(res => res.blob());
        return {
            title: obj.title,
            image: blob
        };
    }
};
