module.exports = function(eleventyConfig) {


	//this doesnt work
	/*
	eleventyConfig.addCollection("blogPosts", function(collectionApi) {
		console.log(collectionApi.getFilteredByTag("posts"));
		return collectionApi.getFilteredByTag("posts");
	});
	*/

	eleventyConfig.addCollection("blogPosts", function(collectionApi) {
		let initial = collectionApi.getFilteredByGlob("posts/*.md");
		return  initial.filter(i => {
			return i.data.tags && i.data.tags === 'posts';
		});
	});

};