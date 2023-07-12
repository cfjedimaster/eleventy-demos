require('dotenv').config();
const fs = require('fs');

const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_APPID, process.env.ALGOLIA_ADMINKEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

module.exports = function(eleventyConfig) {

	eleventyConfig.on('eleventy.after', async ({ dir }) => {
		let data = JSON.parse(fs.readFileSync(dir.output + '/algolia.json', 'utf8'));

		/*
		Algolia requires an objectID for each object. It can generate it, but we 
		want to use the filename. Unfortunately, only the PHP SDK lets you point to a
		property.
		*/
		data.forEach(d => d.objectID = d.pdf);

		await index.saveObjects(data);
	});

	eleventyConfig.addPassthroughCopy('src/pdfs');

	return {
		dir: {
			input: "src",
			data: "_data"
		}
	}

};