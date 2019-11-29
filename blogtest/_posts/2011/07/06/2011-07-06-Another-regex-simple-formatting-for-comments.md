---
layout: post
title: "Another regex - simple formatting for comments"
date: "2011-07-06T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/06/Another-regex-simple-formatting-for-comments
guid: 4296
---

As a follow up to my quick little <a href="http://www.raymondcamden.com/index.cfm/2011/7/5/Quick-little-regex-example--Youtube-video-from-URL">regex post</a> yesterday, I thought I'd share another one today. This is something I'm adding to <a href="http://www.blogcfc.com">BlogCFC</a> later this week, but as I was working on <a href="http://groups.adobe.com">Adobe Groups</a> today I figured I'd test it out there first. It's a formatting trick used n many places, including Google+, and it's something so simple you probably don't even have to document it. What this code will do is convert any word surrounded with asterisks to bolded text and any word surrounded with underscores to italics. Here's the UDF:
<!--more-->
<p/>

<code>
&lt;cfscript&gt;
function simpleFormat(s) {
	s = rereplace(s, "\*(\w+?)\*","&lt;b&gt;\1&lt;/b&gt;","all");
	s = rereplace(s, "_(\w+?)_","&lt;i&gt;\1&lt;/i&gt;","all");
	return s;
}
&lt;/cfscript&gt;
</code>

<p/>

And here is my sample text:

<p/>

<blockquote>
This is some text I feel *very* strongly about. Maybe _you_ don't feel strongly
about it, but honestly, maybe you are just slow.* Or maybe you aren't *slow* per se
but you could _kinda_ slow.

* = No offense to anyone who walks slow!
</blockquote>

<p/>

Notice I intentionally used a * as a pointer to a note at the end of the string. That was to test solitary characters. Here is the output: (Note - edited to remove the blockquote as it messed up formatting.)

<p/>

This is some text I feel <b>very</b> strongly about. Maybe <i>you</i> don't feel strongly about it, but honestly, maybe you are just slow.* Or maybe you aren't <b>slow</b> per se but you could <i>kinda</i> slow. * = No offense to anyone who walks slow!

<p/>

Not rocket science, and I know folks are going to say "what about lists, links, etc etc", but it's nice, simple, and an effective update to plain text. By the way, if you want to handle turning vertical spaces into paragraphs, you can simply add <a href="http://www.cflib.org/udf/XHTMLParagraphFormat">XHTMLParagraphFormat</a> to the code as well.