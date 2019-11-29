---
layout: post
title: "PhoneGap/Cordova Example - Getting File Metadata (and an update to the FAQ)"
date: "2014-08-18T18:08:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/08/18/PhoneGapCordova-Example-Getting-File-Metadata-and-an-update-to-the-FAQ
guid: 5289
---

<p>
I decided to move my PhoneGap/Cordova FileSystem FAQ from a Google Doc to my Cordova Examples repository. I figured this would make it a bit easier for folks to edit and simpler for me to commit those changes. You can find the FAQ here:
</p>
<!--more-->
<p>
<a href="https://github.com/cfjedimaster/Cordova-Examples/wiki/PhoneGap-Cordova-File-System-FAQ">PhoneGap Cordova File System FAQ</a>
</p>

<p>
In doing so I decided to quickly knock out one of the questions - how to get metadata about files. This is rather trivial, so my demo app is rather trivial, but hopefully it will help folks. The basic gist is - once you have a FileEntry object, you can then fetch the File object itself (<a href="https://developer.mozilla.org/en-US/docs/Web/API/File">MDN Docs</a>) and fetch various properties. Here is a super simple demo roughly based on the ones I showed earlier. It uses window.resolveLocalFileSystemURL to get index.html.
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
	
	&#x2F;&#x2F;This alias is a read-only pointer to the app itself
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + &quot;www&#x2F;index.html&quot;, gotFile, fail);

}

function fail(e) {
	console.log(&quot;FileSystem Error&quot;);
	console.dir(e);
}

function gotFile(fileEntry) {

	fileEntry.file(function(file) {
		var s = &quot;&quot;;
		s += &quot;&lt;b&gt;name:&lt;&#x2F;b&gt; &quot; + file.name + &quot;&lt;br&#x2F;&gt;&quot;;
		s += &quot;&lt;b&gt;localURL:&lt;&#x2F;b&gt; &quot; + file.localURL + &quot;&lt;br&#x2F;&gt;&quot;;
		s += &quot;&lt;b&gt;type:&lt;&#x2F;b&gt; &quot; + file.type + &quot;&lt;br&#x2F;&gt;&quot;;
		s += &quot;&lt;b&gt;lastModifiedDate:&lt;&#x2F;b&gt; &quot; + (new Date(file.lastModifiedDate)) + &quot;&lt;br&#x2F;&gt;&quot;;
		s += &quot;&lt;b&gt;size:&lt;&#x2F;b&gt; &quot; + file.size + &quot;&lt;br&#x2F;&gt;&quot;;
		
		document.querySelector(&quot;#status&quot;).innerHTML = s;
		console.dir(file);
	});
}</code></pre>

<p>
Here is a sample of it running in iOS. (Be aware - there is a bug with Android that may prevent this from working. It is reported at the Cordova site.)
</p>

<p>
<img src="https://static.raymondcamden.com/images/iossim.png" class="bthumb" />
</p>

<p>
So - yeah - not rocket science - but hopefully helpful. This "application" can be grabbed from my Cordova repo: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/getfiledata">https://github.com/cfjedimaster/Cordova-Examples/tree/master/getfiledata</a>.
</p>