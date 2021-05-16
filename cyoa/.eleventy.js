module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy("css");
	eleventyConfig.addWatchTarget("./css");
};

