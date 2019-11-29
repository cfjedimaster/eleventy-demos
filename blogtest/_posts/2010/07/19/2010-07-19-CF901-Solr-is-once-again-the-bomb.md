---
layout: post
title: "CF901: Solr is (once again) the bomb"
date: "2010-07-19T20:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/19/CF901-Solr-is-once-again-the-bomb
guid: 3883
---

Back in January of this year I <a href="http://www.raymondcamden.com/index.cfm/2010/1/26/Some-criticisms-on-Solr-in-ColdFusion-9">wrote</a> a blog entry about just how poorly Solr was integrated into ColdFusion 9. I'll take partial blame for that as I didn't test it during the betas, but at the end of the day, the support for binary files were so poor there was no way I could recommend it. Database content - sure. But for any collection of files the integration failed miserably.
<!--more-->
This is one of the areas that was touched in the 901 updater, and I'm very happy to see that Adobe did indeed do a great job improving their support for binary files. I did a quick test where I dumped in some MP3, PDF, and Word docs into a folder and then indexed it. (I also tried an AVI for the heck of it - it didn't work though.) After the collection was created I did a few quick tests. Here is the result of a search for e*:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-19 at 6.04.38 PM.png" title="Searcher Results" />

As you can see, it picked up quite a bit of information. Check out the summary on the MP3. It isn't clear unless you view source, but the data is line delimited and could be parsed if you wanted to. 

I guess this shouldn't come as any surprise that "Yes, it did get fixed," but I'm pretty darn happy. Let me leave you with two quick notes.

First - the application I used to test searching against the collection is my CF Admin extension, <a href="http://cfadminsearcher.riaforge.org/">CF Admin Searcher</a>. It is a great tool for quickly testing ad hoc queries against your collections.

Secondly - on my Mac I ran into an issue the first time I tried to use Solr after my 901 update. Vinu (from Adobe) suggested checking ColdFusion9/solr/muticore/solr.xml to see if I had any collections there that didn't exist on the file system. I simply removed them all (<b>except core0!</b>), restarted Solr, and everything worked after that.