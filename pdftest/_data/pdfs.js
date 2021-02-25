
const globby = require('globby');

module.exports = async function() {
	let result = [];

	let files = await globby('./pdfs/**/*.pdf');

	
	for(let i=0; i < files.length; i++) {
		//name safe for a directory
		let name = files[i].split('/').pop().replace('.pdf', '');
		result.push({
			path:files[i],
			name:name
		});
	}
	
	return result;
};