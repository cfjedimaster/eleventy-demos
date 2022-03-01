const qrCode = require('qrcode');

module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("qrcode", async function(value) {

		return await qrCode.toDataURL(value);

	});

	/*
	Based on an email from Will, I discovered that nunjucks can't use an async *global* filter. If
	you define one using the code below, it works just fine. Filing a bug for this.
	*/
	eleventyConfig.addNunjucksAsyncFilter("qrcode2", async function(value, callback) {
		let result = await qrCode.toDataURL(value);
		callback(null,result);
	});

};

