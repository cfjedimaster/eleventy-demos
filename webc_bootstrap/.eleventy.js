const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginWebc, {
		components: "src/_components/**/*.webc"
	});
	
	return {
		dir: {
			input: "src",
			layouts:"_layouts"
		}
	}

};