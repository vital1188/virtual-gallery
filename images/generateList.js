// images/generateList.js
const fs = require('fs');

// Predefined list of artworks with Cloudinary URLs
const artworks = [
    {
        title: "Sunset Over Mountains",
        url: "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884280/artworks/IMG_4008_jm4odm.png"
    },
    {
        title: "Abstract Composition",
        url: "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884278/artworks/IMG_3776_t6yog9.png"
    },
    {
        title: "Portrait of a Lady",
        url: "https://res.cloudinary.com/dlqfawszf/image/upload/v1728884276/artworks/IMG_3311_mblyqk.jpg"
    }
    // Add more artworks as needed
];

const list = artworks.map(art => ({
    title: art.title,
    url: art.url
}));

const json = JSON.stringify({ images: list }, null, 4);
fs.writeFileSync('./images/images.json', json);
console.log("images.json has been generated successfully.");
