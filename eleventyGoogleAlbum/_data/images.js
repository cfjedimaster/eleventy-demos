require('dotenv').config();
const Image = require("@11ty/eleventy-img");
const fetch = require('node-fetch');
const fs = require('fs');

const ALBUM = 'EleventyTest';
const PHOTO_API = process.env.IMAGE_ENDPOINT + `?album=${ALBUM}`;
// desired *initial* size, this will be still be scaled appropriately
const WIDTH = 800;
const HEIGHT = 800;

module.exports = async function() {

	/*
	clean the img folder
	*/
	emptyImageFolder();

	let data = await fetch(PHOTO_API);
	let photos = await data.json();

	/*
	for each photo, rewrite URL to add H/W
	*/
	photos = photos.map(p => {
		return p + `=w${WIDTH}-h${HEIGHT}`
	});

	console.log('got ',photos.length,' photos');
	let result = [];

	for(let i=0; i<photos.length; i++) {

		let stats = await Image(photos[i], {
			widths: [null,300],
			formats:['jpeg']
		});

		/*
		stats has a lot of info we can simplify. we specified ONE dimension, but the plugin 
		will always return 2 with the second being the original
		*/
		let imageResult = {
			width: stats.jpeg[1].width,
			height: stats.jpeg[1].height,
			thumbnail_width: stats.jpeg[0].width,
			thumbnail_height: stats.jpeg[0].height,
			url: stats.jpeg[1].url,
			thumbnail_url: stats.jpeg[0].url
		};

		result.push(imageResult);
	}

	return result;
}

function emptyImageFolder() {
	let imgDir = './img/';
	let files = fs.readdirSync(imgDir);
	for(file of files) {
		fs.unlinkSync(imgDir + file);
	}
	return;
}