---
layout: post
title: "Two Spry Questions"
date: "2006-07-28T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/07/28/Two-Spry-Questions
guid: 1436
---

I had a few Spry questions during my <a href="http://ray.camdenfamily.com/index.cfm/2006/7/27/Spry-Presentation-RecordingZip">presentation</a> that I wasn't able to answer. I pinged the <a href="http://www.adobe.com/cfusion/webforums/forum/categories.cfm?forumid=72&catid=602">Spry Forum</a> and got the responses I needed.

First - does Spry let you sort by two columns? The answer is yes. dougsm (of the famous <a href="http://www.bigdoug.com/SpryPatches/">Spry Patches</a> page) showed this example:

<code>
dataSet.sort( [ 'colX', 'colY' ] )
</code>

The second big question I had was on accessibility. I'm going to quote Don Booth, one of the Adobe Spry engineers:

<blockquote>
Screen readers generally read source code. The fact that Spry does not have content rich source will be a problem for those using readers. And they can't catch the dynamic screen refreshes. The bummer is that this affects most Ajax stuff. But the good news is that people, including us, are working on it. Mozilla is taking the lead on making their browser the leading assisted browsing tool. Users are also forcing browser makers and screen reader companies to keep up.
On the Spry side, we invented the spry:content tag to allow for static and dynamic content to exist at the same time. This also helps SEO.
But for now, Ajax is not reader friendly and those that need to be 508 compliant or otherwise accessible will probably not be using Spry or Ajax in a mission critical way.
</blockquote>

Interesting. As a side note, I did not show the spry:content tag during my presentation as I was trying to keep things simple, but it is the recommended way to display data. It also gets rid of the "Spry Flash" effect you see on the initial load.