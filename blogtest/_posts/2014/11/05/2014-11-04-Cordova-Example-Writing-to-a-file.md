---
layout: post
title: "Cordova Example: Writing to a file"
date: "2014-11-05T09:11:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/11/05/Cordova-Example-Writing-to-a-file
guid: 5343
---

<p>
As you know, lately I've been publishing simple Cordova examples that involve the file system. I'm working on a demo that involves background asset downloads (see the <a href="http://www.raymondcamden.com/2014/10/7/Cordova-and-Large-Asset-Downloads--An-Abstract">blog entry</a>) but I thought I'd take a break from that and write up something super simple, but hopefully helpful, that demonstrates file writing.
</p>
<!--more-->
<p>
With that in mind I built a demo that writes to a log file. The idea being that your app may want to record what it is doing. Normally you would do that via XHR to a server, but logging to a file ensures it will work offline as well. And perhaps you don't really need the data on your server but just want a log you can check later if things go wrong. Let's take a look at the code bit by bit.
</p>

<p>
The first thing I need to do is get a handle to the file. I'm going to use a file inside cordova.file.dataDirectory, which is an alias to an application-specific folder with read/write access.
</p>

<pre><code class="language-javascript">	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		console.log(&quot;got main dir&quot;,dir);
		dir.getFile(&quot;log.txt&quot;, {% raw %}{create:true}{% endraw %}, function(file) {
			console.log(&quot;got the file&quot;, file);
			logOb = file;
			writeLog(&quot;App started&quot;);			
		});
	});
</code></pre>

<p>
<code>resolveLocalFileSystemURL</code> converts the alias path into a directory entry object. That has a variety of methods but the one we care about is <code>getFile</code>. Note the <code>create:true</code> flag. This ensures that the file will be created the first time it is run. I also copy the file object into a variable logOb that is global to my application. Finally I call <code>writeLog</code>. That's my utility function. Let's look at that next.
</p>

<pre><code class="language-javascript">function writeLog(str) {
	if(!logOb) return;
	var log = str + &quot; [&quot; + (new Date()) + &quot;]\n&quot;;
	console.log(&quot;going to log &quot;+log);
	logOb.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {% raw %}{type:&#x27;text&#x2F;plain&#x27;}{% endraw %});
		fileWriter.write(blob);
		console.log(&quot;ok, in theory i worked&quot;);
	}, fail);
}
</code></pre>

<p>
So first off, if logOb wasn't created, we simply return. My thinking here is that log file writing is <strong>not</strong> required for the application. I want to silently ignore if we couldn't write to the file system for whatever reason. I modify the input a bit (adding a timestamp and a newline) and then begin the write operation. This particular code was taken right from the <a href="http://www.html5rocks.com/en/tutorials/file/filesystem/">HTML5Rocks article</a> on the FileSystem API. It uses <code>seek</code> to append as opposed to overwrite the file. 
</p>

<p>
With this in place I could then add calls to the log utility from my application. Since my "application" is just a demo, I added two buttons that do nothing but log.
</p>

<pre><code class="language-javascript">	document.querySelector(&quot;#actionOne&quot;).addEventListener(&quot;touchend&quot;, function(e) {
		&#x2F;&#x2F;Ok, normal stuff for actionOne here
		&#x2F;&#x2F;
		&#x2F;&#x2F;Now log it
		writeLog(&quot;actionOne fired&quot;);
	}, false);

	document.querySelector(&quot;#actionTwo&quot;).addEventListener(&quot;touchend&quot;, function(e) {
		&#x2F;&#x2F;Ok, normal stuff for actionTwo here
		&#x2F;&#x2F;
		&#x2F;&#x2F;Now log it
		writeLog(&quot;actionTwo fired&quot;);
	}, false);
</code></pre>

<p>
The final thing I did was add a special function that would read the file out and send it to console. I did this <i>just</i> for testing.
</p>

<pre><code class="language-javascript">function justForTesting() {
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
		};

		reader.readAsText(file);
	}, fail);

}</code></pre>

<p>
To see this in action, I used <a href="https://www.genuitec.com/products/gapdebug/">GapDebug</a> and my iOS simulator. That let me run <code>justForTesting</code> right from my browser. In the screen shot below, note that the beginning of the file isn't formatted right. That's because I forgot the newline initially.
</p>

<p>
<img src="https://static.raymondcamden.com/images/GapDebug.png" />
</p>

<p>
I hope this helps. You can find the complete source in my GitHub repo with the rest of my demos: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/writelog">https://github.com/cfjedimaster/Cordova-Examples/tree/master/writelog</a>
</p>