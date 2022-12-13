const fs = require('fs');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("fileassets");

	eleventyConfig.addGlobalData('downloads2', () => {
		return fs.readdirSync('./fileassets');
	});

	return {
		dir: {
			input: "src"
		}
	}

};