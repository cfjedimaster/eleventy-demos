---
layout: post
title: "Ask a Jedi: Dynamic Images and Deletes"
date: "2005-09-23T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/23/Ask-a-Jedi-Dynamic-Images-and-Deletes
guid: 800
---

Here is an interesting question:

<blockquote>
On my site I am creating custom images of stamps which are saved on the web server.  When the session ends I want it to delete the image file. I'm using this code in onSessionEnd: &lt;cffile action="delete" file="C:\Inetpub\www\images\xstamp\temp\#arguments.sessionScope.file#.jpg"&gt;
This works fine in  IE and sometimes in firefox but not consitantly with either, sessions are set to expire in 20 minutes in the cfapplication tag.  Any suggestions??
</blockquote>

So, a few responses here. First off - you are using Application.cfc, so I assume you meant setting it in the THIS scope, not in a cfapplication tag. I assume - but double check. I'm not sure you can even put a cfapplication tag inside a Application.cfc. Even if you can - don't. Secondly - you are setting a timeout. Good. I hope folks remember there is a bug in CFMX 7.0 where onSessionEnd will <b>not</b> get fired if an explicit sessionTimeout isn't defined in the THIS scope for the Application.cfc.

Another though - I know that IIS had an issue in the past where it would lock files. I.e., user requests foo.jpg, and ColdFusion can't delete it. There was some setting you could modify. I haven't seen this in <i>many</i> years, but I haven't done what you have in many years either.

That being said, let me offer you an alternative that may help. You can still create the files on the fly, but instead of letting the browser load the images by URL, use a proxy instead. Imagine this file:

<code>
&lt;cfparam name="session.file" default="red.gif"&gt;

&lt;cfif isDefined("url.color")&gt;
	&lt;cfif url.color is "red"&gt;
		&lt;cfset session.file = "red.gif"&gt;
	&lt;cfelseif url.color is "green"&gt;
		&lt;cfset session.file = "green.gif"&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;a href="#cgi.script_name#?color=red"&gt;Set to red.&lt;/a&gt;&lt;br&gt;
&lt;a href="#cgi.script_name#?color=green"&gt;Set to green.&lt;/a&gt;&lt;br&gt;
&lt;/cfoutput&gt;

&lt;p&gt;
&lt;img src="image_dynamic.cfm"&gt;
&lt;/p&gt;
</code>

This code starts off defaulting the name of a file for the session. This would be dynamic for your application. I then provide a simple way to update the file. Lastly, note that my image is pointing to a CFM file, not a .gif or .jpg. Now let's look at image_dynamic.cfm:

<code>
&lt;cfparam name="session.file" default="red.gif"&gt;

&lt;cfcontent type="image/gif" file="#expandPath(".\#session.file#")#"&gt;
</code>

Nothing too complex here. I defaulted session.file, just in case a person views the file directly. Normally I'd have that in onSessionStart however. Then I simply use expandPath to load in the file. 

So this approach has a number of benefits. You could put the image files completely out of your web root. This <i>should</i> make your deletes work. However, remember that onSessionEnd may not always fire. Your web server could crash, for example. You should consider adding a scheduled task that deletes all images older than a certain time, maybe 48 hours or so.

(Look, a real ColdFusion post, finally! :)