---
layout: post
title: "Ask a Jedi: RSS Reader with CFGRID?"
date: "2009-01-12T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/12/Ask-a-Jedi-RSS-Reader-with-CFGRID
guid: 3190
---

Craig sent me one of those emails where one main question leads to a whole heck of a lot of topics. I love those. Here is his email, and then I'll try to tackle it bit by bit:

<blockquote>
<p>
I would like to be able to read an RSS feed from another website and be able to see on the screen when a new one is published. Maybe highlight the new/unread ones in a data grid or something.
</p>

<p>
I'm not a flex guy, so I was wondering before I start what you thought would be the easiest way to accomplish it.
</p>

<p>
Old school meta refresh the html page every few seconds to run the code?
</p>

<p>
Some kind of Ajax grid that will asynchronously call a cfc, that reads the feed for me every few seconds?
</p>

<p>
Do sites that publish RSS feed get angry when you hit their feeds every 10 seconds?
</p>
</blockquote>

Alright, so Craig here touches on a whole load of very different topics. I'm going to try to touch on each of them, and I'll let Craig, and my readers, point out where they would like to see further details/code. So with that in mind, let's tackle this paragraph by paragraph.
<!--more-->
<blockquote>
<p>
I would like to be able to read an RSS feed from another website and be able to see on the screen when a new one is published. Maybe highlight the new/unread ones in a data grid or something.
</p>
</blockquote>

Well number one, you will be using the CFFEED tag. Despite having a few warts (search the blog here for cffeed), it will handle converting your feed into a query. You will need this because your Ajax calls can't connect to the RSS feed directly. Ajax calls (outside of AIR of course) are limited to hitting the same domain by which they are served. So if you want to have a feed reader on foo.com and that reads my RSS feed, then you have to write code that will go from JavaScript to your server and from your server to my feed. 

The second part to the puzzle is new/unread. This one is a bit tricky. You can figure out new items by simply storing the time when you first hit the page. If you hit it at 10AM, and you see a feed item for 11AM, then it is new. The highlighting is a bit trickier. You can do that client side with a custom cell renderer (see blog post here: <a href="http://www.raymondcamden.com/index.cfm/2007/8/20/Custom-grid-renderers-with-CFGRID">Custom Grid Renderers with CFGRID</a>). Unread would also involve storing values about the items. If you enable a 'click to view' for each RSS item, then you can store in the session which items are viewed. That way if the user reloads the page, you can return a column of data representing the read state and use the custom grid renderers to handle it.

<blockquote>
<p>
I'm not a flex guy, so I was wondering before I start what you thought would be the easiest way to accomplish it.
</p>
</blockquote>

Ajax versus Flex. Yeah, I'm not touching that. ;) I'll take the easy way out and say let's keep the focus on Ajax as you mention it more in the post then Flex.

<blockquote>
<p>
Old school meta refresh the html page every few seconds to run the code?
</p>
</blockquote>

That could work as well, and would take all of two seconds to code. META tags are something that I think people tend to forget, at least outside of the ones used for SEO. A super simple example is:

<code>
&lt;meta http-equiv="refresh" content="60"&gt;
</code>

This will reload the page every 60 seconds. It works, but is not something you use often for public pages. Imagine you were filling a form out and the page decided to refresh itself. That would be a quick way to lose visitors. But for a page where you are just monitoring stuff, it could work well.

<blockquote>
<p>
Some kind of Ajax grid that will asynchronously call a cfc, that reads the feed for me every few seconds?
</p>
</blockquote>

I assume you know that ColdFusion 8 has an Ajax grid built in and that it can call a CFC. If not, you can search my blog for multiple examples, and of course read the excellent ColdFusion documentation. As for reading the feed every few seconds, you can use JavaScript to first run code every N seconds (setInterval) and then have the grid refresh itself (ColdFusion.Grid.refresh, again, check the docs for details).

<blockquote>
<p>
Do sites that publish RSS feed get angry when you hit their feeds every 10 seconds?
</p>
</blockquote>

Define "angry" :) I know some sites will notice this and try to block you but I'd be willing to bet a lot of people would have no idea you were hitting their feed every 10 seconds. Of course, just because you <i>can</i> do something doesn't mean you should. I think I blog a bit (although I've slowed down over the last year or so), but I probably average only 2 blog entries per day. Hitting my feed every 10 seconds then would be crazy. <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a> only does updates every 10 minutes and that is to hit a giant list of blogs. So no, I would not hit the feed every 10 seconds. 10 minutes is probably better. The <b>best</b> options is to use HTTP Conditional Gets. This is where you ask the remote server if their content has been updated. If the server replies positively, you then make a followup request for the complete content. Not all servers support this. I blogged about this back in 07: <a href="http://www.coldfusionjedi.com/index.cfm/2007/10/15/Doing-HTTP-Conditional-Gets-in-ColdFusion">Doing HTTP Conditional Gets in ColdFusion</a>

Thoughts? What would folks like to see more of? Remember that Todd Sharp has a complete RSS Reader built with CF: <a href="http://cfsilence.com/blog/client/index.cfm/2008/2/12/ColdFusion-8-Ajax-Feed-Reader">ColdFusion 8 Ajax Feed Reader</a>. I could demonstrate other aspects of this blog post though if folks would like.