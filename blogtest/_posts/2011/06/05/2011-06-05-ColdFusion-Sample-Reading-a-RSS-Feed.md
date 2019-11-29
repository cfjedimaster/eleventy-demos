---
layout: post
title: "ColdFusion Sample - Reading a RSS Feed"
date: "2011-06-05T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/05/ColdFusion-Sample-Reading-a-RSS-Feed
guid: 4257
---

Many web sites provide what's called an RSS feed. RSS stands for Really Simple Syndication. In simpler terms, it's a way to create a list of articles in a common XML format. So for example, a blog, like this one, can share it's last 10 articles. RSS is not read by humans typically. Normally another program will read in the feed and work with it. In this blog entry, I'm going to discuss how ColdFusion can work with RSS feeds, specifically how to read them and create usable data from it. ColdFusion also provides a simple way to create feeds as well. I'll discuss that later.
<!--more-->
<p>

To begin, let's select an RSS feed. I went to CNN and discovered they had a nice <a href="http://www.cnn.com/services/rss/">list of feeds</a>. The first one was for their top stories and had this URL: <a href="http://rss.cnn.com/rss/cnn_topstories.rss">http://rss.cnn.com/rss/cnn_topstories.rss</a> Go ahead and click that link to see what the XML looks like. 

<p>

ColdFusion provides a tag that both reads and creates RSS feeds: cffeed. At it's simplest usage, you can point cffeed to the URL and have it create a query from it. You can also ask cffeed to return information about the feed in general. RSS actually covers multiple different formats: Two 'core' types (RSS and Atom) and multiple versions as well. cffeed will work with all of them, but the type of feed read does impact what's returned. For now, let's just dump all the data from the feed:

<p>

<code>
&lt;cfset rssUrl = "http://rss.cnn.com/rss/cnn_topstories.rss"&gt;

&lt;cffeed action="read" source="#rssUrl#" query="entries" properties="info"&gt;

&lt;cfdump var="#info#"&gt;
&lt;cfdump var="#entries#"&gt;
</code>

<p>

The info structure contains metadata about the RSS feed. What you see there will depend on the type and how descriptive the feed is. A remote site may choose to include optional data that another feed does not. To be honest, this information is not going to be very useful if you are only parsing one feed. Let's look at that dump anyway:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip105.png" />

<p>

Lots of info, right? Again though - if your intent was just to put CNN's news on your web site, this metadata really isn't helpful to you. If you are building an aggregator with random RSS urls being added than it becomes more important. But for our needs, we are done with it. Now let's look at the query created:

<p>

<a href="http://www.raymondcamden.com/images/cfjedi/_1307284594969.png"><img src="https://static.raymondcamden.com/images/cfjedi/_1307284594969_thumb.png" /></a>

<p>

Click that image above to see the full screen shot. It's a <i>huge</i> query. Do you need all those columns? Heck no. When cffeed parses a RSS feed, it has to support multiple different types of feeds. Because of this it has a large number of different columns that <b>may or may not</b> be used depending on the type. In general, the value and usefulness of a column depends on if the base type was RSS or Atom. If you read the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7675.html">reference for cffeed</a> you can see the list of columns. Based on the first dump we saw, we know CNN is using an RSS type feed. (Confused? RSS is a generic term as well as a particular <i>type</i> as well. So we may say a site has an RSS feed, and the type itself is RSS. It may also be an Atom feed, but most likely it would still be linked to as an RSS feed.) 

<p>

So given that we have a large set of columns and we can use the reference to figure out what means what - what's the next step? At this point it depends on your needs. How exactly are you planning on using the feed? For most folks, they want to create a list of the entries on their site with a link to the full article. From the docs we see that the column "RSSLINK" provides the link and "TITLE" provides a title. Let's just try them fornow.

<p>

<code>
&lt;cfoutput query="entries"&gt;
	&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt;&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p>

This returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip106.png" />

<p>

Pretty simple, right? In theory, we could stop there. But let's look at two other properties we may want to display. The first is "PUBLISHEDDATE", which as you can imagine is the stories publication date. This could be useful for sites that update content a bit less frequently than CNN. The other is "CONTENT". Some RSS feeds will provide all of their story text within the feed. I think most though provide a summary. The idea being that you want your RSS feed consumers to be tempted to actually go to the site instead. Let's add both to our code:

<p>

<code>
&lt;cfoutput query="entries"&gt;
	&lt;p&gt;
	&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt; #publisheddate#&lt;br/&gt;
	#content#
	&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip107.png" />

<p>

Those links at the bottom come from CNN, not my code. It's something you have to keep in mind when using the content from RSS feeds. The HTML may or may not work well within your own site. That's it for now - I've included the full template below. After the template I've got a note you may want to read.

<p>

<code>
&lt;cfset rssUrl = "http://rss.cnn.com/rss/cnn_topstories.rss"&gt;

&lt;cffeed action="read" source="#rssUrl#" query="entries" properties="info"&gt;

&lt;!---
&lt;cfdump var="#info#"&gt;
---&gt;
&lt;!---
&lt;cfdump var="#entries#"&gt;
---&gt;

&lt;cfoutput query="entries"&gt;
	&lt;p&gt;
	&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt; #publisheddate#&lt;br/&gt;
	#content#
	&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

<p>

<b>Notes:</b>

<p>

As I said, working with a <i>specific</i> RSS feed isn't too difficult. You can do exactly like I did. cfdump the info and the data and see which columns you care about. If you do intend to work with multiple, unknown (at creation) feeds, you may want to consider something like <a href="http://paragator.riaforge.org/">Paragator</a>. That's a ColdFusion component I created that both multithreads parsing multiple feeds as well as does a bit of normalization as well. 

<p>

It goes without saying, every time you use a remote source in your code you should both cache it and prepare for an error. CNN could go down. Can you imagine (or even write and share) an example of the code above that both adds caching as well as exception handling?