const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("img");
	eleventyConfig.addPassthroughCopy("css");
	eleventyConfig.addWatchTarget("css");

	eleventyConfig.addCollection('images', async collectionApi => {

		let files = await glob('./img/*.jpeg');
		//Now filter to non thumb-
		let images = files.filter(f => {
			return f.indexOf('./img/thumb-') !== 0;
		});

		let collection = images.map(i => {
			return {
				path: i,
				thumbpath: i.replace('./img/', './img/thumb-')
			}
		});

		return collection;

	});

};