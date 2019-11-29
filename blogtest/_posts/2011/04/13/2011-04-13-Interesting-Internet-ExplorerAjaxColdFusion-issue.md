---
layout: post
title: "Interesting Internet Explorer/Ajax/ColdFusion issue"
date: "2011-04-13T15:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/04/13/Interesting-Internet-ExplorerAjaxColdFusion-issue
guid: 4194
---

I was just talking to John Ramon about an odd issue he was having with Internet Explorer and Ajax. His code was <i>incredibly</i> simple and worked fine in Chrome but not IE. Here's a quick example of how simple his code was:
<!--more-->
<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#spot").load("test3.cfm");
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="spot"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can see, all this code does is load the page and make an Ajax request to load test3.cfm. When I tested his site in IE9 it worked fine. I then found a machine with IE8 (yeah, cuz lord forbid a web developer be allowed to run IE8 and 9 on the same machine without creating an entire operating system virtual image as opposed to just freaking running two apps but I'll stop the sermon now) and it also worked for me fine there!

<p>

Turns out the issue was ColdFusion debugging! That's why it worked fine in my IE and not his. He had his debugging restricted to just his IP so I never saw it. Now here's where things get interesting. Those of us who use Ajax and ColdFusion are used to disabling debugging since it breaks JSON responses. But in this case it should not have mattered. ColdFusion's debugging HTML would have just been added to the end. And in fact, when I turned on debugging and ran the page in Chrome, I just saw 2 copies of the debugging info. One from the "main" page I ran and one from the page loaded via Ajax. But in IE (and that includes IE9) I was able to replicate it as well.

<p>

My <i>guess</i> is that the closing &lt;/div&gt; tag output in the beginning of ColdFusion's debugging output broke IE's DOM when it was inserted into the div. This is - probably - IE being a bit more strict than Chrome. 

<p>

As one last reminder - you can easily use ColdFusion debugging and turn it off on a per request basis using:

<p>

<code>
&lt;cfsetting showdebugoutput="false"&gt;
</code>