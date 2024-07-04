const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('img');

	const english = new Intl.DateTimeFormat('en',{dateStyle:'medium', timeStyle:'long'});
	eleventyConfig.addFilter("dtFormat", function(date) {
		return english.format(new Date(date));
	});

	eleventyConfig.addShortcode('mastodon_attachment', async function (src, alt, sizes) {
		/*
		todo, support other formats
		*/

		let IMG_FORMATS = ['jpg','gif','png','jpeg'];

		let format = src.split('.').pop();
		if(IMG_FORMATS.includes(format)) {

			// check for valid image 
			let mSrc = './_data/mastodon/archive' + src;
			let metadata = await Image(mSrc, {
				widths: [500],
				formats: ['jpeg'],
			});

			let imageAttributes = {
				alt,
				sizes,
				loading: 'lazy',
				decoding: 'async',
			};

			// You bet we throw an error on a missing alt (alt="" works okay)
			return Image.generateHTML(metadata, imageAttributes);

		}

		// do nothing
		console.log('mastodon_attachment sc - unsupported ext', format);
		return '';

	});


};