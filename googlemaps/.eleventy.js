
require('dotenv').config();
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

module.exports = function(eleventyConfig) {


	eleventyConfig.addShortcode("staticmap", function(address, width=500, height=500, zoom=13, maptype="roadmap") {
		return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=${zoom}&size=${width}x${height}&maptype=${maptype}&key=${GOOGLE_MAPS_KEY}`;
	});

};