const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPlugin(pluginWebc, {
		components:"_includes/components/**/*.webc"
	});

	//eleventyConfig.addPlugin(pluginWebc);

};