/*
No access to output directory, or configured data, so we have code for now.

This shows an example of handling this nicer: https://github.com/11ty/eleventy/pull/1143#issuecomment-687192877
*/
const dataDir = './_data/';
const outputDir = './_site/';
const fs = require('fs');

module.exports = function (eleventyConfig) {

	eleventyConfig.on('afterBuild', () => {
		fs.copyFileSync(dataDir + 'site.json', outputDir + 'site3.json');	
	});

};