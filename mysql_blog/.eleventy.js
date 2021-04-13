module.exports = function(eleventyConfig) {

	let markdownIt = require("markdown-it")();
	
	const english = new Intl.DateTimeFormat('en');

	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(date);
	});

	eleventyConfig.addFilter("markdown", function(str) {
		return markdownIt.render(str);
	});

	eleventyConfig.addFilter('getByCategory', (posts,cat) => {
		let results = [];

		for(let post of posts) {
			if(post.categories.findIndex(c => c.id === cat) >= 0) results.push(post);
			//if(post.data.categories.indexOf(cat) >= 0) results.push(post);
		}
		return results.reverse();
	});

};