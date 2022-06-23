---
layout: post
title: "Uploading Multiple Files with Fetch"
date: "2021-08-08T18:00:00"
categories: ["javascript"]
tags: ["javascript"]
banner_image: /images/banners/fetch.jpg
permalink: /2021/08/08/uploading-multiple-files-with-fetch.html
description: Quick example of using Fetch to upload multiple files at once.
---

This afternoon I was going through my "blog ideas" list and cleaning up entries I've changed my mind on. I came across something I added many months ago - using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to upload multiple files at once. The reason it's stuck in my "todo" pile for so long is that I wasn't aware of a good service I could use to post my files against. I've done it before in Node.js and I know it's something I could do locally in an hour, but honestly I just didn't want to. That probably sounds a bit lazy but it's honest. Today though I came across [httpbin.org](https://httpbin.org/), an online service that lets you hit it with various types of HTTP methods and even supports file uploads. (Obviously it doesn't make those files available, it just reports back on the upload.) Even better, it supports CORS which means I could use CodePen. So with no more excuses at my disposal, today I finally built a simple demo.

First off, I created a simple form:

```html
<form>
	<input id="filesToUpload" type="file" multiple>
	<button id="testUpload">Test Upload</button>
</form>

<div id="status"></div>
```

I've got a file field, a button, and an empty div. Notice the file field uses the `multiple` attribute. This lets the end user select one or more files. For my first iteration, I used the following JavaScript:


```js
document.addEventListener('DOMContentLoaded', init, false);

let fileField, statusDiv;

async function init() {
	fileField = document.querySelector('#filesToUpload');
	statusDiv = document.querySelector('#status');
	document.querySelector('#testUpload').addEventListener('click', doUpload, false);
}

async function doUpload(e) {
	e.preventDefault();
	statusDiv.innerHTML = '';

	let totalFilesToUpload = fileField.files.length;
	
	//nothing was selected 
	if(totalFilesToUpload === 0) {
		statusDiv.innerHTML = 'Please select one or more files.';
		return;
	}

	for(let i=0;i<totalFilesToUpload; i++) {
		statusDiv.innerHTML = `Working on file ${i+1} of ${totalFilesToUpload}`;
		let resp = await uploadFile(fileField.files[i]);
		console.log(`Done with ${i+1} item.`);
	}
	
	statusDiv.innerHTML = 'All complete.';
	fileField.value='';
}

async function uploadFile(f) {
	let form = new FormData();
	form.append('file', f);	
	let resp = await fetch('https://httpbin.org/post', { method: 'POST', body:form });
	let data = await resp.json();
	//console.log(data);
	return data;
}
```

From top to bottom - I begin by using `querySelector` to cache access to my file field and empty div. Then I add a click handler to the button.

The click handler first checks to see if any files were selected. If none were then we print out a message and leave. Otherwise, we then iterate over the `files` array and call an async function, `uploadFile`. In my demo, `uploadFile` does a `POST` to httpbin and returns the result. Right now I'm ignoring the result but in a real application you would probably need something from there. At the end of each upload I update my div with a status. 

Finally I report that everything is complete and reset the file field. Here's a CodePen for you to try it out yourself:

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="xxdQzpE" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/xxdQzpE">
  fetch multi sequential</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

This works well, but uploads the files one after the other. It would be nicer if they were all uploaded at once, right? Here's an updated version that does that:

```js
document.addEventListener('DOMContentLoaded', init, false);

let fileField, statusDiv;

async function init() {
	fileField = document.querySelector('#filesToUpload');
	statusDiv = document.querySelector('#status');
	document.querySelector('#testUpload').addEventListener('click', doUpload, false);
}

async function doUpload(e) {
	e.preventDefault();
	statusDiv.innerHTML = '';

	let totalFilesToUpload = fileField.files.length;
	
	//nothing was selected 
	if(totalFilesToUpload === 0) {
		statusDiv.innerHTML = 'Please select one or more files.';
		return;
	}

	statusDiv.innerHTML = `Uploading ${totalFilesToUpload} files.`;

	let uploads = [];	
	for(let i=0;i<totalFilesToUpload; i++) {
		uploads.push(uploadFile(fileField.files[i]));
	}
	
	await Promise.all(uploads);
	
	statusDiv.innerHTML = 'All complete.';
	fileField.value='';
}

async function uploadFile(f) {
	console.log(`Starting with ${f.name}`);
	let form = new FormData();
	form.append('file', f);	
	let resp = await fetch('https://httpbin.org/post', { method: 'POST', body:form });
	let data = await resp.json();
	console.log(`Done with ${f.name}`);
	return data;
}
```

The main difference is tht now I don't `await` the call to `uploadFile` and use the implied Promise returned instead. I can then use `Promise.all` on the array of uploads to notice when they are all done. One thing I don't have is the nice "X of Y" message, and that's possibly something I could do too, but for now the improved speed should be nice. If you want to test this version, it's below.

<p class="codepen" data-height="500" data-theme-id="dark" data-default-tab="html,result" data-slug-hash="zYwMLxZ" data-user="cfjedimaster" style="height: 500px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/zYwMLxZ">
  fetch multi sequential</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Enjoy, let me know what you think!

Photo by <a href="https://unsplash.com/@miaanderson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mia Anderson</a> on <a href="https://unsplash.com/s/photos/fetch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  