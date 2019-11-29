---
layout: post
title: "Detecting CFINCLUDE versus Custom Tag"
date: "2010-04-02T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/02/Detecting-CFINCLUDE-versus-Custom-Tag
guid: 3771
---

JC Panzerpants asks:

<p>

<blockquote>
Hey Ray! I've been googling for a good 45 minutes trying to find a way to do this... maybe you know off the top of your head. Is there a way for a CF file to determine how it's being accessed? Like, directly vs cfincluded vs cfmoduled etc. Mostly I'm interested in if it can tell whether it's being accessed directly or not, but being able to tell what the parent file is that's calling it would be useful too.
<br/><br/>
I'm trying to convert an old, big, messy 1000+ line application.cfm file into something readable, functional, and able to be edited without cringing in fear that one change might break other parts.
<br/><br/>
I'm absolutely sure I've seen a way to do this before, but all I've been able to find is the executionmode function for custom tags, which is nice, but not what I'm looking for...
</blockquote>
<!--more-->
<p>

Well there are a few things going on here and a few things we can try. For the simplest check - how can you tell a custom tag? One quick way is just do:

<p>

<code>
&lt;cfif isDefined("attributes")&gt;
</code>

<p>

This used to be sufficient, but don't forget that you also get an attributes scope inside cfthread. So the better check may be:

<p>

<code>
&lt;cfif isDefined("attributes") and not isDefined("thread")&gt;
</code>

<p>

Now, as to checking a cfincluded template, the only way I know of is to compare getBaseTemplatePath to getCurrentTemplatePath. getBaseTemplatePath always gets the "core" CFM whereas getCurrentTemplatePath returns the "active" one. I put this and the earlier code block together to form this:

<p>

<code>

&lt;cfif isDefined("attributes") and not isDefined("thread")&gt;
I seem to be a custom tag.
&lt;cfelseif getBaseTemplatePath() neq getCurrentTemplatePath()&gt;
I seem to be an include
&lt;cfelse&gt;
I seem to be vanilla code.
&lt;/cfif&gt;
</code>

<p>

I then wrote this test:

<p>

<code>
&lt;h2&gt;Root&lt;/h2&gt;

&lt;cfif isDefined("attributes") and not isDefined("thread")&gt;
I seem to be a custom tag.
&lt;cfelseif getBaseTemplatePath() neq getCurrentTemplatePath()&gt;
I seem to be an include
&lt;cfelse&gt;
I seem to be vanilla code.
&lt;/cfif&gt;

&lt;h2&gt;CFInclude&lt;/h2&gt;

&lt;cfinclude template="test2.cfm"&gt;

&lt;h2&gt;Custom Tag&lt;/h2&gt;

&lt;cf_simpletag&gt;
</code>

<p>

The contents of test2.cfm were the CFIF. Ditto in simpletag.cfm. The result seemed fine to me:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-02 at 8.23.12 AM.png" title="Snazzy screen shot" />

<p>

As for getting the immediate parent, that isn't quite as easy. If test1.cfm includes test2.cfm and test2.cfm includes test3.cfm, your base template path in test3.cfm will go all the way up to test1.cfm. The only way I know of to get that lineage in that case is with a try/catch and introspecting the tag context array.