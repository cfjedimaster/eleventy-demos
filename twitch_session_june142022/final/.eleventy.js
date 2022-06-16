module.exports = function(eleventyConfig) {

	eleventyConfig.addTemplateFormats('css');

	eleventyConfig.addFilter("excerpt", c => {
		// kinda hacky like REAL hacky
		return c.templateContent.split('</p>')[0];
	});

};