---
layout: post
title: "Fun little feed parsing issue to watch out for - new lines!"
date: "2008-01-14T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/14/Fun-little-feed-parsing-issue-to-watch-out-for-new-lines
guid: 2590
---

For a few days now <a href="http://www.bennadel.com/blog/recent-blog-entries.htm">Ben Nadel's blog</a> hasn't been aggregated on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. While this was <i>not</i> a lame attempt by me to stop the rising tide of my competition in the blog world (ok, maybe it was ;), it was an interesting little issue.
<!--more-->
First off - his feed did return correctly from CFFEED. It wasn't a bug with the tag (which as you know has a few warts). But when parsing his feed, I noticed something interesting - the publisheddate query column was blank! Now there is a confirmed bug with some date formats, but Ben's dates were just fine (as far as I knew), until I took a closer look. Here is a sample, see if you can spot the issue:

<code>
&lt;item&gt;
&lt;title&gt;Ask Ben: Screen Scraping PowerBall Statistics With ColdFusion&lt;/title&gt;
&lt;link&gt;http://www.bennadel.com/index.cfm?dax=blog:1122.view&lt;/link&gt;

&lt;guid isPermaLink="true"&gt;http://www.bennadel.com/index.cfm?dax=blog:1122.view&lt;/guid&gt;
&lt;description&gt;&lt;![CDATA[  I was spending my free time this (deletia) this us ...&nbsp;&lt;a href="http://www.bennadel.com/index.cfm?dax=blog:1122.view"&gt;Read More&lt;/a&gt;&nbsp;&raquo; ]]&gt;&lt;/description&gt;
&lt;pubDate&gt;Mon, 14 Jan 2008
08:15:00 EST&lt;/pubDate&gt;
&lt;category&gt;Ask Ben&lt;/category&gt;
&lt;category&gt;ColdFusion&lt;/category&gt;
&lt;/item&gt; 
</code>

Notice his date is on two lines? That was enough to make CFFEED think it wasn't a valid date. Personally, I think that <i>kind</i> of makes sense and I won't blame CFFEED for this, but others may disagree.

What made this issue even more difficult was that Ben had not changed his code at all. He had moved servers. Guess what setting changed? The old server was using white space suppression in the admin. I do <b>not</b> recommend people use this feature and this is a <b>perfect</b> example of why. It involves more work, but if you want to control white space, do it the manual way. (More information on this <a href="http://www.raymondcamden.com/index.cfm/2006/7/26/ColdFusion-Whitespace-Options">blog entry</a>.)