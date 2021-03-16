
require('dotenv').config()

const globby = require('globby');
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk');
const nanoid = require('nanoid').nanoid;
const StreamZip = require('node-stream-zip');
const Jimp = require('jimp');
const fs = require('fs');

let creds = {
	clientId:process.env.ADOBE_CLIENT_ID,
	clientSecret:process.env.ADOBE_CLIENT_SECRET,
	privateKey:process.env.ADOBE_KEY,
	organizationId:process.env.ADOBE_ORGANIZATION_ID,
	accountId:process.env.ADOBE_ACCOUNT_ID
}

const outputPath = './tmp/';

const thumbPath = "images/thumbs/";

module.exports = async function() {
	let result = [];

	let files = await globby('./pdfs/**/*.pdf');

	for(let i=0; i < files.length; i++) {
		let pdf = files[i];

		//name safe for a directory
		let name = pdf.split('/').pop().replace('.pdf', '');

		let zip = await generateImageZip(pdf, creds, outputPath);
		console.log(`image generated from source ${pdf} at ${zip}`);

		let dest = await extractFirstFile(zip, outputPath);
		console.log(`image extracted to ${dest}`);

		await makeThumbnail(dest, 200, 80);
		console.log('Done resizing image.');

		//move to a new filename based on nanoid
		let newFilename = thumbPath + nanoid() + ".jpg";
		fs.renameSync(dest, newFilename);

		//cleanup
		fs.unlinkSync(zip);

		result.push({
			path:files[i],
			name:name,
			thumb:newFilename
		});
	}

	return result;
};

async function generateImageZip(pdfPath, credsPath, outputPath) {

	return new Promise((resolve, reject) => {

		let output = outputPath + nanoid() + '.zip';

		const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder()
		.withClientId(creds.clientId)
		.withClientSecret(creds.clientSecret)
		.withPrivateKey(creds.privateKey)
		.withOrganizationId(creds.organizationId)
		.withAccountId(creds.accountId)
		.build();

		const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
			exportPDF = PDFToolsSdk.ExportPDF,
			exportPdfOperation = exportPDF.Operation.createNew(exportPDF.SupportedTargetFormats.JPEG);

		const input = PDFToolsSdk.FileRef.createFromLocalFile(pdfPath);
		exportPdfOperation.setInput(input);

		exportPdfOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(r => {
			resolve(output);
		})
		.catch(err => {
			if(err instanceof PDFToolsSdk.Error.ServiceApiError
					|| err instanceof PDFToolsSdk.Error.ServiceUsageError) {
					console.log('Exception encountered while executing operation', err);
			} else {
					console.log('Exception encountered while executing operation', err);
				}
		});
	});
}

async function extractFirstFile(zip, outputPath) {

	return new Promise(async (resolve, reject) => {
		// Read the zip and extract the first file
		let zipFile = new StreamZip.async({file: zip });

		const entries = await zipFile.entries();
		let first = Object.values(entries)[0];

		let dest = outputPath + nanoid() + '.' + first.name.split('.').pop();

		await zipFile.extract(first.name, dest );
		await zipFile.close();
		resolve(dest);
	});
}

async function makeThumbnail(path, width, quality) {

	const image = await Jimp.read(path);
	await image.resize(width, Jimp.AUTO);
	await image.quality(quality);
	await image.writeAsync(path);
	return true;

}