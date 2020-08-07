module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter("released", posts => {
		let now = new Date().getTime();
		return posts.filter(p => {
			if(now < p.date.getTime()) return false;
			return true;
		});
	});

	 eleventyConfig.addCollection("releasedPosts", function(collectionApi) {

    	// get unsorted items
	    return collectionApi.getFilteredByTag("posts").filter(p => {
			let now = new Date().getTime();
			if(now < p.date.getTime()) return false;
			return true;
		});
  	});

};