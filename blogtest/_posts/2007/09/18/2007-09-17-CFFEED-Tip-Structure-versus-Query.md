---
layout: post
title: "CFFEED Tip - Structure versus Query"
date: "2007-09-18T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/18/CFFEED-Tip-Structure-versus-Query
guid: 2353
---

Over the weekend and Monday, there was an interesting thread on CF-Talk. You can read the complete thread <a href="http://www.houseoffusion.com/groups/cf-talk/thread.cfm/threadid:53408">here</a>. The basic problem involved getting a particular piece of data to show up in the final feed xml, in this case, the GUID attribute for an RSS 2.0 feed. One of the problems I have with CFFEED is that sometimes it is rather difficult to figure out what you have to feed it. (See <a href="http://www.raymondcamden.com/index.cfm/2007/8/22/Metadata-properties-for-CFFEED">this post</a> for an example.)
<!--more-->
Jayesh Viradiya of Adobe informed me of an interesting aspect of CFFEED. As you may or may not know, you can use either a structure of data or a query to create your feed. Now I've spent most of my time using queries to build feeds - and I think most people will do the same. But you may - for whatever reason - need to create your feed with a structure.

Here is where things get interesting. When you work with a query that comes <i>from</i> a feed, you have a set of columns that always exist no matter what type of feed you read from. Because you have one set of columns, sometimes the columns can mean different things based on the type of feed you read from. So for example, the ID column refers to the ID data of an Atom feed and the GUID data of a RSS feed.

The same rules then apply when creating a feed. If I want to create an RSS 2 feed and have GUID data, I use the ID column of my query, or I use columnMap to point to it. You can see the entire list of columns and the rules behind them in the CFML Reference, page 191. If you do anything with CFFEED, you need to take a look at the reference.

Now here is where it gets confusing a bit. If you are creating your feed from a structure, you specify the <i>exact</i> column name. So instead of using ID for example, you would use GUID. Since GUID can be complex though this has to be a structure, as Jayesh demonstrates in the thread:

<code>
&lt;cfset myStruct.item[i].guid = structnew()&gt;
&lt;cfset myStruct.item[i].guid.isPermaLink="YES/NO(anyone)"&gt; 
&lt;cfset myStruct.item[i].guid.value = "http://www.google.com"&gt;
</code>

Make sense yet? What is really needed I think is a bit more documentation. As an FYI - I've worked a bit on Atom Metadata and hope to have a follow up to my <a href="http://www.coldfusionjedi.com/index.cfm/2007/8/22/Metadata-properties-for-CFFEED">other post</a> soon.