---
layout: post
title: "Example of callback URL support in ColdFusion Builder"
date: "2012-01-09T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/09/Example-of-callback-URL-support-in-ColdFusion-Builder
guid: 4489
---

I know this isn't new - and I've blogged it before - but I thought it was cool so I thought I'd share. I'm preparing for an e-seminar tomorrow morning on RIAForge. I decided I'd quickly show off the <a href="http://riaforgedownloader.riaforge.org/">RIAForge Downloader</a>. If you haven't seen it before, it's an extension to ColdFusion Builder that lets you browse and download projects from your IDE. For example:
<!--more-->
<p>

<b>Right click on a folder and select the extension...</b><br/>

<img src="https://static.raymondcamden.com/images/ScreenClip9.png" />

<p>

<b>Pick a project...</b><br/>

<img src="https://static.raymondcamden.com/images/ScreenClip10.png" />

<p>

<b>Browse to the one you want - note - we filter to projects with actual downloads</b><br/>
<img src="https://static.raymondcamden.com/images/ScreenClip11.png" />

<p>

<b>Select one...</b><br/>
<img src="https://static.raymondcamden.com/images/ScreenClip12.png" />

<p>

And then all you have to do is click download. Until about a few minutes ago, when you clicked download, it would fetch the bits, use cfzip to unzip them, and then remind you to refresh your Eclipse folder. 

<p>

But you can actually tell the IDE to refresh itself. Extensions are passed a callbackurl value that points to a service that accepts XML. You take your XML commands and simply CFHTTP to the server.

<p>

<code>
&lt;!--- data is a variable containing the data Builder sends to all extensions. ---&gt;
&lt;cfset cburl = data.event.ide.callbackurl.xmltext&gt;
&lt;cfsavecontent variable="cbxml"&gt;
&lt;cfoutput&gt;
&lt;response&gt;
&lt;ide&gt;
	&lt;commands&gt;
	&lt;command type="refreshfolder"&gt;
	&lt;params&gt;
	&lt;param key="foldername" value="#basedirectory#" /&gt;
	&lt;/params&gt;
	&lt;/command&gt;
&lt;/commands&gt;
&lt;/ide&gt;
&lt;/response&gt;
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;
&lt;cfhttp method="post" url="#cburl#" result="commandresponse"&gt;
	&lt;cfhttpparam type="body" value="#cbxml#" &gt;
&lt;/cfhttp&gt;
</code>

<p>

And voila - no need to tell the user to refresh the folder, it happens automagically. Other callback commands exist - just check the docs. I've also written a "helper" CFC you can download <a href="http://builderhelper.riaforge.org/">here</a> that makes this even easier to use.