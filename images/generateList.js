
const fs = require('fs');
const path = require('path');

// Replace with your actual Cloudinary cloud name and folder
const CLOUDINARY_CLOUD_NAME = 'dlqfawszf';
const CLOUDINARY_FOLDER = '/artworks'; // Ensure images are uploaded to this folder
const IMAGE_DIRECTORY = './images'; // Directory containing your artwork images
const IMAGE_EXTENSION = ['.png', '.jpg', '.jpeg', '.gif']; // Supported image formats

// Read all files from the image directory
fs.readdir(IMAGE_DIRECTORY, (err, files) => {
    if (err) {
        console.error('Error reading images directory:', err);
        process.exit(1);
    }
    
    // Filter files to include only supported image formats and exclude non-image files
    files = files.filter(file => 
        IMAGE_EXTENSION.some(ext => file.toLowerCase().endsWith(ext)) &&
        !file.endsWith(".js") && 
        !file.endsWith(".json")
    );
    
    // Map each file to its Cloudinary URL
    const list = files.map(file => ({
        title: path.parse(file).name, // Extracts the file name without extension
        file: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_FOLDER}/${file}`
    }));
    
    // Write the list to images.json with proper formatting
    const json = JSON.stringify({ images: list }, null, 4);
    fs.writeFileSync('./images/images.json', json);
    console.log('images.json has been generated with Cloudinary URLs.');
});
