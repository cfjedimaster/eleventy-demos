const fetch = require('node-fetch');

module.exports = (eleventyConfig, options) => {

	if(!options) options = {};

	if(!options.name) options.name = 'posts';

	if(!options.host) {
		throw new Error('Host required for WordPress plugin.');
	}

	let headers = {};
	if(options.username && options.password) {
		headers['Authorization'] = 'Basic ' + Buffer.from(options.username + ":" + options.password).toString('base64');
	}

  	let url = options.host + '/wp-json/wp/v2/posts?orderby=date&order=desc';

	eleventyConfig.addGlobalData(options.name, async () => {
		try {
			let req = await fetch(url, {
			headers
			});
			let data = await req.json();
			data = data.map(p => {
				return {
					title:p.title.rendered,
					content:p.content.rendered,
					date:p.date
				}
			});
			return data;
		} catch(e) {
			console.log('error', e);
		}

	});

}
