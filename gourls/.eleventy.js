const fs = require('fs');

module.exports = function(eleventyConfig) {


	eleventyConfig.addCollection("goPages", function(collectionApi) {
    	return collectionApi.getAll().filter(p => {
			if(p.data.go) return true;
		});
	});

};