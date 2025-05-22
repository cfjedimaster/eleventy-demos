const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const fs = require('fs');
const lunr = require('lunr');


module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("jsonsafe", function(s) {
		return JSON.stringify(s);
	});

	eleventyConfig.addFilter("extract", function(s) {
		let firstP = s.indexOf('</p>');
		return s.substring(0,firstP).replace(/<.*?>/g, '');
	});

	eleventyConfig.addPassthroughCopy("*.css");
	eleventyConfig.addWatchTarget("*.css");

	eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
		name: "serverless", 
		functionsDir: "./netlify/functions/"
	});

	let index = null;
	let data = null;
	eleventyConfig.addFilter("findResults", function(term) {
		if(!index) {
			console.log('build index',new Date());
			data = JSON.parse(fs.readFileSync('_site/index.json','utf8'));
			index = lunr(function() {
				this.ref('url');
				this.field('title');
				this.field('content');

				data.forEach(function(doc) {
					this.add(doc);
				}, this);
			});
		}
		let results = index.search(term).map(r => {
			r.doc = data.find(d => d.url === r.ref);
			return r;
		});
		
		return results;
	});

};