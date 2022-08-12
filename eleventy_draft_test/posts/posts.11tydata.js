
module.exports = {
	eleventyComputed: {
		permalink: data => {
			if(data.draft) return false;
		},
		tags: data => {
			if(!data.draft) return 'posts';
			return '';
		}
	}
}