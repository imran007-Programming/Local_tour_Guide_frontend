const fs = require('fs');

// Create a simple base64 PNG icon (1x1 blue pixel, will be scaled by browser)
const createPNG = (size) => {
  // Minimal PNG: blue square
  const canvas = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="%233b82f6"/><text x="50%" y="50%" font-size="${size/3}" text-anchor="middle" dy=".3em" fill="white">🗺️</text></svg>`;
  return canvas;
};

console.log('To create PNG icons:');
console.log('1. Open Chrome');
console.log('2. Go to: data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="%233b82f6"/><text x="256" y="280" font-size="180" text-anchor="middle" fill="white">🗺️</text></svg>');
console.log('3. Right-click > Save image as > icon-512x512.png');
console.log('4. Repeat for 192x192 and 180x180');
