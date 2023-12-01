module.exports = function(eleventyConfig) {

	const english = new Intl.DateTimeFormat('en');

	// https://stackoverflow.com/a/543152/52160
	function datediff(first, second) {        
		return Math.round((second - first) / (1000 * 60 * 60 * 24));
	}

	eleventyConfig.addCollection("recentPosts", function(collectionApi) {
		let now = new Date();
		return collectionApi.getFilteredByTag("posts").filter(function(p) {
			return datediff(p.date, now) <= 30;
		});
	});

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});
};