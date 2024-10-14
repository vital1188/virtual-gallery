// api/functions/fetchImages.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Handler for fetching images from Cloudinary.
 * Expects query parameters:
 * - from: starting index
 * - count: number of images to fetch
 */
exports.handler = async (event, context) => {
    const { from = 0, count = 10 } = event.queryStringParameters || {};

    try {
        // Fetch a list of images from images.json
        const fs = require('fs');
        const path = require('path');
        const imagesPath = path.join(__dirname, '../../images/images.json');
        const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));
        const images = imagesData.images.slice(parseInt(from), parseInt(from) + parseInt(count));

        // Optionally, you can implement pagination or more complex logic here

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Enable CORS
            },
            body: JSON.stringify(images)
        };
    } catch (error) {
        console.error('Error fetching images:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch images' })
        };
    }
};
