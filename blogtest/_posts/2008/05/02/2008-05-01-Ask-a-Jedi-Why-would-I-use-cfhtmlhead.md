---
layout: post
title: "Ask a Jedi: Why would I use cfhtmlhead?"
date: "2008-05-02T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/02/Ask-a-Jedi-Why-would-I-use-cfhtmlhead
guid: 2801
---

Jen asks:

<blockquote>
<p>
i read your <a href="http://www.raymondcamden.com/index.cfm/2008/4/30/Ask-a-Jedi-Does-ColdFusion-have-a-htmlfoot-tag">recent post</a> on the cfhtmlhead tag and wondered if you might review why we would use the cfhtmlhead tag instead of a cfinclude? what are the pros and cons for each method?
</p>
</blockquote>
<!--more-->
As I said in that <a href="http://www.coldfusionjedi.com/index.cfm/2008/4/30/Ask-a-Jedi-Does-ColdFusion-have-a-htmlfoot-tag">post</a>, I'm not really a fan of cfhtmlhead so I may not be the best person to ask. I'll explain how I think it could be used.

Imagine a fairly typical ColdFusion page that looks like so:

<code>
&lt;cf_layout title="Deep Thoughts by Paris Hilton"&gt;
code and logic for page go here
&lt;/cf_layout&gt;
</code>

This this page, the main logic/text/etc of the page is wrapped by a custom tag that handles the layout of the site. Imagine your code/logic/etc realizes that it's going to need Spry libraries. But at this point, the head of your template has already been output. In order to 'change the past' so to speak, you could simply use cfhtmlhead to embed the script tags to load Spry libraries.

Now normally I wouldn't do it like that at all. I'd have something like this instead:

<code>
needSpry = false
if (logic here) needSpry=true

&lt;cf_layout loadSpry="#needSpry#"&gt;
etc
&lt;/cf_layout&gt;
</code>

And in a Model-Glue style framework I'd do it like so:

<code>
if(logic here) viewState.setValue("needspry", true)
</code>

Which the Layout event would be able to pick up on.