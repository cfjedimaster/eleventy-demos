---
layout: post
title: "Ask a Jedi: Yahoo RSS Feeds and Images"
date: "2005-10-03T12:10:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/10/03/Ask-a-Jedi-Yahoo-RSS-Feeds-and-Images
guid: 826
---

A reader asks:

<blockquote>
Yahoo's RSS Feed has thumbnail pictures with the excerpt when you view The Feed in FireFox-Sage. Any idea how to make that work?
</blockquote>

To be honest, I had no idea what the reader was talking about, so I gired up FeedDemon and added one a <a href="http://rss.news.yahoo.com/rss/oddlyenough">sample</a> Yahoo RSS feed. Sure enough - an image popped up. So, knowing nothing, I did what any good web developer does - I went to View Source. Inside the regular RSS 2.0 feed I found this:

<code>
&lt;media:content url="http://a super long url I trimmed" type="image/jpeg" height="99" width="130"/&gt;
&lt;media:text&gt;
Some html I trimmed
&lt;/media:text&gt;
&lt;media:credit role="provider"&gt;(Reuters)&lt;/media:credit&gt;
</code>

While I don't consider myself an RSS expert, I have done <i>some</i> <a href="http://blogs.law.harvard.edu/tech/rss">research</a> and I certainly did not remember a media element. Turns out this was an extension to the RSS spec added by Yahoo. Yahoo calls it Media RSS 1.0 (More information may be found <a href="http://search.yahoo.com/mrss">here</a>.) 

As with any extension, it will be up to the reader to actually use it. As I said above, FeedDemon had no problem with it, so I'm assuming more and more readers will be able to use it. (By "reader" I mean RSS applications.)