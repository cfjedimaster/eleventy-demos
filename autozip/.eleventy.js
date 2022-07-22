module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('src/images');
	

	return {
		dir: {
			input: 'src'
		}
	}

};