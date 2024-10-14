'use strict';

module.exports = {
    default: "cloudinary", // Set Cloudinary as the default API
    artic: require("./artic"),
    local: require("./local"),
    cloudinary: require("./cloudinary") // Add Cloudinary API
};
