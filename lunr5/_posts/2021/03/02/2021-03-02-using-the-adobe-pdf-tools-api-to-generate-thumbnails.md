---
layout: post
title: "Using the Adobe PDF Tools API to Generate Thumbnails"
date: "2021-03-02"
categories: ["javascript"]
tags: ["adobe","pdf services"]
banner_image: /images/banners/eggs2.jpg
permalink: /2021/03/02/using-the-adobe-pdf-tools-api-to-generate-thumbnails
description: How to use the PDF Tools API to create an image thumbnail of a PDF.
---

As folks have noticed, I've been [blogging](https://www.raymondcamden.com/tags/pdf+services) lately about the tools Adobe has for working with PDFs. Broadly speaking these fall under the umbrella of [Adobe Document Services](https://www.adobe.io/apis/documentcloud/dcsdk/). I've focused so far on the [Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) but today I want to share an example of the [Tools API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-tools.html). 

Unlike the previous examples where I used client-side code to display PDFs in a browser, the Tools API are all HTTP based APIs built to let you work with PDF files. You should check the docs for a full set of features, but it allows for things like:

* Creating PDFs from HTML and Office formats. 
* Exporting PDFs to Office or image formats.
* OCRing a PDF to let you use search.
* Protecting, or removing protection, from a PDF.
* Splitting, combining, re-ordering, PDFs as well as adding or removing pages.
* And more.

The feature that interested me the most (and will be used in my next blog post) is the ability to convert a PDF into images. My specific use case was to take a PDF, convert it into images, grab the first page, and resize it into a thumbnail. 

Before I get started sharing my solution, note that unlike the Embed API, Tooling is not free. However, you get a free trial of 1000 API calls over six months. (By that way, to all tech companies that do timed trials. Please consider using a length of time like Adobe has done here. I can't tell you how many times I've signed up for a trial of something and then gotten too busy to use it!) One, very, *very* cool part of the API is how credential creation is handled. 

