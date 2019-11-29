---
layout: post
title: "Cordova Sample: Reading a text file"
date: "2014-07-15T15:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/07/15/Cordova-Sample-Reading-a-text-file
guid: 5268
---

<p>
A few weeks back I began a <a href="http://www.raymondcamden.com/2014/6/23/PhoneGapCordova-File-System-questions">list of questions</a> to help build a PhoneGap/Cordova File System FAQ. (More on that at the very end.) As I work through the questions I'm building little samples (like <a href="http://www.raymondcamden.com/2014/7/1/Cordova-Sample-Check-for-a-file-and-download-if-it-isnt-there">this one</a>) to help demonstrate various FileSystem features. Today's is <i>really</i> simple, but as always, I figure people can find this helpful even if it trivial. (And if I'm wrong, let me know in the comments below.) Today's example simply reads a text-based file from the file system and displays it in the application.
</p>
<!--more-->
<p>
Let's take a look at the code and then I'll walk you through what it does.
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	
	&#x2F;&#x2F;This alias is a read-only pointer to the app itself
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + &quot;www&#x2F;index.html&quot;, gotFile, fail);

	&#x2F;* Yes, this works too for our specific example...
	$.get(&quot;index.html&quot;, function(res) {
		console.log(&quot;index.html&quot;, res);
	});
	*&#x2F;

}

function fail(e) {
	console.log(&quot;FileSystem Error&quot;);
	console.dir(e);
}

function gotFile(fileEntry) {

	fileEntry.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(&quot;Text is: &quot;+this.result);
			document.querySelector(&quot;#textArea&quot;).innerHTML = this.result;
		}

		reader.readAsText(file);
	});

}</code></pre>

<p>
After deviceready fires, we use resolveLocalFileSystemURL to translate a path into a FileEntry object. Once again I'm using one of the aliases that ship with the latest version of the File plugin: cordova.file.applicationDirectory. As you can probably guess, this points to the application itself and is read-only, which is fine for our purposes. To this path I add <code>www/index.html</code> to refer to the index.html of the app itself.
</p>

<p>
As you can see in the commented out code, if I really did want to read something inside the www folder, I could just use Ajax. The example in the comment is jQuery-based. But since I wanted to demonstrate the FileSystem API I use it instead. For something this simple I'd probably just use Ajax typically.
</p>

<p>
Once we get the FileEntry object we can then run the <code>file</code> method on it. This gives us a handler to the file itself (think of FileEntry as the agent for the movie star file that is too busy to give us the time of day). Once we have that, we then fire up a new FileReader object, run <code>readAsText</code> on it, and wait for the read operation to end. Once it is done we have access to the contents of the file and can do - whatever - with it. In the sample app I simply added a text area to the DOM.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-15 at 1.43.27 PM.png" />
</p>

<p>
That's it. Full source may be found here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/readtextfile">https://github.com/cfjedimaster/Cordova-Examples/tree/master/readtextfile</a>.
</p>

<p>
As a quick FYI, I have begun work on the FAQ itself. You can view (and comment) on the Google doc here: <a href="https://docs.google.com/document/d/1qKB63z3U2BwCl7Gc-Ry7cPbNbQB-Cur2BaS1BRB1tV0/edit?usp=sharing">https://docs.google.com/document/d/1qKB63z3U2BwCl7Gc-Ry7cPbNbQB-Cur2BaS1BRB1tV0/edit?usp=sharing</a>
</p>