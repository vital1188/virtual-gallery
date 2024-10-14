const fs = require('fs');

// Replace with your Cloudinary cloud name and folder
const CLOUDINARY_CLOUD_NAME = 'dlqfawszf';
const CLOUDINARY_FOLDER = 'Home/artworks'; // Folder where images are uploaded
const IMAGE_EXTENSION = ['.png', '.jpg', '.jpeg', '.gif']; // Supported image extensions

fs.readdir('./images', (err, files) => {
    if (err) {
        console.error('Error reading images directory:', err);
        process.exit(1);
    }
    files = files.filter(file => 
        IMAGE_EXTENSION.some(ext => file.endsWith(ext)) &&
        !file.endsWith(".js") && 
        !file.endsWith(".json")
    );
    const list = files.map(file => ({
        title: file.split('.').slice(0, -1).join('.'),
        file: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_FOLDER}/${file}`
    }));
    let json = JSON.stringify({ images: list }, null, 4);
    fs.writeFileSync('./images/images.json', json);
    console.log('images.json has been generated with Cloudinary URLs.');
});
