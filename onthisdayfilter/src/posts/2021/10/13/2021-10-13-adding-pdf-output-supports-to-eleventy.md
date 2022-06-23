---
layout: post
title: "Adding PDF Output Support to Eleventy"
date: "2021-10-13T18:00:00"
categories: ["jamstack"]
tags: ["eleventy","adobe","pdf services"]
banner_image: /images/banners/transformers.jpg
permalink: /2021/10/13/adding-pdf-output-supports-to-eleventy.html
description: Using Eleventy transforms and Adobe PDF Services to create dynamic PDFs.
---

I've blogged a few times now about integrating [Adobe PDF Services](https://www.adobe.io/apis/documentcloud/dcsdk/) with [Eleventy](https://www.11ty.dev/), but so far my examples have either been for supporting existing PDFs or [converting documents](https://www.raymondcamden.com/2021/08/30/using-pdfs-with-the-jamstack-building-a-document-viewer) into PDFs for a consistent viewing expirement. Today's test is yet another example of something that may not be a good idea, but it worked, and it's cool, so I'm sharing it!

I was thinking about how one could take a regular Eleventy template and have it output PDF instead of HTML. Eleventy already lets you output whatever you want. So for example, you could use your favorite template language to create dynamic JSON and tell Eleventy to save it with a JSON file extension. This works for anything really, so for example, my [RSS feed](https://www.raymondcamden.com/feed.xml). This wouldn't really work for binary style formats though.

On a whim, I took a look at Eleventy's [transforms](https://www.11ty.dev/docs/config/#transforms) feature. This feature lets you take the output of any template (after it's been parsed) and transform it. The [minification](https://www.11ty.dev/docs/config/#transforms-example-minify-html-output) example from their docs works great and I use it here:

```js
eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
	if( outputPath.endsWith(".html") ) {
		let minified = htmlmin.minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true
		});
		return minified;
	}

	return content;
});
```

Looking at this, I wondered what would happen if I tried to make a PDF inside a transform like this. I began with a simple Liquid template:

```html
{% raw %}---
layout: main
title: two
permalink: "{{page.fileSlug}}.pdf"
---

<h1>Hello</h1>

<p>
<img src="https://placekitten.com/400/400">
</p>

<p>
The time is {{ "now" | date: "%Y-%m-%d %H:%M" }}
{% endraw %}
</p>
```

While most of the content is just regular old stuff, notice how in the permalink I tell Eleventy to save it as a PDF file, not HTML. I used `page.fileSlug` so I didn't have to type in the real filename. 

With this in mind, I then added a basic transform:

```js
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
```

So what's going on here? First, I look at the output path and see if it's PDF. If not, I return the content as is. But otherwise, I create a PDF. This is done by taking the contents and saving it as an HTML file. Our [HTML to PDF](https://opensource.adobe.com/pdftools-sdk-docs/release/latest/howtos.html#create-a-pdf-from-static-html) API requires either a file or a URL so I need to save it temporarily. I'm using `nanoid()` to ensure the filename is unique. I pass this to a utility function I wrote, `createPDF` which handles wrapping the calls to our service. When it's done, I save the file, read in the binary data, and return it. (I also clean up the temporary files.) A few important things to note here.

Our API supports giving you a stream access to the data so I didn't have to save the PDF to the filesystem, but I'm *really* unsure how to use streams. I took the easy way out. 

This line in particular took me a while to figure out:

```js
return Buffer.from(contents,'binary');
```

Initially I just returned `contents`, but the PDF was corrupt. While testing, I temporarily changed my return statement to return null, and when I did, I got this error:

```
[11ty] TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received null
```

I noticed the `or Buffer` part and that's when I swiched to using `Buffer.from` and that's when it started working well. Despite the error message from Eleventy, I'm not entirely sure I'm supposed to be doing that. I filed [this issue](https://github.com/11ty/eleventy/issues/2023) to ask the docs to be clarified on it or the feature to be removed. (Not transforms, but being able to return non-string results.) Here's an example of the output:

<div id="adobe-dc-view" style="height: 600px; width: 600px;"></div>
<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
<script type="text/javascript">
let clientId = (location.host.indexOf('raymondcamden.com')>0)?'33f07f2305444579a56b088b8ac1929e':'9861538238544ff39d37c6841344b78d';
if(window.AdobeDC) displayPDF();
else document.addEventListener("adobe_dc_view_sdk.ready", () => displayPDF());
function displayPDF() {
    let adobeDCView = new AdobeDC.View({clientId: clientId, divId: "adobe-dc-view"});
    adobeDCView.previewFile({
      content:{ location: { url: "https://static.raymondcamden.com/enclosures/test.pdf"}},
      metaData:{fileName: "test.pdf"}
    }, { embedMode: "SIZED_CONTAINER" });
};
</script>

As I said, the `createPDF` call just wraps our SDK. But here it is:

```js
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
```

The complete source code for this demo may be found here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/pdftest5>
As always, let me know what you think!

Photo by <a href="https://unsplash.com/@iqram_shawon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Iqram-O-dowla Shawon</a> on <a href="https://unsplash.com/s/photos/transformers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  