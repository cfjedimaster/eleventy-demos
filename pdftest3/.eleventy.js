module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("pdfs");
	eleventyConfig.addPassthroughCopy("css");

	eleventyConfig.addFilter('jsonify', function (variable) {
		return JSON.stringify(variable);
	});

};

