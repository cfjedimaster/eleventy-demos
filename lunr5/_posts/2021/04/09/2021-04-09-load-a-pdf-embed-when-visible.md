---
layout: post
title: "Load a PDF Embed when Visible"
date: "2021-04-09"
categories: ["javascript","development"]
tags: ["adobe","pdf services"]
banner_image: /images/banners/invisible.jpg
permalink: /2021/04/09/load-a-pdf-embed-when-visible
description: Using IntersectionObserver to load PDFs
---

A quick tip before I turn my brain off for the weekend (that's not entirely true, tonight I plan on building LEGO). I've blogged before about the [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html), it's one of the tools my new job involves. If you didn't see my first post on it, definitely give it a quick read: [Using the PDF Embed API with Vue.js](https://www.raymondcamden.com/2021/02/17/using-the-pdf-embed-api-with-vuejs) Today's tip is a bit simpler - how can we use the PDF Embed API to only load a PDF once it's actually visible in the DOM?

Turns out it's rather simple. Modern browsers support the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). When I say "modern browsers", I mean all but Safari, but they're working on it. You can find more details at CanIUse: <https://caniuse.com/intersectionobserver>. 

I thought I'd do a quick demo of using the PDF Embed API and Intersection Observer together. Turns out it was incredibly simple:

```js
const ADOBE_KEY = 'b9151e8d6a0b4d798e0f8d7950efea91';

if(!!window.IntersectionObserver) {
	const pdfBox = document.querySelector('#pdfArea');

	const intersectionObserver = new IntersectionObserver(function(entries, observer) {
		if(entries && entries[0] && entries[0].isIntersecting){
			loadPDF();
			observer.unobserve(pdfBox);
		}
	});
	intersectionObserver.observe(pdfBox);
} else loadPDF();

function loadPDF() {
	console.log('visible');
	const adobeDCView = new AdobeDC.View({
		clientId: ADOBE_KEY, 
		divId: "pdfArea"
	});
	adobeDCView.previewFile({
      content:{ 
				location: 
        { url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea%20Brochure.pdf" }
			},
      metaData:{ fileName: "Bodea Brochure.pdf"}
    },
    {
      embedMode: "SIZED_CONTAINER"
    });
}
```

Basically, if the browser supports the API, I set up an observer to monitor part of the DOM (see the earlier `querySelector`. When it detects that it's visible, I run `loadPDF`. If the API is not supported, I just run `loadPDF` immediately.

And that's it. I freaking love how simple that was. If you want to see a demo with some lovely [Cat Ipsum](https://fungenerators.com/lorem-ipsum/cat/), take a gander at the CodePen below.

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="result" data-user="cfjedimaster" data-slug-hash="abpEmPd" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="PDF when Visible Test">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/abpEmPd">
  PDF when Visible Test</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Photo by <a href="https://unsplash.com/@lazycreekimages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Michael Dziedzic</a> on <a href="https://unsplash.com/s/photos/invisible?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  