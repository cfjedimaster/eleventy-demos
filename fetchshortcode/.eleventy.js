const fetch = require('node-fetch');

module.exports = function(eleventyConfig) {
;

	/*
	eleventyConfig.addPairedShortcode("fetch2", async function(content, url) {
		console.log('called fetch2 with '+url);
		let resp = await fetch(url);
		let data = await resp.json();
		console.log('data', data.results.length);
		this.page.fetchdata = data;
		return '';
	});
	*/
	
	eleventyConfig.addShortcode("fetch", async function(url, name, filter) {
		let resp = await fetch(url);
		let data = await resp.json();
		if(filter) data = data[filter];
		this.page[name] = data;
	});

}