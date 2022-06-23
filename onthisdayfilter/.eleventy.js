module.exports = function(eleventyConfig) {

	eleventyConfig.addFilter('onthisday', (date, posts) => {
		date = new Date(date);

		return posts.filter(p => {
			return p.date.getFullYear() < date.getFullYear() && 
				   p.date.getMonth() == date.getMonth() && 
				   p.date.getDate() == date.getDate();
		});

	});

	return {
		dir: {
			input: 'src'
		}
	}

};