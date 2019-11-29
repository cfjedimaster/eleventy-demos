---
layout: post
title: "Uploading multiple files at once - with Fetch"
date: "2016-05-10T13:21:00-07:00"
categories: [javascript,development]
tags: []
banner_image: 
permalink: /2016/05/10/uploading-multiple-files-at-once-with-fetch
---

So, my last couple of posts ([Uploading multiple files at once with Ajax and XHR2](https://www.raymondcamden.com/2016/05/05/uploading-multiple-files-at-once-with-ajax-and-xhr2) and [Uploading multiple files at once - for Cordova](https://www.raymondcamden.com/2016/05/06/uploading-multiple-files-at-once-for-cordova)) have both discussed a similar idea - using JavaScript and XHR2 to create POST operations with multiple files. As I mentioned in the first post, XHR2 (really just XHR) represented an updated version of the original XHR spec. What you may not be aware of is that there is another (because, well, JavaScript) API that aims to both improve basic HTTP operations as well as working with other new tech like Service Workers. 

<!--more-->

While working with XHR isn't necessarily difficult, Fetch can be quite a bit simple, let's even say jQuery-simple. Here's an example:

<pre><code class="language-javascript">
fetch('foo.json')
.then(function(res) {
	//do something with the json	
})
.catch(function(err) {
	console.log('Oh crap!', err);	
})
</code></pre>

Fetch does a lot more, and as always, I'm going to point out the super excellent resources at Mozilla Developer Network:

* [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

For a new API, support is actually pretty decent. The CanIUse [table for Fetch](http://caniuse.com/#feat=fetch) shows pretty good support in every browser except Safari and iPhone:

![Fetch support](https://static.raymondcamden.com/images/2016/05/fetch1.jpg)

Although apparently Fetch will be in the next update to Safari. (Right after they get IndexedDB working right.) 

So all in all, it is an interesting API, and I was curious to see what it would be like if I updated my [first demo](https://www.raymondcamden.com/2016/05/05/uploading-multiple-files-at-once-with-ajax-and-xhr2/) to make use of it. Here is the original code fired by the upload event.

<pre><code class="language-javascript">
function processForm(e) {
	e.preventDefault();
	
	var formData = new FormData();
	if($f1.val()) {
		var fileList = $f1.get(0).files;
		for(var x=0;x&lt;fileList.length;x++) {
			formData.append('file'+x, fileList.item(x));	
		}
	}

	var request = new XMLHttpRequest();
	request.open('POST', 'http://localhost:3000/upload');
	request.send(formData);
	
	request.onload = function(e) {
		console.log('Request Status', request.status);
	};
	
}
</code></pre>

And here is the Fetching version.

<pre><code class="language-javascript">
function processForm(e) {
	e.preventDefault();
	
	var formData = new FormData();
	if($f1.val()) {
		var fileList = $f1.get(0).files;
		for(var x=0;x&lt;fileList.length;x++) {
			formData.append('file'+x, fileList.item(x));	
		}
	}

	fetch('http://localhost:3000/upload', {
		method:'POST',
		body:formData	
	}).then(function(res) {
		console.log('Status', res);
	}).catch(function(e) {
		console.log('Error',e);
	});
	
}
</code></pre>

All in all, I think this version is one line longer, but I actually included error handling so that's not a fair comparison. That being said, I actually *prefer* the Fetch API, so to me, this is a net win. And of course, there is a *heck* of a lot more to the API than what I've shown here. The Google Developer's site has an excellent article on the topic ([Introduction to fetch()](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)) that includes a great example of some of the power you get:

<pre><code class="language-javascript">
function status(response) {  
  if (response.status &gt;= 200 && response.status &lt; 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function json(response) {  
  return response.json()  
}

fetch('users.json')  
  .then(status)  
  .then(json)  
  .then(function(data) {  
    console.log('Request succeeded with JSON response', data);  
  }).catch(function(error) {  
    console.log('Request failed', error);  
  });
</code></pre>

Yeah - I dig that. Anyone using this in production yet?

![Obligatory 'Fetch' image](https://static.raymondcamden.com/images/2016/05/fetch2.jpg)