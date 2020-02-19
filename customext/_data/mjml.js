
const mjml = require('mjml');
const globby = require('globby');
const fs = require('fs');

module.exports = async function(data) {
	let result = [];

	let files = await globby('mjml/*.*');

	for(let i=0; i < files.length; i++) {
		let content = fs.readFileSync(files[i], 'utf8');
		let path = files[i].replace(/\.mjml/,'');
		result.push({
			path:path,
			originalContent:content,
			parsedContent:mjml(content).html
		});
	}

	return result;
};