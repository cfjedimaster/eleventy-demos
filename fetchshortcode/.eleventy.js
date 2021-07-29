const fetch = require('node-fetch');

module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("fetch", async function(url) {
		console.log('called fetch with '+url);
		let resp = await fetch(url);
		let data = await resp.json();
		console.log('data', data.results.length);
		return data;
  	});

}