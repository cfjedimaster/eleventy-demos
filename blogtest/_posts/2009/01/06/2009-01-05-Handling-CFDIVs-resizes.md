---
layout: post
title: "Handling CFDIV's resizes"
date: "2009-01-06T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/06/Handling-CFDIVs-resizes
guid: 3178
---

Omer asks:

<blockquote>
<p>
I am using cfdiv to allow users to browse videos without refreshing the whole page. The problem I am facing now is that when the user hit the next link to show 10 next videos, the div starts loading the stuff and it resizes (get smaller with the loading message) and when the videos load, it goes back to its original size. I want to know how can I keep the size of div same even when ajax is loading the stuff.
</p>
</blockquote>
<!--more-->
The issue Omer is talking about can be demonstrated with the following code. Our root page will simply have:

<code>
&lt;h2&gt;Header&lt;/h2&gt;

&lt;cfdiv bind="url:test3.cfm" /&gt;

&lt;p&gt;
My footer...
&lt;/p&gt;
</code>

The file test3.cfm will generate some images:

<code>
&lt;cfloop index="x" from="1" to="5"&gt;
	&lt;cfset a = imageNew("", 120,70, "rgb", "green")&gt;
	&lt;cfset imageDrawText(a, "Image #x#", 5, 12)&gt;
	&lt;cfset sleep(200)&gt;
	&lt;cfimage action="writeToBrowser" source="#a#"&gt;
	&lt;br/&gt;&lt;br /&gt;
&lt;/cfloop&gt;
&lt;cfoutput&gt;&lt;a href="#ajaxLink('test3.cfm')#"&gt;Reload...&lt;/a&gt;&lt;/cfoutput&gt;
</code>

Note the reload link in there. If you run this, you will notice an odd resizing of the cfdiv every time the content is reloaded. This is so exciting I decided to make a movie out of it. (<b>Mac Firefox 3 Users:</b> Remember to click in the upper left hand triangle. Jing is aware of the bug and says it will be fixed soon.)

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="530" height="598"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/FirstFrame.jpg&width=530&height=598&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/00000002.swf"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <param name="base" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="530" height="598" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/FirstFrame.jpg&width=530&height=598&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/00000002.swf" allowFullScreen="true" base="http://content.screencast.com/users/jedimaster/folders/Jing/media/1a342a4a-3661-4969-8cbe-fb7c65bea7fd/" scale="showall"></embed> </object>

Luckily this is rather easy to fix. The cfdiv tag will accept any normal CSS attributes. I changed my code like so:

<code>
&lt;cfdiv bind="url:test3.cfm" style="background-color: red;width:100%;height:500px" /&gt;
</code>

The red background was just to help make it a bit clearer, and to share some late Christmas spirit. What's important is the width and height. I picked values that made sense for my content. This now results in...

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="512" height="615"> <param name="movie" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/bootstrap.swf"></param> <param name="quality" value="high"></param> <param name="bgcolor" value="#FFFFFF"></param> <param name="flashVars" value="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/FirstFrame.jpg&width=512&height=615&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/00000003.swf"></param> <param name="allowFullScreen" value="true"></param> <param name="scale" value="showall"></param> <param name="allowScriptAccess" value="always"></param> <param name="base" value="http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/"></param> <embed src="http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/bootstrap.swf" quality="high" bgcolor="#FFFFFF" width="512" height="615" type="application/x-shockwave-flash" allowScriptAccess="always" flashVars="thumb=http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/FirstFrame.jpg&width=512&height=615&content=http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/00000003.swf" allowFullScreen="true" base="http://content.screencast.com/users/jedimaster/folders/Jing/media/596829ab-70c7-4ac2-ae6a-33593322eb70/" scale="showall"></embed> </object>

Pretty easy!