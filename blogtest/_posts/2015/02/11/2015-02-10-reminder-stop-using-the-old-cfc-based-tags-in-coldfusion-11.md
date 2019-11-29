---
layout: post
title: "Reminder - stop using the old CFC-based tags in ColdFusion 11"
date: "2015-02-11T05:57:56+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/02/11/reminder-stop-using-the-old-cfc-based-tags-in-coldfusion-11
guid: 5662
---

Earlier last week I was helping someone diagnose a ColdFusion issue when I noticed he was using the old CFC-based tags in cfscript. Specifically:

<!--more-->

<pre><code class="language-javascript">httpService = new http();
httpService.setMethod("put");
httpService.setCharset("utf-8");
httpService.setUrl(someURL);
httpService.addParam(type="file",name="stuff",file="c:\inetpub\wwwroot\test.csv",mimetype="Content-type:text/csv");
httpService.addParam(type="formfield",name="filename",value="Test");
result = LOCAL.httpService.send().getPrefix();</code></pre>

Back around ColdFusion 9 I believe Adobe made CFCs to support a few different tags in cfscript. They were: cfcollection, cfdbinfo, cffeed, cfftp, cfhttp, cfimap, cfindex, cfldap, cfmail, cfpdf, cfpop, cfquery, cfsearch, cfstoredproc, cfstoredprocresult. 

I used a few of these quite a bit, and in general they worked ok, but I ran into bugs from time to time. Surprisingly these CFCs are <strong>not</strong> encrypted. You can find them in an com.adobe.coldfusion folder under your server's CustomTags folder. Because they weren't encrypted, I actually wrote my own fixes from time to time. 

But the point is - in ColdFusion 11, you should not be using any of these, and should be using the built-in support for tags in script. The documentation for this may be a bit hard to find. The feature as a whole may be found here: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/cfscript#cfscript-Scriptsupportfortags">Script support for tags</a>, but as far as I know, <i>none</i> of the wiki pages shows examples of this in regards to individual tags. 

Adam Cameron does a good <a href="http://blog.adamcameron.me/2015/01/cfml-evolution-of-functionality.html">write up</a> about some of the mistakes in Adobe's implementation. I don't agree they are quite as bad as he points out, but I strongly agree that "cf" should have been removed from the calls and the need to pass in a result argument should have been fixed. Maybe ColdFusion 12 will correct that. (Or Luccee. :)