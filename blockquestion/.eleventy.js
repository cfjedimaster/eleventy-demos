module.exports = function(eleventyConfig) {

	let _CAPTURES;
	eleventyConfig.on('beforeBuild', () => {
		//I need this to wipe _CAPTURES when editing pages, wouldn't be an issue in prod
		_CAPTURES = {};
	});
	
	
	eleventyConfig.addPairedShortcode("mycapture", function (content, name) {
		if(!_CAPTURES[this.page.inputPath]) _CAPTURES[this.page.inputPath] = {};
		if(!_CAPTURES[this.page.inputPath][name]) _CAPTURES[this.page.inputPath][name] = '';
		_CAPTURES[this.page.inputPath][name] += content;
		return '';
	});
	
	eleventyConfig.addShortcode("displaycapture", function(name) {
		if(_CAPTURES[this.page.inputPath] && _CAPTURES[this.page.inputPath][name]) return _CAPTURES[this.page.inputPath][name];
		return '';
	});

};