module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("getAuthor", (authors,label) => {
		let author = authors.filter(a => a.key === label)[0];
		return author;
	});

	eleventyConfig.addFilter("getPostsByAuthor", (posts,author) => {
		return posts.filter(a => a.data.author === author);
	});
};