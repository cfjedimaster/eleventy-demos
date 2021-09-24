module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("getRelated", function(relatedPosts, all) {
		/*
		relatedPosts is an array of filePathStems, return an array
		of page obs that match
		*/
		
		return all.filter(p => {
			return relatedPosts.includes(p.filePathStem);
		});
		
	});

};