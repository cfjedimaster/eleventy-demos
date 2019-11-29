---
layout: post
title: "Finding the owner of a file with ColdFusion"
date: "2015-05-29T08:30:53+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/05/29/finding-the-owner-of-a-file-with-coldfusion
guid: 6221
---

A reader asked me last night if it was possible to find the owner of a file using ColdFusion. You may think <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/GetFileInfo">getFileInfo</a> would return this but it does not. Luckily it is relatively simple to get to it from Java.

<!--more-->

The first result I found via Google sent me to a <a href="http://stackoverflow.com/a/23152140/52160">Stack Overflow</a> answer that worked fine once I converted it to work within ColdFusion:

<pre><code class="language-javascript">pathOb = createObject("java", "java.nio.file.Paths");
//Hard coded path here, but obviously this would be dynamic
path = pathOb.get("/Applications/ColdFusion11/cfusion/wwwroot/test.cfm",[]);
files = createObject("java", "java.nio.file.Files");
fav = createObject("java","java.nio.file.attribute.FileOwnerAttributeView");
oav = files.getFileAttributeView(path, fav.getClass(), []);
owner = oav.getOwner();
writeoutput(owner);</code></pre>

You could easily wrap this up into a UDF so it is easier to call. Ok, Ray, don't be lazy. Here is a UDF version with an example call:

<pre><code class="language-javascript">
function getFileOwner(p) {
	var pathOb = createObject("java", "java.nio.file.Paths");
	var path = pathOb.get(p,[]);
	var files = createObject("java", "java.nio.file.Files");
	var fav = createObject("java","java.nio.file.attribute.FileOwnerAttributeView");
	var oav = files.getFileAttributeView(path, fav.getClass(), []);
	return oav.getOwner();
}

writeoutput(getFileOwner(expandPath("./Application.cfc")));
</code></pre>

And because I was bored, I rewrote the UDF as one line that would be a pain in the rear to debug.

<pre><code class="language-javascript">
function getFileOwner(p) {
	return createObject("java", "java.nio.file.Files").getFileAttributeView(createObject("java", "java.nio.file.Paths").get(p,[]), createObject("java","java.nio.file.attribute.FileOwnerAttributeView").getClass(), []).getOwner();
}
</code></pre>