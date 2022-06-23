---
layout: post
title: "Using PDFs with the Jamstack - Adding Search with Text Extraction"
date: "2021-06-18T18:00:00"
categories: ["javascript","development","jamstack"]
tags: ["eleventy","pdf services","adobe"]
banner_image: /images/banners/search.jpg
permalink: /2021/06/18/using-pdfs-with-the-jamstack-adding-search-with-text-extraction.html
description: Using PDF Extraction to add PDF search to your Jamstack site
---

A few weeks ago I shared a couple of blog posts describing how to add PDFs to your Jamstack site. The [first](https://www.raymondcamden.com/2021/02/25/using-pdfs-with-the-jamstack) talked about the using the Adobe [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) to give you more control over viewing PDFs in an Eleventy site. The [second](https://www.raymondcamden.com/2021/03/16/using-pdfs-with-the-jamstack-now-with-thumbnails) example took it a bit further by using Adobe's [PDF Services](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-services.html) API to generate thumbnails of the PDFs when the Eleventy site was generated. Since I wrote those posts, we (oh, I did tell you I work for Adobe, right?) released a new service, the [PDF Extraction API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-extract.html).

This API extracts information from your PDF, including:

* Text, of course, but deep information about the text, things like it's font, it's position, and so forth.
* Tables as Excel, CSV, or plain images
* Images

There's a huge amount of detail available in the output, but that's of interest to me is the text itself. If our Jamstack site is making use of PDFs, it would be helpful to provide a way for users to search for text contained inside those PDFs. Let's look at an update to the last demo that adds this feature.

First, I worked on the data file I use to get PDF information for the site in general. This file (I'll link to the repo at the end) is found in `_data\pdfs.js`. In the last [post](https://www.raymondcamden.com/2021/03/16/using-pdfs-with-the-jamstack-now-with-thumbnails) the code did two things - find the PDFs and add them to an array and generate a thumbnail for each one (if it didn't exist). My first modification is going to be getting and saving the text content of the PDF. As with the thumbnails, we only do this one time.

```js
let textFile = pdf.replace('.pdf', '.txt');
let text = '';
if(!fs.existsSync(textFile)) {
	console.log('need to generate text '+textFile);

	text = await getPDFText(pdf, creds);
	console.log(`Get text back, length is ${text.length}`);
	fs.writeFileSync(textFile, text);
} else text = fs.readFileSync(textFile,'utf-8');

result.push({
	path:files[i].replace('./','/'),
	name,
	text, 
	thumb
});
```

In the code above, `pdf` is one of the PDF file names and will be `something.pdf`. We want to cache the output so I use the same name with a different extension. The hard work is done in `getPDFText`. Our [docs](https://opensource.adobe.com/pdftools-sdk-docs/release/latest/howtos.html#extract-pdf) go into detail about how this works, but the general flow is:

* Tell the API what you want (text, tables, images)
* Pass that and the PDF to the API
* Get a zip result back
* Extract the zip and do whatever

For the most part it feels pretty simple, but the hard part will be dealing with the zip. Not really hard per se, but you need to find a good Zip library for your platform that's easy to use. I used [node-sream-zip](https://www.npmjs.com/package/node-stream-zip) which seemed to work fine. Here's the entirety of the function:

```js
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
			.then(async () => {

				let zipFile = new StreamZip.async({file: OUTPUT_ZIP });
				let entries = await zipFile.entries();
				let first = Object.values(entries)[0];
				let dest = outputPath + nanoid() + '.' + first.name.split('.').pop();

				await zipFile.extract(first.name, dest);
				await zipFile.close();
				let data = JSON.parse(fs.readFileSync(dest, 'utf-8'));

				let text = data.elements.filter(e => e.Text).reduce((result, e) => {
					return result + e.Text + '\n';
				},'');

				fs.unlinkSync(dest);
				fs.unlinkSync(OUTPUT_ZIP);
				resolve(text);

			})
			.catch(err => reject(err));

	});

}
```

It starts off creating a unique filename for the result zip so that multiple operations don't try to overwrite the same file. The code cleans up after itself but I figured better safe than sorry. Next is setup code for PDF Services, basically just loading the credentials. We then build an operation object, set the parameters (`addElementsToExtract`) and then execute.

At the of this part we'll have a zip file with our data. In that zip is a JSON file that contains every single bit of text data possible from the call. This is a *huge* JSON file and you can grab a [schema file](https://opensource.adobe.com/pdftools-sdk-docs/release/shared/extractJSONOutputSchema2.json) to help make sense of it. Here's one snippet of some sample output:

```json
{
	"Bounds": [
		72,
		603.0959930419922,
		523.8600311279297,
		743.4600067138672
	],
	"Font": {
		"alt_family_name": "Titlingmes New Roman PSMT",
		"embedded": true,
		"encoding": "WinAnsiEncoding",
		"family_name": "Titlingmes New Roman PSMT",
		"font_type": "TrueType",
		"italic": false,
		"monospaced": false,
		"name": "RHNYAF+TimesNewRomanPSMT",
		"subset": true,
		"weight": 400
	},
	"HasClip": false,
	"Lang": "en",
	"Page": 1,
	"Path": "//Document/P[4]",
	"Text": "Performing architecture-level trade studies and mission concept point design studies was a major effort, presenting a number of challenges to the study centers, NASA HQ and the NRC PSDS team.  As a result of this work, many lessons were learned along the way that can benefit future efforts that require similar design team study support.  The PSDS Lessons Learned task was undertaken to identify those lessons learned and make them available for future similar efforts. The approach taken was to send questionnaires to the full range of study participants, including the PSDS science champions and panels, study center leads and team participants (JPL, GSFC, APL, GRC and MSFC), and NASA HQ POCs. The set of responses reflects a complete cross-section of study participants and provides excellent insight into the PSDS mission study process. This report documents the lessons learned. ",
	"TextSize": 12,
	"attributes": {
		"LineHeight": 13.75,
		"SpaceAfter": 18
	}
},
```

To me, the important part is just `Text`, and I use that in my `filter` and `reduce` calls to generate one blob of text. 

The end result of all this is an array of PDF data that includes where the PDF is (I use this so I can render it with the Embed API), a path to the thumbnail (used in the home page for links), and the text content. 

Alright, so at this point, I can build a search engine. I've covered various types of Jamstack friendly search engines here before, but the simplest one would be [Lunr](https://lunrjs.com/). The quick and dirty solution for building the search engine would be to expose my PDF data for indexing by Lunr and then adding a page that uses JavaScript and the Lunr library to search it. First, here is my index:

```
---
permalink: /searchdata.json
---

[
{% raw %}{% for pdf in pdfs %}
	{
		"name": {{pdf.name | jsonify}},
		"url":"/pdf/{{ pdf.name }}",
		"text":{{ pdf.text | jsonify }}

	}{% unless forloop.last %},{% endunless %}
{% endfor %}
{% endraw %}]
```

The `jsonify` filter is one I wrote myself and may be found in `.eleventy.js`:

```js
eleventyConfig.addFilter('jsonify', function (variable) {
	return JSON.stringify(variable);
});
```

I forgot to use an arrow function for that I feel so un-hipster. Sorry. The end result of this is a JSON file containing each PDF, it's url, and the text. In case your spidey-sense is tingling, yes, this could end up being a very large JSON file. I discussed how to use Lunr in a serverless fashion earlier this month: [Using Lunr with Eleventy via Netlify Serverless Functions - Part Two](https://www.raymondcamden.com/2021/06/06/using-lunr-with-eleventy-via-netlify-serverless-functions-part-two) Just keep that in mind as a possible alteration to what I've done here. Now for the front end:

```html
---
layout: main
---

<h2>Search</h2>

<p>
<input type="search" id="term" placeholder="Enter your search here...">
<button id="searchBtn">Search</button>
</p>

<div id="result"></div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>
document.addEventListener('DOMContentLoaded', init, false);

let idx, $term, pdfs, $result;

async function init() {
	console.log('load original data');
	let dataRequest = await fetch('/searchdata.json');
	pdfs = await dataRequest.json();

	idx = lunr(function () {
		this.ref('id');
		this.field('name');
		this.field('text');
		pdfs.forEach(function (doc, idx) {
			doc.id = idx;
			this.add(doc); 
		}, this);
	});
	console.log('Search index created');

	document.querySelector('#searchBtn').addEventListener('click', search, false);
	$term = document.querySelector('#term');
	$result = document.querySelector('#result');

}

function search() {
	if($term.value === '') return;
	console.log(`search for ${$term.value}`);
	let results = idx.search($term.value);
	results.forEach(r => {
		r.name = pdfs[r.ref].name;
		r.url = pdfs[r.ref].url;
	});

	if(results.length > 0) {
		let result = '<p>Search results:</p><ul>';
		results.forEach(r => {
			result += `<li><a href="${r.url}?term=${encodeURIComponent($term.value)}">${r.name}</a></li>`
		});
		result += '</ul>';
		$result.innerHTML = result;
	} else {
		$result.innerHTML = '<p>Sorry, but there we no results.</p>';
	}
}
</script>
```

I'm just using some vanilla JS here to load in the data, pass it to Lunr, and set up the form field and button to handle doing the search. If you want to give this a spin, head over to <https://pdftest3.vercel.app/> and click the Search link on top. A good search term is "launch". To make it even fancier (I'll all about the fancy), I made it such that when you go through to the embedded view, I pass along the search term and use the Embed API to highlight it:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/06/pdfsearch.jpg" alt="PDF Search term highlighting example" class="lazyload imgborder imgcenter">
</p>

You can find the complete source code for this demo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/pdftest3>