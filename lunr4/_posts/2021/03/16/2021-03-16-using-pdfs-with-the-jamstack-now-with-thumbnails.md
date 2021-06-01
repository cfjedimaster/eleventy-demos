---
layout: post
title: "Using PDFs with the Jamstack - Now with Thumbnails"
date: "2021-03-16"
categories: ["javascript","development","static sites"]
tags: ["adobe","pdf services","eleventy"]
banner_image: /images/banners/papers.jpg
permalink: /2021/03/16/using-pdfs-with-the-jamstack-now-with-thumbnails
description: Combing Adobe PDF APIs with Eleventy to create PDF Thumbnails
---

A few weeks ago I [posted](https://www.raymondcamden.com/2021/02/25/using-pdfs-with-the-jamstack) a tutorial on using PDFs with [Eleventy](https://www.11ty.dev/). In that post I described how to use a data file to scan a directory of PDFs and make them available to a Liquid template. I then followed up that post with another, where I [described](https://www.raymondcamden.com/2021/03/02/using-the-adobe-pdf-tools-api-to-generate-thumbnails) using Adobe's [PDF Tools API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-tools.html) to generate thumbnail images from PDFs. I thought it would be nice to combine the two so I could have my Eleventy site both list the PDFs as well as generate thumbnails. Here's how that looks with me spending about five seconds on layout:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/03/pdf11_1.jpg" alt="Screenshot of PDF demo" class="lazyload imgborder imgcenter">
</p>

So how did I do it? Keep in mind I described most of the process in my earlier post (["Using the Adobe PDF Tools API to Generate Thumbnails"](https://www.raymondcamden.com/2021/03/02/using-the-adobe-pdf-tools-api-to-generate-thumbnails)). The process boils down to:

* Use Adobe's PDF Tools API to generate a zip of images for each page of the PDF
* Extract the first file from the zip
* Resize

I took that logic and combined it with the code from the first demo (["Using PDFs with the Jamstack"](https://www.raymondcamden.com/2021/02/25/using-pdfs-with-the-jamstack)). That process was:

* Use a glob pattern to get PDFs
* Create an array of those PDFs with names and such to make them easier to use in Liquid
* Use [Eleventy pagination](https://www.11ty.dev/docs/pagination/) to generate an HTML page per PDF
* Use the Adobe [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) to render the PDF in the HTML layout

Here's the updated data file (named `pdfs.js`):

```js

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

		//do we have a thumb, if so, its /path/foo.pdf => /path/foo.jpg
		let thumb = pdf.replace('.pdf', '.jpg');
		if(!fs.existsSync(thumb)) {
			console.log('need to generate '+thumb);

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

		result.push({
			path:files[i],
			name,
			thumb
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
```

That's a bit long, but let me point out the highlights. First off, I modified my use of Adobe's Node SDK to use variables instead of files. This let me store everything in a `.env` file that would be regular environment variables in production. That makes the initial setup a few more lines of code, but the code is safer to check into source control now:

```js
const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder()
.withClientId(creds.clientId)
.withClientSecret(creds.clientSecret)
.withPrivateKey(creds.privateKey)
.withOrganizationId(creds.organizationId)
.withAccountId(creds.accountId)
.build();
```

I still use a glob to get my PDFs, but now I look for a corresponding filename with the `.jpg` extension. If it doesn't exist, I generate the thumbnail. This makes it quite a bit more performant. In my initial version I simply regenerated it everytime, but while the API was pretty fast, that's still a lot of work I don't need to do more than once. 

The other change was to include the thumb filename in the result data:

```js
result.push({
	path:files[i],
	name,
	thumb
});
```

And really, that's it. As I said, I did modify the homepage to show the thumbnails and used a bit of CSS, so if you're curious, you can peruse the entire codebase here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/pdftest2>

