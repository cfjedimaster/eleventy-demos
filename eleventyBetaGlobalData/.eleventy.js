const fetch = require('node-fetch');

module.exports = function(eleventyConfig) {


	eleventyConfig.addGlobalData('name', 'Eleventy Test Site');
	
	eleventyConfig.addGlobalData('complex', {
		facebook:'facebook foo',
		twitter:'twittet goo',
		insta:'insta zoo'
	});

	eleventyConfig.addGlobalData('generated', () => {
		let now = new Date();
		return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(now);
	});

	eleventyConfig.addGlobalData('ships', async () => {
		let shipRequest = await fetch('https://swapi.dev/api/starships');
		let ships = await shipRequest.json();
		return ships.results;
	});

	//only works here
	eleventyConfig.addGlobalData('test', Object.keys(eleventyConfig.globalData));

	eleventyConfig.on('beforeBuild', () => {
		console.log('beforeBuild');
		eleventyConfig.addGlobalData('test2', Object.keys(eleventyConfig.globalData));
		console.log('done', JSON.stringify(eleventyConfig.globalData));
	});

};