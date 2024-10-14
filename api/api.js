'use strict';

module.exports = {
    default: "cloudinary", // Set 'cloudinary' as the default API
    artic: require("./artic"),
    local: require("./local"),
    cloudinary: require("./cloudinary") // Include the Cloudinary API module
};
