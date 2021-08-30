const fs = require('fs').promises;
const pdfSDK = require('@adobe/pdfservices-node-sdk');

require('dotenv').config()

const creds = {
	clientId:process.env.ADOBE_CLIENT_ID,
	clientSecret:process.env.ADOBE_CLIENT_SECRET,
	privateKey:process.env.ADOBE_KEY,
	organizationId:process.env.ADOBE_ORGANIZATION_ID,
	accountId:process.env.ADOBE_ACCOUNT_ID
}

// main directory of documents
const LIB = './documentLibrary/';

// where we store PDF version of documents
const PDFDIR = './documentLibrary/pdfversions/';

// supported extensions for convertin' to PDF
// note we aren't including images here, we'll just show em as is (nor txt)
const SUPPORTED_EXTS = ['doc', 'docx', 'ppt', 'pptx', 'xlsx', 'txt', 'rtf'];

//https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));

	return arr.filter((_v, index) => results[index]);
}

module.exports = async function() {
	console.log('running _data/documents.js');
	let entries = await fs.readdir(LIB, { withFileTypes: true} );

	/*
	files will represent _all_ the objects in our doc library
	*/
	let files = entries.filter(f => !f.isDirectory()).map(f => LIB + f.name);

	/*
	Ok, so files is a set of names of files in my directory w/ subdirs filtered out.
	For each file that is NOT a pdf AND we support conversion AND there is no converted file, we need to convert
	*/
	console.log(files);
	let filesToConvert = await asyncFilter(files, async f => {
		let ext = f.split('.').pop();
		if(SUPPORTED_EXTS.indexOf(ext) === -1) return false;

		let pdfVersion = pdfFile(f);
		console.log('name of pdf version',pdfVersion);
		let exists = true;
		try {
			await fs.stat(pdfVersion);
		} catch(e) {
			exists = false;
		}
		if(!exists) return true;		
		// shouldn't be able to get here, but just in case...
		return false;
	});
	console.log('files to convert', filesToConvert);
	/*
	files to convert are files in our lib we CAN convert to PDF that we haven't.
	*/

	if(filesToConvert.length) {
		let ops = [];
		for(let i=0;i<filesToConvert.length;i++) {
			console.log('convert '+filesToConvert[i]+' to '+pdfFile(filesToConvert[i]));
			ops.push(convertToPDF(filesToConvert[i], pdfFile(filesToConvert[i]), creds));
		}
		let done = await Promise.all(ops);
		console.log('Done converting my files to PDF');

	}

	/*
	ok, so now we need to return our data properly, an array of obs with .path being the orig doc, and .pdfpath 
	being the pdf version, if it exists
	*/
	return [];
}

// utility func to go from /foo.docx to /foo/pdfdir/foo.pdf
function pdfFile(s) {		
	//remove path
	s = s.replace(LIB, '');
	let parts = s.split('.');
	parts.pop();
	let filename = parts.join('.');
	let pdfVersion = PDFDIR + filename + '.pdf';
	return pdfVersion;
}

/*
ray, its create, not export
*/

async function convertToPDF(source,output,creds) {

    return new Promise((resolve, reject) => {

		const credentials = pdfSDK.Credentials.serviceAccountCredentialsBuilder()
		.withClientId(creds.clientId)
		.withClientSecret(creds.clientSecret)
		.withPrivateKey(creds.privateKey)
		.withOrganizationId(creds.organizationId)
		.withAccountId(creds.accountId)
		.build();

		const executionContext = pdfSDK.ExecutionContext.create(credentials),
				createPDFOperation = pdfSDK.CreatePDF.Operation.createNew();

		// Set operation input from a source file
		const input = pdfSDK.FileRef.createFromLocalFile(source);
		createPDFOperation.setInput(input);

		// Execute the operation and Save the result to the specified location.
		createPDFOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(() => resolve())
		.catch(err => {
			if(err instanceof pdfSDK.Error.ServiceApiError
			|| err instanceof pdfSDK.Error.ServiceUsageError) {
				reject(err);
			} else {
				reject(err);
			}
		});

	});

}
