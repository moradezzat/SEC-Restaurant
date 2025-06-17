const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// List of images to convert
const images = [
    'assets/No_Offers.png',
    'Icons/EgyptianFlag.png',
    'Icons/GermanFlag.png',
    'Icons/Grinning.png',
    'Icons/Star.png',
    'Icons/Star2.png',
    'Icons/SyrianFlag.png',
    'Icons/User.png'
];

// Function to convert a single image
async function convertToWebP(inputPath) {
    try {
        const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        await sharp(`public/${inputPath}`)
            .webp({ quality: 80 })
            .toFile(`public/${outputPath}`);
        console.log(`Converted ${inputPath} to ${outputPath}`);
    } catch (error) {
        console.error(`Error converting ${inputPath}:`, error.message);
    }
}

// Convert all images
async function convertAllImages() {
    for (const image of images) {
        await convertToWebP(image);
    }
}

// Run the conversion
convertAllImages().then(() => {
    console.log('All images converted successfully!');
}).catch(error => {
    console.error('Error during conversion:', error);
}); 