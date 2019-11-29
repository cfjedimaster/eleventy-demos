---
layout: post
title: "Uploading multiple files at once with Ajax and XHR2"
date: "2016-05-05T13:21:00-07:00"
categories: [development,javascript]
tags: [cordova]
banner_image: /images/banners/xhr2banner.jpg
permalink: /2016/05/05/uploading-multiple-files-at-once-with-ajax-and-xhr2
---

Almost a year ago I wrote a blog post discussing how to use the Cordova FileTransfer plugin to upload multiple files ([Processing multiple simultaneous uploads with Cordova](https://www.raymondcamden.com/2015/08/10/processing-multiple-simultaneous-uploads-with-cordova/#comment-2660245015)). In that post I demonstrated how you could wrap the calls to each upload in a Promise and then wait for them all to complete. A reader pointed out the obvious issue with that solution - for N files you're creating N HTTP requests. While *probably* not a big deal (and as the developer, you could put a limit on how many files were allowed to be sent), I thought it would be interesting to demonstrate how can upload multiple files with one POST request using XHR2.

<!--more-->

First off - a quick refresher. What is XHR2? Easy - the second version of XHR. Ok, sorry, that was a bit sarcastic. XHR is the abbreviation of XMLHttpRequest and is how JavaScript performs Ajax requests. Basically, XHR is what you think of as Ajax. If you've only ever done Ajax via jQuery, then just know that $.get is wrapping calls to an XHR object behind the scenes. Working with XHR without jQuery isn't terribly difficult - you can start with this [great guide](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest?redirectlocale=en-US&redirectslug=DOM%2FXMLHttpRequest) at MDN for a refresher. 

XHR2 represents the more recent version of the overall spec (details [here](https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html)) and includes the ability to send file uploads via Ajax. Previously this was done with products like Adobe Flash. [Support](http://caniuse.com/#feat=xhr2) for XHR2 is rather nice:

![CanIUse.com data](https://static.raymondcamden.com/images/2016/05/xhr2supporta.jpg)

And of course, if you want to use this in Cordova, you are definitely safe to do so, especially if you use [Crosswalk](https://crosswalk-project.org/) on the Android side. 

So, how do you send a file using XHR2? For that I'd suggest reading the excellent MDN article, [Using FormData Objects](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects), which walks you through the process of creating a FormData object in JavaScript and assigning a file to it. I won't repreat the documentation there as it is short and sweet (and once again I will remind folks that the Mozilla Developer Network is one of the best damn resources on the Internet for web developers) but rather focus on how we could use it to send *multiple* files at once.

Let's begin with an incredibly simple handler for our uploads. The following Node application defines a route, <code>/upload</code>, that uses the [Formidable package](https://www.npmjs.com/package/formidable) to process file uploads. It literally just dumps them to console so it really isn't "handling" it, but it gave me an easy way to see my form POSTs come in and ensure they were being sent the right way.

<pre><code class="language-javascript">
var express = require('express');
var app = express();
var formidable = require('formidable');

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {

		console.log('handling form upload - fields', fields);
		
		console.log('handling form upload - files', files);
		
	});
	res.send('Thank you');
});

app.listen(app.get('port'), function() {
	console.log('Express running on http://localhost:' + app.get('port'));
});
</code></pre>

Ok, now let's look at the front end. For my first demo, I created the following HTML.

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;form id=&quot;testForm&quot;&gt;
		&lt;input type=&quot;file&quot; id=&quot;file1&quot;&gt;&lt;br&#x2F;&gt;
		&lt;input type=&quot;file&quot; id=&quot;file2&quot;&gt;&lt;br&#x2F;&gt;		
		&lt;input type=&quot;file&quot; id=&quot;file3&quot;&gt;&lt;br&#x2F;&gt;
		&lt;input type=&quot;submit&quot;&gt;
	&lt;&#x2F;form&gt;
		 
	&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.4&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

As you can see - I've got 3 form fields - all of which are file types. Now let's look at the code. 

<pre><code class="language-javascript">
var $f1, $f2, $f3;

$(document).ready(function() {
	$('#testForm').on('submit', processForm);
	$f1 = $('#file1');
	$f2 = $('#file2');
	$f3 = $('#file3');
	
});

function processForm(e) {
	e.preventDefault();
	console.log('processForm');
	
	var formData = new FormData();

	if($f1.val()) formData.append('file1', $f1.get(0).files[0]);
	if($f2.val()) formData.append('file2', $f2.get(0).files[0]);
	if($f3.val()) formData.append('file3', $f3.get(0).files[0]);


	var request = new XMLHttpRequest();
	request.open('POST', 'http://localhost:3000/upload');
	request.send(formData);
	
	request.onload = function(e) {
		console.log('Request Status', request.status);
	};
	
}
</code></pre>

So first off - yes I'm using jQuery *and* naked XHR calls. That's ok. You don't have to use jQuery and that's fine too. Don't stress over it. I begin by adding a submit handler and a quick reference to my three fields. When you submit the form, I create a new <code>FormData</code> object. The MDN article I linked to earlier talks about it more, but you can think of it like a virtual form. I can add simple name/value pairs (like name = 'Raymond') as well as files. I check the value of each field to determine if something was selected. Here's an important point though. The value will be a string. In Chrome it looks something like <code>C:\fakepath\aliens.jpg</code>. Yes, I'm on a Mac and yes, that's a fake Windows path. The idea here is to obscure the real path so that nasty code can't be used as a vector to attack your system. 

The FormData object though wants a real file. We use <code>$f1.get(0)</code> to connect to the real DOM item (not the jQuery-wrapped object) and then use the <code>files</code> property to gain read access to the selected file. 

That's repeated for each of the three fields and then I simply post to my server. 

And yeah - that's it. When I test, I can see my files come in as expected.

![Console dump](https://static.raymondcamden.com/images/2016/05/xhr2shot1.jpg)

So far so good. But don't forget that some HTML form tags support a <code>multiple</code> attribute. In v2 of my sample, I changed the three form fields to this:

<pre><code class="language-javascript">
&;lt;input type="file" id="file1" multiple&gt;
</code></pre>

I can now select 0-N files when submitting my form. Here is the modified version of the code to handle that.

<pre><code class="language-javascript">
var $f1;

$(document).ready(function() {
	$('#testForm').on('submit', processForm);
	$f1 = $('#file1');	
});

function processForm(e) {
	e.preventDefault();
	console.log('processForm');
	
	var formData = new FormData();
	if($f1.val()) {
		var fileList = $f1.get(0).files;
		for(var x=0;x&lt;fileList.length;x++) {
			formData.append('file'+x, fileList.item(x));	
			console.log('appended a file');
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

I grab that <code>files</code> property and treat it like a simple array. It isn't quite an array though (MDN docs for [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)) as I have to use a <code>item</code> method to fetch the particular value. Then it's simply a matter of appending to <code>formData</code> with a unique name for each file. This is treated the exact same by the back-end so it just works.

All in all - pretty simple I think and could be used easily in a Cordova application. You can also attach a progress event handler and monitor the process of sending up the binary data. Enjoy and let me know if you have any questions by leaving a comment below.