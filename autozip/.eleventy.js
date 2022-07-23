const AdmZip = require('adm-zip');
const glob = require('glob-promise');

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('src/images');
	
	eleventyConfig.on('eleventy.after', async () => {
		console.log('after build');
		let catpics = await glob('./src/images/cats/*.jpg');
		let zip = new AdmZip();
		catpics.forEach(c => zip.addLocalFile(c));
		zip.writeZip('_site/catpics.zip');
	});

	return {
		dir: {
			input: 'src'
		}
	}

};
