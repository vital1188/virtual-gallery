'use strict';

require('dotenv').config(); // Load environment variables from .env

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
    default: "local", // Sets 'local' as the default API
    artic: require("./artic"), // ARTIC API module
    local: require("./local"), // Local (Cloudinary) API module
    cloudinary: require("./cloudinary") // New Cloudinary API module
};
