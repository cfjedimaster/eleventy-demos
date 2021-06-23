const fs = require('fs');

module.exports = function(eleventyConfig) {


	eleventyConfig.addCollection("goPages", collectionApi => {
    	return collectionApi.getAll().filter(p => {
			if(p.data.go) return true;
			return false;
		});
	});

};