module.exports = function(eleventyConfig) {

	let _CAPTURES;
	eleventyConfig.on('beforeBuild', () => {
		//I need this to wipe _CAPTURES when editing pages, wouldn't be an issue in prod
    	_CAPTURES = {};
	});
	
	eleventyConfig.addPairedShortcode("mycapture", (content, name) => {
		if(!_CAPTURES[name]) _CAPTURES[name] = '';
		_CAPTURES[name] += content;
		return '';
  	});

	eleventyConfig.addShortcode("displaycapture", name => {
		console.log('displaycapture called');
		return _CAPTURES[name];
	});

};