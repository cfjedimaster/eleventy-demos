require('dotenv').config();
const globby = require('globby');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const AdmZip = require('adm-zip');
const nanoid = require('nanoid').nanoid;

let pdf_dir = './src/pdfs/';
let cache_dir = './scanned_pdfs/';

// Adobe Acrobat Services stuff
const credentials =  PDFServicesSdk.Credentials
	.servicePrincipalCredentialsBuilder()
	.withClientId(process.env.ADOBE_CLIENT_ID)
	.withClientSecret(process.env.ADOBE_CLIENT_SECRET)
	.build();

module.exports = async () => {

	let files = await globby(`${pdf_dir}**/*.pdf`);
	let result = [];

	for(let i=0; i<files.length; i++) {
		let pdf = files[i];
		let name = pdf.split('/').pop().replace('.pdf','.txt');
		let pdfText;
		if(!fs.existsSync(cache_dir + name)) {
			console.log('need to generate', name);
			pdfText = await getPDFText(pdf);
			fs.writeFileSync(cache_dir + name, pdfText, 'utf8');
		} else pdfText = fs.readFileSync(cache_dir + name, 'utf8');

		/*
		pdf looks like, ./src/pdfs/X.pdf, which is fine for working with, but in the generated site, 
		we really want /pdfs/X.pdf. So while "src" is configurable and not necessarily safe to assume, 
		I'm going to do so anyway because I live on the edge.
		*/
		pdf = pdf.replace('./src/', '/');
		
		result.push({
			pdf,
			pdfText
		});
	}

	return result;

}

async function getPDFText(path) {

	// Used to store the result on the file system
	const output = `./output${nanoid()}.zip`;

	const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
	const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
    	input = PDFServicesSdk.FileRef.createFromLocalFile(
        	path, 
        	PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
    	);

	const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
	.addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT).build()

	extractPDFOperation.setInput(input);
	extractPDFOperation.setOptions(options);

	let result = await extractPDFOperation.execute(executionContext);
	await result.saveAsFile(output);

	let zip = new AdmZip(output);

    let jsondata = zip.readAsText('structuredData.json');
    let data = JSON.parse(jsondata);

	let text = '';
	data.elements.forEach(e => {
		if(e.Text) text += e.Text + '\n';
	});

	// clean up zip
	fs.unlinkSync(output);

	return text;

}