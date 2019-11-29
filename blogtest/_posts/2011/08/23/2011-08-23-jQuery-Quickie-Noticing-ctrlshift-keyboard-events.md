---
layout: post
title: "jQuery Quickie - Noticing ctrl/shift keyboard events"
date: "2011-08-23T15:08:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/08/23/jQuery-Quickie-Noticing-ctrlshift-keyboard-events
guid: 4336
---

Andy S. asked me earlier today...
<p/>
<blockquote>
I know how to trap for simple keyboard events using jQuery like so...
<br/><br/>
$(document).keydown(function (e){<br/>
   if (e.which == 13){<br/>
       doSomething();<br/>
   }<br/>
});<br/>
<br/><br/>
How can I trap for keyboard combinations like someone pressing the Ctrl + Shift + F2 all at once?
</blockquote>
<!--more-->
<p>

I did some quick Googling and found this on the <a href="http://api.jquery.com/keydown/#comment-73042279/">keydown() docs</a> at jQuery.com:

<p>

<blockquote>
You would check for event.shiftKey:<br/>
if ( event.which == 13 && event.shiftKey ) {<br/>
// do something<br/>
}<br/>
</blockquote>

<p>

This was posted by Karl Swedberg. I took his idea and built up a simple demo:

<p>

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
   &lt;script type="text/javascript"&gt;
   $(document).ready(function() {
	   
		$(document).keydown(function (e){
			var s = '';
			if (e.ctrlKey) s += "CTRL ON&lt;br/&gt;";
			else s += "CTRL OFF&lt;br/&gt;";

			if (e.shiftKey) s += "SHIFT ON&lt;br/&gt;";
			else s += "SHIFT OFF&lt;br/&gt;";

			s+= "Key : " + e.which;
			$("#test").html(s);		 
			e.preventDefault();
		});
   });
   &lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
	
Type on your keyboard...
&lt;p/&gt;

&lt;div id="test"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can see, I look for both the ctrlKey and shiftKey flags in the event object. I create a string that shows what you typed along with whether or not the ctrl or shift (or both) keys were depressed. You can run this yourself using the link below. It worked fine in Chrome, Firefox, and, wait for it, yes, even Internet Explorer 9. 

<p>


<a href="http://www.raymondcamden.com/demos/aug232011/test2.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>