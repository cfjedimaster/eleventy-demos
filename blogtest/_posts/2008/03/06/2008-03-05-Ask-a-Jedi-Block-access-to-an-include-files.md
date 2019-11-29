---
layout: post
title: "Ask a Jedi: Block access to an include files"
date: "2008-03-06T07:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/06/Ask-a-Jedi-Block-access-to-an-include-files
guid: 2693
---

Devon asks:

<blockquote>
<p>
I am using your custom tag technique to manage the layout of my site. I'm not sure if the fact that the cfinclude is in a tag makes any difference but I am looking for a way to stop in include file from being accessible if navigated to
directly. One thought was to move the cfoutput tags out of the included files and into the layout...but it seems then i need to cfoutput around all variables...and then they are displayed if the page is browsed directly. 

The other option is to set a variable in the request scope that I then check in all included pages to make sure it was called from within a layout. So far this is what I am going with. Am I overlooking a feature that does this better?
</p>
</blockquote>
<!--more-->
So the obvious answer is that if you don't want a CFM available directly, just move it out of a web root. I typically put all my includes in an include folder, outside of web root. If /app is a ColdFusion mapping pointing to my application root, I'd then use

&lt;cfinclude template="/app/includes/slovenlytrull.cfm"&gt;

But what if you are on a host and your root folder <i>is</i> your web root? One simple thing to do is check the current versus base template path. Consider this file that is included:

<code>
&lt;cfif getBaseTemplatePath() eq getCurrentTemplatePath()&gt;
	Direct execution denied.
	&lt;cfabort&gt;
&lt;/cfif&gt;

This is the include file - running fine.
</code>

The getBaseTemplatePath function returns the files 'base' page. This just means that if the file was an cfinclude or custom tag, you get the file that called it, not the file itself. The getCurrentTemplatePath function will return the file itself.

If you hit the included filed directly, then both functions will return the same value. Therefore I output an error and abort the request.

Again though the number one thing I'd recommend is simply moving the file out of web root.