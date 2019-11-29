---
layout: post
title: "Spry demo - check for a valid URL"
date: "2007-02-26T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/26/Spry-demo-check-for-a-valid-URL
guid: 1862
---

There has been a UDF released for a while now that would check to see if a URL is valid. Ben wrote <a href="http://www.cflib.org/udf.cfm?ID=1385">urlExists</a> over a year ago. Along with isValid(), you can check both the form and existence of a URL.
<!--more-->
For the heck of it - I thought I'd make a quick demo in Spry showing how you can do without refreshing the browser. First take a quick look at the online demo:

<blockquote>
<a href="http://ray.camdenfamily.com/demos/spryurlcheck/">http://ray.camdenfamily.com/demos/spryurlcheck/</a>
</blockquote>

Don't hit submit on the button, just enter a URL and click off of it. Do note that the you have to enter a valid URL before the server will check it. (So don't enter "toaster", enter "http://www.toaster.com".) 

The code behind this is rather simple. First, look at the form field for URL:

<code>
&lt;input type="text" name="homepage" id="homepage" onBlur="validateURL()"&gt; &lt;span id="urlcheckresult"&gt;&lt;/span&gt;
</code>

I use an onBlur to call a JavaScript function. Also note the span next to the form field. validateURL is pretty simple:

<code>
function validateURL() {
	var url = $("homepage").value;
	if(url == '') return;
	Spry.Utils.updateContent('urlcheckresult','urlcheck.cfm?site='+encodeURI(url));	
}
</code>

I grab the value of the URL and ensure it isn't blank. Next I use updateContent. This was added in the last Spry release. It is a simple way to load a new URL into a div or span. Here I'm simply pointing the span next to my form field to a server side file. The server side file is also rather simple. To cut down on the size I removed Ben's UDF:

<code>
&lt;cfparam name="url.site" default=""&gt;
&lt;style&gt;
b.good {
	color: green;
}
b.sucky {
	color: red;
}

&lt;/style&gt;

&lt;cfif len(url.site) and isValid("url", url.site)&gt;
	&lt;cfif urlExists(url.site)&gt;
		&lt;cfoutput&gt;&lt;b class="good"&gt;Valid URL!&lt;/b&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;&lt;b class="sucky"&gt;Appears to be an invalid URL&lt;/b&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

The only thing that I don't like about this demo is the speed. Adobe made updateContent blocking, so you can't do anything while the page is loading. Of course, someone could easily add this to the Spry code.