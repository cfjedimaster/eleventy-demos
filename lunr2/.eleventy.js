module.exports = function(eleventyConfig) {

	eleventyConfig.addCollection("characters", function(collection) {
		return collection.getFilteredByGlob("characters/*.md").sort((a,b) => {
			if(a.data.title < b.data.title) return -1;
			if(a.data.title > b.date.title) return 1;
			return 0;
		});
	});

	eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

	eleventyConfig.addPassthroughCopy("css");

	const outputDir = './_site/';
	const fs = require('fs');
	const lunr = require('lunr');

	eleventyConfig.on('afterBuild', () => {
		let data = fs.readFileSync(outputDir + '/raw.json','utf-8');
		let docs = JSON.parse(data);

		console.log('docs length', docs.length);


		let idx = lunr(function () {
			this.ref('id');
			this.field('title');
			this.field('content');

			docs.forEach(function (doc, idx) {
				doc.id = idx;
				this.add(doc); 
			}, this);
		});

		fs.writeFileSync(outputDir + 'index.json', JSON.stringify(idx));
	});

};

// https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/
function extractExcerpt(article) {
	if (!article.hasOwnProperty('templateContent')) {
	  console.warn('Failed to extract excerpt: Document has no property "templateContent".');
	  return null;
	}
   
	let excerpt = null;
	const content = article.templateContent;

	// The start and end separators to try and match to extract the excerpt
	const separatorsList = [
	  { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
	  { start: '<p>', end: '</p>' }
	];
   
	separatorsList.some(separators => {
	  const startPosition = content.indexOf(separators.start);
	  const endPosition = content.indexOf(separators.end);
   
	  if (startPosition !== -1 && endPosition !== -1) {
		excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
		return true; // Exit out of array loop on first match
	  }
	});
	return excerpt;
  }
  