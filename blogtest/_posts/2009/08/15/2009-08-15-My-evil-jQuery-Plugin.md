---
layout: post
title: "My evil jQuery Plugin"
date: "2009-08-15T16:08:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/08/15/My-evil-jQuery-Plugin
guid: 3489
---

I demonstrated this at my jQuery presentation earlier today at CFUNITED but I thought I'd share the code. The basic idea is this - you have a coworker you hate (we've all had one from time to time), so you quickly figure out their IP and output some code just for them:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="myplugin.js"&gt;&lt;/script&gt;
&lt;script&gt;
&lt;cfif cgi.remote_host is "127.0.0.1"&gt;
function mean() { 
	$("#content").notMean();
}

$(document).ready(function () {
	window.setInterval('mean()',5000)	
})
&lt;/cfif&gt;
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="content"&gt;
This is my text. It is only my text. It does not have anything special in it. You should not read it.
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

What does the 'notMean' plugin do? I think a video demonstration may be a bit nicer.<br/><br/>

<object height="322" width="684">
	<param name="movie" value="http://www.raymondcamden.com/downloads/evil.swf"/>
	<param name="menu" value="false"/>
	<param name="scale" value="noScale"/>
	<param name="allowFullScreen" value="true"/>
	<param name="allowScriptAccess" value="always" />
	<embed src="http://www.coldfusionjedi.com/downloads/evil.swf" allowscriptaccess="always" allowFullScreen="true" height="322" width="684" type="application/x-shockwave-flash" />
</object><br/><br/>

Be sure to watch the entire thing - it is a bit subtle. So I don't imagine anyone would ever use this in production (but if you do, let me know), but here is the source code:

<code>
$.fn.notMean = function(){
	this.each(
		function(){
			var contents = $(this).html()
			var ranPos = Math.ceil(Math.random() * contents.length)
			var ranChar = Math.ceil(Math.random() * 26) + 65
			var newChar = String.fromCharCode(ranChar)
			if(Math.random() &gt; 0.5) newChar = newChar.toLowerCase()
			var newContents = contents.substring(0,ranPos) + newChar + contents.substring(ranPos+1,contents.length)
			$(this).html(newContents)
		}
	)
		
	return this
}
</code>

Enjoy!