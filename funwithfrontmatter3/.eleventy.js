module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("getByURL", function(url, posts) {
		return posts.reduce((prev, p) => {
			if(p.data.page.url === url) return p;
			else return prev;
		});
	});

	eleventyConfig.addFilter("getRelated", function(relatedPosts, posts) {
		return relatedPosts.map(p => eleventyConfig.getFilter('getByURL')(p, posts));
	});
};