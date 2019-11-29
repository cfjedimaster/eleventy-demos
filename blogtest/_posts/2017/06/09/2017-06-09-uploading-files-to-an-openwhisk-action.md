---
layout: post
title: "Uploading Files to an OpenWhisk Action"
date: "2017-06-09T13:49:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/09/uploading-files-to-an-openwhisk-action
---

This post starts with not one, not two, but three disclaimers. Read carefully!

First off, if you want to upload files to an OpenWhisk action, you can, but your limited to file sizes less than one meg. That's pretty small, but don't forget you can use a third-party cloud storage provider to serve your file. (IBM has a Cloud Object Storage service that would be useful here, and obviously Amazon S3 would work too.) Don't forget you can detect the size of a file in JavaScript before you attempt to POST it.

Secondly, while I was able to get a solution working, I really feel like this is something OpenWhisk can handle better at the platform level. I will go into detail about the particular parts that were difficult and what I had to do, but as I said, I think this is something that can, and should, improve in the future. I'll do my best to try and come back to this post if that happens, but... I'm old. I forget stuff. So just keep in mind the date of this post.

Third item, and this is more a general warning then anything else, while I love [Postman](https://www.getpostman.com/), it failed to work correctly for me when I was testing. I'll 100% put the blame on me, but when I switched from Postman to a "Plain old HTML form" for testing, I made a lot of progress. 

Alright, ready?

For my action, all I wanted to see in was it processing a form that included a file. OpenWhisk will already parse FORM data of the "regular" kind, your text fields and such. What I did with the file wasn't necessarily important (I tried a few things just to ensure it really worked), but pretty much anything should work.

You would think this would be easy. There's a bunch of npm packages that make processing a file upload easy. My favorite is [formidable](https://www.npmjs.com/package/formidable). However, they all suffer from one core problem in OpenWhisk - they want an instance of a HttpRequest object. 

When working with Express, you have this baked in. But under OpenWhisk, this is all handled behind the scenes. You do get passed 100% (afaik) of the request data, but it isn't a proper HttpRequest object itself. I tried faking it, but nothing worked well. (In fact, [one solution](https://github.com/lionelvillard/openwhisk-expressjs/blob/master/index.js) that another project used was to mock the object with SuperTest.)

I asked on Twitter and got two good tips - one from [Wes Bos](http://wesbos.com/) and another from [Cesidio Di Benedetto](http://cesidiodibenedetto.com/). My solution does the following:

<ol>
<li> Get the raw body.
<li>Convert that string into a stream using <a href="https://www.npmjs.com/package/string-to-stream">string-to-stream</a>.
<li>Pass that steam to <a href="https://github.com/chjj/parted">parted</a>, which seemed like the most low level, simplest multipart form parser. 
</ol>

This was all pretty frustrating and it seemed like there must be *some* library that would just let me pass a giant multipart string to it (and there probably is!), but I couldn't find a "one shot" solution.

Ok - so the code. First off, the action has to be web enabled, and raw body enabled. That's done like so:

	wsk action update nameOfMyAction --web raw

Now for the code.

<pre><code class="language-javascript">var str = require(&#x27;string-to-stream&#x27;);
var multipart = require(&#x27;parted&#x27;).multipart;
var fs = require(&#x27;fs&#x27;);

function main(args) {

	return new Promise((resolve, reject) =&gt; {
		let decoded = new Buffer(args.__ow_body,&#x27;base64&#x27;);
		let newStream = str(decoded);

		var options = {
			limit: 30 * 1024,
			diskLimit: 30 * 1024 * 1024
		};

		console.log(&#x27;Making parser&#x27;);
		var parser = new multipart(args.__ow_headers[&quot;content-type&quot;], options), parts = {};
		parser.on(&#x27;error&#x27;, function(err) {
			console.log(&#x27;parser error&#x27;, err);
		});

		parser.on(&#x27;part&#x27;, function(field, part) {
			&#x2F;&#x2F; temporary path or string
			parts[field] = part;
		});

		parser.on(&#x27;data&#x27;, function() {
			console.log(&#x27;%d bytes written.&#x27;, this.written);
		});

		parser.on(&#x27;end&#x27;, function() {
			console.log(parts);

			var file = fs.readFileSync(parts.file1);
			var base64File = new Buffer(file).toString(&#x27;base64&#x27;);

			resolve({
				statusCode: 200,
				headers: {% raw %}{ &#x27;Content-Type&#x27;: &#x27;image&#x2F;png&#x27; }{% endraw %},
				body: base64File
			});


		});

		newStream.pipe(parser);


	});

		
}

exports.main = main;
</code></pre>

I begin by getting the raw body. Remember you have to tell OpenWhisk to make this available with the annotation I mention before. I then make a fake stream using string-to-stream. I then make use of parted - and I pretty much just copied and pasted their sample. The end result is a `parts` object that contains all my form fields where the files are paths to the temporary file system. All in all pretty simple, but the line where I created `decoded` took me like an hour of trying random crap until I got it right. 

And basically - that's it. When parted is done (see the `end` event), I essentially "echo" the file back to the user. My code assumes a file field named `file` and assumed it was a png. It would be trivial *not* to do that though, but for the demo, I just wanted something quick and dirty.

The front end is just an HTML form:

<pre><code class="language-markup">&lt;form 
action=&quot;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden@us.ibm.com_My%20Space&#x2F;safeToDelete&#x2F;filetest1&quot; 
method=&quot;post&quot; enctype=&quot;multipart&#x2F;form-data&quot;&gt;
  &lt;p&gt;&lt;input type=&quot;text&quot; name=&quot;text1&quot; value=&quot;text default&quot;&gt;
  &lt;p&gt;&lt;input type=&quot;text&quot; name=&quot;text2&quot; value=&quot;text default2&quot;&gt;
  &lt;p&gt;&lt;input type=&quot;file&quot; name=&quot;file1&quot;&gt;
  &lt;p&gt;&lt;button type=&quot;submit&quot;&gt;Submit&lt;&#x2F;button&gt;
&lt;&#x2F;form&gt;
</code></pre>

Here is a completely unnecessary animated gif showing it in action.

![Really?](https://static.raymondcamden.com/images/2017/6/owform.gif)

You can find the source code for this demo here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/file_upload

And again - consider this whole example covered in a fine layer of "Use with Caution" and sprinkled with a "Are You Kidding Me". It worked - but hopefully I can share a nicer solution in the future.