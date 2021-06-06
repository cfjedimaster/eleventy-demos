---
layout: post
title: "Using PDFs with the Jamstack"
date: "2021-02-25"
categories: ["development","javascript","static sites"]
tags: ["eleventy","adobe","pdf services"]
banner_image: /images/banners/papers.jpg
permalink: /2021/02/25/using-pdfs-with-the-jamstack
description: Using the Adobe PDF Embed API to view PDFs on your Jasmstack site
---

Earlier this week I spent some time working on a demo that combined the Jamstack (with [Eleventy](https://www.11ty.dev/) of course) and the ability to work with PDFs. I recently [blogged](https://www.raymondcamden.com/2021/02/17/using-the-pdf-embed-api-with-vuejs) about using Adobe's free [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) with Vue.js and I thoughbt it would be interesting to tie this in with a Jamstack example. Here's what I came up with.

First, I <strike>stole</strike>borrowed a bunch of PDFs from the IRS. I figure they own me a few PDFs, right? I grabbed around ten or so and put them into two subdirectories based on whether they were a form or instructions for a form (and to be clear, I didn't *really* check, I just kinda threw some around):

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/pdfj1.jpg" alt="Screen shot of a list of PDF files" class="lazyload imgborder imgcenter">
</p>

With my source material available, the first thing I had to do was ensure the PDFs ended up being available on the static site. By default, Eleventy is going to ignore the PDFs as they aren't recognized as supported files (much like it ignores JavaScript, CSS, and images). This is easy enough to fix with [passthrough copy](https://www.11ty.dev/docs/copy/). I added the following to my `.eleventy.js`:

```js
eleventyConfig.addPassthroughCopy("pdfs");
```

This will recursively grab my `pdfs` folder and the files underneath it. That part was relatively simple. (Although I think this particular aspect - the "dont copy what I don't recognize" is the single most common thing I screwed up when learning Eleventy!) 

Next, I need to make Eleventy "aware" of the PDF data. I can't use [Collections](https://www.11ty.dev/docs/collections/) feature as it only works with files Eleventy recognizes. Instead I can use the [Data](https://www.11ty.dev/docs/data/) feature which lets you add pretty much anything you want. Inside of `_data`, I created `pdfs.js`:

```js
const globby = require('globby');

module.exports = async function() {
	let result = [];

	let files = await globby('./pdfs/**/*.pdf');
	
	for(let i=0; i < files.length; i++) {
		//name safe for a directory
		let name = files[i].split('/').pop().replace('.pdf', '');
		result.push({
			path:files[i],
			name:name
		});
	}
	
	return result;
};
```

Basically - get all the files under my `pdfs` folder and create an array that contains the path as well as a 'name' field, which for me was just the filename minus the extension. 

Once this was done, I could then the `pdfs` array in my Liquid templates, so for example, here is my home page:

```html
---
layout: main
---

<h2>PDFs</h2>

<ul>
{% raw %}{% for pdf in pdfs %}
<li><a href="pdf/{{pdf.name}}">{{ pdf.name }}</a></li>
{% endfor %}
{% endraw %}</ul>
```

You'll notice that I'm linking to `pdf`, not `pdfs`. Why? I could link directly to the where I copied the PDF file, and modern browsers will render it full screen. However, the [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html) will give us much more control over the experience and let us present it inside our site user interface as well. 

To support this, I used Eleventy's ["pages from data"](https://www.11ty.dev/docs/pages-from-data/) feature to create new HTML pages to render my PDF documents. Here's how I did it:

```html
---
pagination:
    data: pdfs
    size: 1
    alias: pdf
{% raw %}permalink: "pdf/{{ pdf.name }}/"
{% endraw %}layout: main
---

{% raw %}<h2>{{ pdf.name }}</h2>

<div id="adobe-dc-view"></div>

<script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
<script type="text/javascript">
document.addEventListener("adobe_dc_view_sdk.ready", () => {
	var adobeDCView = new AdobeDC.View({clientId: "{{ site.pdfkey }}", divId: "adobe-dc-view"});
	adobeDCView.previewFile(
	{
		content:   {location: {url: "{{site.url}}/{{ pdf.path }}"}},
		metaData: {fileName: "{{pdf.name}}pdf"}
	});
});
</script>
{% endraw %}
```

From the top, I use the Pagination feature to iterate over my `pdfs` array. I specify a permalink under the `pdf` folder (quick side note - my source directory uses two subdirectories - it's possible that I could have two or more PDFs of the same name and this would cause a problem here - a fix would be to replicate the same subdirectory strucutre as the source - let me know if you want to see that) and for each one, I output the name of the PDF and then use the simple JavaScript embed code. 

This code is pretty much boilerplate from the embed docs with a few things to note.

First, I needed a key. To do this, I created a new project on Adobe's dashboard. I already had one for my localhost system, but right now your keys are limited to one domain at a time. I knew I was going to deploy this to Vercel so I went ahead and created a new project and key just for that. You'll notice I'm using `site.pdfkey`. I'll explain this in a bit. 

Next, I need to specify a full URL for the PDF. For this, I use `site.url`. Both of the `site` values come from another data file, `site.js`:

```js
module.exports = async function() {

	let url = 'http://localhost:8080';

	if(process.env.VERCEL_ENV && process.env.VERCEL_ENV === 'production') url = 'https://pdftest.vercel.app'
	//my localhost key
	let pdfkey = process.env.PDF_KEY?process.env.PDF_KEY:'9861538238544ff39d37c6841344b78d'

	return {
		url,
		pdfkey
	}
};
```

For the URL I switch to my Vercel site if I detect I'm in production. Ditto for the key value. That hard coded value is the one I use for localhost so it will run locally only. 

And that's really it. When the Eleventy site is generated, I end up with HTML files under `pdf/` and the raw PDFs under `/pdfs`. That's not terribly good naming but it works well enough I think. Here's an example of one of the pages.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/pdfj2.jpg" alt="Example web page showing PDF embed" class="lazyload imgborder imgcenter">
</p>

You can test this yourself here: <https://pdftest.vercel.app>. As a reminder, I used the most basic embed possible. Check the [docs](https://www.adobe.io/apis/documentcloud/dcsdk/docs.html?view=view) for more examples of how you can configure it. You can find the source here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/pdftest> 


