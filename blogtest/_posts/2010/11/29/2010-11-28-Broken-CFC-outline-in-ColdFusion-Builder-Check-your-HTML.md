---
layout: post
title: "Broken CFC outline in ColdFusion Builder? Check your HTML"
date: "2010-11-29T09:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/11/29/Broken-CFC-outline-in-ColdFusion-Builder-Check-your-HTML
guid: 4029
---

From time to time I'll encounter a CFC that is 'broken' in the outline. By broken I mean the method listing goes up to a certain point and just plain stops. I don't encounter this very often, but when I do, it's normally a case of needing to find some method <i>after</i> the mysterious stopping point. I brought this up with Adobe, and used a specific file as an example, and today Ramchandra (Adobe engineer) shared with me what the issue was - invalid HTML.
<!--more-->
<p/>

Let's look at an example of this. The following CFC closely resembles the one that originally had a broken outline.

<p/>

<code>
&lt;cfcomponent&gt;

	&lt;cffunction name="badboy"&gt;
		&lt;cfset var str = ""&gt;
		&lt;cfsavecontent variable="str"&gt;&lt;tr&gt;&lt;/cfsavecontent&gt;
		&lt;cfreturn str&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="goodboy"&gt;
		&lt;cfreturn "&lt;tr&gt;"&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="placeholder1"&gt;
		&lt;cfreturn 1&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

<p/>

Notice the very first method, badboy, returns a TR tag. This is perfectly valid CFML. You could imagine a real use for this - perhaps in a method called startTableRow. And yea - this would be <b>way over enginered</b> - but I've bet we've all seen code like that before. Check out what the outline does with it though:

<p/>

<img src="https://static.raymondcamden.com/images/screen50.png" />

<p/>

As you can see, it stops at badboy and doesn't render anything past that. If we comment out badboy we get:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen51.png" />

<p/>

Now - in the code above - there is really no bug. In my original CFC shared with Adobe there definitely was. (This is in <a href="http://galleon.riaforge.org">Galleon</a> and will be fixed today.) I've made the argument that the code above should <i>not</i> break the outline. That being said though - if you have outline issues - check for something like this.

<p/>

On a related note, I've noticed that CFBuilder will not correctly flag invalid HTML. Create a new HTML file in CFBuilder, write a B tag and don't close it, and you get no error or warning. Do the same in Aptana. I've asked about why this happens and if I find out I'll post back.