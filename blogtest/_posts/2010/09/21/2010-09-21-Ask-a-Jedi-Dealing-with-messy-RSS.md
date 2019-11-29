---
layout: post
title: "Ask a Jedi: Dealing with messy RSS"
date: "2010-09-21T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/21/Ask-a-Jedi-Dealing-with-messy-RSS
guid: 3949
---

Steve asks:

<p/>

<blockquote>
A question on CFFEED: How do you control/resize the image in the description column of linked media? Or strip it out if it is malformed?
</blockquote>
<!--more-->
<p/>

This is a great question because it touches on two important issues. One - if you willy nilly display the content of a RSS feed you may get undesired results in your page layout. In Steve's case he was trying to display the content in side column and the images were too big to fit. The other issue is that the HTML you get from the RSS feed could not only be bad for your site layout, but could also be completely broken! Let's look at the some examples of both cases. 

<p/>

First, let's start by just getting the feed and displaying it.

<p/>

<code>
&lt;cffeed source = "http://wow.joystiq.com/rss.xml" properties = "myProps" query = "myQuery"&gt;

&lt;cfoutput&gt;
&lt;h2&gt;#myProps.title#&lt;/h2&gt;
&lt;/cfoutput&gt;

&lt;cfoutput query = "myQuery"&gt;
	&lt;cfif myProps.version IS "atom_1.0"&gt;
		&lt;h3&gt;&lt;a href = "#linkhref#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
	&lt;cfelse&gt;
		&lt;h3&gt;&lt;a href = "#rsslink#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
	&lt;/cfif&gt;
	 &lt;div class="content"&gt;
     #content#
	 &lt;/div&gt;
&lt;/cfoutput&gt;
</code>

<p/>

This results in a hodgepodge of graphics and other items:

<p/>

<img src="https://static.raymondcamden.com/images/screen5.png" />

<p/>

As you can see, some of the images are pretty wide. We <i>could</i>, if we wanted to, make use of regular expressions to find each image, remove any existing height/width attribute, and add our own with a set value of 200 for example. Setting just width should proportion things right. While that would work, it would probably easier to just use CSS:

<p/>

<code>
&lt;cffeed source = "http://wow.joystiq.com/rss.xml" properties = "myProps" query = "myQuery"&gt;

&lt;style&gt;
div.content img {
	max-width:250px;
}
&lt;/style&gt;
&lt;cfoutput&gt;
&lt;h2&gt;#myProps.title#&lt;/h2&gt;
&lt;/cfoutput&gt;

&lt;cfoutput query = "myQuery"&gt;
	&lt;cfif myProps.version IS "atom_1.0"&gt;
		&lt;h3&gt;&lt;a href = "#linkhref#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
	&lt;cfelse&gt;
		&lt;h3&gt;&lt;a href = "#rsslink#"&gt;#title#&lt;/a&gt;&lt;/h3&gt;
	&lt;/cfif&gt;
	 &lt;div class="content"&gt;
     #content#
	 &lt;/div&gt;
&lt;/cfoutput&gt;
</code>

<p/>

That works... ok.... see the result:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen6.png" />

<p/>

But as you can see, there is a huge old blue block below the graphic. If you view source, you discover all kinds of CSS embedded with the content. Even better, you see this gem:

<p/>

<code>
&lt;a href="http://".$GLOBALS["HTTP_HOST"]."/photos/pre-cataclysm-twilight-cultist-event/"&gt;Pre-Cataclysm Twilight Cultist Event&lt;/a&gt;
</code>

<p/>

I'm not sure what language that is. Probably a dead one. Either way, their feed generation code obviously has a bug in it. Steve also shared another RSS feed he had where a Youtube embed set of code literally just stopped 50% through the HTML. Most likely that was someone using a left() operation and not considering HTML. The point is - unless you know your feed source very well - you should probably expect - and be prepared to deal with - <b>crap</b>.

<p/>

So what did I recommend? Get rid of the HTML altogether. Here is an example:

<p/>

<code>
#reReplace(content, "&lt;.*?&gt;", "", "all")#
</code>

<p/>

A bit draconian, but most likely the safest option.