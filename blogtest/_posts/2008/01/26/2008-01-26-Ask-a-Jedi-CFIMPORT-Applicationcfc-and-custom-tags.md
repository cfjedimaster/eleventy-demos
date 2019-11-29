---
layout: post
title: "Ask a Jedi: CFIMPORT, Application.cfc, and custom tags"
date: "2008-01-26T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/26/Ask-a-Jedi-CFIMPORT-Applicationcfc-and-custom-tags
guid: 2617
---

Tony asks two interestin questions:

<blockquote>
<p>
1. I really like cfimport for being able to call my customtag libraries by directory vs by file and then using prefix:tagname.  However, I do NOT like having to add that line of code to every page.  I think I remember hearing/reading that cfimport cannot be used in Application.cfc. Is this correct? I tried adding a cfimport call into onRequestStart but it didn't work.  It didn't throw an error, it just didn't render my masterlayout elements.  Thoughts??  (NOTE:  I have no problem
using cfmodule or cf_tagname...it's what I've been using as of late. It's really the concept of organizing my customtags in directories that had me considering
cfimport instead.)
</p>
</blockquote>

So yes, if you do use cfimport, you must include it on every page. However, you actually can use cfimport on an Application.cfc page, it just won't "carry over" into the current CFM file. I added a cfimport to a sample Application.cfc file, inside my cfcomponent tag, and inside onRequestStart, I did:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="true"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfoutput&gt;header call: &lt;/cfoutput&gt;&lt;ray:time&gt;&lt;cfoutput&gt; end header call&lt;/cfoutput&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

"ray" was the prefix I had used, and time just outputs now(). This works fine, although please note I don't support outputting headers in onRequestStart. But if you wanted to use cfimport inside Application.cfc itself, you <i>can</i> do it.

<blockquote>
<p>
2. If I end up just sticking with good ole cfmodule or cf_tagname, is there a way to specify customtag paths and mappings in Application.cfc (vs opening up CF Admin to do it)?
</p>
</blockquote>

In ColdFusion 8, this is baked in. You can create both mappings and custom tags using the This scope in the Application.cfc file. You can read more about this feature in LiveDocs: <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/appFramework_04.html#1203247">Specifying settings per application</a> (PS to the Live Docs team - why do you make it so hard to find the link to a page? In the old Live Docs, I remember a URL at the bottom of each page. This seems to have been removed.)