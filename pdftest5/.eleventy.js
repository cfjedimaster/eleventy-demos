const pdfSDK = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const { nanoid } = require('nanoid');
const creds = './pdftools-api-credentials.json';


module.exports = function(eleventyConfig) {

	eleventyConfig.addTransform("toPDF", async function(content) {
		console.log( `this.inputPath-${this.inputPath}, this.outputPath=${this.outputPath}`);
		
		if(this.outputPath.toLowerCase().endsWith('.pdf')) {
			console.log('make this one a pdf');
			let htmlFile = `./tmp/${nanoid()}.html`;
			let pdfFile = `./tmp/${nanoid()}.pdf`;

			fs.writeFileSync(htmlFile, content);
			let pdf = await createPDF(htmlFile, creds);
			await pdf.saveAsFile(pdfFile);
			let contents = fs.readFileSync(pdfFile, 'binary');

			fs.unlinkSync(htmlFile); fs.unlinkSync(pdfFile);
			return Buffer.from(contents,'binary');
		} else return content;

	});

	eleventyConfig.ignores.add('private.key');
	eleventyConfig.ignores.add('tmp/**');
	eleventyConfig.ignores.add('pdftools-api-credentials.json');

};


async function createPDF(source, creds) {

	return new Promise((resolve, reject) => {

		const credentials =  pdfSDK.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile(creds)
		.build();

		const executionContext = pdfSDK.ExecutionContext.create(credentials),
				createPdfOperation = pdfSDK.CreatePDF.Operation.createNew();

		// Set operation input from a source file
		const input = pdfSDK.FileRef.createFromLocalFile(source);
		createPdfOperation.setInput(input);

		// Execute the operation and Save the result to the specified location.
		createPdfOperation.execute(executionContext)
		.then(result => resolve(result))
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