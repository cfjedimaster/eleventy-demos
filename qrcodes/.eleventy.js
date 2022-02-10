const qrCode = require('qrcode');

module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("qrcode", async function(value) {

		return await qrCode.toDataURL(value);

	});

};

