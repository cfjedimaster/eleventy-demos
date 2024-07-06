let Sqrl = require('squirrelly');

module.exports = function(eleventyConfig) {

	eleventyConfig.addGlobalData('site', { name:'test site', foo:'goo'});

	eleventyConfig.addTemplateFormats('sqrl');

	eleventyConfig.addExtension('sqrl', {

		compile: async (inputContent) => {

			return async (data) => {
				return Sqrl.render(inputContent, data);
			};
		},
	});

};

