const weatherPlugin = require('../weatherplugin/');
const wpPlugin = require('../wordpress');

const weatherAPIKey = process.env.KEY;

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(weatherPlugin, { 
		key: weatherAPIKey,
		zip:'90210'
	});

	/*
	eleventyConfig.addPlugin(weatherPlugin, { 
		key: '002041a8430f6bf9b3ec61dbaf581800',
		zip:'70508',
		name:'localWeather'
	});
	*/

	eleventyConfig.addPlugin(wpPlugin, { 
		host:'https://funny-cave.localsite.io',
		username:'admin',
		password:'admin'
	});

};