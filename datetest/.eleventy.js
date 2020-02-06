module.exports = function(eleventyConfig) {


	eleventyConfig.addCollection("docs", function(collection) {
		return collection.getFilteredByGlob("docs/*.md").sort((a,b) => {
			if(a.data.title < b.data.title) return -1;
			if(a.data.title > b.date.title) return 1;
			return 0;
		});
	});

}