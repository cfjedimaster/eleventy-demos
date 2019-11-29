---
layout: post
title: "Ask a Jedi: Reloading a Page with Flash Forms"
date: "2005-11-22T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/22/Ask-a-Jedi-Reloading-a-Page-with-Flash-Forms
guid: 932
---

A reader asks:

<blockquote>
Howw can i make a reload page button with a cfform?
</blockquote>

The answer is to use JavaScript. Flash Forms (and Flash in general) can communicate with JavaScript using getURL. This is a technique I use when I want to use Flash Forms to send the user anywhere, like maybe a detail page based on the current record selected in a grid. To reload though we can just use the JavaScript reload method. Here is the code:

<code>
&lt;script&gt;
function reloadThis() {
	document.location.reload();
}
&lt;/script&gt;

&lt;cfform format="flash" height="50" width="200"&gt;
	&lt;cfinput type="button" name="reload" value="Reload" tooltip="Click here to reload."
	onClick="getURL('javascript:reloadThis()')"&gt;
&lt;/cfform&gt;

&lt;cfoutput&gt;
&lt;p&gt;
#randrange(1,100)#
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

The randRange at the end is just there to confirm the page is reloading. Of course, if you want to hard code a URL in, you can use this in your button:

<code>
&lt;cfinput type="button" name="reload" value="Reload" tooltip="Click here to reload."
onClick="getURL('http://www.cnn.com')"&gt;
</code>

You could replace the CNN with the current URL of course. 

I'm using this technique on a site now where the flash grid lets you click a button and download a file. The URL is hitting a page using cfcontent, so to the user, it looks as if you never left the cfgrid. You select an item, hit the Download button, and are then prompted to download a file. It works great.