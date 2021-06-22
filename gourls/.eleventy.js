const fs = require('fs');

module.exports = function(eleventyConfig) {
	let allPages;

	eleventyConfig.addPassthroughCopy("./_redirects");

	eleventyConfig.addCollection("allMyContent", function(collectionApi) {
		// copy out so I can usee it in afterBuild
		allPages = collectionApi.getAll();
		// allMyContent is basically unused
    	return collectionApi.getAll();
	});

	eleventyConfig.on('afterBuild', () => {
		console.log('afterBuild');
		// read in _redirects, if it exists, if not, we end early
		let redir = './_site/_redirects';

		if(!fs.existsSync(redir)) return;
		let contents = fs.readFileSync(redir, 'utf8');
		let newContent = '\n';

		for(let page of allPages) {
			if(page.data.go) {
				newContent += `
/go/${page.data.go}	${page.url}`;
			}
		}

		if(newContent !== '\n') {
			console.log('Adding custom GO urls ');
		}
		contents += newContent;
		fs.writeFileSync(redir, contents);
		
	});

};