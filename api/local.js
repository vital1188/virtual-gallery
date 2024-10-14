'use strict';

// Images hosted on Cloudinary
const images = require("../images/images.json").images.map((img, i) => ({ ...img, image_id: i }));

module.exports = {
    fetchList: async function (from, count) {
        return images.slice(from, from + count);
    },
    fetchImage: async function (obj, advicedResolution) {
        const url = obj.file; // Full Cloudinary URL
        const blob = await fetch(url).then(res => res.blob());
        return {
            title: obj.title,
            image: blob
        };
    }
};