If you create new credentials from the [Getting Started](https://www.adobe.io/apis/documentcloud/dcsdk/gettingstarted.html) page, you have the opportunity of downloading example code (in a few languages, including Node) that includes your authentication details in the zip itself. After struggling with Google's APIs and their authentication, this was really neat to see. I feel like Adobe's API authentication requirements are a bit complex, but having working samples with my own credentials made testing so much easier. I highly recommend using that option when you sign up, even if you don't plan on looking at the examples for a while.

Alright, so once you have your credentials, you can start using the API. Adobe provides an NPM package you can use like so:

```bash
npm install @adobe/documentservices-pdftools-node-sdk
```

Next, take a look at the [example](https://opensource.adobe.com/pdftools-sdk-docs/release/latest/howtos.html#export-a-pdf-to-images) for exporting a PDF to images. It works by taking a source PDF file, generating an image for each page, and saving it to a zip file.

Here's the example from their pages (and again, if you download the samples you can run it yourself):

```js
// Get the samples from http://www.adobe.com/go/pdftoolsapi_node_sample
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk');

 try {
   // Initial setup, create credentials instance.
   const credentials =  PDFToolsSdk.Credentials
       .serviceAccountCredentialsBuilder()
       .fromFile("pdftools-api-credentials.json")
       .build();

   //Create an ExecutionContext using credentials and create a new operation instance.
   const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
       exportPDF = PDFToolsSdk.ExportPDF,
       exportPdfOperation = exportPDF.Operation.createNew(exportPDF.SupportedTargetFormats.JPEG);

   // Set operation input from a source file
   const input = PDFToolsSdk.FileRef.createFromLocalFile('resources/exportPDFToImageInput.pdf');
   exportPdfOperation.setInput(input);

   // Execute the operation and Save the result to the specified location.
   exportPdfOperation.execute(executionContext)
       .then(result => result.saveAsFile('output/exportPDFToJPEG.zip'))
       .catch(err => {
           if(err instanceof PDFToolsSdk.Error.ServiceApiError
               || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
               console.log('Exception encountered while executing operation', err);
           } else {
               console.log('Exception encountered while executing operation', err);
           }
       });
} catch (err) {
   console.log('Exception encountered while executing operation', err);
}
```

This boils down to:

* Point to the authentication
* Point to a local PDF
* Export to a zip

The end result is a zip of every image. Here's an example:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/pdft.jpg" alt="Zip listing" class="lazyload imgborder imgcenter">
</p>

So given that we've got a way to create a zip of images, what I need to do is take this, extract out the first file (which should represent the first page of the PDF), and then resize it so it's appropriate for a thumbnail.

Here's my script, bit by bit, and I'll share the entire script at the end. First, I generate the zip.

```js
//test pdf file
let pdf = './fw9.pdf';

let zip = await generateImageZip(pdf, credsPath, outputPath);
```

My `generateImageZip` function is just a more dynamic version of the code above:

```js
async function generateImageZip(pdfPath, credsPath, outputPath) {

	return new Promise((resolve, reject) => {

		let output = outputPath + nanoid() + '.zip';

		const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder()
		.fromFile(credsPath)
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
```

Note the use of `nanoid` in there. This is a [npm package](https://www.npmjs.com/package/nanoid) for generating a unique string appropriate for a file name. 

Next I need to get the first file from the zip file. I used the npm package [node-stream-zip](https://www.npmjs.com/package/node-stream-zip). Here's how it's called:

```js
let dest = await extractFirstFile(zip, outputPath);
console.log(`image extracted to ${dest}`);
```

And here's the function:

```js
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
```

I'm *very* unsure about this part: `let first = Object.values(entries)[0];` Everything I know about objects tells me that there is no order to the keys (or values), but this seemed to work well. I'd feel better getting all the file names, do a custom sort to find `_1`, and then returning that, but again this seemed to work. Just know I've got reservations. At the end of this, we've got a file name for the extracted image.

To handle resizing it, I used [jimp](https://www.npmjs.com/package/jimp). In the main portion of my script I call my function like so:

```js
await makeThumbnail(dest, 200, 80);
console.log('Done resizing image.');
```

And here's the actual logic:

```js
async function makeThumbnail(path, width, quality) {

	const image = await Jimp.read(path);
	await image.resize(width, Jimp.AUTO);
	await image.quality(quality);
	await image.writeAsync(path);
	return true;

}
```

I'm resizing it and setting a quality. Normally I'd probably save it to a new file, but I just overwrite the original. Here's the entire script:

```js
const PDFToolsSdk = require('@adobe/documentservices-pdftools-node-sdk');
const nanoid = require('nanoid').nanoid;
const StreamZip = require('node-stream-zip');
const Jimp = require('jimp');
const fs = require('fs');

const credsPath = './pdftools-api-credentials.json';

//path to store crap
const outputPath = './output/';

(async () => {

	//test pdf file
	let pdf = './fw9.pdf';
	
	let zip = await generateImageZip(pdf, credsPath, outputPath);
	console.log(`image generated from source ${pdf} at ${zip}`);

	let dest = await extractFirstFile(zip, outputPath);
	console.log(`image extracted to ${dest}`);

	await makeThumbnail(dest, 200, 80);
	console.log('Done resizing image.');

	//cleanup
	fs.unlinkSync(zip);

})();

async function generateImageZip(pdfPath, credsPath, outputPath) {

	return new Promise((resolve, reject) => {

		let output = outputPath + nanoid() + '.zip';

		const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder()
		.fromFile(credsPath)
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
```

And here's an example I got from a lovely IRS form.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/thumb.jpg" alt="Thumbnail" class="lazyload imgborder imgcenter">
</p>

In the next post, I'm going to show how to take this and employ it with Eleventy!

<span>Photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/s/photos/images?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>