
module.exports = function(eleventyConfig) {

	eleventyConfig.addWatchTarget('./mjml/');

	/*
	This does not work as getFiltereByGlob doesn't support unknown extensions
	eleventyConfig.addCollection("mjml", function(collection) {
		let source = collection.getFilteredByGlob("mjml/*.mjml");
		console.log('source', source.length);

		return [];
	});
	*/	
};