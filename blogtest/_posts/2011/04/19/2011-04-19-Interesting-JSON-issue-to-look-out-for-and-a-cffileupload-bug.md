---
layout: post
title: "Interesting JSON issue to look out for - and a cffileupload bug"
date: "2011-04-19T18:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/19/Interesting-JSON-issue-to-look-out-for-and-a-cffileupload-bug
guid: 4200
---

This one surprised me - a lot. A reader wrote me this morning about an issue he was having following my <a href="http://www.raymondcamden.com/index.cfm/2010/3/5/ColdFusion-9-Multifile-Uploader--Complete-Example">tutorial</a> on using cffileupload. He reported that files were being uploaded but the Flash control kept returning a red error result to the end user. I whipped out my copy of Charles, an excellent network tool, and looked at the response. It's then I noticed that the JSON response was prefixed with //. Now - this is to be expected if you enable the "Prefix serialized JSON with" option in your ColdFusion administrator. However - all of ColdFusion's front end Ajax-y widgets are supposed to recognize and account for this. The end result being you enable the feature and don't have to worry about changing widgets like cfgrid, cfwindow, etc, and certainly cffileupload. Unfortunately, it looks like there is a bug (the report is <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=83573">here</a>) and the feature completely breaks cffileupload.
<!--more-->
<p>

Now here is where things get interesting. If you read the description in the ColdFusion Admin for this feature, it says:

<p>

<blockquote>
Protects web services which return JSON data from cross-site scripting attacks by prefixing serialized JSON strings with a custom prefix. 
</blockquote>

<p>

This to me implies that when I request a CFC method with returnFormat=json that the prefix will be prepended to the result. However, in my tutorial, I was simply doing something like this:

<p>

<code>
&lt;cfset str.STATUS = 200&gt;
&lt;cfset str.MESSAGE = "passed"&gt;
&lt;cfoutput&gt;#serializeJSON(str)#&lt;/cfoutput&gt;
</code>

<p>

This by itself was enough to modify the result. Even called on a page by itself - no Ajax involved - the result is prefixed with //. This is not what I expected.