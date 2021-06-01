module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("_redirects");

    //eleventyConfig.addWatchTarget("./css/");
    //eleventyConfig.addWatchTarget("./js");


	eleventyConfig.addCollection("posts", collection => {
		let posts = collection.getFilteredByGlob("_posts/**/*.md");

		for(let i=0;i<posts.length;i++) {
			posts[i].data.permalink += '.html';
		    posts[i].outputPath += '/index.html';
		}

		return posts;
	});

	eleventyConfig.addFilter('jsonify', function (variable) {
		return JSON.stringify(variable);
	});

};
