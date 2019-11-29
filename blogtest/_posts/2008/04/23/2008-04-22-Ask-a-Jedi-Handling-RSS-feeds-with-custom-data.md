---
layout: post
title: "Ask a Jedi: Handling RSS feeds with custom data"
date: "2008-04-23T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/23/Ask-a-Jedi-Handling-RSS-feeds-with-custom-data
guid: 2783
---

Neal asks:

<blockquote>
<p>
I'm trying to use cffeed to read RSS feeds provided by National Public Radio (I manage a few
websites for community radio stations that purchase NPR programming). Everything
works great, except that NPR uses a custom namespace for certain elements. For
example, npr:rmaudio provides a link to a Real audio file, but cffeed won't
read this element. When I try to loop through the feed having captured it with
cfhttp, coldfusion chokes on the colon. Any ideas? I can't seem to find much
about this on the web. Finally, thanks for the many interesting articles you've
written over the years.
</p>
</blockquote>
<!--more-->
So your right. The CFFEED tag ignores any custom elements in an RSS feed. This is rather unfortunate as I know I've run into multiple feeds that use custom fields. Technically you can get it via CFFEED if you use xmlVar to return the XML, but at that point, why bother with CFFEED. I'd just use CFHTTP. (And if you do so, you can get a bit <a href="http://www.raymondcamden.com/index.cfm/2007/10/15/Doing-HTTP-Conditional-Gets-in-ColdFusion">fancy</a>.) 

As for the colon issue - you are the second person in the past 24 hours who hasn't recognized a simple fact about structures. (Remember that when dealing with an XML object, you can treat parts of it as arrays and structs.) When it comes to keys that have colons, or other odd characters, all you need to do is use bracket notation. So consider this simple structure:

<code>
&lt;cfset s = {}&gt;
&lt;cfset s.age = 9&gt;
&lt;cfset s["funky cold madina"] = 21&gt;
</code>

The first key I set, age, is a simple string with no spaces in it, and I can use dot notation. The second key, "funky cold madina", can't be used with dot notation, but bracket notation works just fine.

So let's look at the XML Neal was working with. The feed may be found here:

<a href="http://www.npr.org/rss/rss.php?id=2&station=KSJD_FM">http://www.npr.org/rss/rss.php?id=2&station=KSJD_FM</a>

And if you get this data via XML, you will see data like so:

<code>
&lt;item&gt;
      &lt;title&gt;Pennsylvania Primary Roundup&lt;/title&gt;
      &lt;description&gt;Barack Obama improved his showing among white, middle-class voters, but not enough to beat Hillary Clinton in the Pennsylvania primary on Tuesday. NPR's National Political Correspondent Mara Liasson analyzes the race with Robert Seigel.&lt;/description&gt;
      &lt;pubDate&gt;Tue, 22 Apr 2008 21:53:01 -0400&lt;/pubDate&gt;
      &lt;link&gt;http://www.npr.org/stations/force/force_localization.php?station=KSJD_FM&amp;url=http://www.npr.org/templates/story/story.php?storyId=89862645&amp;ft=1&amp;f=2&lt;/link&gt;
      &lt;guid&gt;http://www.npr.org/templates/story/story.php?storyId=89862645&amp;ft=1&amp;f=2&lt;/guid&gt;
      &lt;npr:wmaudio&gt;http://www.npr.org/templates/dmg/dmg_wmref_em.php?id=89863241&amp;type=1&amp;date=22-Apr-2008&amp;mtype=WM&lt;/npr:wmaudio&gt;
      &lt;npr:rmaudio&gt;http://www.npr.org/templates/dmg/dmg_rpm.rpm?id=89863241&amp;type=1&amp;date=22-Apr-2008&amp;mtype=RM&lt;/npr:rmaudio&gt;
    &lt;/item&gt;
</code>

Note the NPR tags. Working with these tags is a simple matter. Consider this code:

<code>
&lt;cfloop index="x" from="1" to="#arrayLen(xmlResult.rss.channel.item)#"&gt;
	&lt;cfset item = xmlResult.rss.channel.item[x]&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	&lt;b&gt;&lt;a href="#item.link.xmlText#"&gt;#item.title.xmlText#&lt;/a&gt;&lt;/b&gt;&lt;br /&gt;
	&lt;cfif structKeyExists(item, "npr:wmaudio")&gt;
	&lt;a href="#item["npr:wmaudio"].xmlText#"&gt;WM Audio Link&lt;/a&gt;&lt;br /&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(item, "npr:rmaudio")&gt;
	&lt;a href="#item["npr:rmaudio"].xmlText#"&gt;RM Audio Link&lt;/a&gt;&lt;br /&gt;
	&lt;/cfif&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

All I do is loop over each item, output the things I know exist (link and title), and check to see if the WM or RM audio links exist. If so, I output them using bracket notation.