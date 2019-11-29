---
layout: post
title: "How to tell if a header has been set in ColdFusion"
date: "2007-03-16T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/16/How-to-tell-if-a-header-has-been-set-in-ColdFusion
guid: 1896
---

Here is an interesting question - how do you determine if something has been added to the response header? I needed to know this because of an bug in <a href="http://coldfire.riaforge.org">ColdFire</a> where cflocation stopped working when ColdFire was used. Turns out that when you use cflocation, the debug template is still executed. I'm not sure why the template still runs - but when my code set information in the header, it apparently broke the data that cflocation had also set in the header. So obviously I needed to see if a cflocation header existed - and if so - suppress ColdFire. Easy, right?
<!--more-->
Turns out it <i>isn't</i> that simple. ColdFusion provides a way to get request headers (<a href="http://www.cfquickdocs.com/?getDoc=GetHttpRequestData">getHTTPRequestData</a>), but there is no built in way to get response headers. Luckily this is something built into the plumbing down in Java, and ColdFusion provides us a way to get there with <a href="http://www.cfquickdocs.com/?getDoc=GetPageContext">getPageContext()</a>. Consider the following code block:

<pre><code class="language-javascript">&lt;cfheader name="foo" value="1"&gt;

&lt;cfset response = getPageContext().getResponse()&gt;
&lt;cfif response.containsHeader("foo")&gt;
	yes
&lt;cfelse&gt;
	no
&lt;/cfif&gt;
&lt;p&gt;
&lt;cfif response.containsHeader("foo2")&gt;
	yes
&lt;cfelse&gt;
	no
&lt;/cfif&gt;
</code></pre>

I set a header named foo. This is the header I'll be testing for. I then grab the page context object and from that grab the response object. How did I know to do this? I just looked around the Java API docs a bit. That is where I discovered that the response object has a "containsHeader" method that does exactly what it sounds like - returns true or false if the response contains a particular header. 

If you find you need this functionality, try this simple UDF I wrote. (Which will be up on CFLib later today.)

<pre><code class="language-javascript">&lt;cfscript&gt;
function responseHeaderExists(header) {
	return getPageContext().getResponse().containsHeader(header);
}
&lt;/cfscript&gt;
</code></pre>