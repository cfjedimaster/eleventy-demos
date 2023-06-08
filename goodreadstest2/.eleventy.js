const GOOGLE_KEY = process.env.GOOGLE_KEY;

module.exports = function(eleventyConfig) {

	return {
		dir: {
			input: "src",
			data: "_data"
		}
	}

};