
require('dotenv').config();

const mapPlugin = require('eleventy-plugin-googlestaticmaps');

const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(mapPlugin, {
		key:GOOGLE_MAPS_KEY
	});

};