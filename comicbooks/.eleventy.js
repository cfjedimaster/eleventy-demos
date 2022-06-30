module.exports = function(eleventyConfig) {


	eleventyConfig.addPassthroughCopy("./comics/(*.cbr|*.cbz)");
	eleventyConfig.addPassthroughCopy("./comiccache/**");
	eleventyConfig.addPassthroughCopy("src/app.css");
	
	eleventyConfig.addWatchTarget("./src/app.css")

	return {
		dir: {
			input: 'src'
		}
	}

};