const fetch = require('node-fetch');

module.exports = (eleventyConfig, options) => {

	// key is where to save the data
	if(!options) options = {};

	if(!options.name) options.name = 'weatherData';

	if(!options.key) {
		throw new Error('API key required for weather plugin.');
	}

	if(!options.zip) {
		throw new Error('Zip code required for weather plugin.');
	}

	eleventyConfig.addGlobalData(options.name, async () => {

		let req = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${options.zip}&appid=${options.key}&units=imperial`);
		let data = await req.json();
		return data;

	});
}
