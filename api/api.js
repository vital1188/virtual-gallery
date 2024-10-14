// api/api.js
'use strict';

require('dotenv').config(); // Load environment variables

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// api/api.js
module.exports = {
    default: "cloudinary", // Set 'cloudinary' as default if preferred
    local: require("./local"),
    cloudinary: require("./cloudinary")
};

