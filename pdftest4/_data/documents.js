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
const IMAGES = ['gif','jpg','jpeg','png'];

//https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));

	return arr.filter((_v, index) => results[index]);
}

module.exports = async function() {
	console.log('running _data/documents.js');
	let entries = await fs.readdir(LIB, { withFileTypes: true} );
	/*
	Our final result is an array of objects such that:
		name, just the filename, no path
		path points to the file
		pdfpath points to pdf version
		slug - filenamne minus extension
		image - true for images (duh)

		to make things simpler, for an original PDF that doesn't need 
		converting, pdfpath == path
	*/
	let data = [];

	let files = entries.filter(f => !f.isDirectory()).map(f => LIB + f.name);

	for(let i=0; i<files.length; i++) {

		// remove ./ from path as we need a web safe path
		let dataOb = {
			path: files[i].replace('./','/'),
			name: files[i].replace(LIB, ''), 
			image: false
		}
		dataOb.slug = dataOb.name.split('.').slice(0,-1).join('.');

		// is this something we can convert to pdf, if we need to

		let ext = files[i].split('.').pop();
		if(SUPPORTED_EXTS.indexOf(ext) !== -1) {

			let pdfVersion = pdfFile(files[i]);
			let pdfVersionExists = true;
			try {
				await fs.stat(pdfVersion);
			} catch {
				pdfVersionExists = false;
			}
			console.log('do i need to make a pdf for '+files[i]+', named '+pdfVersion+', '+pdfVersionExists);
			if(!pdfVersionExists) {
				await convertToPDF(files[i], pdfVersion, creds);
			}

			dataOb.pdfpath = pdfVersion.replace('./', '/');
		} else if(ext === 'pdf') {
			dataOb.pdfpath = dataOb.path;
		} else if(IMAGES.indexOf(ext) !== -1) {
			dataOb.image = true;
		} 
		data.push(dataOb);
	}
	console.log(data);

	return data;
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
