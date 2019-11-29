---
layout: post
title: "ColdFusion, CFHTTP, and java.io.ByteArrayOutputStream"
date: "2014-12-12T13:23:21+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/12/12/coldfusion-cfhttp-and-java-io-bytearrayoutputstream
guid: 5442
---

I believe I may have blogged this before, but a reader ran into this yesterday so I thought it might be worth sharing. If you are using CFHTTP to hit a remote and seeing java.io.ByteArrayOutputStream in the result, there is a simple solution around that.

<!--more-->

Here is a sample cfdump of just such a response. You are expecting a string of some sort in fileContent, but instead end up with a Java object:

<a href="http://www.raymondcamden.com/wp-content/uploads/2014/12/unnamed.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2014/12/unnamed.png" alt="unnamed" width="450" height="568" class="alignnone size-full wp-image-5443" /></a>

To work with this result as a string, you simply need to run toString() on the value. So for example, if you know the response is JSON:

<pre><code class="lang-javascript">deserializeJSON(result.filecontent.toString())</code></pre>

I'll be honest and say I don't know why some servers return that, or why cfhttp can't simply toString it itself. I'm assuming there is a good reason that probably involves all kind of crap I really don't care about. ;)

p.s. It looks like this might be just ColdFusion 9 and earlier - see this <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3574332">bug report</a>. I can say it has been a while since I've seen it. I've run ColdFusion 10 since it came out pretty much.