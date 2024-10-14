'use strict';

require('dotenv').config(); // Load environment variables

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    default: "cloudinary",
    artic: require("./artic"),
    local: require("./local"),
    cloudinary: require("./cloudinary") // Added Cloudinary module
};
