module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("getAuthors", (authors,label) => {
		let labels = label.split(',');
		return authors.filter(a => labels.includes(a.key));
	});

	eleventyConfig.addFilter("getPostsByAuthor", (posts,author) => {
		return posts.filter(p => {
			if(!p.data.author) return false;
			let authors = p.data.author.split(',');
			return authors.includes(author);
		});
	});
};