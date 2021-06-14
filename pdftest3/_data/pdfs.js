
require('dotenv').config()

const globby = require('globby');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
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

		//do we have a thumb, if so, its /path/foo.pdf => /path/foo.jpg
		let thumb = pdf.replace('.pdf', '.jpg');
		if(!fs.existsSync(thumb)) {
			console.log('need to generate thumb '+thumb);

			let zip = await generateImageZip(pdf, creds, outputPath);
			console.log(`image generated from source ${pdf} at ${zip}`);

			let dest = await extractFirstFile(zip, outputPath);
			console.log(`image extracted to ${dest}`);

			await makeThumbnail(dest, 200, 80);
			console.log('Done resizing image.');

			//move to a new filename based on nanoid
			fs.renameSync(dest, thumb);

			//cleanup
			fs.unlinkSync(zip);
		}

		let text = pdf.replace('.pdf', '.txt');
		if(!fs.existsSync(text)) {
			console.log('need to generate text '+text);

			let textContent = await getPDFText(pdf, creds);
			console.log(`Get text back, length is ${textContent.length}`);

		}

		result.push({
			path:files[i],
			name,
			thumb
		});
	}

	return result;
};

async function generateImageZip(pdfPath, creds, outputPath) {

	return new Promise((resolve, reject) => {

		let output = outputPath + nanoid() + '.zip';

		const credentials = PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
		.withClientId(creds.clientId)
		.withClientSecret(creds.clientSecret)
		.withPrivateKey(creds.privateKey)
		.withOrganizationId(creds.organizationId)
		.withAccountId(creds.accountId)
		.build();

		const executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
			exportPDF = PDFServicesSdk.ExportPDF,
			exportPdfOperation = exportPDF.Operation.createNew(exportPDF.SupportedTargetFormats.JPEG);

		const input = PDFServicesSdk.FileRef.createFromLocalFile(pdfPath);
		exportPdfOperation.setInput(input);

		exportPdfOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(r => {
			resolve(output);
		})
		.catch(err => {
			if(err instanceof PDFServicesSdk.Error.ServiceApiError
					|| err instanceof PDFServicesSdk.Error.ServiceUsageError) {
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

async function getPDFText(path, creds) {

	return new Promise((resolve, reject) => {

		const OUTPUT_ZIP = `./output${nanoid()}.zip`;

		const credentials = PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
		.withClientId(creds.clientId)
		.withClientSecret(creds.clientSecret)
		.withPrivateKey(creds.privateKey)
		.withOrganizationId(creds.organizationId)
		.withAccountId(creds.accountId)
		.build();

		// Create an ExecutionContext using credentials
		const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

		// Build extractPDF options
		const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
				.addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT).build()

		// Create a new operation instance.
		const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
			input = PDFServicesSdk.FileRef.createFromLocalFile(
				path,
				PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
			);

		extractPDFOperation.setInput(input);
		extractPDFOperation.setOptions(options);

		// Execute the operation
		extractPDFOperation.execute(executionContext)
			.then(result => result.saveAsFile(OUTPUT_ZIP))
			.then(() => {
				let zip = new AdmZip(OUTPUT_ZIP);		
				let zipEntries = zip.getEntries(); // an array of ZipEntry records
				// we output to the same filename but I _think_ we are ok as we are single threading these
				zip.extractEntryTo("structuredData.json", "./", false, true);
				fs.unlinkSync(OUTPUT_ZIP);

				let data = JSON.parse(fs.readFileSync('./structuredData.json', 'utf-8'));

				let text = data.elements.filter(e => e.Text).reduce((result, e) => {
					return result + e.Text + '\n';
				},'');

				fs.unlinkSync('./strucutredData.json');
				resolve(text);

			})
			.catch(err => reject(err));

	});

}