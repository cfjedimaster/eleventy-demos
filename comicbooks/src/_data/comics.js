const fs = require('fs');
const slugify = require('@sindresorhus/slugify');

const AdmZip = require('adm-zip');
const unrar = require('node-unrar-js');
const wasmBinary = fs.readFileSync(require.resolve('node-unrar-js/esm/js/unrar.wasm'));

const Jimp = require('jimp');

const inputDir = './comics'; 
const cacheDir = './comiccache'; 

/*
the 'web' version of cacheDir is just a web accessible version, duh
*/
const cacheWebDir = '/comiccache';

const THUMB_WIDTH = 300;

module.exports = async () => {

	let comics = [];

	console.log('Comic Processing:\n');
	let files = fs.readdirSync(inputDir);

	// first, ensure we filter to .cbr or .cbz, could be done using glob npm module instead
	files = files.filter(f => {
		let ext = f.split('.').pop().toLowerCase();
		return ['cbr','cbz'].indexOf(ext) >= 0;
	});

	/*
	For each comic, we need 2 bits of data:
		a list of pages in image format
		a thumbnail page

	This information will be stored in a folder named:

		cacheDir/slugified version of comic filename/pages/*.jpg
		cacheDir/slugified version of comic filename/thumb.jpg

	*/

	for(let i=0; i<files.length; i++) {

		let f = files[i];
		let cacheFolder = cacheDir + '/' + slugify(f) + '/';
		console.log(`For ${f}, the cache is ${cacheFolder}`);
		if(!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

		/*
		Always check for the pages first, as we use that to make thumbnails.
		*/
		let pagesFolder = cacheFolder + 'pages/';
		if(!fs.existsSync(pagesFolder)) {
			fs.mkdirSync(pagesFolder);
			console.log(`Need to extract the pages to ${pagesFolder}`);
			/*
			we use one library for zips, another for rars
			*/
			let ext = f.split('.').pop().toLowerCase();
			if(ext === 'cbz') {
				console.log(`Process the ZIP file, ${f}`);
				let zip = new AdmZip(inputDir + '/' + f);
				/*
				Can't use this as it doesn't allow us to ignore the internal directory
				zip.extractAllTo(pagesFolder, true);
				*/
				let entries = zip.getEntries();
				entries.forEach(e => {
					if(!e.isDirectory) {
						zip.extractEntryTo(e.entryName, pagesFolder, false);
					}
				});
			} else {
				console.log('Process the RAR');
				let extractor = await unrar.createExtractorFromFile({ 
					wasmBinary, 
					filepath:inputDir + '/' + f, 
					targetPath:pagesFolder, 
					filenameTransform(file) {
						return file.split('/').pop();
					}
				});
				/*
				I have no idea how this works, but thanks: https://stackoverflow.com/a/71427375/52160
				*/
				[...extractor.extract().files];
				console.log(`Extracted to ${pagesFolder}`);
  
			}
		}

		/*
		At this point we have our extracted pages, let's see if we have our thumbnail

		*/
		let thumb = cacheFolder + 'thumb.jpg';
		if(!fs.existsSync(thumb)) {
			console.log(`Need to make the thumbnail, ${thumb}.`);
			/*
			First, find the first image in pagesFolder. We're going to get all and get the first
			item, but I'm NOT sure I trust the sorting. 

			Also note I found one comic with a Thumbs.db, so we will filter to first jpg/gif/png
			*/
			let images = fs.readdirSync(pagesFolder);
			let sourceImage = null;

			while(!sourceImage) {
				let image = images.shift();
				let ext = image.split('.').pop().toLowerCase();
				if(['jpg','gif','png'].indexOf(ext) >= 0) sourceImage = image;
			}

			const image = await Jimp.read(pagesFolder + '/' + sourceImage);
			await image.resize(THUMB_WIDTH, Jimp.AUTO);
			// hard coding for now
			await image.quality(80);
			await image.writeAsync(thumb);
		}
		
		/*
		Ok, let's construct the data we're returning...
		*/
		let comic = {};
		comic.filename = f;
		comic.slug = slugify(f);
		comic.pages = fs.readdirSync(pagesFolder).filter(f => {
			let ext = f.split('.').pop().toLowerCase();
			return ['jpg','gif','png'].indexOf(ext) >= 0;
		}).map(p => {
			return cacheWebDir + '/' + comic.slug + '/pages/' + p;
		});
		comic.thumb = thumb;
		comic.numPages = comic.pages.length;
		comics.push(comic);

	}

	return comics;
};