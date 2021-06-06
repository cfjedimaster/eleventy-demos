const lunrjs = require('lunr');
const fs = require('fs');

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("js");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("_redirects");

    //eleventyConfig.addWatchTarget("./css/");
    //eleventyConfig.addWatchTarget("./js");

	eleventyConfig.on('afterBuild', () => {
		console.log('running afterBuild');
    	const data = require('./netlify/functions/search/data.json');
		const index = createIndex(data);
		fs.writeFileSync('netlify/functions/search/index.json', JSON.stringify(index));
		console.log('Wrote out my index.');
	});

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


function createIndex(posts) {
  return lunrjs(function() {
    this.ref('id');
    this.field('title');
    this.field('content');
    this.field('date');

    posts.forEach((p,idx) => {
      p.id = idx;
      this.add(p);
    });
  });
}
