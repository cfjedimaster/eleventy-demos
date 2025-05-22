---
layout: post
title: "Using PDFs with the Jamstack - Building a Document Viewer"
date: "2021-08-30T18:00:00"
categories: ["static sites"]
tags: "post"
description: Using Adobe PDF Services to build a document viewer for your Jamstack site
---

I've been blogging quite a bit about how to integrate Adobe's [PDF Services](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-services.html) with the Jamstack ([11ty](https://www.11ty.dev) specifically but applicable to any generator) and today's I think is pretty cool. One of the features of our PDF API is the ability to [convert](https://opensource.adobe.com/pdftools-sdk-docs/release/latest/howtos.html#create-pdf) documents into PDF. I thought it would be interesting to use that as a way to provide a consistent document viewing experience using PDF and the free [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html). Here's what I came up, and as always, comments and suggestions are welcome!

### The Setup

My intent was to create something that would be simple to use and not require any technical knowledge of the person who owns the final site. To enable that, there's one folder (`documentLibrary`) that will contain all the files they will want visible on the site. 

Under this folder will be one subdirectory, `pdfversions`, which contains generated PDF versions of files. What files get converted? 

If you check our [docs](https://opensource.adobe.com/pdftools-sdk-docs/release/latest/howtos.html#create-pdf), we support the following:

* Microsoft Word (DOC, DOCX)
* Microsoft PowerPoint (PPT, PPTX)
* Microsoft Excel (XLS, XLSX)
* Text (TXT, RTF)
* Image (BMP, JPEG, GIF, TIFF, PNG)

However it doesn't make sense to convert images to PDFs since the browser can render that just fine. (Technically it can render many of these, but we want to provide a consistent experience in our site UI.) 

On startup, our site will scan the document library folder and find files that *can* be converted. But it will first see if they have been previously converted and if so, will not bother. 

At the end, it will return Eleventy data consisting of an array of documents that we can then render out. 

### Part One - Setting up the Data

First, let me share how I created the data values that will be used later on in the Eleventy templates. This file (`_data/documents.js`) is pretty important. It scans the library, figures out what it needs to convert to PDF, and is responsible for outputting the result in such a way that the templates can use it later on.

I went through a couple of different iterations on this, but here's the final version:

```js
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
```

I tried to document the code as much as possible, but here's how it breaks down. I begin by scanning my directory for documents. For each one, we see if we can and need to convert. If so, that process is fired off. Note that it does take time for our APIs to convert your code. In my test files (which are in the repository), it took almost two minutes, but two of the files were rather large so this isn't surprising, and it's also a one time hit. Once a PDF version exists, there's no need to create it again. 

I *really* went back and forth with exactly how to output the data. I ended up changing this a few times when I built my templates. I figure it's better to do more work in the data area if it helps keep the templates a bit more simple. 

The final bit of code, `convertToPDF`, simply wraps our documented example in a nice function that's easy to call. 

### Part Two - The Templates

My "site" is relatively simple - two templates. (There's also layout files, CSS, etc, all available in the repository.) The two templates cover the home page and then one 'view' page per document. Let's look at the home page first:

```html
---
layout: main
title: Document Library
---

<h2>Document Library</h2>

<ul>
{% raw %}{% for file in documents %}
<li><a href="/view/{{ file.slug | slug }}">{{ file.name}}</a></li>
{% endfor %}
{% endraw %}
```

So nothing really too exciting here - a bulleted list that iterates over my document data. The only kinda weird part may be this:

```
{% raw %}{{ file.slug | slug }}{% endraw %}
```

So I wanted to link to a URL based on the original file name, but not with the extension. So back in my data file, I took something like `/documentLibrary/cat.docx` and removed everything but the file name without the extension. With the previous example, that would be `cat`. However, I still wanted something URL safe, and given that a document could be named `cats are better than dogs.docx`, I'd use the `slug` filter to turn that into `cats-are-better-than-dogs`. I'm not happy with slug/slug there, but, it works. Here's how this renders using my lovely Boostrap layout:

<p>
<img src="https://static.raymondcamden.com/images/2021/08/doclib1.jpg" alt="Bulleted list of documents" class="lazyload imgborder imgcenter">
</p>

The template that handles documents is a bit more complex. It needs to handle using the PDF Embed... when it can... and then either rendering an image or just plain giving up (mostly). Here's that template.

```html
{% raw %}
---
layout: main
pagination:
  data: documents
  size: 1
  alias: document
# why slug | slug? slug is the filename minus extension, but for spaces
# and stuff, we want it replaced via the slug filter
permalink: "view/{{ document.slug | slug }}/index.html" 
---
<h2>Viewing {{document.name}}</h2>

{% if document.pdfpath %}

	<div id="pdfview"></div>

	<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
	<script type="text/javascript">
	const KEY = '9861538238544ff39d37c6841344b78d';

	document.addEventListener("adobe_dc_view_sdk.ready", async () => {
		let adobeDCView = new AdobeDC.View({clientId: KEY, divId: "pdfview"});
		adobeDCView.previewFile(
		{
			content:   {location: {url: "{{ document.pdfpath }}"}},
			metaData: {fileName: "{{document.name}}"}
		});

	});
	</script>

{% elsif document.image %}
	<img src="{{document.path}}" class="imagePreview">
{% else %}
	<p>
	We're unable to show a render of this document, but you can download it below.
	</p>
{% endif %}

<p class="downloadBtn">
<a href="{{document.path}}" download class="btn btn-primary" role="button">Download Original File</a>
</p>{% endraw %}
```

Alright, so how in the heck is this working? If you remember back up in the data file, I use `pdfpath` to represent the path to either the original document, if it's a PDF, or to the converted path. This then lets me use the Embed API for any of those documents.

Then we either show the image as is, or a message saying we can't render it.

While the Embed API has save functionality built in, I always include a link at the bottom that lets you download the image. Thank you handly `download` attribute, I love you.

Here's an example where the Embed API is rendering a PDF version of a Powerpoint:

<p>
<img src="https://static.raymondcamden.com/images/2021/08/doclib2.jpg" alt="Web page with PDF embed rendering a Powerpoint presentation" class="lazyload imgborder imgcenter">
</p>

If you would like to see the complete repository, you can check it out here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/pdftest4> Enjoy and ask for help if you need it!

Photo by <a href="https://unsplash.com/@iammrcup?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mr Cup / Fabien Barral</a> on <a href="https://unsplash.com/s/photos/documents?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  