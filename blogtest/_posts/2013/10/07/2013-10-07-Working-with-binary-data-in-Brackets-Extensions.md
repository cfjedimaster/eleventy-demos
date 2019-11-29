---
layout: post
title: "Working with binary data in a Brackets Extension"
date: "2013-10-07T12:10:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/10/07/Working-with-binary-data-in-Brackets-Extensions
guid: 5054
---

<p>
A few months ago I released an extension for Brackets called <a href="https://github.com/cfjedimaster/brackets-jsdownloader">JSDownloader</a>. The idea behind the extension was rather simple. I wanted a quick and easy way to grab my favorite JavaScript libraries. <strong>Yes, I realize there are tools out there that do this already.</strong> But those tools just didn't work well for me. As an example, I tried <a href="http://bower.io/">Bower</a> once to grab a copy of jQuery and discovered it downloaded a large number of other files as well. <strong>To be clear, there is a good reason for that!</strong>. But it just wasn't what I personally needed. 
</p>
<!--more-->
<p>
From that need JSDownloader was built. But there was big flaw with the extension. I couldn't add support for jQuery Mobile because the jQM library contains a few images. Right now the Bracket's File API allows you to read and write files, but does not provide access to binary data.
</p>

<p>
There has been a workaround for a few releases though - using Node. I <a href="http://www.raymondcamden.com/index.cfm/2013/4/16/Proof-of-Concept--Connecting-a-Node-app-with-Brackets">blogged</a> about using Node with Brackets Extensions a few months ago. I never got around to updating JSDownloader because, well, it felt like overkill to me. Also, I held out hope that the core File API would eventually support it. Last week I stopped being lazy and got around to fixing it. I do not believe my solution is the best, but if you have the same need for your extension, you can now copy what I did. My extension pretty much only calls out to Node for the file save operation so in theory, it should be easy to re-use in a totally different extension.
</p>

<p>
Here is a bit of the code. First, I'll start off with the call to Node from my main JavaScript file in the extension.
</p>

<pre><code class="language-markup">
var suPromise = nodeConnection.domains.downloader.fetchStuff(filesToGet,pathToUse);
suPromise.done(function(port) {
    $span.html("&lt;i&gt;Done!&lt;/i&gt;");
    ProjectManager.refreshFileTree();
});
</code></pre>

<p>
In the snippet above, filesToGet is simply an array of files for a particular JavaScript library. For jQuery, this is one file. For jQuery Mobile, this is a JavaScript file, a CSS file, and a few images. Finally, pathToUse is simply the current project directory. So basically - Node will be told what to get and where to save it.
</p>

<p>
Actually - let me amend the previous statement a bit. In order to make the logic a bit simpler, I'm passing an array of file names that also include an optional path that is a subdirectory. This allows me to store the jQuery Mobile images in a subdirectory called "images". This will be underneath the <i>main</i> directory specified in pathToUse. Again - I'm not saying this is the most elegant solution!
</p>

<p>
Now let's look at the Node code. I want to be clear here - my confidence in this portion is not terribly high. I've got one main concern I'll share at the end.
</p>

<pre><code class="language-markup">
function fetchStuff(urls,basePath) {

	urls.forEach(function(item, idx, urls) {
		var fileName = item.href.split("/").pop();
		var fullPath;
			
		if(item.path) {
			fullPath = basePath + item.path + fileName;
			//does item path exist?
			if(!fs.existsSync(basePath+item.path)) {
				fs.mkdirSync(basePath+item.path);
			}
		} else {
			fullPath = basePath + fileName;
		}
				
		// Credit: http://stackoverflow.com/a/5294619/52160
		var file = fs.createWriteStream(fullPath);

		function resHandler(res) {
			var imagedata = '';
			res.setEncoding('binary');
				res.on('data', function(chunk){
				imagedata += chunk;
			});

			res.on('end', function(){
			fs.writeFile(fullPath, imagedata, 'binary', function(err){
				if (err) throw err;
					console.log('File saved.');
				});
			});
		}

		if(item.href.indexOf("https") === 0) {
			https.get(item.href, resHandler);
		} else {
			http.get(item.href, resHandler);
		}


	});


	return 1;
}
</code></pre>

<p>
For the most part this should make sense. The thing that concerns me the most is the return 1 at the end. I'm pretty sure that is wrong and makes the extension report <i>immediately</i> that it has completed the download. Since I'm talking about pretty small files here I'm not concerned, but it is something I'd like to address.
</p>

<p>
Want to see it in action? Watch the video below. Sorry I didn't get around to adding background music.
</p>

<iframe width="600" height="450" src="//www.youtube.com/embed/zrAowYuFKxI?rel=0" frameborder="0" allowfullscreen></iframe>