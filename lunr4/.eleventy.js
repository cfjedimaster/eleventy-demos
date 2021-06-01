module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("_redirects");

    eleventyConfig.addWatchTarget("./css/");
    eleventyConfig.addWatchTarget("./js");


	eleventyConfig.addCollection("posts", collection => {
		let posts = collection.getFilteredByGlob("_posts/**/*.md");

		return posts;
	});

	eleventyConfig.addFilter('jsonify', function (variable) {
		return JSON.stringify(variable);
	});

};
