module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("_redirects");

    eleventyConfig.addWatchTarget("./css/");
    eleventyConfig.addWatchTarget("./js");

	eleventyConfig.on('afterBuild', () => {
		console.log('afterBuild');
	});

};
