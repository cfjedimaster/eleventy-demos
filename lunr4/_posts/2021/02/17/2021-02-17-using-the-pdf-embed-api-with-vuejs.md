---
layout: post
title: "Using the PDF Embed API with Vue.js"
date: "2021-02-17"
categories: ["development"]
tags: ["adobe","pdf services"]
banner_image: /images/banners/papers.jpg
permalink: /2021/02/17/using-the-pdf-embed-api-with-vuejs
description: Using Adobe's PDF Embed API in a Vue.js application
---

I've recently become acquainted with Adobe's [PDF Embed API](https://www.adobe.io/apis/documentcloud/dcsdk/pdf-embed.html). As you can probably guess by the name, it's a library for embedded PDFs on a web page. Not just a simple viewer, it has APIs for interacting with the PDF as well really good mobile support. This is a part of the [Document Cloud](https://www.adobe.io/apis/documentcloud/dcsdk/) service which provides other PDF tools as well (extraction, conversion, and so forth). I've been playing with the viewer a bit and wanted to see what Vue.js integration would look like. Here's my solution, but note that I'm still learning about the product so it could probably be done better. 

First off, to use the API you need a key. Clicking the [link from the webpage](https://www.adobe.com/go/dcsdks_credentials) will walk you through the process of generating a key. One important note on this though. You have to lock down your key to a domain and that domain can not be changed either. Also, you can only specify one domain. So if you want your domain *and* localhost, create two projects, generate two keys, and set them as environment variables for your development and production environment. I did my testing on CodePen and had to use this domain: cdpn.io

Once you have a key, you can copy the code from the [Getting Started](https://www.adobe.io/apis/documentcloud/dcsdk/docs.html?view=view) to quickly test. Here it is in its entirety as it's pretty short:

```html
<!--Get the samples from https://www.adobe.com/go/pdfembedapi_samples-->
<!DOCTYPE html>
<html>
<head>
 <title>Adobe Document Services PDF Embed API Sample</title>
 <meta charset="utf-8"/>
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
 <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin: 0px">
 <div id="adobe-dc-view"></div>
 <script src="https://documentcloud.adobe.com/view-sdk/main.js"></script>
 <script type="text/javascript">
    document.addEventListener("adobe_dc_view_sdk.ready", function()
    {
        var adobeDCView = new AdobeDC.View({clientId: "<YOUR_CLIENT_ID>", divId: "adobe-dc-view"});
        adobeDCView.previewFile(
       {
          content:   {location: {url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf"}},
          metaData: {fileName: "Bodea Brochure.pdf"}
       });
    });
 </script>
</body>
</html>
```

Breaking this down, you listen for an event signifying that the library is loaded and then create a new "view" based on a div in your HTML. (In the example above, `adobe-dc-view`.) Once that's done you can use the `previewFile` method to add it the PDF viewer to the page. Here's a screen shot of this particular example:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/pdf1.jpg" alt="Screen shot of PDF Viewer" class="lazyload imgborder imgcenter">
</p>

I realize that screen shot is a bit small, but in case you can't see it, the viewer includes the tools you would normally expect in Acrobat - navigation, search, as well as annotation tools. You can even save directly from the viewer and include your annotations. Here is my attempt at making life insurance documents more fun.

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/pdf2.jpg" alt="A page from the PDF with a bad drawing of a cat." class="lazyload imgborder imgcenter">
</p>

Cool. So as I said, it's a pretty powerful embedded viewer, and I want to play with it more later, but I first wanted to take a stab at adding it to a simple Vue.js application. Here's how I did it.

First off, notice in the code listing above that we listen for an event on the document object, `adobe_dc_view_sdk.ready`. For my code to work in Vue I needed something a bit more robust. An Adobian on the support forum [noted](https://community.adobe.com/t5/document-services-apis/adobe-dc-view-sdk-ready/m-p/11648022#M948) that you can check for `window.AdobeDC` to see if the library is ready. I wrote my code such that the `created` method of my Vue app can check that and still handle the library being loaded library. Broadly I did it by using a variable, `pdfAPIReady`. My `created` method does this:

```js
created() {
	//credit: https://community.adobe.com/t5/document-services-apis/adobe-dc-view-sdk-ready/m-p/11648022#M948
	if(window.AdobeDC) this.pdfAPIReady = true;
}, 
```

I then add a watcher for that variable:

```js
watch: {
  pdfAPIReady(val) {
    // should only be called when true, but be sure
    if(val) {
      this.adobeDCView = new AdobeDC.View({
        clientId: ADOBE_KEY, 
        divId: "pdf-view"
      });
    }
  }
}
```

And the final bit is a listener *outside* my Vue application. Remember that you can access the `data` variable using the Vue instance. This is how I handled that:

```js
// In theory I'm not needed on CodePen, but in the real world I would be.
document.addEventListener("adobe_dc_view_sdk.ready", () => { app.pdfAPIReady = true; });
```

Now, in theory, my Vue app can make use of the library. The Adobe docs describe how to use [local file content](https://www.adobe.com/devnet-docs/dcsdk_io/viewSDK/howtos.html#passing-file-content) driven by an HTML input tag. Basically you can pass a FileReader promise to the embed and it will handle knowing when the local file is read and then render it. 

Here's the HTML I used for my demo:

```html
<div id="app" v-cloak>

  <strong>Select a PDF to Preview</strong> 
  <input type="file" accept="application/pdf" @change="previewPDF" ref="fileInput"> 

  <h3 v-if="pdfSelected">PDF Preview:</h3>
  <div id="pdf-view"></div>
  
</div>
```

Notice the `pdfSelected` conditional. This is going to toggle after the user has selected a file. I originally had this in a div around the h3 and the div (`pdf-view`), but the embed viewer didn't like its div being hidden by Vue. (I could probably change how I hide the div, but for now I'm leaving it.) Now for the JavaScript:

```js
const ADOBE_KEY = 'b9151e8d6a0b4d798e0f8d7950efea91';

const app = new Vue({
  el:'#app',
  data:{
    pdfAPIReady:false,
    adobeDCView:null,
    pdfSelected:false
  }, 
  created() {
    //credit: https://community.adobe.com/t5/document-services-apis/adobe-dc-view-sdk-ready/m-p/11648022#M948
    if(window.AdobeDC) this.pdfAPIReady = true;
  }, 
  methods: {
    previewPDF() {
      let files = this.$refs.fileInput.files;
      if(files.length === 0) return;
      this.pdfSelected = true;
      let reader = new FileReader();
      let viewer = this.adobeDCView;
      console.log(`going to view ${files[0].name}`);
      reader.onloadend = function(e) {
        let filePromise = Promise.resolve(e.target.result);
        viewer.previewFile({
          content: { promise: filePromise }, 
          metaData: { fileName: files[0].name }
        });
      };
      reader.readAsArrayBuffer(files[0]);
 
    }
  },
  watch: {
    pdfAPIReady(val) {
      // should only be called when true, but be sure
      if(val) {
        this.adobeDCView = new AdobeDC.View({
          clientId: ADOBE_KEY, 
          divId: "pdf-view"
        });
      }
    }
  }
})

// In theory I'm not needed on CodePen, but in the real world I would be.
document.addEventListener("adobe_dc_view_sdk.ready", () => { app.pdfAPIReady = true; });
```

For the most part, all I did was use Adobe's example of reading a file and moved it inside a Vue method. The end result lets you select a local PDF and have it rendered on my Vue app:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/02/pdf3.jpg" alt="Example from my Vue app" class="lazyload imgborder imgcenter">
</p>

As I said, this is a rather simple integration, but hopefully useful to folks wanting to use it with Vue. I've got some more examples coming! You can find the complete source code below.

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="QWGvZed" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="PDF Embed Test">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/QWGvZed">
  PDF Embed Test</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>