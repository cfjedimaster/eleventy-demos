module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("getRelated", function(relatedPosts, posts) {
		let related = [];
		posts.forEach(p => {
			if(relatedPosts.includes(p.data.page.url)) related.push(p);
		});
		return related;
	});
};