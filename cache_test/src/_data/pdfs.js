const fs = require('fs');

const sourceDir = './pdfs';
const cacheDir = './scanned_pdfs';

/*
Fake logic!
*/
async function parsePDF(f) {
	return new Promise((resolve, reject) => {

		setTimeout(() => {
			resolve({
				input:f,
				made:new Date()
			});
		}, 5000);

	});
}

module.exports = async () => {

	console.log('running pdfs data file');
	let files = fs.readdirSync(sourceDir);
	let pdfs = [];

	for(let i=0; i<files.length; i++) {
		let f = files[i];
		console.log('pdf source input', f);
		let filenoext = f.replace(/\.pdf$/,'');
		// do we have a cache for f?
		let cached_file = cacheDir + `/${filenoext}.json`;
		console.log('cached_file location', cached_file);
		if(!fs.existsSync(cached_file)) {
			console.log('The cached file does NOT exist. Getting my data.');
			let parse = await parsePDF(f);
			console.log('got my parsed pdf info ', parse);
			fs.writeFileSync(cached_file, JSON.stringify(parse));
			pdfs.push({
				name:f,
				data:parse
			});
		} else {
			console.log('The cached file DOES exist.');
			let data = JSON.parse(fs.readFileSync(cached_file, 'utf8'));
			pdfs.push({
				name:f,
				data
			});
		}
	};

	return pdfs;

};