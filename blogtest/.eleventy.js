module.exports = function(eleventyConfig) {

	eleventyConfig.addCollection("posts", collection => {
		return collection.getFilteredByGlob("_posts/**/*.md");
	});
}