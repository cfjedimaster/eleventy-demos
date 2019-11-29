---
layout: post
title: "Somewhat lame iOS Cordova debugging tip"
date: "2014-02-17T14:02:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/02/17/Somewhat-lame-iOS-Cordova-debugging-tip
guid: 5154
---

<p>
A while ago I <a href="http://css.dzone.com/articles/overview-mobile-debugging">wrote</a> about iOS Remote Debugging and PhoneGap/Cordova apps. Long story short - it kicks butt and is a great way to debug. (And you can do the same with Android.) There is one small issue though that you may run into and I've got a workaround.
</p>
<!--more-->
<p>
In order to use remote debugging with iOS, you have to run Safari, open the Developer menu, and click on your device or the simulator link. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot1.jpg" />
</p>

<p>
So far so good - except for one thing. Every time you kill and restart the app, Safari will close the debug window. This is not only annoying, but it also means that any console messages, or errors, that show up <strong>before</strong> you re-open the window are lost. Android does <strong>not</strong> have this problem. So what to do if you need to debug the application immediately? 
</p>

<p>
Use an alert.
</p>

<p>
Yeah, that is <i>really</i> lame, but it also works. Consider the following block.
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);
function init() {
  alert(&#x27;Lame sauce!&#x27;);
	console.log(&#x27;running FS tests&#x27;);
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, errorHandler);
}

function errorHandler(e) {
  var msg = &#x27;&#x27;;

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = &#x27;QUOTA_EXCEEDED_ERR&#x27;;
      break;
    case FileError.NOT_FOUND_ERR:
      msg = &#x27;NOT_FOUND_ERR&#x27;;
      break;
    case FileError.SECURITY_ERR:
      msg = &#x27;SECURITY_ERR&#x27;;
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = &#x27;INVALID_MODIFICATION_ERR&#x27;;
      break;
    case FileError.INVALID_STATE_ERR:
      msg = &#x27;INVALID_STATE_ERR&#x27;;
      break;
    default:
      msg = &#x27;Unknown Error&#x27;;
      break;
  }

  console.log(&#x27;Error: &#x27; + msg);
}

function onFSSuccess(fs) {
	console.dir(fs);

    var dirReader = fs.root.createReader();

    dirReader.readEntries(gotFiles,errorHandler);	
}

function gotFiles(entries) {
	console.log(&quot;gotFiles success, size of entries is &quot;+entries.length);
	for(var i=0,len=entries.length; i&lt;len; i++) {
		&#x2F;&#x2F;entry objects include: isFile, isDirectory, name, fullPath
		var s = &quot;&quot;;
		s+= entries[i].fullPath;
		if (entries[i].isFile) {
			s += &quot; [F]&quot;;
		}
		else {
			s += &quot; [D]&quot;;
		}
		console.log(s);     
	}
}</code></pre>

<p>
I placed an alert inside the init function that I've tied to the deviceready event. On load, the alert will stop everything, let me open the debugger in Safari, and carry on. I could have put it on line one as well, but in my case I needed to debug when the deviceready event fired, not before.
</p>